namespace backend.Models
{
    public class GoalContribution
    {
        public int Id { get; set; }
        public int Deposit {  get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public int SavingGoalId { get; set; }
        public SavingGoal SavingGoal { get; set; } = null!; 

    }
}
