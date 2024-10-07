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

export type expenseCategoryDto = {
    id: number;
    category: string;
    budgetPlan?: { id: number; amount: number; expenseCategoryId: number; periodicity: number };
};

export type cuBudgetPlanDto = {
    amount: number;
    expenseCategoryId: number;
    periodicity: number;
};

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5085/api/",
    }),
    tagTypes: ["Income", "FixedIncome", "ExpenseCategory"],
    endpoints: (builder) => ({
        //Income endpoints
        getIncomesByUserId: builder.query({
            query: (userId: number) => `income/user/${userId}`,
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
        getFixedIncomesByUserId: builder.query({
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
        getExpenseCategoryFullByUserId: builder.query({
            query: (userId) => `expensecategory/user/full/${userId}`,
            providesTags: ["ExpenseCategory"],
        }),
        getExpenseCategoryBudgetByUserId: builder.query({
            query: (userId) => `expensecategory/user/budget/${userId}`,
            providesTags: ["ExpenseCategory"],
        }),

        //Budget Plan endpoints
        createBudgetPlan: builder.mutation({
            query: (budgetPlanData: cuBudgetPlanDto) => ({
                url: "budgetplan",
                method: "POST",
                body: budgetPlanData,
            }),
            invalidatesTags: ["ExpenseCategory"],
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
} = apiSlice;
