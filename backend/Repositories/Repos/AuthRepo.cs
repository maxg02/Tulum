using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Repos
{
    public class AuthRepo : IAuthRepo
    {
        private readonly ApplicationDBContext _context;

        public AuthRepo (ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<User> RegisterAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User?> LogInAsync(string email)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(user => user.Email == email);

            return user;
        }

        public async Task<User?> ValidateRefreshTokenAsync(string refreshToken)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(user => user.RefreshToken == refreshToken);

            return user;
        }

        public async Task<string> SaveRefreshTokenAsync(string refreshToken, User user)
        {
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpireDate = DateTime.Now.AddDays(90);
            await _context.SaveChangesAsync();

            return refreshToken;
        }
    }
}
