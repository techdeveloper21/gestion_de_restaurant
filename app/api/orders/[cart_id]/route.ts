import { getCartItemsByCartId } from "@/services/cartService";
import { getProductBySlug } from "@/services/productService";

export async function GET(req: Request, { params }: { params: { cart_id: any } }) {
    console.log("Fetching orders products details:", params.cart_id);

    /// Get cart items [{ cart_id: , product_slug: '', quantity:  }]
    const cartItems = await getCartItemsByCartId(params.cart_id); 

    const result = [];

    if(cartItems){
        for(const cartItem of cartItems){
            let product = await getProductBySlug(cartItem.product_slug);
            result.push({
                cart_id: params.cart_id,
                quantity : cartItem.quantity,
                product : product
            }) 
        }
        
    }

    return Response.json(result);
}