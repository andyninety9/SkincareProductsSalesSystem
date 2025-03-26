import { createSlice } from '@reduxjs/toolkit';

const compareSlice = createSlice({
    name: 'compare',
    initialState: {
        compareItems: [], // Array to store products selected for comparison
        maxItems: 4, // Maximum number of products allowed for comparison
    },
    reducers: {
        // Add a product to the comparison list
        addToCompare: (state, action) => {
            const product = action.payload;
            const productId = product.productId.toString(); // Ensure productId is a string

            // Check if the product is already in the comparison list
            const exists = state.compareItems.some((item) => item.productId === productId);

            if (!exists && state.compareItems.length < state.maxItems) {
                state.compareItems.push(product);
            } else if (exists) {
                // Optionally, you could remove it if it's already added (toggle behavior)
                state.compareItems = state.compareItems.filter((item) => item.productId !== productId);
            }
        },

        // Remove a product from the comparison list
        removeFromCompare: (state, action) => {
            const productId = action.payload.toString();
            state.compareItems = state.compareItems.filter((item) => item.productId !== productId);
        },

        // Clear all products from the comparison list
        clearCompare: (state) => {
            state.compareItems = [];
        },
    },
});

// Export actions
export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;

// Export selectors
export const selectCompareItems = (state) => state.compare.compareItems;
export const selectCompareCount = (state) => state.compare.compareItems.length;

// Export reducer
export default compareSlice.reducer;