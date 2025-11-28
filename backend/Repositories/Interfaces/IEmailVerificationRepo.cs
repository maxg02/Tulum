using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IEmailVerificationRepo
    {
        Task<String> CreateEmailVerificationCodeAsync(int userId);
        Task<int?> VerifyTokenAsync(string token);
        Task<VerificationToken?> GetLastEmailVerificationAsync(int userId);
    }
}