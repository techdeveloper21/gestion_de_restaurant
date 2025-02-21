import { getProducts, addProduct, updateProduct, deleteProduct } from "@/services/productService";

export async function GET() {
  console.log("Products from GET");
  const products = await getProducts();
  ///console.log(products);
  return Response.json(products);
}

export async function POST(req: Request) {
  const data = await req.json();
  await addProduct(data);
  return Response.json({ message: "Product added!" });
}

export async function PUT(req: Request) {
  const { slug, ...updates } = await req.json();
  await updateProduct(slug, updates);
  return Response.json({ message: "Product updated!" });
}

export async function DELETE(req: Request) {
  const { slug } = await req.json();
  await deleteProduct(slug);
  return Response.json({ message: "Product deleted!" });
}
