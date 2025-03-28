using Microsoft.OpenApi.Models;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using StackExchange.Redis;
using DotNetEnv;
using src.Middleware;

DotNetEnv.Env.Load();
var builder = WebApplication.CreateBuilder(args);

// CORS Policy
var corsPolicy = "AllowAllOrigins";

// Load Redis config từ biến môi trường
var redisHost = Environment.GetEnvironmentVariable("REDIS_HOST");
var redisPort = Environment.GetEnvironmentVariable("REDIS_PORT");
var redisUsername = Environment.GetEnvironmentVariable("REDIS_USERNAME");
var redisPassword = Environment.GetEnvironmentVariable("REDIS_PASSWORD");

// Tạo cấu hình Redis có auth
var redisConfig = new ConfigurationOptions
{
    EndPoints = { $"{redisHost}:{redisPort}" },
    User = redisUsername,
    Password = redisPassword,
    Ssl = true,
    AbortOnConnectFail = false
};

// Đăng ký Redis trong DI container
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(redisConfig)
);

var corsOrigin = Environment.GetEnvironmentVariable("CORS_ORIGIN") ?? "http://localhost:3000"; 
System.Console.WriteLine($"🌐 CORS Origin: {corsOrigin}");
// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins(corsOrigin)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Load cấu hình Ocelot từ ocelot.Production.json
builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("ocelot.Production.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// Cho phép controller hoạt động (cho /gateway-stats/online)
builder.Services.AddControllers();

// Đăng ký Ocelot
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

// Apply CORS
app.UseCors(corsPolicy);
Console.WriteLine("✅ CORS policy applied.");

// Ghi lại IP truy cập
app.UseMiddleware<VisitorTrackingMiddleware>();

// Định tuyến controller trước Ocelot
app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers(); // 👈 Controller nội bộ như /gateway-stats/online xử lý tại đây
});

// Cuối cùng: Ocelot xử lý các route còn lại
await app.UseOcelot();

app.Run();
