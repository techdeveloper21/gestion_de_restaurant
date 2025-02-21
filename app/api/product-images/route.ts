import { addProductImage, getProductImages } from "@/services/productImageService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return Response.json({ error: "Missing slug" }, { status: 400 });

  const images = await getProductImages(slug);
  return Response.json(images);
}

export async function POST(req: Request) {
  const { product_slug, image_id } = await req.json();
  await addProductImage(product_slug, image_id);
  return Response.json({ message: "Product image added!" });
}
