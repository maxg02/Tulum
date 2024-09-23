namespace backend.Models
{
    public class BudgetPlan
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int ExpenseCategoryId { get; set; }
        public int Periodicity { get; set; }
    }
}