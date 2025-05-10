
namespace backend.Dtos.ExpenseCategory
{
    public class ExpenseCategoryDto
    {
        public int Id { get; set; }
        public string Category { get; set; } = String.Empty;
        public Models.BudgetPlan? BudgetPlan { get; set; }
    }
}
