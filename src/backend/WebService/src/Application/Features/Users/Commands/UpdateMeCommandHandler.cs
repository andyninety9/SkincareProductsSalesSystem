using Application.Abstractions.AWS;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.Email;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands
{
    public sealed record UpdateMeCommand(
        long UsrId,
        string? Fullname,
        string? Phone,
        string? Email,
        string? Gender,
        string? Dob
    ) : ICommand;
    internal sealed class UpdateMeCommandHandler : ICommandHandler<UpdateMeCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<UpdateMeCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;

        public UpdateMeCommandHandler(IUserRepository userRepository, IMapper mapper, IUnitOfWork unitOfWork, ILogger<UpdateMeCommandHandler> logger,
            IJwtTokenService jwtTokenService,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
        }
        public async Task<Result> Handle(UpdateMeCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(command.UsrId, cancellationToken);
            if (user == null)
            {
                return Result.Failure(new Error("UpdateMe", IConstantMessage.USER_NOT_FOUND));
            }

            if (!string.IsNullOrEmpty(command.Email) && await _userRepository.IsExistedEmail(command.Email))
            {
                return Result.Failure(new Error("UpdateMe", IConstantMessage.EMAIL_ALREADY_EXISTS));
            }

            if (!string.IsNullOrEmpty(command.Phone) && await _userRepository.IsExistedPhone(command.Phone))
            {
                return Result.Failure(new Error("UpdateMe", IConstantMessage.PHONE_NUMBER_EXISTED));
            }

            await UpdateUserFields(user, command);

            user.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

            bool isSuccess = await _userRepository.UpdateUserAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return isSuccess
                ? Result.Success()
                : Result.Failure(new Error("UpdateMe", IConstantMessage.UPDATE_ME_FALSE));
        }

        private async Task UpdateUserFields(User user, UpdateMeCommand command)
        {
            if (!string.IsNullOrEmpty(command.Fullname))
            {
                user.Fullname = command.Fullname;
            }

            if (!string.IsNullOrEmpty(command.Email))
            {
                var emailVerifyToken = _jwtTokenService.GenerateToken(user.UsrId, 3, IConstant.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES);
                user.Email = command.Email;
                user.EmailVerifyToken = emailVerifyToken;
                await SendVerificationEmailAsync(command, emailVerifyToken);
            }

            if (!string.IsNullOrEmpty(command.Phone))
            {
                user.Phone = command.Phone;
            }

            if (!string.IsNullOrEmpty(command.Gender) && short.TryParse(command.Gender, out short inputGender))
            {
                user.Gender = inputGender;
            }

            if (!string.IsNullOrEmpty(command.Dob) && DateOnly.TryParse(command.Dob, out DateOnly date))
            {
                user.Dob = date;
            }
        }
        private async Task<bool> SendVerificationEmailAsync(UpdateMeCommand command, string emailVerifyToken)
        {
            try
            {
                var emailBody = EmailTemplate.GenerateEmailVerifyTokenHtml(
                    username: command.UsrId.ToString(),
                    verifyToken: emailVerifyToken,
                    baseUrl: "http://localhost:5019/swagger/api/Authen/verify-email"
                );

                await _emailService.SendEmailAsync(new EmailModel
                {
                    From = Environment.GetEnvironmentVariable("AWS_SES_EMAIL") ?? throw new InvalidOperationException("AWS_SES_EMAIL environment variable is not set"),
                    To = command.Email ?? throw new InvalidOperationException("Email cannot be null when sending verification email"),
                    Subject = "[MAVID SKINCARE] Verify Your Email",
                    Body = emailBody
                });

                _logger.LogInformation("Email sent successfully.");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email: {Message}", ex.Message);
                return false;
            }
        }
    }
}