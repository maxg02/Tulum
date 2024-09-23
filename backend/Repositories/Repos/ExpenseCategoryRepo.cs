using backend.Data;
using backend.Dtos.ExpenseCategory;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Repos
{
    public class ExpenseCategoryRepo : IExpenseCategoryRepo
    {
        private readonly ApplicationDBContext _context;

        public ExpenseCategoryRepo(ApplicationDBContext context) => _context = context;
        
        public async Task<List<ExpenseCategory>> GetByUserIdFullAsync(int userId)
        {
            var ExpenseCategories = await _context.ExpenseCategories
                .Where(ec => ec.UserId == userId)
                .Include(ec => ec.Expenses)
                .Include(ec => ec.FixedExpenses)
                .Include(ec => ec.BudgetPlan)
                .ToListAsync();

            return ExpenseCategories;
        }

        public async Task<List<ExpenseCategory>> GetByUserIdWithBudgetAsync(int userId)
        {
            var ExpenseCategories = await _context.ExpenseCategories
                .Where(ec => ec.UserId == userId)
                .Include(ec => ec.BudgetPlan)
                .ToListAsync();

            return ExpenseCategories;
        }

        public Task<ExpenseCategory?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ExpenseCategory> CreateAsync(ExpenseCategory expenseCategory)
        {
            throw new NotImplementedException();
        }

        public Task<ExpenseCategory?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ExpenseCategory?> UpdateAsync(int id, UpdateExpenseCategoryRequestDto expenseCategoryDto)
        {
            throw new NotImplementedException();
        }
    }
}
