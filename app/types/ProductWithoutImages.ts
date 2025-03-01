import { RowDataPacket } from "mysql2";

export interface ProductWithoutImages extends RowDataPacket {
    product_id: number;
    product_slug: string;
    product_name: string;
    description: string;
    price: number;
    category: string;
    status: string;
}