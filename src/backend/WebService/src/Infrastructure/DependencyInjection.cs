using System;
using Infrastructure.Utils;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Infrastructure.Configs;
using Domain.Repositories;
using Infrastructure.Repositories;
using Application.Abstractions.UnitOfWork;
using Domain.Common;
using Infrastructure.Common;
using Infrastructure.JWT;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Application.Common.Jwt;
using Infrastructure.Redis;
using Application.Abstractions.Redis;
using StackExchange.Redis;
using Infrastructure.AWS;
using Amazon.SimpleEmail;
using Amazon.Runtime;
using Amazon;
using Application.Abstractions.AWS;
using Infrastructure.Cloud;
using Application.Abstractions.Cloud;
using Amazon.S3;
using Application.Abstractions.Authorization;
using Infrastructure.Authorization;
using Application.Abstractions.Google;
using Infrastructure.Google;
using Infrastructure.Delivery;
using Application.Abstractions.Delivery;
using Infrastructure.VNPay;
using Application.Abstractions.Payment;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IAccountStatusRepository, AccountStatusRepository>();
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IReviewRepository, ReviewRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IOrderLogRepository, OrderLogRepository>();
            services.AddScoped<IQuestionRepository, QuestionRepository>();
            services.AddScoped<IQuizRepository, QuizRepository>();
            services.AddScoped<IResultQuizRepository, ResultQuizRepository>();
            services.AddScoped<IEventRepository, EventRepository>();
            services.AddScoped<IAddressRepository, AddressRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
            services.AddScoped<IWarantyOrderRepository, WarantyOrderRepository>();
            services.AddScoped<ICategoryProductRepository, CategoryProductRepository>();
            services.AddScoped<IReturnProductRepository, ReturnProductRepository>();
            services.AddScoped<IReturnProductDetailRepository, ReturnProductDetailRepository>();
            services.AddScoped<IProductImageRepository, ProductImageRepository>();
            services.AddScoped<ISkinTypeRepository, SkinTypeRepository>();
            services.AddScoped<IVoucherRepository, VoucherRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            // Config VNPay & DI VNPayService
            services.AddSingleton<VNPayConfig>();
            services.AddScoped<IPaymentVNPayService, VNPayService>();

            //DI GoogleOAuthService
            services.AddSingleton<GoogleAuthConfig>();

            //DI HttpClient for Google OAuth Service
            services.AddHttpClient<IGoogleOAuthService, GoogleOAuthService>();

            // DI GoogleOAuthService
            services.AddScoped<IGoogleOAuthService, GoogleOAuthService>();

            // Config Google OAuth
            services.AddSingleton(provider =>
            {
                var config = provider.GetRequiredService<GoogleAuthConfig>();
                if (string.IsNullOrEmpty(config.ClientId) || string.IsNullOrEmpty(config.ClientSecret))
                {
                    throw new InvalidOperationException("Google OAuth credentials are not configured properly.");
                }
                return config;
            });

            //DI IAuthorizationService
            services.AddScoped<IAuthorizationService, AuthorizationService>();

            string solutionDirectory = Directory.GetParent(Directory.GetCurrentDirectory())?.FullName ?? "";
            if (solutionDirectory != null)
            {
                DotNetEnv.Env.Load(Path.Combine(solutionDirectory, ".env"));
            }

            // DI Delivery Config
            services.AddSingleton<GHNDeliveryConfig>();
            var ghnConfig = services.BuildServiceProvider().GetRequiredService<GHNDeliveryConfig>();

            services.AddHttpClient<IDelivery, GHNDeliveryServices>(client =>
            {
                client.BaseAddress = new Uri(ghnConfig.BaseUrl);
            });


            //DI AWS IAM Service
            services.AddSingleton<IAMConfig>();
            var iamConfig = services.BuildServiceProvider().GetRequiredService<IAMConfig>();

            services.AddSingleton<IAmazonSimpleEmailService>(provider =>
            {
                var credentials = new BasicAWSCredentials(iamConfig.AccessKey, iamConfig.SecretKey);

                return new AmazonSimpleEmailServiceClient(credentials, RegionEndpoint.APSoutheast1);
            });
            // System.Console.WriteLine(iamConfig.AccessKey);
            // System.Console.WriteLine(iamConfig.SecretKey);

            services.AddTransient<IEmailService, AwsSesEmailService>();

            //DI Jwt Service
            services.AddSingleton<JwtConfigService>();
            var jwtConfig = services.BuildServiceProvider().GetRequiredService<JwtConfigService>();
            // System.Console.WriteLine(jwtConfig.JwtIssuer);
            // System.Console.WriteLine(jwtConfig.JwtAudience);
            // System.Console.WriteLine(jwtConfig.JwtKey);

            //Config JWT
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtConfig.JwtIssuer,
                    ValidAudience = jwtConfig.JwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.JwtKey))
                };
            });

            // Config AWS S3
            services.AddSingleton<AwsS3Config>();
            var awsConfig = services.BuildServiceProvider().GetRequiredService<AwsS3Config>();

            services.AddSingleton<IAmazonS3>(provider =>
            {
                var config = new AmazonS3Config
                {
                    RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(awsConfig.Region)
                };
                return new AmazonS3Client(
                    awsConfig.AccessKey,
                    awsConfig.SecretKey,
                    config
                );
            });

            // Config CloudStorageService
            services.AddTransient<ICloudStorageService, CloudStorageService>();


            // Config Redis
            services.AddSingleton<RedisConfigService>();
            var redisConfig = services.BuildServiceProvider().GetRequiredService<RedisConfigService>();

            services.AddSingleton<IConnectionMultiplexer>(provider =>
            {
                try
                {
                    // Sử dụng ConfigurationOptions để cấu hình chi tiết
                    var options = new ConfigurationOptions
                    {
                        EndPoints = { $"{redisConfig.RedisHost}:{redisConfig.RedisPort}" }, 
                        User = redisConfig.RedisUsername, 
                        Password = redisConfig.RedisPassword, 
                        Ssl = true, 
                        AbortOnConnectFail = false, 
                        ConnectTimeout = 10000, 
                        SyncTimeout = 10000, 
                    };

                    // Kết nối Redis
                    var multiplexer = ConnectionMultiplexer.Connect(options);
                    Console.WriteLine("Connected to Redis successfully.");
                    return multiplexer;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to connect to Redis: {ex.Message}");
                    throw;
                }
            });
            // System.Console.WriteLine(redisConfig.RedisHost);
            // System.Console.WriteLine(redisConfig.RedisPort);
            services.AddTransient<IRedisCacheService, RedisCacheService>();

            services.AddSingleton<EnvironmentConfig>();
            using var serviceProvider = services.BuildServiceProvider();
            var logger = serviceProvider.GetRequiredService<ILogger<AutoScaffold>>();
            var config = serviceProvider.GetRequiredService<EnvironmentConfig>();
            var scaffold = new AutoScaffold(logger)
                .Configure(
                    config.DatabaseHost,
                    config.DatabasePort,
                    config.DatabaseName,
                    config.DatabaseUser,
                    config.DatabasePassword,
                    config.DatabaseProvider);

            scaffold.UpdateAppSettings();
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (environment == "Development")
            {

                var autoMigration = new AutoMigration(logger);

                string currentHash = SchemaComparer.GenerateDatabaseSchemaHash(
                    config.DatabaseHost,
                    config.DatabasePort,
                    config.DatabaseName,
                    config.DatabaseUser,
                    config.DatabasePassword
                );

                if (!SchemaComparer.TryGetStoredHash(out string storedHash) || currentHash != storedHash)
                {
                    logger.LogInformation("Database schema has changed. Performing scaffolding...");
                    SchemaComparer.SaveHash(currentHash);
                    scaffold.Run();
                    SchemaComparer.SetMigrationRequired(true);
                }
                else if (Environment.GetEnvironmentVariable("IS_SCAFFOLDING") != "true")
                {
                    if (SchemaComparer.IsMigrationRequired())
                    {
                        autoMigration.GenerateMigration();
                    }
                    SchemaComparer.SetMigrationRequired(false);
                }
            }

            return services;
        }
    }
}