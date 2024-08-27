using backend.Dtos.FixedIncome;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IFixedIncomeRepo
    {
        Task<List<FixedIncome>> GetByUserIdAsync(int userId);
        Task<FixedIncome?> GetByIdAsync(int id);
        Task<FixedIncome> CreateAsync(FixedIncome fixedIncome);
        Task<FixedIncome?> UpdateAsync(int id, UpdateFixedIncomeRequestDto fixedIncomeDto);
        Task<FixedIncome?> DeleteAsync(int id);
    }
}
