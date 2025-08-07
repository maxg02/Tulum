using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.BudgetPlan
{
    public class UpdateBudgetPlanRequestDto
    {
        [Required]
        public int Amount { get; set; }
        [Required]
        public int Periodicity { get; set; }
    }
        
}
