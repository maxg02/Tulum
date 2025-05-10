using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IUserRepo
    {
        Task<User?> GetByIdAsync(int Id);
    }
}
