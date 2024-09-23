namespace backend.Dtos.ExpenseCategory
{
    public class CreateExpenseCategoryRequestDto
    {
        public string Category { get; set; } = String.Empty;
        public int UserId { get; set; }
    }
}
