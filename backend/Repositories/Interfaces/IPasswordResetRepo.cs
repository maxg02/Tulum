using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IPasswordResetRepo
    {
        Task<String> CreatePasswordResetTokenAsync(int userId);
        Task<int?> VerifyTokenAsync(string token);
        Task<PasswordResetToken?> GetLastPasswordResetTokenAsync(int userId);
    }
}