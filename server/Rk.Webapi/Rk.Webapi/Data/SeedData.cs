using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Entities;

namespace Rk.Webapi.Data
{
    public class SeedData
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager)
        {
            if(await userManager.Users.AnyAsync()) return;
            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            var option = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            foreach (var user in users)
            {
               
                user.UserName = user.UserName.ToLower();

                await userManager.CreateAsync(user, "Start12345@") ;
            }

        }
    }
}
