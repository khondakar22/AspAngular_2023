using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Entities;
using Rk.Webapi.Interfaces;

namespace Rk.Webapi.Data
{
    public class UserRepository: IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            this._context = context;
        }
        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.Include(p => p.Photos) .ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByNameAsync(string name)
        {
            return await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => String.Equals(x.UserName, name, StringComparison.CurrentCultureIgnoreCase));
        }
    }
}
