using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.BudgetPlan
{
    public class UpdateBudgetPlanRequestDto
    {
        [Required]
        public double Amount { get; set; }
        [Required]
        public int Periodicity { get; set; }
    }
        
}
