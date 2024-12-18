import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type user = {
    userInfo: {
        firstName: string | undefined;
        lastName: string | undefined;
        fullName: string | undefined;
    };
    tokens: { access: string | undefined; refresh: string | undefined };
};

const initialState: user = {
    userInfo: {
        firstName: undefined,
        lastName: undefined,
        fullName: undefined,
    },
    tokens: { access: undefined, refresh: undefined },
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<user>) => {
            state = action.payload;
        },
    },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
