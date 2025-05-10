namespace backend.Dtos.GoalContribution
{
    public class GoalContributionRequestDto
    {
        public int Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public int SavingGoalId { get; set; }
    }
}
