using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Auth
{
    public class UserRestorePasswordDto
    {
        public required string VerificationToken { get; set; }
        
        [Required(ErrorMessage = "The Password field is required.")]
        [MinLength(8, ErrorMessage = "Password must have 8 characters.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$", ErrorMessage = "The password must include a lowercase letter, an uppercase letter and a digit.")]
        public required string NewPassword { get; set; }
    }
}
