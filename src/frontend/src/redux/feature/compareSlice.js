import { createSlice } from '@reduxjs/toolkit';

const compareSlice = createSlice({
    name: 'compare',
    initialState: {
        compareItems: [],
        maxItems: 4,
    },
    reducers: {

        addToCompare: (state, action) => {
            const product = action.payload;
            const productId = product.productId.toString();

            const exists = state.compareItems.some((item) => item.productId === productId);

            if (!exists && state.compareItems.length < state.maxItems) {
                state.compareItems.push(product);
            } else if (exists) {
                state.compareItems = state.compareItems.filter((item) => item.productId !== productId);
            }
        },

        removeFromCompare: (state, action) => {
            const productId = action.payload.toString();
            state.compareItems = state.compareItems.filter((item) => item.productId !== productId);
        },

        clearCompare: (state) => {
            state.compareItems = [];
        },
    },
});


export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;


export const selectCompareItems = (state) => state.compare.compareItems;
export const selectCompareCount = (state) => state.compare.compareItems.length;

export default compareSlice.reducer;