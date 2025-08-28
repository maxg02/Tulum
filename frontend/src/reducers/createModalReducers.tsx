import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type modalState = {
    show: {
        income: boolean;
        budgetPlanning: boolean;
        expense: boolean;
        savingGoal: boolean;
        goalContribution: boolean;
        expenseCategory: boolean;
    };
};

export const initialState: modalState = {
    show: {
        income: false,
        budgetPlanning: false,
        expense: false,
        savingGoal: false,
        goalContribution: false,
        expenseCategory: false,
    },
};

export const createModalSlice = createSlice({
    name: "createModal",
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<typeof initialState.show>) => {
            state.show = action.payload;
        },
        hideModal: (state) => {
            state.show = initialState.show;
        },
    },
});

export const { showModal, hideModal } = createModalSlice.actions;

export default createModalSlice.reducer;
