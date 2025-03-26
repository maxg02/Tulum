namespace backend.Models
{
    public class FixedExpense
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public string Details { get; set; } = String.Empty;
        public int Periodicity { get; set; }
        public int ExpenseCategoryId { get; set; }
    }
}
