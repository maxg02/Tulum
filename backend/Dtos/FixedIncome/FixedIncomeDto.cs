namespace backend.Dtos.FixedIncome
{
    public class FixedIncomeDto
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public string Details { get; set; } = String.Empty;
        public int Periodicity { get; set; }
    }
}
