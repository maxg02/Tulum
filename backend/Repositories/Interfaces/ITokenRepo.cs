using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ITokenRepo
    {
        Task<User?> ValidateRefreshTokenAsync(string refreshToken);
        Task<string> SaveRefreshTokenAsync(string refreshToken, User user);
    }
}
