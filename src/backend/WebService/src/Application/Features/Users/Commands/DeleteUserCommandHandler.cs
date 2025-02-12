using System.Threading.Tasks;
using Application.Abstractions.AWS;
using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.Email;
using Application.Common.Enum;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Users.Commands
{
    public sealed record DeleteUserCommand(
        long UsrId
    ) : ICommand;
    internal sealed class DeleteUserCommandHandler : ICommandHandler<DeleteUserCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<DeleteUserCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        private readonly IAccountRepository _accountRepository;
        private readonly IUserRepository _userRepository;

        public DeleteUserCommandHandler(IMapper mapper, IUnitOfWork unitOfWork, ILogger<DeleteUserCommandHandler> logger,
            IJwtTokenService jwtTokenService,
            IEmailService emailService, IAccountRepository accountRepository, IUserRepository userRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _accountRepository = accountRepository;
            _userRepository = userRepository;
        }
        public async Task<Result> Handle(DeleteUserCommand command, CancellationToken cancellationToken)
        {
            var account = await _accountRepository.GetByIdAsync(command.UsrId, cancellationToken);
            var user = await _userRepository.GetByIdAsync(command.UsrId, cancellationToken);
            if (account == null || user == null)
            {
                return Result.Failure<DeleteUserCommand>(new Error("DeleteUserCommandHandler", IConstantMessage.USER_NOT_FOUND));
            }
            if (account.AccStatusId == (short)AccountStatusEnum.Banned)
            {
                return Result.Failure<DeleteUserCommand>(new Error("DeleteUserCommandHandler", IConstantMessage.ACCOUNT_IS_LOCKED));
            }

            account.AccStatusId = (short)AccountStatusEnum.Banned;
            user.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);


            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success("User deleted successfully");

        }


    }
}