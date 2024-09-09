import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type modalState = {
    show: boolean;
    id: number | null;
};

const initialState: modalState = {
    show: false,
    id: null,
};

export const detailsModalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<number>) => {
            state.show = true;
            state.id = action.payload;
        },
        hideModal: (state) => {
            state.show = false;
            state.id = null;
        },
    },
});

export const { showModal, hideModal } = detailsModalSlice.actions;

export default detailsModalSlice.reducer;
