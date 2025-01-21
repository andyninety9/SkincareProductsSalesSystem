using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Application.Abstractions.AWS;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Accounts.Response;
using Application.Common.Email;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Auth.Commands
{
    public sealed record RegisterAccountCommand
    (
        string Username,
        string Email,
        string Phone,
        string Password,
        string ConfirmPassword
    ) : ICommand<RegisterResponse>;
    internal sealed class RegisterAccountCommandHandler : ICommandHandler<RegisterAccountCommand, RegisterResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<RegisterAccountCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        public RegisterAccountCommandHandler(IAccountRepository accountRepository, IUserRepository userRepository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<RegisterAccountCommandHandler> logger, IJwtTokenService jwtTokenService, IEmailService emailService)
        {
            _accountRepository = accountRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
        }

        public async Task<Result<RegisterResponse>> Handle(RegisterAccountCommand command, CancellationToken cancellationToken)
        {
            var errors = new List<Error>();
            if (await _accountRepository.IsExistedUsername(command.Username))
            {
                errors.Add(new Error("RegisterError", IConstantMessage.DUPLICATED_USERNAME));
      
            }

            if (await _userRepository.IsExistedPhone(command.Phone))
            {
                errors.Add(new Error("RegisterError", IConstantMessage.DUPLICATED_PHONE_NUMBER));
        
            }

            if (await _userRepository.IsExistedEmail(command.Email))
            {
                errors.Add(new Error("RegisterError", IConstantMessage.DUPLICATED_EMAIL));
        
            }

            if(errors.Any())
            {
                return Result<RegisterResponse>.Failure<RegisterResponse>(new Error("ValidationError", string.Join("; ", errors.Select(e => e.Description))));
            }

            try
            {
                var account = new Account
                {
                    Password = BCrypt.Net.BCrypt.HashPassword(command.Password, workFactor: 12),
                    Username = command.Username,
                    AccStatusId = 1,
                    RoleId = 3
                };

                await _accountRepository.AddAsync(account, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var retrievedAccount = await _accountRepository.GetAccountByUsername(command.Username);
                if (retrievedAccount == null)
                {
                    Result<RegisterResponse>.Failure(new Error("RegisterAccount", IConstantMessage.REGISTER_FALSE));
                }
                if (retrievedAccount == null)
                {
                    return Result<RegisterResponse>.Failure<RegisterResponse>(new Error("RegisterAccount", IConstantMessage.REGISTER_FALSE));
                }
                var createdEmailVerifyToken = _jwtTokenService.GenerateToken(retrievedAccount.AccId, retrievedAccount.RoleId, IConstant.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES); 
                var user = new User
                {
                    UsrId = retrievedAccount.AccId,
                    Email = command.Email,
                    Phone = command.Phone,
                    CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                    UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                    EmailVerifyToken = createdEmailVerifyToken,
                };

                await _userRepository.AddAsync(user, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                try
                {
                    var emailBody = EmailTemplate.GenerateEmailVerifyTokenHtml(
                        username: command.Username,
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


                var response = new RegisterResponse
                {
                    EmailVerifyToken = createdEmailVerifyToken
                };
                return Result<RegisterResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during account registration: {Message}", ex.Message);

                return Result<RegisterResponse>.Failure<RegisterResponse>(new Error("RegisterAccount", "An error occurred while registering the account"));
            }
        }


    }
}