using backend.Models;

namespace backend.Utilities.Interfaces
{
    public interface ITokenService
    {
        string CreateAccessToken(User user);
        Task<string> CreateRefreshToken(User user);
        Task<User?> ValidateRefreshToken(string refreshToken);
    }
}