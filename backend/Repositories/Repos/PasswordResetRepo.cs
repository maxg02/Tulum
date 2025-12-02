using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;

namespace backend.Repositories.Repos
{
    public class PasswordResetRepo : IPasswordResetRepo
    {
        private readonly ApplicationDBContext _context;

        public PasswordResetRepo(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<String> CreatePasswordResetTokenAsync(int userId)
        {
            String verificationToken = Guid.NewGuid().ToString();

            await _context.PasswordResetTokens.AddAsync(new PasswordResetToken
            {
                UserId = userId,
                Token = verificationToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            });

            await _context.SaveChangesAsync();

            return verificationToken;
        }

        public async Task<PasswordResetToken?> GetLastPasswordResetTokenAsync(int userId)
        {
            PasswordResetToken? passwordReset = await _context.PasswordResetTokens.OrderByDescending(ev => ev.ExpiresAt).FirstOrDefaultAsync();

            return passwordReset;
        }

        public async Task<int?> VerifyTokenAsync(string token)
        {
            PasswordResetToken? passwordReset = await _context.PasswordResetTokens.FirstOrDefaultAsync(ev => ev.Token == token);

            if (passwordReset == null || passwordReset.IsUsed || passwordReset.ExpiresAt < DateTime.UtcNow)
            {
                return null;
            }

            passwordReset.IsUsed = true;

            await _context.SaveChangesAsync();

            return passwordReset.UserId;
        }
    }
}
