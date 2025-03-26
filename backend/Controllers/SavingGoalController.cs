using backend.Dtos.SavingGoal;
using backend.Mappers;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavingGoalController : ControllerBase
    {
        private readonly ISavingGoalRepo _savingGoalRepo;

        public SavingGoalController(ISavingGoalRepo savingGoalRepo)
        {
            _savingGoalRepo = savingGoalRepo;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserSavingGoal([FromRoute] int userId)
        {
            var savingGoals = await _savingGoalRepo.GetByUserIdAsync(userId);

            var savingGoalsDto = savingGoals.Select(ec => ec.ToSavingGoalDto());

            return Ok(savingGoalsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSavingGoal([FromRoute] int id)
        {
            var savingGoal = await _savingGoalRepo.GetByIdAsync(id);

            if (savingGoal == null)
            {
                return NotFound();
            }

            return Ok(savingGoal);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSavingGoal([FromBody] CreateSavingGoalRequestDto savingGoalDto)
        {
            var savingGoal = await _savingGoalRepo.CreateAsync(savingGoalDto.ToSavingGoalFromCreateDto());

            return CreatedAtAction(nameof(GetSavingGoal), new { id = savingGoal.Id }, savingGoal.ToSavingGoalDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSavingGoal([FromRoute] int id, [FromBody] UpdateSavingGoalRequestDto savingGoalDto)
        {
            var savingGoal = await _savingGoalRepo.UpdateAsync(id, savingGoalDto);

            if (savingGoal == null)
            {
                return NotFound();
            }

            return Ok(savingGoal.ToSavingGoalDto());
        }

        [HttpDelete("{id}")]
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
