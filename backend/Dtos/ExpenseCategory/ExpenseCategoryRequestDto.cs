using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.ExpenseCategory
{
    public class ExpenseCategoryRequestDto
    {
        [Required]
        public string Category { get; set; } = String.Empty;
    }
}
