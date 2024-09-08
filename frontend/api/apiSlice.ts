import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type createIncomeDto = { amount: number; details: string; date: Date };

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5085/api/",
    }),
    endpoints: (builder) => ({
        getIncomesByUserId: builder.query({
            query: (userId: number) => `income/user/${userId}`,
}),
        getIncomesById: builder.query({
            query: (Id: number) => `income/${Id}`,
        }),
        createIncome: builder.mutation({
            query: (incomeData: createIncomeDto) => ({
                url: "income",
                method: "POST",
                body: incomeData,
            }),
        }),
deleteIncome: builder.mutation({
            query: (Id: number) => ({
                url: `income/${Id}`,
                method: "DELETE",
            }),
        }),
        getFixedIncomesByUserId: builder.query({
            query: (userId) => `fixedincome/user/${userId}`,
        }),
    }),
});

export const {
useGetIncomesByUserIdQuery,
    useGetIncomesByIdQuery,
    useCreateIncomeMutation,
    useDeleteIncomeMutation,
useGetFixedIncomesByUserIdQuery,
} = apiSlice;
