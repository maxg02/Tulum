using backend.Dtos.ExpenseCategory;
using backend.Models;

namespace backend.Mappers
{
    public static class ExpenseCategoryMappers
    {
        public static ExpenseCategoryFullDto ToExpenseCategoryFullDto(this ExpenseCategory ExpenseCategoryModel)
        {
            return new ExpenseCategoryFullDto
            {
                Id = ExpenseCategoryModel.Id,
                Category = ExpenseCategoryModel.Category,
                Expenses = ExpenseCategoryModel.Expenses,
                FixedExpenses = ExpenseCategoryModel.FixedExpenses,
                BudgetPlan = ExpenseCategoryModel.BudgetPlan,
            };
        }
        public static ExpenseCategoryWithBudgetDto ToExpenseCategoryWithBudgetDto(this ExpenseCategory ExpenseCategoryModel)
        {
            return new ExpenseCategoryWithBudgetDto
            {
                Id = ExpenseCategoryModel.Id,
                Category = ExpenseCategoryModel.Category,
                BudgetPlan = ExpenseCategoryModel.BudgetPlan,
            };
        }
        public static ExpenseCategory ToExpenseCategoryFromCreateDto(this CreateExpenseCategoryRequestDto ExpenseCategoryDto)
        {
            return new ExpenseCategory
            {
                Category = ExpenseCategoryDto.Category,
                UserId = 1
            };
        }
    }
}
