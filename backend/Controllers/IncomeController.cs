using backend.Data;
using backend.Dtos.Income;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public IncomeController(ApplicationDBContext dBContext) => _context = dBContext;

        [HttpGet("user/{userId}")]
        public IActionResult GetUserIncome([FromRoute] int userId)
        {
            var incomes = _context.Incomes
                .Where(i => i.UserId==userId)
                .ToList()
                .Select(s => s.ToIncomeDto());
                
            return Ok(incomes);
        }

        [HttpGet("{id}")]
        public IActionResult GetIncome([FromRoute] int id)
        {
            var income = _context.Incomes.FirstOrDefault(i => i.Id==id);

            if (income == null) {
                return NotFound();
            }

            return Ok(income.ToIncomeDto());
        }

        [HttpPost]
        public IActionResult CreateIncome([FromBody] CreateIncomeRequestDto incomeDto)
        {
            var incomeModel = incomeDto.ToIncomeFromCreateDto();
            _context.Incomes.Add(incomeModel);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetIncome), new { id = incomeModel.Id }, incomeModel.ToIncomeDto());
        }

        [HttpPut("{id}")]
        public IActionResult UpdateIncome([FromRoute] int id, [FromBody] UpdateIncomeRequestDto incomeDto)
        {
            var incomeModel = _context.Incomes.FirstOrDefault(i => i.Id == id);

            if (incomeModel == null)
            {
                return NotFound();
            }

            incomeModel.Amount = incomeDto.Amount;
            incomeModel.Details = incomeDto.Details;
            incomeModel.Date = incomeDto.Date;
            _context.SaveChanges();

            return Ok(incomeModel.ToIncomeDto());
        }

    }
}
