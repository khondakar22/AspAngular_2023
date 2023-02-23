using System.ComponentModel.DataAnnotations;

namespace Rk.Webapi.Dto
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }

    }
}
