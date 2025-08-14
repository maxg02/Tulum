import { apiSlice } from "@/api/apiSlice";
import { tokenDto } from "./types";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.mutation<tokenDto, { email: string; password: string }>({
            query: (userData) => ({
                url: "auth/login",
                method: "Post",
                body: userData,
            }),
        }),
        registerUser: builder.mutation<tokenDto, { email: string; password: string; name: string }>({
            query: (userData) => ({
                url: "auth/register",
                method: "Post",
                body: userData,
            }),
        }),
        getUserRefreshToken: builder.mutation({
            query: (refreshToken: string) => ({
                url: "token/",
                method: "Post",
                body: refreshToken,
            }),
        }),
    }),
});

export const { useGetUserMutation, useRegisterUserMutation } = authApi;
