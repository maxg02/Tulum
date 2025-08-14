import { apiSlice } from "@/api/apiSlice";
import {
    expenseCategoryDto,
    createExpenseCategoryDto,
    updateExpenseCategoryDto,
    createBudgetPlanDto,
    updateBudgetPlanDto,
    expenseDto,
    createExpenseDto,
    updateExpenseDto,
    fixedExpenseDto,
    createFixedExpenseDto,
    updateFixedExpenseDto,
} from "./types";

export const expensesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Expense Category endpoints
        getUserExpenseCategories: builder.query<expenseCategoryDto[], void>({
            query: () => `expensecategory/`,
            providesTags: ["ExpenseCategory"],
        }),
        createExpenseCategory: builder.mutation({
            query: (expenseCategoryData: createExpenseCategoryDto) => ({
                url: "expensecategory/",
                method: "POST",
                body: expenseCategoryData,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        updateExpenseCategory: builder.mutation({
            query: (expenseCategoryData: updateExpenseCategoryDto) => ({
                url: `expensecategory/${expenseCategoryData.id}`,
                method: "PUT",
                body: expenseCategoryData.data,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        deleteExpenseCategory: builder.mutation({
            query: (Id: number) => ({
                url: `expensecategory/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ExpenseCategory", "Expense"],
        }),

        //Budget Plan endpoints
        createBudgetPlan: builder.mutation({
            query: (budgetPlanData: createBudgetPlanDto) => ({
                url: "budgetplan/",
                method: "POST",
                body: budgetPlanData,
            }),
            invalidatesTags: ["ExpenseCategory"],
        }),
        updateBudgetPlan: builder.mutation({
            query: (budgetPlanData: updateBudgetPlanDto) => ({
                url: `budgetplan/${budgetPlanData.id}`,
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
        getUserExpenses: builder.query<expenseDto[], void>({
            query: () => `expense/`,
            providesTags: ["Expense"],
        }),
        createExpense: builder.mutation({
            query: (expenseData: createExpenseDto) => ({
                url: "expense/",
                method: "POST",
                body: expenseData,
            }),
            invalidatesTags: ["Expense"],
        }),
        updateExpense: builder.mutation({
            query: (expenseData: updateExpenseDto) => ({
                url: `expense/${expenseData.id}`,
                method: "PUT",
                body: expenseData.data,
            }),
            invalidatesTags: ["Expense"],
        }),
        deleteExpense: builder.mutation({
            query: (Id: number) => ({
                url: `expense/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Expense"],
        }),

        //Fixed Expense endpoints
        getUserFixedExpenses: builder.query<fixedExpenseDto[], void>({
            query: () => `fixedexpenses/`,
            providesTags: ["FixedExpense"],
        }),
        createFixedExpense: builder.mutation({
            query: (fixedExpenseData: createFixedExpenseDto) => ({
                url: "fixedexpenses/",
                method: "POST",
                body: fixedExpenseData,
            }),
            invalidatesTags: ["FixedExpense"],
        }),
        updateFixedExpense: builder.mutation({
            query: (fixedExpenseData: updateFixedExpenseDto) => ({
                url: `fixedexpenses/${fixedExpenseData.id}`,
                method: "PUT",
                body: fixedExpenseData.data,
            }),
            invalidatesTags: ["FixedExpense"],
        }),
        deleteFixedExpense: builder.mutation({
            query: (Id: number) => ({
                url: `fixedexpenses/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FixedExpense"],
        }),
    }),
});

export const {
    useGetUserExpenseCategoriesQuery,
    useCreateExpenseCategoryMutation,
    useDeleteExpenseCategoryMutation,
    useUpdateExpenseCategoryMutation,

    useCreateBudgetPlanMutation,
    useDeleteBudgetPlanMutation,
    useUpdateBudgetPlanMutation,

    useGetUserExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,

    useGetUserFixedExpensesQuery,
    useCreateFixedExpenseMutation,
    useUpdateFixedExpenseMutation,
    useDeleteFixedExpenseMutation,
} = expensesApi;
