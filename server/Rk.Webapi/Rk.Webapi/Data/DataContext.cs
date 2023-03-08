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

        public DbSet<UserLike> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserLike>().HasKey(k => new {k.SourceUserId, k.TargetUserId});
            builder.Entity<UserLike>().HasOne(s => s.SourceUser).WithMany(x => x.LikedUsers)
                .HasForeignKey(l => l.SourceUserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<UserLike>().HasOne(s => s.TargetUser).WithMany(x => x.LikedByUsers)
                .HasForeignKey(l => l.TargetUserId).OnDelete(DeleteBehavior.Cascade);

        }
    }
}
