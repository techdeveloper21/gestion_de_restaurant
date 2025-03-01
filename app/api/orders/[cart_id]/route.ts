import { getCartItemsByCartId } from "@/services/cartService";
import { getProductBySlug } from "@/services/productService";

export async function GET(req: Request, { params }: { params: { cart_id: string } }) { // ✅ Use 'string' instead of 'any'
    console.log("Fetching orders products details:", params.cart_id);

    /// Get cart items [{ cart_id: , product_slug: '', quantity:  }]
    const cartItems = await getCartItemsByCartId(parseInt(params.cart_id, 10)); 

    const result = [];

    if (cartItems) {
        for (const cartItem of cartItems) {
            const product = await getProductBySlug(cartItem.product_slug); // ✅ Use 'const' instead of 'let'
            result.push({
                cart_id: params.cart_id,
                quantity: cartItem.quantity,
                product: product
            }); 
        }
    }

    return Response.json(result);
}
