using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Repos
{
    public class ExpenseRepo : IExpenseRepo
    {
        private readonly ApplicationDBContext _context;

        public ExpenseRepo(ApplicationDBContext context) => _context = context;

        public async Task<Expense> CreateAsync(Expense expense)
        {
            await _context.Expenses.AddAsync(expense);
            await _context.SaveChangesAsync();

            return expense;
        }
    }
}
