using backend.Dtos.Expense;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IExpenseRepo
    {
        Task<Expense> CreateAsync(Expense expense);
        Task<Expense?> UpdateAsync(int id, CUExpenseRequestDto expenseDto);
        Task<Expense?> DeleteAsync(int id);
    }
}
