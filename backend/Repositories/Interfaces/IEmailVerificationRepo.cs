using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IEmailVerificationRepo
    {
        Task<String> CreateEmailVerificationTokenAsync(int userId);
        Task<int?> VerifyTokenAsync(string token);
        Task<EmailVerificationToken?> GetLastEmailVerificationTokenAsync(int userId);
    }
}