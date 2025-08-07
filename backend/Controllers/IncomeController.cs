using backend.Dtos.Income;
using backend.Mappers;
using backend.Repositories.Interfaces;
using backend.Utilities.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeController : ControllerBase
    {
        private readonly IIncomeRepo _incomeRepo;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IClaimsAccess _claimsAccess;

        public IncomeController(IIncomeRepo incomeRepo, IHttpContextAccessor httpContext, IClaimsAccess claimsAccess) 
        {
            _incomeRepo = incomeRepo;
            _httpContext = httpContext;
            _claimsAccess = claimsAccess;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserIncome()
        {
            int userId = _claimsAccess.GetUserIdFromClaims(_httpContext.HttpContext!);
            var incomes = await _incomeRepo.GetByUserIdAsync(userId);

            var incomeDto = incomes.Select(s => s.ToIncomeDto());

            return Ok(incomeDto);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetIncome([FromRoute] int id)
        {
            var income = await _incomeRepo.GetByIdAsync(id);

            if (income == null) {
                return NotFound();
            }

            return Ok(income.ToIncomeDto());
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateIncome([FromBody] IncomeRequestDto incomeDto)
        {
            int userId = _claimsAccess.GetUserIdFromClaims(_httpContext.HttpContext!);
            var incomeModel = await _incomeRepo.CreateAsync(incomeDto.ToIncomeFromCreateDto(userId));
            
            return CreatedAtAction(nameof(GetIncome), new { id = incomeModel.Id }, incomeModel.ToIncomeDto());
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateIncome([FromRoute] int id, [FromBody] IncomeRequestDto incomeDto)
        {
            var incomeModel = await _incomeRepo.UpdateAsync(id, incomeDto);

            if (incomeModel == null)
            {
                return NotFound();
            }

            return Ok(incomeModel.ToIncomeDto());
        }

        [Authorize]
        [HttpDelete("{id:int}")]
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
