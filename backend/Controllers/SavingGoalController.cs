using backend.Dtos.SavingGoal;
using backend.Mappers;
using backend.Repositories.Interfaces;
using backend.Utilities.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavingGoalController : ControllerBase
    {
        private readonly ISavingGoalRepo _savingGoalRepo;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IClaimsAccess _claimsAccess;

        public SavingGoalController(ISavingGoalRepo savingGoalRepo, IHttpContextAccessor httpContext, IClaimsAccess claimsAccess)
        {
            _savingGoalRepo = savingGoalRepo;
            _httpContext = httpContext;
            _claimsAccess = claimsAccess;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserSavingGoal()
        {
            int userId = _claimsAccess.GetUserIdFromClaims(_httpContext.HttpContext!);
            var savingGoals = await _savingGoalRepo.GetByUserIdAsync(userId);

            var savingGoalsDto = savingGoals.Select(ec => ec.ToSavingGoalDto());

            return Ok(savingGoalsDto);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateSavingGoal([FromBody] SavingGoalRequestDto savingGoalDto)
        {
            int userId = _claimsAccess.GetUserIdFromClaims(_httpContext.HttpContext!);
            var savingGoal = await _savingGoalRepo.CreateAsync(savingGoalDto.ToSavingGoalFromCreateDto(userId));

            return Created();
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateSavingGoal([FromRoute] int id, [FromBody] SavingGoalRequestDto savingGoalDto)
        {
            var savingGoal = await _savingGoalRepo.UpdateAsync(id, savingGoalDto);

            if (savingGoal == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteSavingGoal([FromRoute] int id)
        {
            var savingGoal = await _savingGoalRepo.DeleteAsync(id);

            if (savingGoal == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
