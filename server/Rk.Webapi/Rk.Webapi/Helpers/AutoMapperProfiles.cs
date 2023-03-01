using AutoMapper;
using Rk.Webapi.Dto;
using Rk.Webapi.Entities;

namespace Rk.Webapi.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>();
            CreateMap<Photo, PhotoDto>();

        }
    }
}
