import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Order {
    order: any;
    user: any;
}

interface OrderState {
  items: Order[]; // Array of { order, user }
}

const initialState: OrderState = {
  items: [], // Empty array initially
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload;
    },
    updateOrderStatusByOrderIndex(state, action: PayloadAction<{ index: number }>) {
      state.items = state.items.map((order, i) =>
        i == action.payload.index
          ? { ...order, order: { ...order.order, admin_status: 1 } }
          : order
      );
    },
  },
});

export const { setOrders, updateOrderStatusByOrderIndex } = ordersSlice.actions;
export default ordersSlice.reducer;
