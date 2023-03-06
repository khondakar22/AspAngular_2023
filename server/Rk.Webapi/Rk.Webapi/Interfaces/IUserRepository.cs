using Rk.Webapi.Dto;
using Rk.Webapi.Entities;
using Rk.Webapi.Helpers;

namespace Rk.Webapi.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByNameAsync(string name);

        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);

        Task<MemberDto> GetMemberAsync(string userName);
    }
}
