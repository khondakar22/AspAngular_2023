using Microsoft.AspNetCore.Mvc;
using Rk.Webapi.Helpers;

namespace Rk.Webapi.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
       
    }
}
