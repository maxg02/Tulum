using backend.Dtos.BudgetPlan;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IBudgetPlanRepo
    {
        Task<BudgetPlan> CreateAsync(BudgetPlan budgetPlan);
        Task<BudgetPlan?> UpdateAsync(int id, CUBudgetPlanRequestDto budgetPlanDto);
        Task<BudgetPlan?> DeleteAsync(int id);
    }
}
