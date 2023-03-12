using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Dto;
using Rk.Webapi.Entities;
using Rk.Webapi.Extensions;
using Rk.Webapi.Helpers;
using Rk.Webapi.Interfaces;

namespace Rk.Webapi.Controllers
{

    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _uow;

        public AdminController(UserManager<AppUser> userManager, IUnitOfWork uow)
        {
            _userManager = userManager;
            _uow = uow;
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                .OrderBy(u => u.UserName)
                .Select(x => new
                {
                    x.Id,
                    Username = x.UserName,
                    Roles = x.UserRoles.Select(r => r.Role.Name).ToList()
                }).ToListAsync();
            return Ok(users);
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");
            var selectedRoles = roles.Split(",").ToArray();
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return NotFound();
            var userRoles = await _userManager.GetRolesAsync(user);
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded) return BadRequest("Failed to add to roles");
            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!result.Succeeded) return BadRequest("Failed to remove to roles");
            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate/{photoParams}")]
        public async Task<ActionResult<PhotoForApprovalDto>> GetPhotosForModeration([FromQuery] PhotoParams photoParams)
        {
            var photos = await _uow.PhotoRepository.GetUnapprovedPhotos(photoParams.PageNumber, photoParams.PageSize);
            Response.AddPaginationHeader(new PaginationHeader(photos.CurrentPage, photos.PageSize, photos.TotalCount,
                photos.TotalPages));
            return Ok(photos);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("photos-to-approve/{userId}")]
        public async Task<ActionResult<PhotoDto>> ApprovePhoto(int userId, [FromQuery] int photoId)
        {
            var result = await _uow.PhotoRepository.ApprovePhotoById(photoId, userId);
           
            if (await _uow.Complete()) return Ok(result);

            return BadRequest("Problem approving the photo");
        }


        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("photos-to-reject/{Id}")]
        public async Task<ActionResult<PhotoDto>> RejectPhoto(int Id)
        {
            var result = await _uow.PhotoRepository.RejectPhoto(Id);
            if (await _uow.Complete()) return Ok(result);

            return BadRequest("Problem Rejecting the photo");
        }

    }
}
