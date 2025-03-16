using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands
{
    public sealed record ChangePasswordForgotCommand(
        string ForgotPasswordToken,
        string NewPassword,
        string ConfirmPassword
    ) : ICommand;
    internal sealed class ChangePasswordForgotCommandHandler : ICommandHandler<ChangePasswordForgotCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ChangePasswordForgotCommandHandler> _logger;
        private readonly IAccountRepository _accountRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IUserRepository _userRepository;

        public ChangePasswordForgotCommandHandler(IMapper mapper, IUnitOfWork unitOfWork, ILogger<ChangePasswordForgotCommandHandler> logger, IAccountRepository accountRepository, IJwtTokenService jwtTokenService, IUserRepository userRepository
            )
        {
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _accountRepository = accountRepository;

        }
        public async Task<Result> Handle(ChangePasswordForgotCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var userId = _jwtTokenService.GetAccountIdFromToken(command.ForgotPasswordToken);
                var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
                if (user == null)
                {
                    return Result.Failure(new Error("ChangePasswordForgotCommandHandler", "User not found"));
                }

                if (user.ForgotPasswordToken != command.ForgotPasswordToken)
                {
                    return Result.Failure(new Error("ChangePasswordForgotCommandHandler", "Invalid token"));
                }

                var account = await _accountRepository.GetByIdAsync(user.UsrId, cancellationToken);

                if (account == null)
                {
                    return Result.Failure(new Error("ChangePasswordForgotCommandHandler", "Account not found"));
                }

                account.Password = BCrypt.Net.BCrypt.HashPassword(command.NewPassword);
                user.ForgotPasswordToken = null;
                
                _accountRepository.Update(account);
                _userRepository.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred on ChangePasswordForgotCommandHandler");
                return Result.Failure(new Error("Error occurred on ChangePasswordForgotCommandHandler", e.Message));
            }
            
        }
    }
}