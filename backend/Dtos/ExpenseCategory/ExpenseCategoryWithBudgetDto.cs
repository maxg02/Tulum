using backend.Models;

namespace backend.Dtos.ExpenseCategory
{
    public class ExpenseCategoryWithBudgetDto
    {
        public int Id { get; set; }
        public string Category { get; set; } = String.Empty;
        public backend.Models.BudgetPlan? BudgetPlan { get; set; }
    }
}
