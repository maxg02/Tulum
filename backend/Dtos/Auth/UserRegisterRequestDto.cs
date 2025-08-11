using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Auth
{
    public class UserRegisterRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "The Password field is required")]
        [MinLength(8, ErrorMessage = "Password must have 8 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$", ErrorMessage = "The password must include a lowercase letter, an uppercase letter and a digit")]
        public string Password { get; set; } = string.Empty;

    }
}
