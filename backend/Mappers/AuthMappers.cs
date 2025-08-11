using backend.Dtos.Auth;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Mappers
{
    public static class AuthMappers
    {
        public static User ToUserFromRegisterDto(this UserRegisterRequestDto UserDto)
        {
            User user = new()
            {
                Email = UserDto.Email,
                Name = UserDto.Name

            };

            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, UserDto.Password);

            return user;
        }
    }
}
