using backend.Dtos.Expense;
using backend.Dtos.ExpenseCategory;
using backend.Mappers;
using backend.Repositories.Interfaces;
using backend.Utilities.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseCategoryController : ControllerBase
    {
        private readonly IExpenseCategoryRepo _expenseCategoryRepo;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IClaimsAccess _claimsAccess;

        public ExpenseCategoryController(IExpenseCategoryRepo expenseCategoryRepo, IHttpContextAccessor httpContext, IClaimsAccess claimsAccess)
        {
            _expenseCategoryRepo = expenseCategoryRepo;
            _httpContext = httpContext;
            _claimsAccess = claimsAccess;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserExpenseCategory()
        {
            int userId = _claimsAccess.GetUserIdFromClaims(_httpContext.HttpContext!);
            var expenseCategories = await _expenseCategoryRepo.GetByUserIdAsync(userId);

            var expenseCategoriesDto = expenseCategories.Select(ec => ec.ToExpenseCategoryDto());

            return Ok(expenseCategoriesDto);
        }
        
        [HttpGet("{id:int}")]
        [Authorize]
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
        [Authorize]
        public async Task<IActionResult> CreateExpenseCategory([FromBody] ExpenseCategoryRequestDto expenseCategoryDto)
        {
            
            if (await _expenseCategoryRepo.CheckExists(expenseCategoryDto.Category))
            {
                ModelState.AddModelError("ExpenseCategoryId", "Category already exists");
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            int userId = _claimsAccess.GetUserIdFromClaims(_httpContext.HttpContext!);
            var expenseCategory = await _expenseCategoryRepo.CreateAsync(expenseCategoryDto.ToExpenseCategoryFromCreateDto(userId));

            return CreatedAtAction(nameof(GetExpenseCategory), new { id = expenseCategory.Id }, expenseCategory.ToExpenseCategoryDto());
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateExpenseCategory([FromRoute] int id, [FromBody] ExpenseCategoryRequestDto expenseCategoryDto)
        {
            
            if (await _expenseCategoryRepo.CheckExists(id, expenseCategoryDto.Category))
            {
                ModelState.AddModelError("ExpenseCategoryId", "Category already exists");
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var expenseCategory = await _expenseCategoryRepo.UpdateAsync(id, expenseCategoryDto);

            if (expenseCategory == null)
            {
                return NotFound();
            }

            return Ok(expenseCategory.ToExpenseCategoryDto());
        }

        [HttpDelete("{id:int}")]
        [Authorize]
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
