import { createSlice } from "@reduxjs/toolkit";

export type modalState = {
    show: {
        income: boolean;
        fixedIncome: boolean;
        budgetPlanning: boolean;
        expense: boolean;
        fixedExpense: boolean;
        savingGoal: boolean;
        goalContribution: boolean;
        expenseCategory: boolean;
    };
};

export const initialState: modalState = {
    show: {
        income: false,
        fixedIncome: false,
        budgetPlanning: false,
        expense: false,
        fixedExpense: false,
        savingGoal: false,
        goalContribution: false,
        expenseCategory: false,
    },
};

export const createModalSlice = createSlice({
    name: "createModal",
    initialState,
    reducers: {
        showModal: (state, action) => {
            state.show = action.payload;
        },
        hideModal: (state) => {
            state.show = initialState.show;
        },
    },
});

export const { showModal, hideModal } = createModalSlice.actions;

export default createModalSlice.reducer;
