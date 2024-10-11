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
        public async Task<IActionResult> CreateExpense(CUExpenseRequestDto expenseDto)
        {
            var expense = await _expenseRepo.CreateAsync(expenseDto.toExpenseFromCreateDto());

            return Ok(expense);
        }
    }
}
