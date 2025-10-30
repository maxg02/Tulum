namespace backend.Models
{
    public class EmailVerification
    {
        public int Id { get; set; } 
        public int UserId { get; set; }
        public string Token { get; set; } = String.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }

    }
}
