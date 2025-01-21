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
    public sealed record ForgotPasswordCommand(string Email) : ICommand<ForgotPasswordResponse>;

    internal sealed class ForgotPasswordCommandHandler : ICommandHandler<ForgotPasswordCommand, ForgotPasswordResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ForgotPasswordCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;

        public ForgotPasswordCommandHandler(
            IAccountRepository accountRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<ForgotPasswordCommandHandler> logger,
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

        public async Task<Result<ForgotPasswordResponse>> Handle(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(command.Email);
            if (user == null)
            {
                return Result<ForgotPasswordResponse>.Failure<ForgotPasswordResponse>(
                    new Error("ForgotPasswordError", IConstantMessage.USER_NOT_FOUND)
                );
            }else if(user.ForgotPasswordToken != null)
            {
                int expiredToken = _jwtTokenService.GetExpireMinutesFromToken(user.ForgotPasswordToken);
                if(expiredToken > 0)
                {
                    return Result<ForgotPasswordResponse>.Failure<ForgotPasswordResponse>(
                        new Error("ForgotPasswordError", IConstantMessage.FORGOT_PASSWORD_TOKEN_EXIST + ", try again in " + expiredToken + " minutes")
                    );
                }
                
            }
            var account = await _accountRepository.GetByIdAsync(user.UsrId, cancellationToken);
            var newForgotPasswordToken = _jwtTokenService.GenerateToken(user.UsrId, account.RoleId, IConstant.FORGOT_PASSWORD_TOKEN_EXPIRE_MINUTES);
            bool isSuccess = await _userRepository.UpdateForgotPasswordTokenAsync(user.UsrId, newForgotPasswordToken);
            if (!isSuccess)
            {
                return Result<ForgotPasswordResponse>.Failure<ForgotPasswordResponse>(
                    new Error("ForgotPasswordError", IConstantMessage.FORGOT_PASSWORD_TOKEN_GENERATE_FAILED)
                );
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            try
            {
                var emailBody = EmailTemplate.GenerateForgotPasswordEmailHtml(
                    username: account.Username,
                    resetToken: newForgotPasswordToken,
                    baseUrl: "http://localhost:3000/reset-password"
                );
                await _emailService.SendEmailAsync(new EmailModel
                {
                    From = Environment.GetEnvironmentVariable("AWS_SES_EMAIL") ?? throw new InvalidOperationException("AWS_SES_EMAIL environment variable is not set"),
                    To = command.Email,
                    Subject = "[MAVID SKINCARE] Reset Your Password",
                    Body = emailBody // HTML nội dung email
                });
                return Result<ForgotPasswordResponse>.Success(new ForgotPasswordResponse
                {
                    NewPasswordResetToken = newForgotPasswordToken
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email");
                return Result<ForgotPasswordResponse>.Failure<ForgotPasswordResponse>(
                    new Error("ForgotPasswordError", IConstantMessage.FORGOT_PASSWORD_EMAIL_SEND_FAILED)
                );
            }


        }
    }
}
