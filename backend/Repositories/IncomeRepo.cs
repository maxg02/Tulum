using backend.Data;
using backend.Dtos.Income;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class IncomeRepo : IIncomeRepo
    {
        private readonly ApplicationDBContext _context;

        public IncomeRepo (ApplicationDBContext context)
        {
            _context = context;

        }
        public async Task<List<Income>> GetByUserIdAsync(int userId)
        {
            var incomes = await _context.Incomes
                .Where(i => i.UserId == userId)
                .ToListAsync();

            return incomes;
        }
        public async Task<Income?> GetByIdAsync(int id)
        {
            var income = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id);

            return income;
        }

        public async Task<Income> CreateAsync(Income income)
        {
            await _context.Incomes.AddAsync(income);
            await _context.SaveChangesAsync();

            return income;
        }
        public async Task<Income?> UpdateAsync(int id, UpdateIncomeRequestDto incomeDto)
        {
            var income = await GetByIdAsync(id);

            if (income == null)
            {
                return null;
            }

            income.Amount = incomeDto.Amount;
            income.Details = incomeDto.Details;
            income.Date = incomeDto.Date;
            await _context.SaveChangesAsync();

            return income;
        }

        public async Task<Income?> DeleteAsync(int id)
        {
            var income = await GetByIdAsync(id);

            if (income == null)
            {
                return null;
            }

            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();

            return income;
        }

    }
}
