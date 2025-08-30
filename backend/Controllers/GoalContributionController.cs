using backend.Dtos.Expense;
using backend.Dtos.GoalContribution;
using backend.Mappers;
using backend.Repositories.Interfaces;
using backend.Repositories.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalContributionController : ControllerBase
    {
        private readonly IGoalContributionRepo _goalContributionRepo;
        private readonly ISavingGoalRepo _savingGoalRepo;

        public GoalContributionController(IGoalContributionRepo goalContributionRepo, ISavingGoalRepo savingGoalRepo)
        {
            _goalContributionRepo = goalContributionRepo;
            _savingGoalRepo = savingGoalRepo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateGoalContribution([FromBody] GoalContributionRequestDto goalContributionDto)
        {
            if (!await _savingGoalRepo.CheckExists(goalContributionDto.SavingGoalId))
            {
                ModelState.AddModelError("SavingGoalId","Saving goal does not exist");
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var goalContribution = await _goalContributionRepo.CreateAsync(goalContributionDto.ToGoalContributionFromCreateDto());

            return Created();
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateGoalContribution([FromRoute] int id, [FromBody] GoalContributionRequestDto goalContributionDto)
        {
            if (!await _savingGoalRepo.CheckExists(goalContributionDto.SavingGoalId))
            {
                ModelState.AddModelError("SavingGoalId", "Saving goal does not exist");
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var goalContribution = await _goalContributionRepo.UpdateAsync(id, goalContributionDto);

            if (goalContribution == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteGoalContribution([FromRoute] int id)
        {
            var goalContribution = await _goalContributionRepo.DeleteAsync(id);

            if (goalContribution == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
