namespace backend.Models
{
    public class Income
    {
        public int Id { get; set; }
        public double Amount {  get; set; }
        public string Details { get; set; } = String.Empty;
        public DateTime Date { get; set; } = DateTime.Now;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
