using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Dto;
using Rk.Webapi.Entities;
using Rk.Webapi.Interfaces;
using System.Xml.Linq;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Rk.Webapi.Helpers;

namespace Rk.Webapi.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
            return await _context.Users.Include(p => p.Photos).ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByNameAsync(string name)
        {
           
            if (name == null) throw new ArgumentNullException(nameof(name));
            return await _context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => !string.IsNullOrEmpty(x.UserName) && x.UserName.ToLower() == name.ToLower());
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();
            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender == userParams.Gender);
            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
            query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);
            
            // var query= _context.Users
            //    .ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking();
            return await PagedList<MemberDto>.CreateAsync(query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider), userParams.PageNumber, userParams.PageSize);

        }

        public async Task<MemberDto> GetMemberAsync(string userName)
        {
            return await _context.Users
                .Where(x => !string.IsNullOrEmpty(x.UserName) && x.UserName.ToLower() == userName.ToLower())
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }
    }
}
