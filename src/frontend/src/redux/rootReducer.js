import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./feature/cartSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;
