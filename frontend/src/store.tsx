import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice.ts";
import detailsModalReducer from "../src/reducers/detailsModalReducers";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        detailsModal: detailsModalReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});
