using backend.Models;

namespace backend.Dtos.SavingGoal
{
    public class SavingGoalDto
    {
        public int Id { get; set; }
        public string Details { get; set; } = String.Empty;
        public int Goal { get; set; }
        public int? FixedContribution { get; set; }
        public int? Periodicity { get; set; }
        public List<Models.GoalContribution> GoalContributions { get; set; } = new List<Models.GoalContribution>();
    }
}
