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

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));



            string solutionDirectory = Directory.GetParent(Directory.GetCurrentDirectory())?.FullName ?? "";
            if (solutionDirectory != null)
            {
                DotNetEnv.Env.Load(Path.Combine(solutionDirectory, ".env"));
            }
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