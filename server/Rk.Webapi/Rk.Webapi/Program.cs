using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Rk.Webapi.Data;
using Rk.Webapi.Extensions;
using Rk.Webapi.Interfaces;
using Rk.Webapi.Services;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Rk.Webapi.Entities;
using Rk.Webapi.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationService(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200"));
// Configure the HTTP request pipeline.
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetService<DataContext>();
    if (context != null)
    {
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
        await context.Database.MigrateAsync();
        await SeedData.SeedUsers(userManager, roleManager);
    }
}
catch (Exception e)
{
    var logger = services.GetService<ILogger<Program>>();
    logger?.LogError(e, "An error occurred during migration");
}
app.Run();
 