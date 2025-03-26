using backend.Dtos.Income;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IIncomeRepo
    {
        Task<List<Income>> GetByUserIdAsync(int userId);
        Task<Income?> GetByIdAsync(int id);
        Task<Income> CreateAsync(Income incomeModel);
        Task<Income?> UpdateAsync(int id, UpdateIncomeRequestDto incomeDto);
        Task<Income?> DeleteAsync(int id);


    }
}
