using backend.Dtos.FixedExpense;
using backend.Mappers;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FixedExpenseController : ControllerBase
    {
        private readonly IFixedExpenseRepo _fixedExpenseRepo;

        public FixedExpenseController(IFixedExpenseRepo fixedExpenseRepo) => _fixedExpenseRepo = fixedExpenseRepo;

        [HttpPost]
        public async Task<IActionResult> CreateFixedExpense([FromBody] CUFixedExpenseRequestDto fixedExpenseDto)
        {
            var fixedExpense = await _fixedExpenseRepo.CreateAsync(fixedExpenseDto.ToFixedExpenseFromCreateDto());

            return Ok(fixedExpense);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFixedExpense([FromRoute] int id, [FromBody] CUFixedExpenseRequestDto fixedExpenseDto)
        {
            var fixedExpense = await _fixedExpenseRepo.UpdateAsync(id, fixedExpenseDto);

            if (fixedExpense == null)
            {
                return NotFound();
            }

            return Ok(fixedExpense);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFixedExpense([FromRoute] int id)
        {
            var fixedExpense = await _fixedExpenseRepo.DeleteAsync(id);

            if (fixedExpense == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
