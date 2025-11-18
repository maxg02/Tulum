using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Auth
{
    public class UserResendEmailVerification
    {
        [EmailAddress]
        public required string Email { get; set; }
    }
}
