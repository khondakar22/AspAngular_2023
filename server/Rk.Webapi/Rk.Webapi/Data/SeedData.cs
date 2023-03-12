using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Rk.Webapi.Entities;


namespace Rk.Webapi.Data
{
    public class SeedData
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if(await userManager.Users.AnyAsync()) return;
            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            var roles = new List<AppRole>
            {
                new AppRole { Name = "Member" },
                new AppRole { Name = "Admin" },
                new AppRole { Name = "Moderator" }
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
            foreach (var user in users)
            {
               
                user.UserName = user.UserName.ToLower();
                user.Photos.FirstOrDefault(x => x.IsMain)!.IsApproved = true;
                user.Photos.FirstOrDefault(x => x.IsMain)!.IsRejected = false;
                await userManager.CreateAsync(user, "Start12345@") ;
                await userManager.AddToRoleAsync(user, "Member");
            }

            try
            {
                var admin = new AppUser
                {
                    UserName = "admin",
                    Gender = "female",
                    DateOfBirth = DateTime.UtcNow,
                    KnownAs = "Admin",
                    Created = DateTime.UtcNow,
                    LastActive = DateTime.UtcNow,
                    Introduction = "Sunt esse aliqua ullamco in incididunt consequat commodo. Nisi ad esse elit ipsum commodo fugiat est ad. Incididunt nostrud incididunt nostrud sit excepteur occaecat.\r\n",
                    LookingFor = "Dolor anim cupidatat occaecat aliquip et Lorem ut elit fugiat. Mollit eu pariatur est sunt. Minim fugiat sit do dolore eu elit ex do id sunt. Qui fugiat nostrud occaecat nisi est dolor qui fugiat laborum cillum. Occaecat consequat ex mollit commodo ad irure cillum nulla velit ex pariatur veniam cupidatat. Officia veniam officia non deserunt mollit.\r\n",
                    Interests = "Sit sit incididunt proident velit.",
                    City = "Greenbush",
                    Country = "Martinique",
                    Photos = new List<Photo>
                    {
                        new Photo {Url ="https://randomuser.me/api/portraits/women/51.jpg", IsApproved = true, IsMain = true}
                    }
                };
                await userManager.CreateAsync(admin, "Start12345@");
                await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
           

        }
    }
}
