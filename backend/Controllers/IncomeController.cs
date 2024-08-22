using backend.Data;
using backend.Dtos.Income;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public IncomeController(ApplicationDBContext dBContext) => _context = dBContext;

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserIncome([FromRoute] int userId)
        {
            var incomes = await _context.Incomes
                .Where(i => i.UserId == userId)
                .ToListAsync();

            var incomeDto = incomes.Select(s => s.ToIncomeDto());

            return Ok(incomeDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetIncome([FromRoute] int id)
        {
            var income = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id);

            if (income == null) {
                return NotFound();
            }

            return Ok(income.ToIncomeDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeRequestDto incomeDto)
        {
            var incomeModel = incomeDto.ToIncomeFromCreateDto();
            await _context.Incomes.AddAsync(incomeModel);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetIncome), new { id = incomeModel.Id }, incomeModel.ToIncomeDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIncome([FromRoute] int id, [FromBody] UpdateIncomeRequestDto incomeDto)
        {
            var incomeModel = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id);

            if (incomeModel == null)
            {
                return NotFound();
            }

            incomeModel.Amount = incomeDto.Amount;
            incomeModel.Details = incomeDto.Details;
            incomeModel.Date = incomeDto.Date;
            await _context.SaveChangesAsync();

            return Ok(incomeModel.ToIncomeDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome([FromRoute] int id)
        {
            var incomeModel = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id);

            if (incomeModel == null )
            {
                return NotFound();
            }

            _context.Incomes.Remove(incomeModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
