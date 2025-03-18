using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Application.Abstractions.AWS;
using Application.Abstractions.Messaging;
using Application.Abstractions.Redis;
using Application.Abstractions.UnitOfWork;
using Application.Accounts.Response;
using Application.Common.Email;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using Application.Features.Auth.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Auth.Commands
{
    /// <summary>
    /// Command to resend the email verification token
    /// </summary>
    public sealed record ResendEmailVerifyCommand(string Email) : ICommand<ResendEmailVerifyResponse>;

    /// <summary>
    /// Handler for `ResendEmailVerifyCommand` - Responsible for reissuing a verification email if applicable.
    /// </summary>
    internal sealed class ResendEmailVerifyCommandHandler : ICommandHandler<ResendEmailVerifyCommand, ResendEmailVerifyResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ResendEmailVerifyCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;

        public ResendEmailVerifyCommandHandler(
            IAccountRepository accountRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<ResendEmailVerifyCommandHandler> logger,
            IJwtTokenService jwtTokenService,
            IRedisCacheService redisCacheService,
            IUserRepository userRepository,
            IEmailService emailService)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _redisCacheService = redisCacheService;
            _userRepository = userRepository;
            _emailService = emailService;
        }

        public async Task<Result<ResendEmailVerifyResponse>> Handle(ResendEmailVerifyCommand command, CancellationToken cancellationToken)
        {
            _logger.LogInformation("🔍 Checking user existence for email: {Email}", command.Email);

            // Step 1: Retrieve User
            var user = await _userRepository.GetByEmailAsync(command.Email);
            if (user == null)
            {
                _logger.LogWarning("❌ User not found for email: {Email}", command.Email);
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.USER_NOT_FOUND)
                );
            }

            // Step 2: Retrieve Account
            var account = await _accountRepository.GetByIdAsync(user.UsrId, cancellationToken);
            if (account == null)
            {
                _logger.LogWarning("❌ Account not found for UserId: {UserId}", user.UsrId);
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.USER_INFORMATION_NOT_FOUND)
                );
            }

            // Step 3: Check if the account is already verified (status 2) or banned (status 3)
            if (account.AccStatusId == 2)
            {
                _logger.LogInformation("✅ Account already verified for UserId: {UserId}", user.UsrId);
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.EMAIL_VERIFY_HAVE_BEEN_VERIFIED)
                );
            }
            _logger.LogInformation("Status: {Status}", account.AccStatusId);
            if (account.AccStatusId == 3)
            {
                _logger.LogWarning("⛔ Account is banned for UserId: {UserId}", user.UsrId);
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", "Account is banned. Cannot resend verification email.")
                );
            }

            // Step 4: Check if the existing token is still valid
            if (!string.IsNullOrEmpty(user.EmailVerifyToken) && _jwtTokenService.IsTokenValid(user.EmailVerifyToken))
            {
                _logger.LogInformation("🔄 Email verification token is still valid for UserId: {UserId}", user.UsrId);
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.EMAIL_VERIFY_TOKEN_STILL_VALID)
                );
            }

            // Step 5: Generate a new verification token
            _logger.LogInformation("🔑 Generating new email verification token for UserId: {UserId}", user.UsrId);
            var createdEmailVerifyToken = _jwtTokenService.GenerateToken(user.UsrId, account.RoleId, IConstant.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES);

            bool isSuccess = await _userRepository.UpdateEmailVerifyTokenAsync(user.UsrId, createdEmailVerifyToken);
            if (!isSuccess)
            {
                _logger.LogError("❌ Failed to update email verification token for UserId: {UserId}", user.UsrId);
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.EMAIL_VERIFY_TOKEN_UPDATE_FAILED)
                );
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("✅ Email verification token updated successfully for UserId: {UserId}", user.UsrId);

            // Step 6: Send verification email
            try
            {
                var endpointUrl = Environment.GetEnvironmentVariable("ENDPOINT_WEBAPP_URL")
                    ?? throw new InvalidOperationException("ENDPOINT_URL environment variable is not set");

                var emailBody = EmailTemplate.GenerateEmailVerifyTokenHtml(
                    username: account.Username,
                    verifyToken: createdEmailVerifyToken,
                    baseUrl: $"{endpointUrl}/verify-email"
                );

                await _emailService.SendEmailAsync(new EmailModel
                {
                    From = Environment.GetEnvironmentVariable("AWS_SES_EMAIL")
                        ?? throw new InvalidOperationException("AWS_SES_EMAIL environment variable is not set"),
                    To = command.Email,
                    Subject = "[MAVID SKINCARE] Verify Your Email",
                    Body = emailBody
                });

                _logger.LogInformation("📧 Verification email sent successfully to {Email}", command.Email);
            }
            catch (MessageRejectedException ex)
            {
                _logger.LogError("❌ Email rejected: {Message}", ex.Message);
                throw;
            }
            catch (AmazonSimpleEmailServiceException ex)
            {
                _logger.LogError("❌ AWS SES error: {Message}", ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError("❌ General error while sending email: {Message}", ex.Message);
                throw;
            }

            return Result<ResendEmailVerifyResponse>.Success(new ResendEmailVerifyResponse
            {
                NewEmailVerifyToken = createdEmailVerifyToken
            });
        }
    }
}
