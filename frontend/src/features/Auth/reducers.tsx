import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";
import { tokenDto, tokenInfo, userInfo } from "./types";

const initialState: userInfo = {
    userInfo: null,
    tokens: null,
};

const claims = {
    name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    userId: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<tokenDto>) => {
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
        refreshUserToken: (state, action: PayloadAction<tokenDto>) => {
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

export const { setUserInfo, logOut, refreshUserToken } = authSlice.actions;

export default authSlice.reducer;
