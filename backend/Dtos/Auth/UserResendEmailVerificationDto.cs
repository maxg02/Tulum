using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Auth
{
    public class UserResendEmailVerificationDto
    {
        [EmailAddress]
        public required string Email { get; set; }
    }
}
