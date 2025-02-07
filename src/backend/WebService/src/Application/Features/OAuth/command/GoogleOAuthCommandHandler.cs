using Application.Abstractions.Google;
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
    public sealed record GoogleOAuthCommand(string idToken) : ICommand<LoginResponse>;

    internal sealed class GoogleOAuthCommandHandler : ICommandHandler<GoogleOAuthCommand, LoginResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<LoginAccountCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;
        private readonly IGoogleOAuthService _googleOAuthService;

        public GoogleOAuthCommandHandler(
            IAccountRepository accountRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<LoginAccountCommandHandler> logger,
            IJwtTokenService jwtTokenService,
            IRedisCacheService redisCacheService,
            IGoogleOAuthService googleOAuthService)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _redisCacheService = redisCacheService;
            _googleOAuthService = googleOAuthService;
        }

        public async Task<Result<LoginResponse>> Handle(GoogleOAuthCommand command, CancellationToken cancellationToken)
        {
            var payload = await _googleOAuthService.AuthenticateWithGoogle(command.idToken);
            if (payload is null)
            {
                return Result<LoginResponse>.Failure<LoginResponse>(new Error("GoogleOAuthCommandHandler", IConstantMessage.INVALID_GOOGLE_ID_TOKEN));
            }

            try
            {
                // Kiểm tra tài khoản
                var account = await _accountRepository.LoginAsync(payload.Email, "google");
                if (account == null)
                {
                    return Result<LoginResponse>.Failure<LoginResponse>(new Error("GoogleOAuthCommandHandler", IConstantMessage.INVALID_EMAIL_OR_PASSWORD));
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

                // Lưu token vào cache
                await _redisCacheService.SetAsync(
                    account.AccId.ToString(),
                    refreshToken,
                    TimeSpan.FromMinutes(IConstant.REFRESH_TOKEN_EXPIRE_MINUTES));

                // Trả về thông tin tài khoản
                var response = _mapper.Map<LoginResponse>(account);
                response.AccessToken = accessToken;
                response.RefreshToken = refreshToken;
                return Result<LoginResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while handling GoogleOAuthCommand.");
                return Result<LoginResponse>.Failure<LoginResponse>(new Error("GoogleOAuthCommandHandler", IConstantMessage.INTERNAL_SERVER_ERROR));
            }

        }
    }
}