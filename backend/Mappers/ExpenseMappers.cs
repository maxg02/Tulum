using backend.Dtos.Expense;
using backend.Models;

namespace backend.Mappers
{
    public static class ExpenseMappers
    {
        public static Expense ToExpenseFromCreateDto(this ExpenseRequestDto expenseDto, int userId)
        {
            return new Expense
            {
                UserId = userId,
                Amount = expenseDto.Amount,
                Date = expenseDto.Date,
                Details = expenseDto.Details,
                ExpenseCategoryId = expenseDto.ExpenseCategoryId,
            };
        }
        public static ExpenseDto ToExpenseDto(this Expense expense)
        {
            return new ExpenseDto
            {
                Id = expense.Id,
                Amount = expense.Amount,
                Date = expense.Date,
                Details = expense.Details,
                ExpenseCategoryId = expense.ExpenseCategoryId ?? -1,
            };
        }
    }
}
