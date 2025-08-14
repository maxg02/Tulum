namespace backend.Models
{
    public class ExpenseCategory
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public BudgetPlan? BudgetPlan { get; set; }
        public List<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
