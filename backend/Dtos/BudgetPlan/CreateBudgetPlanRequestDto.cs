namespace backend.Dtos.BudgetPlan
{
    public class CreateBudgetPlanRequestDto
    {
        public int Amount { get; set; }
        public int ExpenseCategoryId { get; set; }
        public int Periodicity { get; set; }
    }
}
