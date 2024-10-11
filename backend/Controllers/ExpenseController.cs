using backend.Data;
using backend.Dtos.Expense;
using backend.Mappers;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseRepo _expenseRepo;

        public ExpenseController(IExpenseRepo expenseRepo) => _expenseRepo = expenseRepo;

        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] CUExpenseRequestDto expenseDto)
        {
            var expense = await _expenseRepo.CreateAsync(expenseDto.toExpenseFromCreateDto());

            return Ok(expense);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense([FromRoute] int id, [FromBody] CUExpenseRequestDto expenseDto)
        {
            var expense = await _expenseRepo.UpdateAsync(id, expenseDto);

            if (expense == null)
            {
                return NotFound();
            }

            return Ok(expense);
        }

        [HttpDelete("{id}")]
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
