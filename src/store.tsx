import { configureStore } from "@reduxjs/toolkit";
import sectionReducer from "./reducers/sectionReducer";

export const store = configureStore({
    reducer: {
        section: sectionReducer,
    },
});
