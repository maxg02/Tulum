using backend.Dtos.Expense;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IExpenseRepo
    {
        Task<List<Expense>> GetByUserIdAsync(int userId);
        Task<Expense> CreateAsync(Expense expense);
        Task<Expense?> UpdateAsync(int id, ExpenseRequestDto expenseDto);
        Task<Expense?> DeleteAsync(int id);
    }
}
