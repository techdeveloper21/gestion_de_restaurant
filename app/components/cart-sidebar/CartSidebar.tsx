import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCartQuantity, removeFromCart, clearCart } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

import "./CartSidebar.css";

export default function CartSidebar({ isOpen, toggleCart }: { isOpen: boolean; toggleCart: () => void }) {

  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const [showDialog, setShowDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleValidateOrder = async () => {
    try {
      const userRes = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const { user_id } = await userRes.json();

      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, cartItems: cart }),
      });

      dispatch(clearCart());
      localStorage.removeItem("cart");
      setShowDialog(false);
      toggleCart();

      // ✅ Show toast when order is confirmed
      toast.success("Order placed successfully!");

    } catch (error) {
      console.error("Order validation failed", error);
    }
  };

  return (
    <>
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
                <button 
                  className="remove-btn" 
                  onClick={() => { 
                      dispatch(removeFromCart(item.product.product_slug))
                      // ✅ Show toast when order is confirmed
                      toast.success(`${item.product.product_slug} removed successfully!`);
                      }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <button className="validate-btn btn btn-dark" onClick={() => setShowDialog(true)}>Validate Order</button>
          </div>
        )}
      </div>

      {/* Bootstrap-Styled Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog card shadow-lg p-4 bg-white rounded">
            <h3 className="text-center text-warning">Confirm Order</h3>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="dialog-actions d-flex justify-content-between">
              <button onClick={handleValidateOrder} className="btn btn-success">Confirm</button>
              <button onClick={() => setShowDialog(false)} className="btn btn-danger">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Styles for the Overlay */}
      <style jsx>{`
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .dialog {
          width: 400px;
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
