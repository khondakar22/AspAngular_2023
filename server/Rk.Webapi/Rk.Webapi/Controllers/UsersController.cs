﻿using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Data;
using Rk.Webapi.Dto;
using Rk.Webapi.Entities;
using Rk.Webapi.Extensions;
using Rk.Webapi.Interfaces;

namespace Rk.Webapi.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;


        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }
      
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await _userRepository.GetMembersAsync());
        }

        
        //[HttpGet("{id}")]
        //public async Task<ActionResult<AppUser>> GetUser(int id)
        //{
        //    return Ok(await _userRepository.GetUserByIdAsync(id));
        //}

        [HttpGet("{name}")]
        public async Task<ActionResult<MemberDto>> GetUserName(string name)
        {
            return Ok(await _userRepository.GetMemberAsync(name));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await _userRepository.GetUserByNameAsync(User.GetUserName());
            if (user == null) return NotFound();
            _mapper.Map(memberUpdateDto, user);
            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByNameAsync(User.GetUserName());
            if(user == null) return NotFound();
            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };
            if (user.Photos.Count == 0) photo.IsMain = true;
            user.Photos.Add(photo);
            if (await _userRepository.SaveAllAsync()) return _mapper.Map<PhotoDto>(photo);
            return BadRequest("Problem adding photo");
        }
    }
}
