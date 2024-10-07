using backend.Dtos.BudgetPlan;
using backend.Models;

namespace backend.Mappers
{
    public static class BudgetPlanMappers
    {
        public static BudgetPlan ToBudgetPlanFromCreateDto(this CreateBudgetPlanRequestDto budgetPlanDto)
        {
            return new BudgetPlan
            {
                Amount = budgetPlanDto.Amount,
                ExpenseCategoryId = budgetPlanDto.ExpenseCategoryId,
                Periodicity = budgetPlanDto.Periodicity,
            };
        }
    }
}
