using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Data;
using Rk.Webapi.Interfaces;
using Rk.Webapi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Add Services
builder.Services.AddScoped<ITokenService, TokenService>();

// Add DbContext
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
// Configure the HTTP request pipeline.

app.MapControllers();

app.Run();
 