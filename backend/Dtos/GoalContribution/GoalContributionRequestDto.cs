using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.GoalContribution
{
    public class GoalContributionRequestDto
    {
        [Required]
        public int Amount { get; set; }
        [Required]
        public DateTime Date { get; set; } = DateTime.Now;
        [Required]
        public int SavingGoalId { get; set; }
    }
}
