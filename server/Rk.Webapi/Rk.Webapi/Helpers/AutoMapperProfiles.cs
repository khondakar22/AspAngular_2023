using AutoMapper;
using Rk.Webapi.Dto;
using Rk.Webapi.Entities;
using Rk.Webapi.Extensions;

namespace Rk.Webapi.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<Photo, PhotoForApprovalDto>()
                .ForMember(dest => dest.UserId,
                    opt => opt.MapFrom(src => src.AppUser.Id))
                .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.AppUser.UserName));
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl,
                    op => op.MapFrom(s => s.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.RecipientPhotoUrl,
                    op => op.MapFrom(s => s.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url)); ;
            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);

        }
    }
}
