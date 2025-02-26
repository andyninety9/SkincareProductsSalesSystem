using Microsoft.OpenApi.Models;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;



var builder = WebApplication.CreateBuilder(args);

// Define CORS policy name
var corsPolicy = "AllowAllOrigins";

// Configure CORS to allow requests from frontend (e.g., Next.js at http://localhost:3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Change this if frontend URL is different
              .AllowAnyMethod() // Allow GET, POST, PUT, DELETE, etc.
              .AllowAnyHeader() // Allow any headers (e.g., Content-Type, Authorization)
              .AllowCredentials(); // Allow cookies or authentication headers
    });
});
builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("ocelot.Production.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.AddOcelot(builder.Configuration);
string solutionDirectory = Directory.GetParent(Directory.GetCurrentDirectory())?.FullName ?? "";
if (solutionDirectory != null)
{
    DotNetEnv.Env.Load(Path.Combine(solutionDirectory, ".env"));
}
var environment = builder.Environment;


var app = builder.Build();

// Use CORS before Ocelot middleware
app.UseCors(corsPolicy);

// Log CORS activation
Console.WriteLine("CORS policy applied.");

await app.UseOcelot();
app.Run();
