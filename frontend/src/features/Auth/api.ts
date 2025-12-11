import { apiSlice } from "@/api/apiSlice";
import {
    sendEmailVerificationDto,
    tokenDto,
    verificationTokenDto,
    userRestorePasswordDto,
} from "./types";

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
            query: (verifyToken: verificationTokenDto) => ({
                url: "auth/verify-email",
                method: "Post",
                body: verifyToken,
            }),
        }),
        resendVerificationEmail: builder.mutation({
            query: (email: sendEmailVerificationDto) => ({
                url: "auth/resend-verification",
                method: "Post",
                body: email,
            }),
        }),
        sendPasswordRecoverEmail: builder.mutation({
            query: (email: sendEmailVerificationDto) => ({
                url: "auth/send-password-reset",
                method: "Post",
                body: email,
            }),
        }),
        resetPassword: builder.mutation({
            query: (body: userRestorePasswordDto) => ({
                url: "auth/password-reset",
                method: "Post",
                body,
            }),
        }),
    }),
});

export const {
    useGetUserMutation,
    useRegisterUserMutation,
    useVerifyEmailMutation,
    useResendVerificationEmailMutation,
    useSendPasswordRecoverEmailMutation,
    useResetPasswordMutation,
} = authApi;
