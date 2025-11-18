import { apiSlice } from "@/api/apiSlice";
import { resendEmailVerificationDto, tokenDto, userEmailVerificationDto } from "./types";

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
        verifyEmail: builder.mutation({
            query: (verifyToken: userEmailVerificationDto) => ({
                url: "auth/verify-email",
                method: "Post",
                body: verifyToken,
            }),
        }),
        resendVerificationEmail: builder.mutation({
            query: (email: resendEmailVerificationDto) => ({
                url: "auth/resend-verification",
                method: "Post",
                body: email,
            }),
        }),
    }),
});

export const {
    useGetUserMutation,
    useRegisterUserMutation,
    useVerifyEmailMutation,
    useResendVerificationEmailMutation,
} = authApi;
