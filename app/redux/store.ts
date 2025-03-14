import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice"; // Already exists
import adminReducer from './slices/adminSlice';
import ordersReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer, // Keep your existing cart logic
    admin: adminReducer, // Ensure admin slice is added here,
    orders: ordersReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
