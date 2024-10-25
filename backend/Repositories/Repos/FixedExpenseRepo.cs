using backend.Data;
using backend.Dtos.FixedExpense;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Repos
{
    public class FixedExpenseRepo : IFixedExpenseRepo
    {
        private readonly ApplicationDBContext _context;

        public FixedExpenseRepo(ApplicationDBContext context) => _context = context;

        public async Task<FixedExpense> CreateAsync(FixedExpense fixedExpense)
        {
            await _context.FixedExpenses.AddAsync(fixedExpense);
            await _context.SaveChangesAsync();

            return fixedExpense;
        }

        public async Task<FixedExpense?> UpdateAsync(int id, CUFixedExpenseRequestDto fixedExpenseDto)
        {
            var fixedExpense = await _context.FixedExpenses.FirstOrDefaultAsync(x => x.Id == id);

            if (fixedExpense == null)
            {
                return null;
            }

            fixedExpense.Amount = fixedExpenseDto.Amount;
            fixedExpense.Periodicity = fixedExpenseDto.Periodicity;
            fixedExpense.Details = fixedExpenseDto.Details;
            fixedExpense.ExpenseCategoryId = fixedExpenseDto.ExpenseCategoryId;

            await _context.SaveChangesAsync();

            return fixedExpense;
        }

        public async Task<FixedExpense?> DeleteAsync(int id)
        {
            var fixedExpense = await _context.FixedExpenses.FirstOrDefaultAsync(x => x.Id == id);

            if (fixedExpense == null)
            {
                return null;
            }

            _context.FixedExpenses.Remove(fixedExpense);
            await _context.SaveChangesAsync();

            return fixedExpense;
        }
    }

}
