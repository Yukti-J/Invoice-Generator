import { createSlice } from "@reduxjs/toolkit";

interface InvoiceId {
    invoiceId: String
}

const initialState: InvoiceId = {
    invoiceId: ""
}

export const invoiceSlice = createSlice({
    name: "Invoice",
    initialState,
    reducers: {
        setInvoice: (state, action) =>{
            state.invoiceId = action.payload
        }
    }
})

export const {setInvoice} = invoiceSlice.actions;
export default invoiceSlice.reducer;