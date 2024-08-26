using backend.Models;
using backend.Enums;

namespace backend.Dtos.FixedIncome
{
    public class FixedIncomeDto
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public string Detail { get; set; } = String.Empty;
        public string Periodicity { get; set; } = String.Empty;
    }
}
