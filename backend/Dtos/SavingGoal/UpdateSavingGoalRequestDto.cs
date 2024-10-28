namespace backend.Dtos.SavingGoal
{
    public class UpdateSavingGoalRequestDto
    {
        public string Details { get; set; } = String.Empty;
        public int Goal { get; set; }
        public bool? FixedContribution { get; set; }
        public int? Periodicity { get; set; }
    }
}
