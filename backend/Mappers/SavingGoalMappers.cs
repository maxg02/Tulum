using backend.Dtos.SavingGoal;
using backend.Models;

namespace backend.Mappers
{
    public static class SavingGoalMappers
    {
        public static SavingGoalDto ToSavingGoalDto(this SavingGoal savingGoalModel)
        {
            return new SavingGoalDto
            {
                Id = savingGoalModel.Id,
                Goal = savingGoalModel.Goal,
                Details = savingGoalModel.Details,
                GoalContributions = savingGoalModel.GoalContributions,
                FixedContribution = savingGoalModel.FixedContribution,
                Periodicity = savingGoalModel.Periodicity,
            };
        }
        public static SavingGoal ToSavingGoalFromCreateDto(this CreateSavingGoalRequestDto savingGoalDto)
        {
            return new SavingGoal
            {
                Goal = savingGoalDto.Goal,
                Details = savingGoalDto.Details,
                FixedContribution = savingGoalDto.FixedContribution,
                Periodicity = savingGoalDto.Periodicity,
                UserId = 1
            };
        }
    }
}
