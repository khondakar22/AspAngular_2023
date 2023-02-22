using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Entities;

namespace Rk.Webapi.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions options):base(options)
        {
            
        }

        public DbSet<AppUser> Users { get; set; }
    }
}
