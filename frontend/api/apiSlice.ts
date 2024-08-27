import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5085/api/",
    }),
    endpoints: (builder) => ({
        getIncomesByUserId: builder.query({
            query: (userId) => `income/user/${userId}`,
        }),
        getFixedIncomesByUserId: builder.query({
            query: (userId) => `fixedincome/user/${userId}`,
        }),
    }),
});

export const { useGetIncomesByUserIdQuery, useGetFixedIncomesByUserIdQuery } = apiSlice;
