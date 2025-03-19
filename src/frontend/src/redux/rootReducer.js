import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./feature/cartSlice";
import quizReducer from "./feature/quizSlice";
import orderReducer from "./feature/orderSlice";


const rootReducer = combineReducers({
    cart: cartReducer,
    quiz: quizReducer,
    order: orderReducer,
});

export default rootReducer;


