namespace backend.Models
{
    public class FixedIncome
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public string Detail { get; set; } = String.Empty;
        public int Periodicity { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

    }
}
