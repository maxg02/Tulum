import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";

export type userInfo = {
    userInfo: {
        fullName: string;
        email: string;
        profileImage: string;
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

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<tokensDto>) => {
            const tokens = action.payload;
            const tokenInfo = decodeToken(tokens.accessToken);

            const userInfo: userInfo = {
                userInfo: {
                    fullName: tokenInfo[claims.name],
                    email: tokenInfo[claims.email],
                    profileImage:
                        "https://media.gq.com.mx/photos/5f6ce732bc946e88f6c96320/16:9/w_2560%2Cc_limit/goky%2520ultra%2520instinto.jpg",
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
