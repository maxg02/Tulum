using backend.Repositories.Interfaces;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using backend.Dtos.FixedIncome;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FixedIncomeController : ControllerBase
    {
        private readonly IFixedIncomeRepo _fixedIncomeRepo;

        public FixedIncomeController(IFixedIncomeRepo fixedIncomeRepo)
        {
            _fixedIncomeRepo = fixedIncomeRepo;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserFixedIncome([FromRoute] int userId)
        {
            var fixedIncome = await _fixedIncomeRepo.GetByUserIdAsync(userId);

            var fixedIncomeDto = fixedIncome.Select(fi => fi.ToFixedIncomeDto());

            return Ok(fixedIncomeDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFixedIncome([FromRoute] int id)
        {
            var fixedIncome = await _fixedIncomeRepo.GetByIdAsync(id);

            if (fixedIncome == null)
            {
                return NotFound();
            }

            return Ok(fixedIncome.ToFixedIncomeDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateFixedIncome([FromBody] CreateFixedIncomeRequestDto fixedIncomeDto)
        {
            var fixedIncome = await _fixedIncomeRepo.CreateAsync(fixedIncomeDto.ToFixedIncomeFromCreateDto());

            return CreatedAtAction(nameof(GetFixedIncome), new { id = fixedIncome.Id }, fixedIncome.ToFixedIncomeDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFixedIncome([FromRoute] int id, [FromBody] UpdateFixedIncomeRequestDto fixedIncomeDto)
        {
            var fixedIncome = await _fixedIncomeRepo.UpdateAsync(id, fixedIncomeDto);

            if (fixedIncome == null)
            {
                return NotFound();
            }

            return Ok(fixedIncome.ToFixedIncomeDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CreateFixedIncome([FromRoute] int id)
        {
            var fixedIncome = await _fixedIncomeRepo.DeleteAsync(id);

            if (fixedIncome == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
