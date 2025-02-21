import db from "@/lib/db";
import { redis } from "@/lib/redis";
import { Product } from "@/types/product";

const CACHE_KEY = "products";

export async function getProducts(): Promise<Product[]> {
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) return JSON.parse(cachedData);
  
    console.log("Products from getProducts");
    console.log("Fetching from DB...");
  
    // Fetch products
    const [products] = await db.query("SELECT * FROM products");
  
    // Fetch images for each product
    for (const product of products) {
      const [images] = await db.query(
        "SELECT product_images.image_id, TO_BASE64(image) AS image FROM product_images JOIN images ON product_images.image_id = images.image_id WHERE product_slug = ?",
        [product.product_slug]
      );
      product.images = images; // Attach images to the product
    }
  
    // Cache the result in Redis for 60 seconds
    await redis.set(CACHE_KEY, JSON.stringify(products), "EX", 60);
  
    return products;
  }

  export async function getProductBySlug(slug: string): Promise<Product | null> {
    // Fetch product details
    const [product] = await db.query("SELECT * FROM products WHERE product_slug = ?", [slug]);
  
    if (!product.length) return null;
  
    // Fetch product images
    const [images] = await db.query(
      "SELECT product_images.image_id, TO_BASE64(image) AS image FROM product_images JOIN images ON product_images.image_id = images.image_id WHERE product_slug = ?",
      [slug]
    );
  
    // Attach images to the product
    product[0].images = images;
  
    return product[0];
  }

export async function addProduct(product: Product) {
  await db.query(
    "INSERT INTO products (product_id, product_slug, product_name, description, price, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [product.product_id, product.product_slug, product.product_name, product.description, product.price, product.category, product.status]
  );
  await redis.del(CACHE_KEY);
}

export async function updateProduct(slug: string, updates: Partial<Product>) {
  const updateKeys = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
  const values = [...Object.values(updates), slug];

  await db.query(`UPDATE products SET ${updateKeys} WHERE product_slug = ?`, values);
  await redis.del(CACHE_KEY);
}

export async function deleteProduct(slug: string) {
  await db.query("DELETE FROM products WHERE product_slug = ?", [slug]);
  await redis.del(CACHE_KEY);
}
