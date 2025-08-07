using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Income
{
    public class IncomeRequestDto
    {
        [Required]
        public int Amount { get; set; }
        [Required]
        public string Details { get; set; } = String.Empty;
        [Required]
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
