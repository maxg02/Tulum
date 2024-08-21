import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5085/api/",
    }),
    endpoints: (builder) => ({
        getUserIncome: builder.query({
            query: (userId) => `income/user/${userId}`,
        }),
    }),
});

export const { useGetUserIncomeQuery } = apiSlice;
