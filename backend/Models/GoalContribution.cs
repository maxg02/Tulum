namespace backend.Models
{
    public class GoalContribution
    {
        public int Id { get; set; }
        public double Amount {  get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public int SavingGoalId { get; set; }

    }
}
