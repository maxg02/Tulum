using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.SavingGoal
{
    public class SavingGoalRequestDto
    {
        [Required]
        public string Details { get; set; } = String.Empty;
        [Required]
        public int Goal { get; set; }
    }
}
