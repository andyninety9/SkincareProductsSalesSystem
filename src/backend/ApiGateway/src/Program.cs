using Microsoft.OpenApi.Models;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// CORS Policy
var corsPolicy = "AllowAllOrigins";

// Config CORS
var allowedOrigins = builder.Environment.IsDevelopment()
    ? new[] { "http://localhost:5173" } // 🔥 Khi chạy local
    : new[] { "https://website-mavidstore-aiw8e6oxq-andyninety9s-projects.vercel.app" };
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins(allowedOrigins) // 🚀 Chỉ định domain frontend (không đổi)
              .AllowAnyMethod() // Cho phép tất cả phương thức HTTP
              .AllowAnyHeader() // Chấp nhận mọi loại header
              .AllowCredentials(); // 🔥 Cho phép gửi Cookie / Authorization
    });
});

builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("ocelot.Production.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

app.UseCors(corsPolicy);

Console.WriteLine("✅ CORS policy applied.");

// Middleware Ocelot
await app.UseOcelot();

app.Run();
