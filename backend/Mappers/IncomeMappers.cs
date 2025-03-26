using backend.Dtos.Income;
using backend.Models;

namespace backend.Mappers
{
    public static class IncomeMappers
    {
        public static IncomeDto ToIncomeDto(this Income incomeModel)
        {
            return new IncomeDto
            {
                Id = incomeModel.Id,
                Amount = incomeModel.Amount,
                Details = incomeModel.Details,
                Date = incomeModel.Date,
            };
        }
        public static Income ToIncomeFromCreateDto(this CreateIncomeRequestDto incomeDto)
        {
            return new Income
            {
                Amount = incomeDto.Amount,
                Details = incomeDto.Details,
                Date = incomeDto.Date,
                UserId = 1
            };
        }
    }
}
