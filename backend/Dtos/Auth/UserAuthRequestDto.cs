namespace backend.Dtos.Auth
{
    public class UserAuthRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
