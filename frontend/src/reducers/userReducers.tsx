import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        setUserInfo: (state, action: PayloadAction<userInfo>) => {
            state.tokens = action.payload.tokens;
            state.userInfo = action.payload.userInfo;
        },
    },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
