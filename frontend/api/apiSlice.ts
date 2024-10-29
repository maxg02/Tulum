import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type incomeDto = { id: number; amount: number; details: string; date: Date };
export type createIncomeDto = { amount: number; details: string; date: Date };
export type updateIncomeDto = { id: number; data: { amount: number; details: string; date: Date } };

export type fixedIncomeDto = { id: number; amount: number; details: string; periodicity: number };
export type createFixedIncomeDto = { amount: number; details: string; periodicity: number };
export type updateFixedIncomeDto = {
    id: number;
    data: { amount: number; details: string; periodicity: number };
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
    date: Date;
    expenseCategoryId: number;
};
export type updateExpenseDto = {
    id: number;
    data: { amount: number; details: string; date: Date; expenseCategoryId: number };
};

export type fixedExpenseDto = {
    id: number;
    amount: number;
    details: string;
    periodicity: number;
    expenseCategoryId: number;
};
export type createFixedExpenseDto = {
    amount: number;
    details: string;
    periodicity: number;
    expenseCategoryId: number;
};
export type updateFixedExpenseDto = {
    id: number;
    data: { amount: number; details: string; periodicity: number; expenseCategoryId: number };
};

export type expenseCategoryDto = {
    id: number;
    category: string;
    budgetPlan?: { id: number; amount: number; expenseCategoryId: number; periodicity: number };
    expenses?: expenseDto[];
    fixedExpenses?: fixedExpenseDto[];
};

export type savingGoalDto = {
    id: number;
    goal: number;
    details: string;
    periodicity?: number;
    fixedContribution?: boolean;
    goalContributions: [];
};
export type createSavingGoalDto = {
    goal: number;
    details: string;
    periodicity?: number;
    fixedContribution?: boolean;
};
export type updateSavingGoalDto = {
    id: number;
    data: { goal: number; details: string; periodicity?: number; fixedContribution?: boolean };
};

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5085/api/",
    }),
    tagTypes: ["Income", "FixedIncome", "ExpenseCategory", "SavingGoal"],
    endpoints: (builder) => ({
        //Income endpoints
        getIncomesByUserId: builder.query<incomeDto[], number>({
            query: (userId) => `income/user/${userId}`,
            providesTags: ["Income"],
        }),
        createIncome: builder.mutation({
            query: (incomeData: createIncomeDto) => ({
                url: "income",
                method: "POST",
                body: incomeData,
            }),
            invalidatesTags: ["Income"],
        }),
        updateIncome: builder.mutation({
            query: (incomeData: updateIncomeDto) => ({
                url: `income/${incomeData.id}`,
                method: "PUT",
                body: incomeData.data,
            }),
            invalidatesTags: ["Income"],
        }),
        deleteIncome: builder.mutation({
            query: (Id: number) => ({
                url: `income/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Income"],
        }),

        //Fixed Income endpoints
        getFixedIncomesByUserId: builder.query<fixedIncomeDto[], number>({
            query: (userId) => `fixedincome/user/${userId}`,
            providesTags: ["FixedIncome"],
        }),
        createFixedIncome: builder.mutation({
            query: (fixedIncomeData: createFixedIncomeDto) => ({
                url: "fixedincome",
                method: "POST",
                body: fixedIncomeData,
            }),
            invalidatesTags: ["FixedIncome"],
        }),
        updateFixedIncome: builder.mutation({
            query: (fixedIncomeData: updateFixedIncomeDto) => ({
                url: `fixedincome/${fixedIncomeData.id}`,
                method: "PUT",
                body: fixedIncomeData.data,
            }),
            invalidatesTags: ["FixedIncome"],
        }),
        deleteFixedIncome: builder.mutation({
            query: (Id: number) => ({
                url: `fixedincome/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FixedIncome"],
        }),

        //Expense Category endpoints
        getExpenseCategoryFullByUserId: builder.query<expenseCategoryDto[], number>({
            query: (userId) => `expensecategory/user/full/${userId}`,
            providesTags: ["ExpenseCategory"],
        }),
        getExpenseCategoryBudgetByUserId: builder.query<expenseCategoryDto[], number>({
            query: (userId) => `expensecategory/user/budget/${userId}`,
            providesTags: ["ExpenseCategory"],
        }),

        //Budget Plan endpoints
        createBudgetPlan: builder.mutation({
            query: (budgetPlanData: createBudgetPlanDto) => ({
                url: "budgetplan",
                method: "POST",
                body: budgetPlanData,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        updateBudgetPlan: builder.mutation({
            query: (budgetPlanData: updateBudgetPlanDto) => ({
                url: `budgetPlan/${budgetPlanData.id}`,
                method: "PUT",
                body: budgetPlanData.data,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        deleteBudgetPlan: builder.mutation({
            query: (Id: number) => ({
                url: `budgetplan/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),

        //Expense endpoints
        createExpense: builder.mutation({
            query: (expenseData: createExpenseDto) => ({
                url: "expense",
                method: "POST",
                body: expenseData,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        updateExpense: builder.mutation({
            query: (expenseData: updateExpenseDto) => ({
                url: `expense/${expenseData.id}`,
                method: "PUT",
                body: expenseData.data,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        deleteExpense: builder.mutation({
            query: (Id: number) => ({
                url: `expense/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),

        //Fixed Expense endpoints
        createFixedExpense: builder.mutation({
            query: (fixedExpenseData: createFixedExpenseDto) => ({
                url: "fixedexpense",
                method: "POST",
                body: fixedExpenseData,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        updateFixedExpense: builder.mutation({
            query: (fixedExpenseData: updateFixedExpenseDto) => ({
                url: `fixedexpense/${fixedExpenseData.id}`,
                method: "PUT",
                body: fixedExpenseData.data,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        deleteFixedExpense: builder.mutation({
            query: (Id: number) => ({
                url: `fixedexpense/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),

        //Saving Goal endpoints
        getSavingGoalsByUserId: builder.query<savingGoalDto[], number>({
            query: (userId) => `savinggoal/user/${userId}`,
            providesTags: ["SavingGoal"],
        }),
        createSavingGoal: builder.mutation({
            query: (savingGoalData: createSavingGoalDto) => ({
                url: "savinggoal",
                method: "POST",
                body: savingGoalData,
            }),
            invalidatesTags: ["SavingGoal"],
        }),
        updateSavingGoal: builder.mutation({
            query: (savingGoalData: updateSavingGoalDto) => ({
                url: `savinggoal/${savingGoalData.id}`,
                method: "PUT",
                body: savingGoalData.data,
            }),
            invalidatesTags: ["SavingGoal"],
        }),
        deleteSavingGoal: builder.mutation({
            query: (Id: number) => ({
                url: `savinggoal/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SavingGoal"],
        }),
    }),
});

export const {
    useGetIncomesByUserIdQuery,
    useCreateIncomeMutation,
    useUpdateIncomeMutation,
    useDeleteIncomeMutation,

    useGetFixedIncomesByUserIdQuery,
    useCreateFixedIncomeMutation,
    useUpdateFixedIncomeMutation,
    useDeleteFixedIncomeMutation,

    useGetExpenseCategoryFullByUserIdQuery,
    useGetExpenseCategoryBudgetByUserIdQuery,

    useCreateBudgetPlanMutation,
    useDeleteBudgetPlanMutation,
    useUpdateBudgetPlanMutation,

    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,

    useCreateFixedExpenseMutation,
    useUpdateFixedExpenseMutation,
    useDeleteFixedExpenseMutation,

    useGetSavingGoalsByUserIdQuery,
    useCreateSavingGoalMutation,
    useUpdateSavingGoalMutation,
    useDeleteSavingGoalMutation,
} = apiSlice;
