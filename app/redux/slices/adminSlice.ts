import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

interface AdminState {
  categories: Category[];
  products: Product[];
}

const initialState: AdminState = {
  categories: [],
  products: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setCategories, setProducts } = adminSlice.actions;
export default adminSlice.reducer;
