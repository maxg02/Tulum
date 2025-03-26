using backend.Dtos.GoalContribution;
using backend.Mappers;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalContributionController : ControllerBase
    {
        private readonly IGoalContributionRepo _goalContributionRepo;

        public GoalContributionController(IGoalContributionRepo goalContributionRepo) => _goalContributionRepo = goalContributionRepo;

        [HttpPost]
        public async Task<IActionResult> CreateGoalContribution([FromBody] CUGoalContributionRequestDto goalContributionDto)
        {
            var goalContribution = await _goalContributionRepo.CreateAsync(goalContributionDto.ToGoalContributionFromCreateDto());

            return Ok(goalContribution);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoalContribution([FromRoute] int id, [FromBody] CUGoalContributionRequestDto goalContributionDto)
        {
            var goalContribution = await _goalContributionRepo.UpdateAsync(id, goalContributionDto);

            if (goalContribution == null)
            {
                return NotFound();
            }

            return Ok(goalContribution);
        }

        [HttpDelete("{id}")]
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
