using backend.Dtos.SavingGoal;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ISavingGoalRepo
    {
        Task<List<SavingGoal>> GetByUserIdAsync(int userId);
        Task<SavingGoal?> GetByIdAsync(int id);
        Task<SavingGoal> CreateAsync(SavingGoal savingGoal);
        Task<SavingGoal?> UpdateAsync(int id, SavingGoalRequestDto savingGoalDto);
        Task<SavingGoal?> DeleteAsync(int id);
        Task<bool> SavingGoalExists(int id);

    }
}
