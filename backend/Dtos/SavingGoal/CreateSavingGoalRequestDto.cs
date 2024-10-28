using backend.Models;

namespace backend.Dtos.SavingGoal
{
    public class CreateSavingGoalRequestDto
    {
        public string Details { get; set; } = String.Empty;
        public int Goal { get; set; }
        public bool? FixedContribution { get; set; }
        public int? Periodicity { get; set; }
        public int UserId { get; set; }
    }
}
