using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.BudgetPlan
{
    public class CreateBudgetPlanRequestDto
    {
        [Required]
        public int Amount { get; set; }
        [Required]
        public int ExpenseCategoryId { get; set; }
        [Required]
        public int Periodicity { get; set; }
    }
}
