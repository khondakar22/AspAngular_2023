using System.ComponentModel.DataAnnotations;

namespace Rk.Webapi.Dto
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength =4)]
        public string Password { get; set; }

        public string Confirmpassword { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public int Gender { get; set; }
        public string Email { get; set; }

    }
}
