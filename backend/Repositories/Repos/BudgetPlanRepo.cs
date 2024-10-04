using backend.Data;
using backend.Dtos.BudgetPlan;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Repos
{
    public class BudgetPlanRepo : IBudgetPlanRepo
    {
        private readonly ApplicationDBContext _context;

        public BudgetPlanRepo(ApplicationDBContext context) => _context = context;
        
        public async Task<BudgetPlan> CreateAsync(BudgetPlan budgetPlan)
        {
            await _context.BudgetPlans.AddAsync(budgetPlan);
            await _context.SaveChangesAsync();

            return budgetPlan;
        }

        public Task<BudgetPlan?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<BudgetPlan?> UpdateAsync(int id, CUBudgetPlanRequestDto budgetPlanDto)
        {
            throw new NotImplementedException();
        }
    }
}
