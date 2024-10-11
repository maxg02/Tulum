using backend.Dtos.Expense;
using backend.Models;

namespace backend.Mappers
{
    public static class ExpenseMappers
    {
        public static Expense toExpenseFromCreateDto(this CreateExpenseRequestDto expenseDto)
        {
            return new Expense
            {
                Amount = expenseDto.Amount,
                Date = expenseDto.Date,
                Details = expenseDto.Details,
                ExpenseCategoryId = expenseDto.ExpenseCategoryId,
            };
        }
    }
}
