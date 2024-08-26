using backend.Models;
using backend.Dtos.FixedIncome;
using backend.Repositories.Interfaces;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Repos
{
    public class FixedIncomeRepo : IFixedIncomeRepo
    {

        private readonly ApplicationDBContext _context;

        public FixedIncomeRepo(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<FixedIncome>> GetByUserIdAsync(int userId)
        {
            var fixedIncomes = await _context.FixedIncomes
                .Where(fi => fi.UserId == userId)
                .ToListAsync();

            return fixedIncomes;
        }
        
        public async Task<FixedIncome?> GetByIdAsync(int Id)
        {
            var fixedIncome = await _context.FixedIncomes.FirstOrDefaultAsync(fi => fi.Id == Id);

            return fixedIncome;
        }

        public async Task<FixedIncome> CreateAsync(FixedIncome fixedIncome)
        {
            await _context.FixedIncomes.AddAsync(fixedIncome);
            await _context.SaveChangesAsync();

            return fixedIncome;
        }

        public async Task<FixedIncome?> UpdateAsync(int Id, UpdateFixedIncomeRequestDto fixedIncomeDto)
        {
            var fixedIncome = await GetByIdAsync(Id);

            if (fixedIncome == null)
            {
                return null;
            }

            fixedIncome.Amount = fixedIncomeDto.Amount;
            fixedIncome.Detail = fixedIncomeDto.Detail;
            fixedIncome.Periodicity = fixedIncomeDto.Periodicity;
            await _context.SaveChangesAsync();

            return fixedIncome;
    }

        public async Task<FixedIncome?> DeleteAsync(int Id)
        {
            var fixedIncome = await GetByIdAsync(Id);

            if (fixedIncome == null)
            {
                return null;
            }

            _context.FixedIncomes.Remove(fixedIncome);
            await _context.SaveChangesAsync();

            return fixedIncome;
        }
    }
}
