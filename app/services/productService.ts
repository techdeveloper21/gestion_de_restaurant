import db from "@/lib/db";
import { redis } from "@/lib/redis";
import { ProductWithoutImages } from "@/types/ProductWithoutImages";
import { Product } from "@/types/product";
import { ResultSetHeader, RowDataPacket } from "mysql2";


const CACHE_KEY = "products";

export async function getProducts(): Promise<Product[]> {
  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) return JSON.parse(cachedData);

  console.log("Fetching from DB...");

  // ✅ Fix: Explicitly define MySQL query result type
  const [products] = await db.query<ProductWithoutImages[] & RowDataPacket[]>(
    "SELECT * FROM products"
  );

  // ✅ Ensure images property exists before returning
  const productsWithImages: Product[] = products.map((product) => ({
    ...product,
    images: [], // Initialize images array
  }));

  // Fetch images for each product
  for (const product of productsWithImages) {
    const [images] = await db.query<RowDataPacket[]>(
      "SELECT product_images.image_id, TO_BASE64(image) AS image FROM product_images JOIN images ON product_images.image_id = images.image_id WHERE product_slug = ?",
      [product.product_slug]
    );

    product.images = images as { image_id: number; image: string }[];
  }

  // Cache the result in Redis for 60 seconds
  await redis.set(CACHE_KEY, JSON.stringify(productsWithImages), "EX", 60);

  return productsWithImages;
}

  export async function getProductBySlug(slug: string): Promise<Product | null> {
    // Fetch product details
    const [product] = await db.query<any[]>("SELECT * FROM products WHERE product_slug = ?", [slug]);
  
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

// Insert product into database
export async function addProduct(product: Product) {

  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO products (product_slug, product_name, description, price, category, status) VALUES (?, ?, ?, ?, ?, ?)",
    [product.product_slug, product.product_name, product.description, product.price, product.category, product.status]
  );

  await redis.del(CACHE_KEY); // Clear cache

  return result.insertId; // Return generated product_id
}

export async function updateProduct(updates: Partial<Product>) {
  const updateKeys = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
  const values = [...Object.values(updates)];

  ///console.log(values);

  /// Update product information only product information  
  const [result] = await db.query<ResultSetHeader>(
    `UPDATE products SET ${updateKeys} WHERE product_slug = ?`,
    [...values, updates.product_slug]
  );

  await redis.del(CACHE_KEY);

  console.log(result);

  return result.affectedRows > 0;

}

export async function deleteProduct(slug: string) {
  await db.query("DELETE FROM products WHERE product_slug = ?", [slug]);
  await redis.del(CACHE_KEY);
}

// Insert image into `images` table and return `image_id`
export async function addImage(imageBuffer: Buffer) {
  const [result] = await db.query<ResultSetHeader>("INSERT INTO images (image) VALUES (?)", [imageBuffer]);
  return result.insertId;
}

// Insert into `product_images` table (link image to product)
export async function linkProductImage(product_slug: string, image_id: number) {
  await db.query("INSERT INTO product_images (product_slug, image_id) VALUES (?, ?)", [product_slug, image_id]);
}
