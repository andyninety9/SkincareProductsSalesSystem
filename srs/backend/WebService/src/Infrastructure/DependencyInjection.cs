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

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            string solutionDirectory = Directory.GetParent(Directory.GetCurrentDirectory())?.FullName ?? "";
            if (solutionDirectory != null)
            {
                DotNetEnv.Env.Load(Path.Combine(solutionDirectory, ".env"));
            }
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