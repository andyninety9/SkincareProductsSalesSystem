using Microsoft.OpenApi.Models;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);
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

await app.UseOcelot();
app.Run();
