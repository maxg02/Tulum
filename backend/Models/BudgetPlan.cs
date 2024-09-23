namespace backend.Models
{
    public class BudgetPlan
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int ExpenseCategoryId { get; set; }
        public ExpenseCategory ExpenseCategory { get; set; } = null!;
        public int Periodicity { get; set; }
    }
}