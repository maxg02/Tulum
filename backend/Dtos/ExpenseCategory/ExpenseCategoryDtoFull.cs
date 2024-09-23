using backend.Models;

namespace backend.Dtos.ExpenseCategory
{
    public class ExpenseCategoryFullDto
    {
        public int Id { get; set; }
        public string Category { get; set; } = String.Empty;
        public List<Expense> Expenses { get; set; } = new List<Expense>();
        public List<FixedExpense> FixedExpenses { get; set; } = new List<FixedExpense>();
        public BudgetPlan? BudgetPlan { get; set; }
    }
}
