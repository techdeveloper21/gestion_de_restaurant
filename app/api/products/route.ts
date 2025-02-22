import { getProducts, addProduct, updateProduct, deleteProduct, linkProductImage, addImage } from "@/services/productService";

export async function GET() {
  console.log("Products from GET");
  const products = await getProducts();
  ///console.log(products);
  return Response.json(products);
}

export async function POST(req: Request) {
  const formData = await req.formData();

  // Extract product fields from formData
  const product_name = formData.get("product_name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  
  // Generate `product_slug` (lowercase, spaces replaced with "-")
  const product_slug = product_name.toLowerCase().replace(/\s+/g, "-");

  // Insert product into the database
  const product_id = await addProduct({
    product_id: 0, // Auto-incremented in DB
    product_slug,
    product_name,
    description,
    price,
    category,
    status,
  });

  // Process images
   
  const imageFiles = formData.getAll("images") as File[];
  const images = [];

  for (const imageFile of imageFiles) {
    const buffer = await imageFile.arrayBuffer(); // Convert File to Buffer
    const image_id = await addImage(Buffer.from(buffer)); // Insert image into `images`
    await linkProductImage(product_slug, image_id); // Link image to product

    // Convert Buffer to Base64
    const base64Image = Buffer.from(buffer).toString("base64");

    images.push({ image_id, image: `${base64Image}` });
  }


  const newProduct = {
    product_id,
    product_slug,
    product_name,
    description,
    price,
    category,
    status,
    images : images
  };

  return Response.json(newProduct);
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
