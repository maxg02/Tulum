using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IUserRepo
    {
        Task<User?> GetByIdAsync(int Id);
        Task<User?> GetByEmailAsync(string email);
        Task ValidateEmailVerificationAsync(int Id);
        Task<User> CreateAsync(User user);
    }
}
