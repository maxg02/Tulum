using backend.Dtos.FixedIncome;
using backend.Models;
using backend.Enums;

namespace backend.Mappers
{
    public static class FixedIncomeMappers
    {
        public static FixedIncomeDto ToFixedIncomeDto(this FixedIncome FixedIncomeModel)
        {            
            return new FixedIncomeDto
            {
                Id = FixedIncomeModel.Id,
                Amount = FixedIncomeModel.Amount,
                Details = FixedIncomeModel.Details,
                Periodicity = FixedIncomeModel.Periodicity
            };
        }

        public static FixedIncome ToFixedIncomeFromCreateDto(this CreateFixedIncomeRequestDto FixedIncomeDto)
        {
            return new FixedIncome
            {
                Amount = FixedIncomeDto.Amount,
                Details = FixedIncomeDto.Details,
                Periodicity = FixedIncomeDto.Periodicity,
                UserId = 1
            };
        }
    }
}
