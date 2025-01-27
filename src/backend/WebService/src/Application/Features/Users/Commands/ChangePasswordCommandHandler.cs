using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands
{
    public sealed record ChangePasswordCommand(
        long UsrId,
        string OldPassword,
        string NewPassword,
        string ConfirmPassword
    ) : ICommand;
    internal sealed class ChangePasswordCommandHandler : ICommandHandler<ChangePasswordCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ChangePasswordCommandHandler> _logger;
        private readonly IAccountRepository _accountRepository;

        public ChangePasswordCommandHandler(IMapper mapper, IUnitOfWork unitOfWork, ILogger<ChangePasswordCommandHandler> logger, IAccountRepository accountRepository
            )
        {
            
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _accountRepository = accountRepository;
        }
        public async Task<Result> Handle(ChangePasswordCommand command, CancellationToken cancellationToken)
        {
            if (command == null)
            {
                _logger.LogError("ChangePasswordCommand is null.");
                throw new ArgumentNullException(nameof(command), "Command cannot be null.");
            }

            if (string.IsNullOrEmpty(command.OldPassword) || string.IsNullOrEmpty(command.NewPassword) || string.IsNullOrEmpty(command.ConfirmPassword))
            {
                _logger.LogError("One or more required fields are empty. Command: {@Command}", command);
                return Result.Failure(new Error("ChangePasswordCommandHandler", "Missing required fields."));
            }

            if (command.NewPassword != command.ConfirmPassword)
            {
                _logger.LogError("NewPassword and ConfirmPassword do not match.");
                return Result.Failure(new Error("ChangePasswordCommandHandler", "Passwords do not match."));
            }
    
            var account = await _accountRepository.GetByIdAsync(command.UsrId, cancellationToken);
            if (account == null)
            {
                return Result.Failure(new Error("ChangePasswordCommandHandler", IConstantMessage.USER_NOT_FOUND));
            }

            if (!BCrypt.Net.BCrypt.Verify(command.OldPassword, account.Password))
            {
                return Result.Failure(new Error("ChangePasswordCommandHandler", IConstantMessage.INVALID_PASSWORD));
            }

            string newPasswordHashed = BCrypt.Net.BCrypt.HashPassword(command.NewPassword, workFactor: 12);
            bool isSuccess = await _accountRepository.UpdateNewPasswordAsync(account.AccId ,newPasswordHashed);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return isSuccess
                ? Result.Success()
                : Result.Failure(new Error("ChangePasswordCommandHandler", IConstantMessage.CHANGE_PASSWORD_FALSE));
        }
    }
}