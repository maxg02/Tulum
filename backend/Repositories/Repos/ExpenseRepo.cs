using backend.Data;
using backend.Dtos.Expense;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

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

        public async Task<Expense?> UpdateAsync(int id, CUExpenseRequestDto expenseDto)
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(x => x.Id == id);

            if (expense == null)
            {
                return null;
            }

            expense.Amount = expenseDto.Amount;
            expense.Date = expenseDto.Date;
            expense.Details = expenseDto.Details;
            expense.ExpenseCategoryId = expenseDto.ExpenseCategoryId;

            await _context.SaveChangesAsync();

            return expense;
        }

        public async Task<Expense?> DeleteAsync(int id)
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(x => x.Id == id);

            if (expense == null)
            {
                return null;
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return expense;
        }
    }
}
