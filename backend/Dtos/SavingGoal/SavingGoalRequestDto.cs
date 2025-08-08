using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.SavingGoal
{
    public class SavingGoalRequestDto
    {
        [Required]
        public string Details { get; set; } = String.Empty;
        [Required]
        public int Goal { get; set; }
        public int? FixedContribution { get; set; }
        public int? Periodicity { get; set; }
    }
}
