"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCartQuantity, removeFromCart } from "@/redux/slices/cartSlice";
import Image from "next/image";

import "./CartSidebar.css";


export default function CartSidebar({ isOpen, toggleCart }: { isOpen: boolean; toggleCart: () => void }) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h3>Shopping Cart</h3>
        <button className="close-btn" onClick={toggleCart}>×</button>
      </div>
      <div className="cart-content">
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.product.product_slug} className="cart-item">
              <Image
                src={`data:image/png;base64,${item.product.images[0]?.image}`}
                alt={item.product.product_name}
                width={60}
                height={60}
              />
              <div className="cart-item-info">
                <h5>{item.product.product_name}</h5>
                <div className="quantity-controls">
                  <button onClick={() => dispatch(updateCartQuantity({ slug: item.product.product_slug, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(updateCartQuantity({ slug: item.product.product_slug, quantity: item.quantity + 1 }))}>+</button>
                </div>
              </div>
              <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.product.product_slug))}><i className="fa-solid fa-trash-can"></i></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
