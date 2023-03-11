using Rk.Webapi.Entities;

namespace Rk.Webapi.Interfaces
{
    public interface ITokenService
    {
        Task<string> CrateToken(AppUser appUser);
    }
}
