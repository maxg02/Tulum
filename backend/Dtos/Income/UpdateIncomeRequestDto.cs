namespace backend.Dtos.Income
{
    public class UpdateIncomeRequestDto
    {
        public int Amount { get; set; }
        public string Details { get; set; } = String.Empty;
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
