using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rk.Webapi.Data;
using Rk.Webapi.Entities;

namespace Rk.Webapi.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public BuggyController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return Ok("secret text");
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var thing = _dataContext.Users.Find(-1);
            if (thing == null) return NotFound();
            return Ok(thing);
        }
        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var thing = _dataContext.Users.Find(-1);
            var thingToReturn = thing.ToString();
            return Ok(thingToReturn);
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This was not the ood request");
        }

    }
}
