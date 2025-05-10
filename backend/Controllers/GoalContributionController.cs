using backend.Dtos.GoalContribution;
using backend.Mappers;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize]
        public async Task<IActionResult> CreateGoalContribution([FromBody] GoalContributionRequestDto goalContributionDto)
        {
            var goalContribution = await _goalContributionRepo.CreateAsync(goalContributionDto.ToGoalContributionFromCreateDto());

            return Created();
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateGoalContribution([FromRoute] int id, [FromBody] GoalContributionRequestDto goalContributionDto)
        {
            var goalContribution = await _goalContributionRepo.UpdateAsync(id, goalContributionDto);

            if (goalContribution == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
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
