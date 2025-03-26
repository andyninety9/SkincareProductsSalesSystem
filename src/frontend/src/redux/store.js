import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import rootReducer from "./rootReducer"; // Assuming this combines your reducers

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "quiz", "order", "compare"], // Added "compare" to whitelist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for BigInt or non-serializable data
    }),
});

export const persistor = persistStore(store);