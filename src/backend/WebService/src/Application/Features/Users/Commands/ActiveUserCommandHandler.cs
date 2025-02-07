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
    public sealed record ActiveUserCommand(
        long UsrId
    ) : ICommand;
    internal sealed class ActiveUserCommandHandler : ICommandHandler<ActiveUserCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ActiveUserCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        private readonly IAccountRepository _accountRepository;
        private readonly IUserRepository _userRepository;

        public ActiveUserCommandHandler(IMapper mapper, IUnitOfWork unitOfWork, ILogger<ActiveUserCommandHandler> logger,
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
        public async Task<Result> Handle(ActiveUserCommand command, CancellationToken cancellationToken)
        {
            var account = await _accountRepository.GetByIdAsync(command.UsrId, cancellationToken);
            var user = await _userRepository.GetByIdAsync(command.UsrId, cancellationToken);
            if (account == null || user == null)
            {
                return Result.Failure<DeleteUserCommand>(new Error("DeleteUserCommandHandler", IConstantMessage.USER_NOT_FOUND));
            }
            if (account.AccStatusId != (short)AccountStatusEnum.Banned)
            {
                return Result.Failure<DeleteUserCommand>(new Error("DeleteUserCommandHandler", IConstantMessage.ACCOUNT_ACTIVE_ALREADY));
            }

            account.AccStatusId = (short)AccountStatusEnum.Verified;
            user.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);


            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success("Active user successfully");

        }


    }
}