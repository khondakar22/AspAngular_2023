﻿using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Data;
using Rk.Webapi.Helpers;
using Rk.Webapi.Interfaces;
using Rk.Webapi.Services;
using Rk.Webapi.SignalR;

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
            service.AddScoped<IMessageRepository, MessageRepository>();
            service.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            service.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            service.AddScoped<IPhotoService, PhotoService>();
            service.AddScoped<ILikesRepository, LikesRepository>();
            service.AddScoped<LogUserActivity>();
            service.AddSignalR();
            service.AddSingleton<PresenceTracker>();
            return service;
        }
    }
}
