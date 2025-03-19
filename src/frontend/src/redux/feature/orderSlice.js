import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pendingOrder: null,
};

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setPendingOrder: (state, action) => {
            state.pendingOrder = action.payload;
        },
        clearPendingOrder: (state) => {
            state.pendingOrder = null;
        },
    },
});

export const { setPendingOrder, clearPendingOrder } = orderSlice.actions;
export const selectPendingOrder = (state) => state.order.pendingOrder;
export default orderSlice.reducer;
