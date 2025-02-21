export interface Product {
  product_id: number;
  product_slug: string;
  product_name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  images: { image_id: number; image: string }[]; // Array of images
}
