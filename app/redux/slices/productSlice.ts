import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

interface ProductState {
  items: Product[];
}

const initialState: ProductState = {
  items: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    deleteProductFromState: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((product) => product.product_slug !== action.payload);
    },
  },
});

export const { setProducts, deleteProductFromState } = productSlice.actions;
export default productSlice.reducer;
