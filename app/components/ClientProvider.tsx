"use client";

import { ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { setCart } from "@/redux/slices/cartSlice";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
