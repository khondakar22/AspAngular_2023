using Microsoft.AspNetCore.Mvc.Filters;
using Rk.Webapi.Extensions;
using Rk.Webapi.Interfaces;

namespace Rk.Webapi.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if(resultContext.HttpContext.User.Identity != null && !resultContext.HttpContext.User.Identity.IsAuthenticated) return;
            var userId = resultContext.HttpContext.User.GetUserId();

            var uow = resultContext.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();
            var user = await uow.UserRepository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.UtcNow;
            await uow.Complete();
        }
    }
}
