using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Auth
{
    public class UserSendPasswordResetDto
    {
        [EmailAddress]
        public required string Email { get; set; }
    }
}
