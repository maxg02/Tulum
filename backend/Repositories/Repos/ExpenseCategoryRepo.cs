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
            var expenseCategories = await _context.ExpenseCategories
                .Where(ec => ec.UserId == userId)
                .Include(ec => ec.Expenses)
                .Include(ec => ec.FixedExpenses)
                .Include(ec => ec.BudgetPlan)
                .ToListAsync();

            return expenseCategories;
        }

        public async Task<List<ExpenseCategory>> GetByUserIdWithBudgetAsync(int userId)
        {
            var expenseCategories = await _context.ExpenseCategories
                .Where(ec => ec.UserId == userId)
                .Include(ec => ec.BudgetPlan)
                .ToListAsync();

            return expenseCategories;
        }

        public async Task<ExpenseCategory?> GetByIdAsync(int id)
        {
            var expenseCategory = await _context.ExpenseCategories.FirstOrDefaultAsync(ec => ec.Id == id);

            return expenseCategory;
        }

        public async Task<ExpenseCategory> CreateAsync(ExpenseCategory expenseCategory)
        {
            await _context.ExpenseCategories.AddAsync(expenseCategory);
            await _context.SaveChangesAsync();

            return expenseCategory;
        }

        public async Task<ExpenseCategory?> DeleteAsync(int id)
        {
            var expenseCategory = await GetByIdAsync(id);

            if (expenseCategory == null)
            {
                return null;
            }

            _context.ExpenseCategories.Remove(expenseCategory);
            await _context.SaveChangesAsync();

            return expenseCategory;
        }

        public async Task<ExpenseCategory?> UpdateAsync(int id, UpdateExpenseCategoryRequestDto expenseCategoryDto)
        {
            var expenseCategory = await GetByIdAsync(id);

            if (expenseCategory == null)
            {
                return null;
            }

            expenseCategory.Category = expenseCategoryDto.Category;
            await _context.SaveChangesAsync();

            return expenseCategory;
        }
    }
}
