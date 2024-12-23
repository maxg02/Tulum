import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";

export type userInfo = {
    userInfo: {
        fullName: string;
    } | null;
    tokens: { access: string; refresh: string } | null;
};

const initialState: userInfo = {
    userInfo: null,
    tokens: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<{ access: string; refresh: string }>) => {
            const tokens = action.payload;
            const tokenInfo = decodeToken(tokens.access);

            const userInfo: userInfo = {
                userInfo: {
                    fullName: tokenInfo.full_name,
                },
                tokens: {
                    access: tokens.access,
                    refresh: tokens.refresh,
                },
            };
            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            state.tokens = userInfo.tokens;
            state.userInfo = userInfo.userInfo;
        },
        refreshUserToken: (state, action: PayloadAction<{ access: string }>) => {
            state.tokens!.access = action.payload.access;
            const userInStorage = JSON.parse(localStorage.getItem("userInfo")!);
            userInStorage.tokens.access = action.payload.access;
            localStorage.setItem("userInfo", JSON.stringify(userInStorage));
        },
        logOut: (state) => {
            debugger;
            state.tokens = null;
            state.userInfo = null;
            localStorage.removeItem("userInfo");
        },
    },
});

export const { setUserInfo, logOut, refreshUserToken } = userSlice.actions;

export default userSlice.reducer;
