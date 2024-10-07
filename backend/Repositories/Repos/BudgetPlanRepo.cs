using backend.Data;
using backend.Dtos.BudgetPlan;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

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

        public async Task<BudgetPlan?> DeleteAsync(int id)
        {
            var budgetPlan = await _context.BudgetPlans.FirstOrDefaultAsync(bp => bp.Id == id);
            
            if (budgetPlan == null)
            {
                return null;
            }
            
            _context.BudgetPlans.Remove(budgetPlan);
            await _context.SaveChangesAsync();

            return budgetPlan;
        }

        public async Task<BudgetPlan?> UpdateAsync(int id,UpdateBudgetPlanRequestDto budgetPlanDto)
        {
            var budgetPlan = await _context.BudgetPlans.FirstOrDefaultAsync(bp => bp.Id == id);

            if (budgetPlan == null)
            {
                return null;
            }

            budgetPlan.Amount = budgetPlanDto.Amount;
            budgetPlan.Periodicity = budgetPlanDto.Periodicity;

            await _context.SaveChangesAsync();

            return budgetPlan;
        }
    }
}
