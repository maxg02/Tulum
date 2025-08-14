import { createApi } from "@reduxjs/toolkit/query/react";

import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../store/store";
import { logOut, refreshUserToken } from "../features/Auth/reducers";
import { tokenDto } from "@/features/Auth/types";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://127.0.0.1:5085/api",
    prepareHeaders: (headers, { getState }) => {
        headers.set("Content-Type", "application/json");
        const token = (getState() as RootState).user.tokens?.accessToken;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

const BaseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        const refreshToken = (api.getState() as RootState).user.tokens?.refreshToken;
        //try to get new token
        const refreshResult = await baseQuery(
            { url: "/auth/refreshaccesstoken/", method: "POST", body: { refreshToken: refreshToken } },
            api,
            extraOptions
        );
        if (refreshResult.data) {
            // store new token
            api.dispatch(refreshUserToken(refreshResult.data as tokenDto));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
        }
    }

    return result;
};

export default BaseQueryWithReauth;

export const apiSlice = createApi({
    tagTypes: ["ExpenseCategory", "Expense", "FixedExpense", "Income", "FixedIncome", "SavingGoal"],
    baseQuery: BaseQueryWithReauth,
    endpoints: () => ({}),
});
