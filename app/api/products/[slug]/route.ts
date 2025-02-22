import { deleteProduct, getProductBySlug } from "@/services/productService";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  console.log("Fetching product:", params.slug);
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  console.log("Deleting product:", params.slug);
  
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  try {
    await deleteProduct(params.slug);
    return Response.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ message: "Failed to delete product" }, { status: 500 });
  }
}