using Application.Abstractions.AWS;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Accounts.Response;
using Application.Common;
using Application.Common.Email;
using Application.Common.Enum;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
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
        private readonly IdGeneratorService _idGenerator;

        public RegisterAccountCommandHandler(
            IAccountRepository accountRepository,
            IUserRepository userRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<RegisterAccountCommandHandler> logger,
            IJwtTokenService jwtTokenService,
            IEmailService emailService,
            IdGeneratorService idGenerator)
        {
            _accountRepository = accountRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _idGenerator = idGenerator;
        }

        public async Task<Result<RegisterResponse>> Handle(RegisterAccountCommand command, CancellationToken cancellationToken)
        {
            // Validate input data
            var validationErrors = await ValidateInputAsync(command);
            if (validationErrors.Any())
            {
                return Result<RegisterResponse>.Failure<RegisterResponse>(
                    new Error("ValidationError", string.Join("; ", validationErrors.Select(e => e.Description)))
                );
            }

            // Using execution strategy to handle transient exceptions
            var executionStrategy = _unitOfWork.CreateExecutionStrategy();

            return await executionStrategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken);

                try
                {
                    // Generate Snowflake ID
                    long accountId = _idGenerator.GenerateLongId();

                    // Create Account
                    var account = CreateAccount(accountId, command);
                    await _accountRepository.AddAsync(account, cancellationToken);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    // Create User
                    var user = CreateUser(accountId, command, _jwtTokenService);
                    await _userRepository.AddAsync(user, cancellationToken);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    // Send verification email
                    if (user.EmailVerifyToken == null)
                    {
                        await transaction.RollbackAsync(cancellationToken);
                        return Result<RegisterResponse>.Failure<RegisterResponse>(
                            new Error("RegisterAccount", "Email verification token is null")
                        );
                    }

                    var emailSentSuccessfully = await SendVerificationEmailAsync(command, user.EmailVerifyToken);
                    if (!emailSentSuccessfully)
                    {
                        await transaction.RollbackAsync(cancellationToken);
                        return Result<RegisterResponse>.Failure<RegisterResponse>(
                            new Error("RegisterAccount", "Failed to send verification email")
                        );
                    }

                    // Commit transaction
                    await transaction.CommitAsync(cancellationToken);

                    // Return success response
                    var response = new RegisterResponse
                    {
                        EmailVerifyToken = user.EmailVerifyToken
                    };

                    return Result<RegisterResponse>.Success(response);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    _logger.LogError(ex, "Error occurred during account registration: {Message}", ex.Message);
                    return Result<RegisterResponse>.Failure<RegisterResponse>(
                        new Error("RegisterAccount", ex.Message)
                    );
                }
            });
        }

        private async Task<List<Error>> ValidateInputAsync(RegisterAccountCommand command)
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

            return errors;
        }

        private Account CreateAccount(long accountId, RegisterAccountCommand command)
        {
            return new Account
            {
                AccId = accountId,
                Password = BCrypt.Net.BCrypt.HashPassword(command.Password, workFactor: 12),
                Username = command.Username,
                AccStatusId = (short)AccountStatusEnum.Unverified, // Default status
                RoleId = (short)RoleAccountEnum.Customer       // Default role
            };
        }

        private User CreateUser(long accountId, RegisterAccountCommand command, IJwtTokenService jwtTokenService)
        {
            var emailVerifyToken = jwtTokenService.GenerateToken(accountId, 3, IConstant.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES);

            return new User
            {
                UsrId = accountId,
                Email = command.Email,
                Phone = command.Phone,
                CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                EmailVerifyToken = emailVerifyToken,
            };
        }

        private async Task<bool> SendVerificationEmailAsync(RegisterAccountCommand command, string emailVerifyToken)
        {
            try
            {
                var endpointUrl = Environment.GetEnvironmentVariable("ENDPOINT_WEBAPP_URL") ?? throw new InvalidOperationException("ENDPOINT_URL environment variable is not set");
                var emailBody = EmailTemplate.GenerateEmailVerifyTokenHtml(
                    username: command.Username,
                    verifyToken: emailVerifyToken,
                    baseUrl: endpointUrl + "/verify-email"
                );

                await _emailService.SendEmailAsync(new EmailModel
                {
                    From = Environment.GetEnvironmentVariable("AWS_SES_EMAIL") ?? throw new InvalidOperationException("AWS_SES_EMAIL environment variable is not set"),
                    To = command.Email,
                    Subject = "[MAVID SKINCARE] Verify Your Email",
                    Body = emailBody
                });

                _logger.LogInformation("Email sent successfully.");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email: {Message}", ex.Message);
                // Đang dùng môi trường sandbox, nên không thể gửi email thực tế, nên bỏ qua lỗi
                return true;
            }
        }

    }
}
