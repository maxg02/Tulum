using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Expense
{
    public class ExpenseRequestDto
    {
        [Required]
        public int Amount { get; set; }
        [Required]
        public string Details { get; set; } = String.Empty;
        [Required]
        public DateTime Date { get; set; } = DateTime.Now;
        public int? ExpenseCategoryId { get; set; }
    }
}
