import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = state.cartItems.find(cartItem => cartItem.productId === action.payload.productId);
            if (item) {
                item.quantity += action.payload.quantity;
            } 
            else {
                state.cartItems.push({ ...action.payload, quantity: action.payload.quantity });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(cartItem => cartItem.productId !== action.payload.productId);
        },
        increaseQuantity: (state, action) => {
            const item = state.cartItems.find(cartItem => cartItem.productId === action.payload.productId);
            if (item) {
                item.quantity += action.payload.quantity || 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.cartItems.find(cartItem => cartItem.productId === action.payload.productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
    },
});

export const { addToCart, removeFromCart, decreaseQuantity, increaseQuantity, clearCart, setCartItems } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.cartItems;
export default cartSlice.reducer;