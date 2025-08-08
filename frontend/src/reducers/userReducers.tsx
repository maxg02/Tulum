import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";

export type userInfo = {
    userInfo: {
        fullName: string;
        email: string;
    } | null;
    tokens: { accessToken: string; refreshToken: string } | null;
};

const initialState: userInfo = {
    userInfo: null,
    tokens: null,
};

export type tokensDto = {
    accessToken: string;
    refreshToken: string;
};

const claims = {
    name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    userId: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
};

type tokenInfo = {
    aud: string;
    iss: string;
    exp: number;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": number;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    iat: number;
    nbf: number;
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<tokensDto>) => {
            const tokens = action.payload;
            const tokenInfo: tokenInfo = decodeToken(tokens.accessToken) as tokenInfo;

            const userInfo: userInfo = {
                userInfo: {
                    fullName: tokenInfo[claims.name as keyof tokenInfo] as string,
                    email: tokenInfo[claims.email as keyof tokenInfo] as string,
                },
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            };

            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            state.tokens = userInfo.tokens;
            state.userInfo = userInfo.userInfo;
        },
        refreshUserToken: (state, action: PayloadAction<tokensDto>) => {
            state.tokens!.accessToken = action.payload.accessToken;
            state.tokens!.refreshToken = action.payload.refreshToken;
            const userInStorage = JSON.parse(localStorage.getItem("userInfo")!);
            userInStorage.tokens.accessToken = action.payload.accessToken;
            userInStorage.tokens.refreshToken = action.payload.refreshToken;
            localStorage.setItem("userInfo", JSON.stringify(userInStorage));
        },
        logOut: (state) => {
            state.tokens = null;
            state.userInfo = null;
            localStorage.removeItem("userInfo");
        },
    },
});

export const { setUserInfo, logOut, refreshUserToken } = userSlice.actions;

export default userSlice.reducer;
