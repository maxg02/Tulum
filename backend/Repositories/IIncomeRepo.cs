using backend.Dtos.Income;
using backend.Models;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

namespace backend.Repositories
{
    public interface IIncomeRepo
    {
        Task<List<Income>> GetByUserIdAsync(int userId);
        Task<Income?> GetByIdAsync(int id);
        Task<Income> CreateAsync(Income incomeModel);
        Task<Income?> UpdateAsync(int id, UpdateIncomeRequestDto incomeDto);
        Task<Income?> DeleteAsync(int id);


    }
}
