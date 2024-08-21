import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "localhost:5058/api/",
    }),
    endpoints: (builder) => ({
        getUserIncome: builder.query({
            query: (userId) => `user/${userId}`,
        }),
    }),
});

export const { useGetUserIncomeQuery } = apiSlice;
