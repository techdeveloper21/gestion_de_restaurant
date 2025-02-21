import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

// Define Cart Item Type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define Initial State
interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [], // ✅ Avoid accessing localStorage directly (Handled in layout.tsx)
};

// Create Redux Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;  // ✅ Load cart from local storage
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.product.product_slug === product.product_slug);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(state.items)); // ✅ Sync with local storage
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.product_slug !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateCartQuantity: (state, action: PayloadAction<{ slug: string; quantity: number }>) => {
      const item = state.items.find(item => item.product.product_slug === action.payload.slug);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { setCart, addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
