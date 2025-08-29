using backend.Dtos.ExpenseCategory;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IExpenseCategoryRepo
    {
        Task<List<ExpenseCategory>> GetByUserIdAsync(int userId);
        Task<ExpenseCategory?> GetByIdAsync(int id);
        Task<ExpenseCategory> CreateAsync(ExpenseCategory expenseCategory);
        Task<ExpenseCategory?> UpdateAsync(int id, ExpenseCategoryRequestDto expenseCategoryDto);
        Task<ExpenseCategory?> DeleteAsync(int id);
        Task<bool> CheckExists(string categoryName);
        Task<bool> CheckExists(int id, string categoryName);
        Task<bool> CheckExists(int id);
    }
}
