using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IAuthRepo
    {
        Task<User> RegisterAsync(User user);
        Task<User?> LogInAsync(string email);
        Task<User?> ValidateRefreshTokenAsync(string refreshToken);
        Task<string> SaveRefreshTokenAsync(string refreshToken, User user);
    }
}
