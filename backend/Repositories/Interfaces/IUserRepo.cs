using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IUserRepo
    {
        Task<User?> GetByIdAsync(int Id);
        Task<bool> UserExists(string email);
    }
}
