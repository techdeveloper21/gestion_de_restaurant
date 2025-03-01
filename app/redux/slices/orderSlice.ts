import { Order } from "@/types/order";
import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Orders {
    order: Order;
    user: User;
}

interface OrderState {
  items: Orders[]; // Array of { order, user }
}

const initialState: OrderState = {
  items: [], // Empty array initially
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Orders[]>) => {
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
