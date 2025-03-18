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
                item.quantity += action.payload.quantity; // Tăng theo số lượng người dùng đã chọn
            } else {
                state.cartItems.push({ ...action.payload, quantity: action.payload.quantity }); // Thêm với số lượng người dùng đã chọn
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(cartItem => cartItem.productId !== action.payload.productId);
        },
        increaseQuantity: (state, action) => {
            const item = state.cartItems.find(cartItem => cartItem.productId === action.payload.productId);
            if (item) {
                item.quantity += action.payload.quantity || 1; // Tăng số lượng theo giá trị người dùng nhập
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.cartItems.find(cartItem => cartItem.productId === action.payload.productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1; // Giảm 1 đơn vị nếu có
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