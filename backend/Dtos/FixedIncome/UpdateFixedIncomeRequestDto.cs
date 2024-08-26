namespace backend.Dtos.FixedIncome
{
    public class UpdateFixedIncomeRequestDto
    {
        public int Amount { get; set; }
        public string Detail { get; set; } = String.Empty;
        public int Periodicity { get; set; }
    }
}
