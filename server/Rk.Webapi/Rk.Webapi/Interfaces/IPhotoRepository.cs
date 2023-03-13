using Rk.Webapi.Dto;
using Rk.Webapi.Entities;
using Rk.Webapi.Helpers;

namespace Rk.Webapi.Interfaces
{
    public interface IPhotoRepository
    {
        Task<PagedList<PhotoForApprovalDto>> GetUnapprovedPhotos(int pageNumber, int pageSize);
        Task<PhotoDto> ApprovePhotoById(PhotoParams photoParams);
        Task<Photo> GetPhotoById(int photoId);
        Task<PhotoDto> RejectPhoto(int photoId);
    }
}
