import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { modalState as defaultModalState } from "./createModalReducers";
import { initialState as defaultInitialState } from "./createModalReducers";

type modalState = defaultModalState & {
    data: unknown | null;
};

const initialState: modalState = {
    ...defaultInitialState,
    data: null,
};

export const detailsModalSlice = createSlice({
    name: "detailsModal",
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<modalState>) => {
            state.show = action.payload.show;
            state.data = action.payload.data;
        },
        hideModal: (state) => {
            state.show = { ...initialState.show };
            state.data = initialState.data;
        },
    },
});

export const { showModal, hideModal } = detailsModalSlice.actions;

export default detailsModalSlice.reducer;
