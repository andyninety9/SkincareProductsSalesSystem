import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./feature/cartSlice";
import quizReducer from "./feature/quizSlice";


const rootReducer = combineReducers({
  cart: cartReducer,
  quiz: quizReducer,
});

export default rootReducer;


