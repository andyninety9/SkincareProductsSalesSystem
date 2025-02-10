using Application.Abstractions.Google;
using Application.Abstractions.Messaging;
using Application.Abstractions.Redis;
using Application.Abstractions.UnitOfWork;
using Application.Accounts.Response;
using Application.Common;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Auth.Commands
{
    public sealed record GoogleOAuthCommand(string IdToken) : ICommand<LoginResponse>;

    internal sealed class GoogleOAuthCommandHandler : ICommandHandler<GoogleOAuthCommand, LoginResponse>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<LoginAccountCommandHandler> _logger;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRedisCacheService _redisCacheService;
        private readonly IGoogleOAuthService _googleOAuthService;
        private readonly IUserRepository _userRepository;
        private readonly IdGeneratorService _idGenerator;

        public GoogleOAuthCommandHandler(
            IAccountRepository accountRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<LoginAccountCommandHandler> logger,
            IJwtTokenService jwtTokenService,
            IRedisCacheService redisCacheService,
            IGoogleOAuthService googleOAuthService,
            IUserRepository userRepository, IdGeneratorService idGenerator)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _jwtTokenService = jwtTokenService;
            _redisCacheService = redisCacheService;
            _googleOAuthService = googleOAuthService;
            _userRepository = userRepository;
            _idGenerator = idGenerator;
        }

        public async Task<Result<LoginResponse>> Handle(GoogleOAuthCommand command, CancellationToken cancellationToken)
        {
            var payload = await _googleOAuthService.AuthenticateWithGoogle(command.IdToken);
            if (payload is null)
            {
                return Result<LoginResponse>.Failure<LoginResponse>(new Error("GoogleOAuthCommandHandler", IConstantMessage.INVALID_GOOGLE_ID_TOKEN));
            }

            try
            {
                // Kiểm tra tài khoản
                var user = await _userRepository.GetByEmailAsync(payload.Email);
                Account account;

                if (user == null)
                {
                    _logger.LogInformation("User not found. Creating a new account for email: {Email}", payload.Email);

                    // Tạo Snowflake ID cho tài khoản mới
                    long accountId = _idGenerator.GenerateLongId();

                    // Tạo User mới
                    var newUser = new Domain.Entities.User
                    {
                        UsrId = accountId,
                        Email = payload.Email,
                        Fullname = payload.Name ?? "Unknown",
                        Phone = null,
                        CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                        UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                        EmailVerifyToken = null, // Không cần xác minh email
                    };

                    await _userRepository.AddAsync(newUser, cancellationToken);

                    // Tạo Account mới
                    account = new Domain.Entities.Account
                    {
                        AccId = accountId,
                        Password = null, // Không cần mật khẩu với OAuth
                        Username = payload.Email,
                        AccStatusId = 2, // Đã xác minh email
                        RoleId = 3,      // Default role
                    };

                    await _accountRepository.AddAsync(account, cancellationToken);

                    // Lưu thay đổi vào database
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    _logger.LogInformation("New account created successfully for email: {Email}", payload.Email);
                }
                else
                {
                    account = await _accountRepository.GetByIdAsync(user.UsrId, cancellationToken);
                    if (account == null)
                    {
                        _logger.LogWarning("Account not found for user: {UserId}", user.UsrId);
                        return Result<LoginResponse>.Failure<LoginResponse>(new Error("AccountNotFound", IConstantMessage.INVALID_EMAIL_OR_PASSWORD));
                    }
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
                var response = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };

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