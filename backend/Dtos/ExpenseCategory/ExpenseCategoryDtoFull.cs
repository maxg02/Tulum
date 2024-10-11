using backend.Models;

namespace backend.Dtos.ExpenseCategory
{
    public class ExpenseCategoryFullDto
    {
        public int Id { get; set; }
        public string Category { get; set; } = String.Empty;
        public List<Models.Expense> Expenses { get; set; } = new List<Models.Expense>();
        public List<FixedExpense> FixedExpenses { get; set; } = new List<FixedExpense>();
        public Models.BudgetPlan? BudgetPlan { get; set; }
    }
}
