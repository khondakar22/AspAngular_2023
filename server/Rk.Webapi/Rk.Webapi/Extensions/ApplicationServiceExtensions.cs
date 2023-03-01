﻿using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Data;
using Rk.Webapi.Interfaces;
using Rk.Webapi.Services;

namespace Rk.Webapi.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection service, IConfiguration config)
        {
            // Add DbContext
            service.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            service.AddCors();
            // Add Services
            service.AddScoped<ITokenService, TokenService>();
            service.AddScoped<IUserRepository, UserRepository>();
            service.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            return service;
        }
    }
}
