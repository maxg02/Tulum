using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;

namespace backend.Repositories.Repos
{
    public class EmailVerificationRepo : IEmailVerificationRepo
    {
        private readonly ApplicationDBContext _context;

        public EmailVerificationRepo(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<String> CreateEmailVerificationCodeAsync(int userId)
        {
            String verificationToken = Guid.NewGuid().ToString();

            await _context.EmailVerification.AddAsync(new VerificationToken
            {
                UserId = userId,
                Token = verificationToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            });

            await _context.SaveChangesAsync();

            return verificationToken;
        }

        public async Task<VerificationToken?> GetLastEmailVerificationAsync(int userId)
        {
            VerificationToken? emailVerification = await _context.EmailVerification.OrderByDescending(ev => ev.ExpiresAt).FirstOrDefaultAsync();

            return emailVerification;
        }

        public async Task<int?> VerifyTokenAsync(string token)
        {
            VerificationToken? emailVerification = await _context.EmailVerification.FirstOrDefaultAsync(ev => ev.Token == token);

            if (emailVerification == null || emailVerification.IsUsed || emailVerification.ExpiresAt < DateTime.UtcNow)
            {
                return null;
            }

            emailVerification.IsUsed = true;

            await _context.SaveChangesAsync();

            return emailVerification.UserId;
        }
    }
}
