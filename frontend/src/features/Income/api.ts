import { apiSlice } from "@/api/apiSlice";

import { incomeDto, updateIncomeDto, createIncomeDto } from "./types";

export const incomeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Income endpoints
        getUserIncomes: builder.query<incomeDto[], void>({
            query: () => "income",
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
    }),
});

export const {
    useGetUserIncomesQuery,
    useCreateIncomeMutation,
    useUpdateIncomeMutation,
    useDeleteIncomeMutation,
} = incomeApi;
