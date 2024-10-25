namespace backend.Dtos.FixedExpense
{
    public class CUFixedExpenseRequestDto
    {
        public int Amount { get; set; }
        public string Details { get; set; } = String.Empty;
        public int Periodicity { get; set; }
        public int ExpenseCategoryId { get; set; }
    }
}
