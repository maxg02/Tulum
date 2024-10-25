using backend.Dtos.FixedExpense;
using backend.Models;

namespace backend.Mappers
{
    public static class FixedExpenseMappers
    {
        public static FixedExpense toFixedExpenseFromCreateDto(this CUFixedExpenseRequestDto fixedExpenseDto)
        {
            return new FixedExpense
            {
                Amount = fixedExpenseDto.Amount,
                Periodicity = fixedExpenseDto.Periodicity,
                Details = fixedExpenseDto.Details,
                ExpenseCategoryId = fixedExpenseDto.ExpenseCategoryId,
            };
        }
    }
}
