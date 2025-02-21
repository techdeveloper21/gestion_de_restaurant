export interface Product {
    product_id: number;
    product_slug: string;
    product_name: string;
    description: string;
    price: number;
    category: string; // Slug from categories table
    status: string;
  }
  