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
    public sealed record ResendEmailVerifyCommand(string Email) : ICommand<ResendEmailVerifyResponse>;

    internal sealed class ResendEmailVerifyCommandHandler : ICommandHandler<ResendEmailVerifyCommand, ResendEmailVerifyResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ResendEmailVerifyCommand> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;



        public ResendEmailVerifyCommandHandler(
            IAccountRepository accountRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<ResendEmailVerifyCommand> logger,
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
            var user = await _userRepository.GetByEmailAsync(command.Email);
            if (user == null)
            {
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.USER_NOT_FOUND)
                );
            }else if (user.EmailVerifyToken == null){
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.EMAIL_VERIFY_HAVE_BEEN_VERIFIED)
                );
            }
            int expiredToken = _jwtTokenService.GetExpireMinutesFromToken(user.EmailVerifyToken);
            if (expiredToken > 0)
            {
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.EMAIL_VERIFY_TOKEN_STILL_VALID + ", try again in " + expiredToken + " minutes")
                );
            }
            var account = await _accountRepository.GetByIdAsync(user.UsrId, cancellationToken);
            var createdEmailVerifyToken = _jwtTokenService.GenerateToken(user.UsrId, account.RoleId, IConstant.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES);
            bool isSuccess = await _userRepository.UpdateEmailVerifyTokenAsync(user.UsrId, createdEmailVerifyToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            try
            {
                var emailBody = EmailTemplate.GenerateEmailVerifyTokenHtml(
                    username: account.Username,
                    verifyToken: createdEmailVerifyToken,
                    baseUrl: "http://localhost:5019/swagger/api/Authen/verify-email"
                );

                await _emailService.SendEmailAsync(new EmailModel
                {
                    From = Environment.GetEnvironmentVariable("AWS_SES_EMAIL") ?? throw new InvalidOperationException("AWS_SES_EMAIL environment variable is not set"),
                    To = command.Email,
                    Subject = "[MAVID SKINCARE] Verify Your Email",
                    Body = emailBody // HTML nội dung email
                });

                Console.WriteLine("Email sent successfully.");
            }
            catch (MessageRejectedException ex)
            {
                Console.WriteLine($"Email rejected: {ex.Message}");
                throw;
            }
            catch (AmazonSimpleEmailServiceException ex)
            {
                Console.WriteLine($"AWS SES error: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General error: {ex.Message}");
                throw;
            }

            if (!isSuccess)
            {
                return Result<ResendEmailVerifyResponse>.Failure<ResendEmailVerifyResponse>(
                    new Error("ResendEmailVerifyError", IConstantMessage.EMAIL_VERIFY_TOKEN_UPDATE_FAILED)
                );
            }
            return Result<ResendEmailVerifyResponse>.Success(new ResendEmailVerifyResponse
            {
                NewEmailVerifyToken = createdEmailVerifyToken
            });

        }
    }
}
