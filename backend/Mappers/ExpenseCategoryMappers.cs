using backend.Dtos.ExpenseCategory;
using backend.Models;

namespace backend.Mappers
{
    public static class ExpenseCategoryMappers
    {
        public static ExpenseCategoryDto ToExpenseCategoryDto(this ExpenseCategory ExpenseCategoryModel)
        {
            return new ExpenseCategoryDto
            {
                Id = ExpenseCategoryModel.Id,
                Category = ExpenseCategoryModel.Category,
                BudgetPlan = ExpenseCategoryModel.BudgetPlan
            };
        }        
        public static ExpenseCategory ToExpenseCategoryFromCreateDto(this ExpenseCategoryRequestDto ExpenseCategoryDto, int userId)
        {
            return new ExpenseCategory
            {
                Category = ExpenseCategoryDto.Category,
                UserId = userId
            };
        }
    }
}
