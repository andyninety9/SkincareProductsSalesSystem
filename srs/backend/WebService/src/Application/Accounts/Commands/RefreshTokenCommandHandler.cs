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
    public sealed record RefreshTokenCommand(string RefreshToken) : ICommand<RefreshTokenResponse>;

    internal sealed class RefreshTokenCommandHandler : ICommandHandler<RefreshTokenCommand, RefreshTokenResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<LoginAccountCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;

        public RefreshTokenCommandHandler(
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

        public async Task<Result<RefreshTokenResponse>> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            var accountID = _jwtTokenService.GetAccountIdFromToken(command.RefreshToken);
            if (accountID <= 0)
            {
                return Result<RefreshTokenResponse>.Failure<RefreshTokenResponse>(
                    new Error("RefreshTokenError", IConstantMessage.INVALID_REFRESH_TOKEN));
            }
            var roleId = _jwtTokenService.GetRoleIdFromToken(command.RefreshToken);

            var storedRefreshToken = await _redisCacheService.GetAsync(accountID.ToString());

            if (storedRefreshToken == null || storedRefreshToken != command.RefreshToken)
            {
                return Result<RefreshTokenResponse>.Failure<RefreshTokenResponse>(
                    new Error("RefreshTokenError", IConstantMessage.INVALID_REFRESH_TOKEN));
            }

            var newAccessToken = _jwtTokenService.GenerateToken(accountID, roleId, IConstant.ACCESS_TOKEN_EXPIRE_MINUTES);

            var newRefreshToken = _jwtTokenService.GenerateToken(accountID, roleId, IConstant.REFRESH_TOKEN_EXPIRE_MINUTES);

            await _redisCacheService.SetAsync(accountID.ToString(), newRefreshToken, TimeSpan.FromMinutes(IConstant.REFRESH_TOKEN_EXPIRE_MINUTES));

            var response = new RefreshTokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };

            return Result<RefreshTokenResponse>.Success(response);
        }

    }
}
