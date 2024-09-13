namespace backend.Models
{
    public class SavingGoal
    {
        public int Id { get; set; }
        public string Details { get; set; } = String.Empty;
        public int Goal { get; set; }
        public int? FixedContribution { get; set; }
        public int? Periodicity { get; set; }
        public List<GoalContribution> GoalContributions { get; set; } = new List<GoalContribution>();
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
