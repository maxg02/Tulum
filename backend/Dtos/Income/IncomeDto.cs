namespace backend.Dtos.Income
{
    public class IncomeDto
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public string Details { get; set; } = String.Empty;
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
