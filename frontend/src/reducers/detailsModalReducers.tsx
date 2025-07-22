import { createSlice } from "@reduxjs/toolkit";
import { modalState as defaultModalState } from "./createModalReducers";
import { initialState as defaultInitialState } from "./createModalReducers";

type modalState = defaultModalState & {
    id: number | null;
};

const initialState: modalState = {
    ...defaultInitialState,
    id: null,
};

export const detailsModalSlice = createSlice({
    name: "detailsModal",
    initialState,
    reducers: {
        showModal: (state, action) => {
            state.show = action.payload.show;
            state.id = action.payload.id;
        },
        hideModal: (state) => {
            state.show = { ...initialState.show };
            state.id = initialState.id;
        },
    },
});

export const { showModal, hideModal } = detailsModalSlice.actions;

export default detailsModalSlice.reducer;
