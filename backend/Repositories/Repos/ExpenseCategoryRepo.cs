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
        
        public async Task<List<ExpenseCategory>> GetByUserIdAsync(int userId)
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
            var expenseCategory = await _context.ExpenseCategories
                .Include(x => x.Expenses)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (expenseCategory == null)
            {
                return null;
            }

            foreach (var expense in expenseCategory.Expenses)
            {
                expense.ExpenseCategoryId = null;
            }

            _context.ExpenseCategories.Remove(expenseCategory);
            await _context.SaveChangesAsync();

            return expenseCategory;
        }

        public async Task<ExpenseCategory?> UpdateAsync(int id, ExpenseCategoryRequestDto expenseCategoryDto)
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

        public async Task<bool> CategoryExists(int id)
        {
            var expenseCategory = await GetByIdAsync(id);

            return expenseCategory != null;
        }
    }
}
