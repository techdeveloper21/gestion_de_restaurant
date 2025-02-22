"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css"; 
import "@fortawesome/fontawesome-free/css/all.min.css"; 
import "./globals.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";

import ClientProvider from "@/components/ClientProvider";
import HeaderDropdown from "./components/HeaderDropdown";
import CartSidebar from "@/components/cart-sidebar/CartSidebar";
import { ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <ToastContainer position="top-right" autoClose={2000} />
        <ClientProvider>
          <header>
            <div className="container header-container">
              <div className="header-actions">
                <div className="header-action header-dropdown">
                  <HeaderDropdown />
                </div>
                <CartQuantity toggleCart={() => setIsCartOpen(!isCartOpen)} />
              </div>
              <div className="header-description">
                <div className="web-title">
                  <h1 className="web-logo d-flex justify-content-center gap-3">
                    <i className="fa fa-utensils"></i>
                      Burger Code 
                    <i className="fa fa-utensils"></i>
                  </h1>
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer></footer>

          {/* Cart Sidebar Component */}
          <CartSidebar isOpen={isCartOpen} toggleCart={() => setIsCartOpen(!isCartOpen)} />
        </ClientProvider>
      </body>
    </html>
  );
}

// ✅ Move cart quantity logic to separate component
function CartQuantity({ toggleCart }: { toggleCart: () => void }) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (typeof window !== "undefined") { 
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        dispatch(setCart(JSON.parse(cartData)));
      }
    }
  }, [dispatch]);

  return (
    <div className='header-action shopping-cart-action' onClick={toggleCart}>
      <p>
        <span className='cart-quantity'>{totalQuantity}</span>
        <i className='fa-solid fa-shopping-cart'></i>
      </p>
    </div>
  );
}
