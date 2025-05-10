using backend.Dtos.GoalContribution;
using backend.Models;

namespace backend.Mappers
{
    public static class GoalContributionMappers
    {
        public static GoalContribution ToGoalContributionFromCreateDto(this GoalContributionRequestDto goalContributionDto)
        {
            return new GoalContribution
            {
                Amount = goalContributionDto.Amount,
                Date = goalContributionDto.Date,
                SavingGoalId = goalContributionDto.SavingGoalId,
            };
        }
    }
}
