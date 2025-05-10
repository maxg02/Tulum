using backend.Data;
using backend.Dtos.GoalContribution;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Repos
{
    public class GoalContributionRepo : IGoalContributionRepo
    {
        private readonly ApplicationDBContext _context;

        public GoalContributionRepo(ApplicationDBContext context) => _context = context;

        public async Task<GoalContribution> CreateAsync(GoalContribution goalContribution)
        {
            await _context.GoalContributions.AddAsync(goalContribution);
            await _context.SaveChangesAsync();

            return goalContribution;
        }

        public async Task<GoalContribution?> UpdateAsync(int id, GoalContributionRequestDto goalContributionDto)
        {
            var goalContribution = await _context.GoalContributions.FirstOrDefaultAsync(x => x.Id == id);

            if (goalContribution == null)
            {
                return null;
            }

            goalContribution.Amount = goalContributionDto.Amount;
            goalContribution.Date = goalContributionDto.Date;
            goalContribution.SavingGoalId = goalContributionDto.SavingGoalId;

            await _context.SaveChangesAsync();

            return goalContribution;
        }

        public async Task<GoalContribution?> DeleteAsync(int id)
        {
            var goalContribution = await _context.GoalContributions.FirstOrDefaultAsync(x => x.Id == id);

            if (goalContribution == null)
            {
                return null;
            }

            _context.GoalContributions.Remove(goalContribution);
            await _context.SaveChangesAsync();

            return goalContribution;
        }
    }
}
