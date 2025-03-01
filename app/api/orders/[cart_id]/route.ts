import { NextRequest } from "next/server";
import { getCartItemsByCartId } from "@/services/cartService";
import { getProductBySlug } from "@/services/productService";

export async function GET(req: NextRequest, { params }: { params: { cart_id: string } }) {  
    const cartId = parseInt(params.cart_id, 10); // Convert string to number
    if (isNaN(cartId)) return Response.json({ error: "Invalid cart ID" }, { status: 400 });

    console.log("Fetching orders products details:", cartId);

    const cartItems = await getCartItemsByCartId(cartId); 
    const result = [];

    if (cartItems) {
        for (const cartItem of cartItems) {
            const product = await getProductBySlug(cartItem.product_slug);
            result.push({
                cart_id: cartId,
                quantity: cartItem.quantity,
                product: product
            }); 
        }
    }

    return Response.json(result);
}
