import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface Section {
    currentSection: string;
}

const initialState: Section = {
    currentSection: "Dashboard",
};

export const sectionSlice = createSlice({
    name: "section",
    initialState,
    reducers: {
        changeSection: (state, action: PayloadAction<string>) => {
            state.currentSection = action.payload;
        },
    },
});

export const { changeSection } = sectionSlice.actions;
export default sectionSlice.reducer;
