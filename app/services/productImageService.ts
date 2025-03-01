import db from "@/lib/db";

export async function addProductImage(product_slug: string, image_id: number) {
  await db.query("INSERT INTO product_images (product_slug, image_id) VALUES (?, ?)", [product_slug, image_id]);
}

export async function getProductImages(product_slug: string) {
  const [images] = await db.query(
    "SELECT images.image_id, images.image FROM product_images JOIN images ON product_images.image_id = images.image_id WHERE product_slug = ?",
    [product_slug]
  );
  return images;
}

export async function deleteProductImage(product_slug: string, image_id:number){
  const [deletedProdutImage] = await db.query(
    "DELETE FROM product_images WHERE product_slug = ? AND image_id = ?",
    [product_slug, image_id]
  );

  return deletedProdutImage;
}
