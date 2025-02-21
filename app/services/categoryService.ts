import db from "@/lib/db";
import { redis } from "@/lib/redis";

const CACHE_KEY = "categories";

export async function getCategories() {
  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) return JSON.parse(cachedData);

  console.log('getting data');

  const [categories] = await db.query("SELECT * FROM categories");
  await redis.set(CACHE_KEY, JSON.stringify(categories), "EX", 60);
  return categories;
}

export async function addCategory(category_id: number, category_slug: string, category_name: string) {
  await db.query(
    "INSERT INTO categories (category_id, category_slug, category_name) VALUES (?, ?, ?)",
    [category_id, category_slug, category_name]
  );
  await redis.del(CACHE_KEY);
}

export async function updateCategory(category_id: number, category_slug: string, category_name: string) {
  await db.query(
    "UPDATE categories SET category_name = ? WHERE category_id = ? AND category_slug = ?",
    [category_name, category_id, category_slug]
  );
  await redis.del(CACHE_KEY);
}

export async function deleteCategory(category_id: number, category_slug: string) {
  await db.query(
    "DELETE FROM categories WHERE category_id = ? AND category_slug = ?",
    [category_id, category_slug]
  );
  await redis.del(CACHE_KEY);
}
