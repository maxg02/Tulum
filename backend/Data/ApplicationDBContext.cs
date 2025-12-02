using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Expense> Expenses {get; set;}
        public DbSet<ExpenseCategory> ExpenseCategories { get; set; }
        public DbSet<SavingGoal> SavingGoals { get; set; }
        public DbSet<GoalContribution> GoalContributions { get; set; }
        public DbSet<BudgetPlan> BudgetPlans { get; set; }
        public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    }
}
