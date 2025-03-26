import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./feature/cartSlice";
import quizReducer from "./feature/quizSlice";
import orderReducer from "./feature/orderSlice";
import compareReducer from "./feature/compareSlice"; // Added compare reducer

const rootReducer = combineReducers({
    cart: cartReducer,
    quiz: quizReducer,
    order: orderReducer,
    compare: compareReducer, // Added to the combined reducers
});

export default rootReducer;