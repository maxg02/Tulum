using backend.Dtos.ExpenseCategory;
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
        public async Task<IActionResult> GetUserExpenseCategoryFull([FromRoute] int userId)
        {
            var expenseCategories = await _expenseCategoryRepo.GetByUserIdFullAsync(userId);

            var expenseCategoriesFullDto = expenseCategories.Select(ec => ec.ToExpenseCategoryFullDto());

            return Ok(expenseCategoriesFullDto);
        }

        [HttpGet("user/budget/{userId}")]
        public async Task<IActionResult> GetUserExpenseCategoryWithBudget([FromRoute] int userId)
        {
            var expenseCategories = await _expenseCategoryRepo.GetByUserIdFullAsync(userId);

            var expenseCategoriesFullDto = expenseCategories.Select(ec => ec.ToExpenseCategoryWithBudgetDto());

            return Ok(expenseCategoriesFullDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExpenseCategory([FromRoute] int id)
        {
            var expenseCategory = await _expenseCategoryRepo.GetByIdAsync(id);

            if (expenseCategory == null)
            {
                return NotFound();
            }

            return Ok(expenseCategory);
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpenseCategory([FromBody] CreateExpenseCategoryRequestDto expenseCategoryDto)
        {
            var expenseCategory = await _expenseCategoryRepo.CreateAsync(expenseCategoryDto.ToExpenseCategoryFromCreateDto());

            return CreatedAtAction(nameof(GetExpenseCategory), new { id = expenseCategory.Id }, expenseCategory.ToExpenseCategoryFullDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpenseCategory([FromRoute] int id, [FromBody] UpdateExpenseCategoryRequestDto expenseCategoryDto)
        {
            var expenseCategory = await _expenseCategoryRepo.UpdateAsync(id, expenseCategoryDto);

            if (expenseCategory == null)
            {
                return NotFound();
            }

            return Ok(expenseCategory.ToExpenseCategoryFullDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpenseCategory([FromRoute] int id)
        {
            var expenseCategory = await _expenseCategoryRepo.DeleteAsync(id);

            if (expenseCategory == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
