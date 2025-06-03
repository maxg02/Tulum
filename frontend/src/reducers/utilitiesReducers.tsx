import { createSlice } from "@reduxjs/toolkit";

type utilitiesInfo = {
    sidebarOpen: boolean;
};

const initialState: utilitiesInfo = {
    sidebarOpen: false,
};

const utilitiesReducers = createSlice({
    name: "utilities",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
    },
});

export const { toggleSidebar } = utilitiesReducers.actions;

export default utilitiesReducers.reducer;
