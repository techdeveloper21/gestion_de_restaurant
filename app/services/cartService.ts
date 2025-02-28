import db  from "@/lib/db";

export async function createCart(user_id: number) {
  const result = await db.query(
    "INSERT INTO cart (user_id, date_cart, client_status, admin_status) VALUES (?, NOW(), 1, 0)",
    [user_id]
  );
  return result[0].insertId;
}

export async function addCartItems(cart_id: number, cartItems: { product_slug: string; quantity: number }[]) {

  const values = cartItems.map(item => [cart_id, item.product.product_slug, item.quantity]);
  await db.query("INSERT INTO cart_items (cart_id, product_slug, quantity) VALUES ?", [values]);
}

export async function getCartItemsByCartId(cart_id: number) {
  console.log(cart_id);
  const cartItem = await db.query("SELECT * FROM cart_items WHERE cart_id = ?", [cart_id]);

  return cartItem[0] || null;
}