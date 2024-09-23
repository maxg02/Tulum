using backend.Mappers;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseCategoryController : ControllerBase
    {
        private readonly IExpenseCategoryRepo _expenseCategoryRepo;

        public ExpenseCategoryController(IExpenseCategoryRepo expenseCategoryRepo)
        {
            _expenseCategoryRepo = expenseCategoryRepo;
        }

        [HttpGet("user/full/{userId}")]
        public async Task<IActionResult> GetUserExpenseCategoryFull(int userId)
        {
            var expenseCategories = await _expenseCategoryRepo.GetByUserIdFullAsync(userId);

            var expenseCategoriesFullDto = expenseCategories.Select(ec => ec.ToExpenseCategoryFullDto());

            return Ok(expenseCategoriesFullDto);
        }

        [HttpGet("user/budget/{userId}")]
        public async Task<IActionResult> GetUserExpenseCategoryWithBudget(int userId)
        {
            var expenseCategories = await _expenseCategoryRepo.GetByUserIdFullAsync(userId);

            var expenseCategoriesFullDto = expenseCategories.Select(ec => ec.ToExpenseCategoryWithBudgetDto());

            return Ok(expenseCategoriesFullDto);
        }
    }
}
