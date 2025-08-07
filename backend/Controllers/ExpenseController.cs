using backend.Dtos.Expense;
using backend.Mappers;
using backend.Repositories.Interfaces;
using backend.Utilities.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseRepo _expenseRepo;
        private readonly IExpenseCategoryRepo _expenseCategoryRepo;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IClaimsAccess _claimsAccess;

        public ExpenseController(IExpenseRepo expenseRepo, IHttpContextAccessor httpContext, IClaimsAccess claimsAccess, IExpenseCategoryRepo expenseCategoryRepo)
        {
            _expenseRepo = expenseRepo;
            _expenseCategoryRepo = expenseCategoryRepo;
            _httpContext = httpContext;
            _claimsAccess = claimsAccess;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserExpense()
        {
            int userId = _claimsAccess.GetUserIdFromClaims(_httpContext.HttpContext!);
            var expenses = await _expenseRepo.GetByUserIdAsync(userId);

            var expenseDto = expenses.Select(s => s.ToExpenseDto());

            return Ok(expenseDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] ExpenseRequestDto expenseDto)
        {            
            if (expenseDto.ExpenseCategoryId != null && !await _expenseCategoryRepo.CategoryExists(expenseDto.ExpenseCategoryId!.Value))
            {
                return BadRequest("Category does not exist");
            }

            int userId = _claimsAccess.GetUserIdFromClaims(_httpContext.HttpContext!);
            var expense = await _expenseRepo.CreateAsync(expenseDto.ToExpenseFromCreateDto(userId));

            return Ok(expense.ToExpenseDto());
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateExpense([FromRoute] int id, [FromBody] ExpenseRequestDto expenseDto)
        {
            var expense = await _expenseRepo.UpdateAsync(id, expenseDto);

            if (expense == null)
            {
                return NotFound();
            }

            return Ok(expense.ToExpenseDto());
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteExpense([FromRoute] int id)
        {
            var expense = await _expenseRepo.DeleteAsync(id);

            if (expense == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
