import { getOrders } from "@/services/orders";
import { NextResponse } from "next/server";


export async function GET() {
    const orders = await getOrders();
    return NextResponse.json(orders);
}