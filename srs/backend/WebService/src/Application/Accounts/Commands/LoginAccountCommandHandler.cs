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
    public sealed record LoginAccountCommand(string Username, string Password) : ICommand<LoginResponse>;

    internal sealed class LoginAccountCommandHandler : ICommandHandler<LoginAccountCommand, LoginResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<LoginAccountCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;

        public LoginAccountCommandHandler(
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

        public async Task<Result<LoginResponse>> Handle(LoginAccountCommand command, CancellationToken cancellationToken)
        {
            try
            {
                // Kiểm tra tài khoản
                var account = await _accountRepository.LoginAsync(command.Username, command.Password);
                if (account == null)
                {
                    return Result<LoginResponse>.Failure<LoginResponse>(new Error("LoginError", IConstantMessage.LOGIN_FALSE));
                }

                // Tạo token
                var accessToken = _jwtTokenService.GenerateToken(
                    account.AccId,
                    account.RoleId,
                    IConstant.ACCESS_TOKEN_EXPIRE_MINUTES);

                var refreshToken = _jwtTokenService.GenerateToken(
                    account.AccId,
                    account.RoleId,
                    IConstant.REFRESH_TOKEN_EXPIRE_MINUTES);

                // Phản hồi
                var response = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };

                // Cache refresh token with user ID as key
                await _redisCacheService.SetAsync(
                    account.AccId.ToString(), 
                    refreshToken,
                    TimeSpan.FromMinutes(IConstant.REFRESH_TOKEN_EXPIRE_MINUTES));

                return Result<LoginResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during login.");
                return Result<LoginResponse>.Failure<LoginResponse>(new Error("LoginAccount", "An unexpected error occurred"));
            }
        }
    }
}
