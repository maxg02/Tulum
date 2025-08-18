namespace backend.Utilities.Classes
{
    public class JwtInfo
    {
        public required string SigningKey { get; set; }
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
    }
}
