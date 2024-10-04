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
        public async Task<IActionResult> CreateBudgetPlan([FromBody] CUBudgetPlanRequestDto budgetPlanDto)
        {
            var budgetPlan = await _budgetPlanRepo.CreateAsync(budgetPlanDto.ToBudgetPlanFromCUDto());

            return Ok(budgetPlan);
        }
    }
}
