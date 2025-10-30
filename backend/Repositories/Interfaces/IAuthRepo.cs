using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IAuthRepo
    {
        Task<User?> ValidateRefreshTokenAsync(string refreshToken);
        Task<string> SaveRefreshTokenAsync(string refreshToken, User user);
    }
}
