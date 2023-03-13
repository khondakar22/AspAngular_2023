using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Dto;
using Rk.Webapi.Entities;
using Rk.Webapi.Helpers;
using Rk.Webapi.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Rk.Webapi.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PhotoRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<PagedList<PhotoForApprovalDto>> GetUnapprovedPhotos(int pageNumber, int pageSize)
        {
            var query = _context.Photos.Where(x => !x.IsApproved).AsQueryable();
            var photos = query.ProjectTo<PhotoForApprovalDto>(_mapper.ConfigurationProvider);
            return await PagedList<PhotoForApprovalDto>.CreateAsync(photos, pageNumber, pageSize);

        }

        public async Task<PhotoDto> ApprovePhotoById(PhotoParams photoParams)
        {
            var photo = await _context.Photos.Where(x => x.Id == photoParams.PhotoId).FirstOrDefaultAsync();
            var query = await _context.Photos.Where(x => x.AppUserId == photoParams.UserId).ToListAsync();
            if (photo == null) return null;
            if (!query.Any(x => x.IsMain))
            {

                photo.IsMain = true;
            }

            if (!photo.IsApproved)
            {
                photo.IsApproved = true;
            }
            var result = _mapper.Map<PhotoDto>(photo);
            return result;
        }

        public async Task<Photo> GetPhotoById(int photoId)
        {
            return await _context.Photos.FirstOrDefaultAsync(x => x.Id == photoId);
        }

        public async Task<PhotoDto> RejectPhoto(int photoId)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(x => x.Id == photoId);
            if (photo == null) return null;
            photo.IsApproved = false;
            photo.IsRejected = true;
            var result = _mapper.Map<PhotoDto>(photo);
            return result;
        }
    }
}
