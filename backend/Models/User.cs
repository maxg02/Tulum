using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        public int Id { get; set; }
        [Required]        
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpireDate {  get; set; }
        public List<Income> Incomes { get; set; } = new List<Income>();
        public List<SavingGoal> SavingGoals { get; set; } = new List<SavingGoal>();
        public List<ExpenseCategory> Expense_Categories { get; set; } = new List<ExpenseCategory>();
        public List<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
