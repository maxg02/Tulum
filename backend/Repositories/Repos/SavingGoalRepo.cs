using backend.Data;
using backend.Dtos.SavingGoal;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Repos
{
    public class SavingGoalRepo : ISavingGoalRepo
    {
        private readonly ApplicationDBContext _context;

        public SavingGoalRepo(ApplicationDBContext context) => _context = context;

        public async Task<List<SavingGoal>> GetByUserIdAsync(int userId)
        {
            var savingGoals = await _context.SavingGoals
                .Where(sg => sg.UserId == userId)
                .Include(sg => sg.GoalContributions)
                .ToListAsync();

            return savingGoals;
        }

        public async Task<SavingGoal?> GetByIdAsync(int id)
        {
            var savingGoal = await _context.SavingGoals.FirstOrDefaultAsync(ec => ec.Id == id);

            return savingGoal;
        }

        public async Task<SavingGoal> CreateAsync(SavingGoal savingGoal)
        {
            await _context.SavingGoals.AddAsync(savingGoal);
            await _context.SaveChangesAsync();

            return savingGoal;
        }

        public async Task<SavingGoal?> DeleteAsync(int id)
        {
            var savingGoal = await GetByIdAsync(id);

            if (savingGoal == null)
            {
                return null;
            }

            _context.SavingGoals.Remove(savingGoal);
            await _context.SaveChangesAsync();

            return savingGoal;
        }

        public async Task<SavingGoal?> UpdateAsync(int id, SavingGoalRequestDto savingGoalDto)
        {
            var savingGoal = await GetByIdAsync(id);

            if (savingGoal == null)
            {
                return null;
            }

            savingGoal.Details = savingGoalDto.Details;
            savingGoal.FixedContribution = savingGoalDto.FixedContribution;
            savingGoal.Periodicity = savingGoalDto.Periodicity;
            savingGoal.Goal = savingGoalDto.Goal;
            await _context.SaveChangesAsync();

            return savingGoal;
        }
    }
}