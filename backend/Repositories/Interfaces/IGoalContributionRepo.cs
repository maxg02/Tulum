using backend.Dtos.GoalContribution;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IGoalContributionRepo
    {
        Task<GoalContribution> CreateAsync(GoalContribution goalContribution);
        Task<GoalContribution?> UpdateAsync(int id, CUGoalContributionRequestDto goalContributionDto);
        Task<GoalContribution?> DeleteAsync(int id);
    }
}
