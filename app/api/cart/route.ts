import { NextResponse } from "next/server";
import { createCart, addCartItems } from "@/services/cartService";

export async function POST(req: Request) {
  try {
    const { user_id, cartItems } = await req.json();

    const cart_id = await createCart(user_id);

    await addCartItems(cart_id, cartItems);

    return NextResponse.json({ success: true, cart_id }, { status: 200 });
  } catch (error) {
    console.error("Error processing cart:", error); // ✅ Log the error
    return NextResponse.json({ error: "Failed to process cart" }, { status: 500 });
  }
}
