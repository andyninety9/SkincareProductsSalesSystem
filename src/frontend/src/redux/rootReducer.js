import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./feature/cartSlice";
import quizReducer from "./feature/quizSlice";
import orderReducer from "./feature/orderSlice";
import compareReducer from "./feature/compareSlice";

const rootReducer = combineReducers({
    cart: cartReducer,
    quiz: quizReducer,
    order: orderReducer,
    compare: compareReducer,
});

export default rootReducer;