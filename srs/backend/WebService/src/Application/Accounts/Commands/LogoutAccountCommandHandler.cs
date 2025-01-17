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

namespace Application.Accounts.Commands
{
    public sealed record LogoutAccountCommand(string RefreshToken) : ICommand<LogoutResponse>;

    internal sealed class LogoutAccountCommandHandler : ICommandHandler<LogoutAccountCommand, LogoutResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<LoginAccountCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;

        public LogoutAccountCommandHandler(
            IAccountRepository accountRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<LoginAccountCommandHandler> logger,
            IJwtTokenService jwtTokenService,
            IRedisCacheService redisCacheService)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _redisCacheService = redisCacheService;
        }

        public async Task<Result<LogoutResponse>> Handle(LogoutAccountCommand command, CancellationToken cancellationToken)
        {
            var accountID = _jwtTokenService.GetAccountIdFromToken(command.RefreshToken);
            var storingRefreshToken = await _redisCacheService.GetAsync(accountID.ToString());

            if (storingRefreshToken != command.RefreshToken)
            {
                return Result<LogoutResponse>.Failure<LogoutResponse>(
                    new Error("LogoutError", IConstantMessage.INVALID_REFRESH_TOKEN));
            }

            await _redisCacheService.RemoveAsync(accountID.ToString());

            return Result<LogoutResponse>.Success(new LogoutResponse
            {
                Message = IConstantMessage.LOGOUT_SUCCESS
            });
        }
    }
}
