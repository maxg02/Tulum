import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SectionType } from "../components/Sidebar";

type utilitiesInfo = {
    sidebarOpen: boolean;
    activeSection: SectionType;
};

const initialState: utilitiesInfo = {
    sidebarOpen: false,
    activeSection: "Dashboard",
};

const utilitiesReducers = createSlice({
    name: "utilities",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        toggleActiveSection: (state, action: PayloadAction<SectionType>) => {
            state.activeSection = action.payload;
        },
    },
});

export const { toggleSidebar, toggleActiveSection } = utilitiesReducers.actions;

export default utilitiesReducers.reducer;
