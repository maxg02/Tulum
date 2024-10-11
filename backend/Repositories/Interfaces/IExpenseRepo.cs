using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IExpenseRepo
    {
        Task<Expense> CreateAsync(Expense expense);
        
    }
}
