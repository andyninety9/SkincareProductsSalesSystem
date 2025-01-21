using Application.Abstractions.Messaging;
using Application.Abstractions.Redis;
using Application.Abstractions.UnitOfWork;
using Application.Accounts.Response;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Auth.Commands
{
    public sealed record VerifyEmailCommand(string EmailVerifyToken) : ICommand<VerifyEmailResponse>;

    internal sealed class VerifyEmailCommandHandler : ICommandHandler<VerifyEmailCommand, VerifyEmailResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<VerifyEmailCommand> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;
        private readonly IUserRepository _userRepository;

        public VerifyEmailCommandHandler(
            IAccountRepository accountRepository,
            IUnitOfWork unitOfWork,
            ILogger<VerifyEmailCommand> logger,
            IJwtTokenService jwtTokenService,
            IRedisCacheService redisCacheService,
            IUserRepository userRepository)
        {
            _accountRepository = accountRepository;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _redisCacheService = redisCacheService;
            _userRepository = userRepository;
        }

        public async Task<Result<VerifyEmailResponse>> Handle(VerifyEmailCommand command, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(command.EmailVerifyToken))
            {
                return Result<VerifyEmailResponse>.Failure<VerifyEmailResponse>(
                    new Error("VerifyEmailError", "Email verification token is missing or invalid.")
                );
            }

            var usrID = _jwtTokenService.GetAccountIdFromToken(command.EmailVerifyToken);

            if (usrID == 0)
            {
                return Result<VerifyEmailResponse>.Failure<VerifyEmailResponse>(
                    new Error("VerifyEmailError", "Invalid email verification token.")
                );
            }

            var storingEmailVerifyToken = await _userRepository.GetEmailVerifyTokenByUsrID(usrID);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            float expireMinutes = _jwtTokenService.GetExpireMinutesFromToken(command.EmailVerifyToken);
            if (storingEmailVerifyToken == null)
            {
                return Result<VerifyEmailResponse>.Failure<VerifyEmailResponse>(
                    new Error("VerifyEmailError", IConstantMessage.EMAIL_VERIFY_HAVE_BEEN_VERIFIED)
                );
            }
            else if (storingEmailVerifyToken != command.EmailVerifyToken || expireMinutes <= 0)
            {
                return Result<VerifyEmailResponse>.Failure<VerifyEmailResponse>(
                    new Error("VerifyEmailError", IConstantMessage.EMAIL_VERIFICATION_EXPIRED)
                );
            }

            var isSuccess = await _userRepository.VerifyEmail(usrID);
            if (isSuccess)
            {
                await _accountRepository.UpdateAccountStatusId(usrID, 2);

                var response = new VerifyEmailResponse
                {
                    Message = IConstantMessage.EMAIL_VERIFY_SUCCESS
                };

                return Result<VerifyEmailResponse>.Success(response);
            }
            else
            {
                return Result<VerifyEmailResponse>.Failure<VerifyEmailResponse>(
                    new Error("VerifyEmailError", IConstantMessage.EMAIL_VERIFY_FALSE)
                );
            }
        }
    }
}