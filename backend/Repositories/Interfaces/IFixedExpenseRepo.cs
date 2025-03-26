using backend.Dtos.FixedExpense;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IFixedExpenseRepo
    {
        Task<FixedExpense> CreateAsync(FixedExpense fixedExpense);
        Task<FixedExpense?> UpdateAsync(int id, CUFixedExpenseRequestDto fixedExpenseDto);
        Task<FixedExpense?> DeleteAsync(int id);
    }
}
