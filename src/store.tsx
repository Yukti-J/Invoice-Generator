import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./state";
import {invoiceSlice} from "./invoiceSlice";

export const store = configureStore({
    reducer: {
        userId : userSlice.reducer,
        Invoice: invoiceSlice.reducer
    }
})