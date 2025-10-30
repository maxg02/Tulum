using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Repos
{
    public class UserRepo : IUserRepo
    {
        private readonly ApplicationDBContext _context;

        public UserRepo(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int Id)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Id == Id);

            return user;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            return user;
        }

        public async Task ValidateEmailVerificationAsync(int Id)
        {
            User user = GetByIdAsync(Id).Result!;
            user.isVerified = true;

            await _context.SaveChangesAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }
    }
}
