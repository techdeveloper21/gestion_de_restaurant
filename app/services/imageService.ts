import db from "@/lib/db";
import { Image } from "@/types/image";

export async function addImage(image: Buffer): Promise<number> {
  const [result] = await db.query("INSERT INTO images (image) VALUES (?)", [image]);
  return result.insertId;
}

export async function getImageById(image_id: number): Promise<Image | null> {
  const [image] = await db.query("SELECT * FROM images WHERE image_id = ?", [image_id]);
  return image.length ? image[0] : null;
}
