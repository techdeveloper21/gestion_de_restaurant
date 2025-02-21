import { getProductBySlug } from "@/services/productService";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  console.log("Fetching product:", params.slug);
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}
