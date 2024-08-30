import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type createIncomeDto = { amount: number; details: string; date: Date };

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5085/api/",
    }),
    endpoints: (builder) => ({
        getIncomesByUserId: builder.query({
            query: (userId) => `income/user/${userId}`,
        }),
        createIncome: builder.mutation({
            query: (incomeData: createIncomeDto) => ({
                url: "income",
                method: "POST",
                body: incomeData,
            }),
        }),
        getFixedIncomesByUserId: builder.query({
            query: (userId) => `fixedincome/user/${userId}`,
        }),
    }),
});

export const { useGetIncomesByUserIdQuery, useGetFixedIncomesByUserIdQuery, useCreateIncomeMutation } =
    apiSlice;
