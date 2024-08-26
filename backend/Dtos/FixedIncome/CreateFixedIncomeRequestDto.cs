using backend.Models;

namespace backend.Dtos.FixedIncome
{
    public class CreateFixedIncomeRequestDto
    {
        public int Amount { get; set; }
        public string Detail { get; set; } = String.Empty;
        public int Periodicity { get; set; }
        public int UserId { get; set; }
    }
}
