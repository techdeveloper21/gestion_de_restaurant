import db from "@/lib/db";
import { redis } from "@/lib/redis";
import { getUserById } from "./userService";
import { OrderWithUser } from "@/types/order-with-user";

const CACHE_KEY = "orders";


export async function getOrders() {

    /// check redis and rturn from it the values of orders
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) return JSON.parse(cachedData);

    // Fetch products
    const [orders] = (await db.query("SELECT * FROM cart"));
    const ordersWithUsers: OrderWithUser[] = [];

    console.log('orders');
    console.log(orders);
    for(const order of orders){
        const user = await getUserById(order.user_id);
        if(user){
            ordersWithUsers.push({
                order: order, 
                user: user
            });
        }
    }
    
    return ordersWithUsers;
}