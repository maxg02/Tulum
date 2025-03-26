using backend.Dtos.BudgetPlan;
using backend.Mappers;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetPlanController : ControllerBase
    {
        private readonly IBudgetPlanRepo _budgetPlanRepo;

        public BudgetPlanController(IBudgetPlanRepo budgetPlanRepo)
        {
            _budgetPlanRepo = budgetPlanRepo;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBudgetPlan([FromBody] CreateBudgetPlanRequestDto budgetPlanDto)
        {
            var budgetPlan = await _budgetPlanRepo.CreateAsync(budgetPlanDto.ToBudgetPlanFromCreateDto());

            return Ok(budgetPlan);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBudgetPlan([FromRoute] int id, [FromBody] UpdateBudgetPlanRequestDto budgetPlanDto)
        {
            var budgetPlan = await _budgetPlanRepo.UpdateAsync(id, budgetPlanDto);

            if (budgetPlan == null)
            {
                return NotFound();
            }

            return Ok(budgetPlan);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudgetPlan([FromRoute] int id)
        {
            var budgetPlan = await _budgetPlanRepo.DeleteAsync(id);

            if (budgetPlan == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
