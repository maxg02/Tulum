using backend.Data;
using backend.Dtos.Income;
using backend.Mappers;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeController : ControllerBase
    {
        private readonly IIncomeRepo _incomeRepo;

        public IncomeController(IIncomeRepo incomeRepo) 
        {
            _incomeRepo = incomeRepo;
        } 

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserIncome([FromRoute] int userId)
        {
            var incomes = await _incomeRepo.GetByUserIdAsync(userId);

            var incomeDto = incomes.Select(s => s.ToIncomeDto());

            return Ok(incomeDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetIncome([FromRoute] int id)
        {
            var income = await _incomeRepo.GetByIdAsync(id);

            if (income == null) {
                return NotFound();
            }

            return Ok(income.ToIncomeDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeRequestDto incomeDto)
        {
            var incomeModel = await _incomeRepo.CreateAsync(incomeDto.ToIncomeFromCreateDto());
            
            return CreatedAtAction(nameof(GetIncome), new { id = incomeModel.Id }, incomeModel.ToIncomeDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIncome([FromRoute] int id, [FromBody] UpdateIncomeRequestDto incomeDto)
        {
            var incomeModel = await _incomeRepo.UpdateAsync(id, incomeDto);

            if (incomeModel == null)
            {
                return NotFound();
            }

            return Ok(incomeModel.ToIncomeDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome([FromRoute] int id)
        {
            var incomeModel = await _incomeRepo.DeleteAsync(id);

            if (incomeModel == null )
            {
                return NotFound();
            }

            return NoContent();
        }


    }
}
