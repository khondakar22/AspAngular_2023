using Rk.Webapi.Entities;

namespace Rk.Webapi.Interfaces
{
    public interface ITokenService
    {
        string CrateToken(AppUser appUser);
    }
}
