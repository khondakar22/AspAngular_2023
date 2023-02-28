using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Data;
using Rk.Webapi.Entities;
using Rk.Webapi.Interfaces;

namespace Rk.Webapi.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;


        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
      
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return Ok(await _userRepository.GetUsersAsync());
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            return Ok(await _userRepository.GetUserByIdAsync(id));
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<AppUser>> GetUserName(string name)
        {
            return Ok(await _userRepository.GetUserByNameAsync(name));
        }
    }
}
