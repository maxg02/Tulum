import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice.ts";
import detailsModalReducer from "../reducers/detailsModalReducers.tsx";
import createModalReducer from "../reducers/createModalReducers.tsx";
import userReducer from "../features/Auth/reducers.tsx";
import utilitiesReducer from "../reducers/utilitiesReducers.tsx";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        detailsModal: detailsModalReducer,
        createModal: createModalReducer,
        user: userReducer,
        utilities: utilitiesReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
