using Microsoft.AspNetCore.Identity;

namespace Rk.Webapi.Entities
{
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
