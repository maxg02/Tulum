export type expenseDto = {
    id: number;
    amount: number;
    details: string;
    date: Date;
    expenseCategoryId: number;
};
export type createExpenseDto = {
    amount: number;
    details: string;
    date: Date | string;
    expenseCategoryId: number | null;
};
export type updateExpenseDto = {
    id: number;
    data: { amount: number; details: string; date: Date | string; expenseCategoryId: number | null };
};

export type createBudgetPlanDto = {
    amount: number;
    expenseCategoryId: number;
    periodicity: number;
};
export type updateBudgetPlanDto = {
    id: number;
    data: { amount: number; periodicity: number };
};

export type budgetPlanDto = {
    id: number;
    amount: number;
    expenseCategoryId: number;
    periodicity: number;
};

export type expenseCategoryDto = {
    id: number;
    category: string;
    budgetPlan: budgetPlanDto | null;
};
export type createExpenseCategoryDto = {
    category: string;
};
export type updateExpenseCategoryDto = {
    id: number;
    data: { category: string };
};
