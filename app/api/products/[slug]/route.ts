import { deleteProductImage } from "@/services/productImageService";
import { addImage, deleteProduct, getProductBySlug, linkProductImage, updateProduct } from "@/services/productService";

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


export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const updateProductInformation = {
      product_slug: formData.get("product_slug"),
      product_name: formData.get("product_name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category"),
      status: formData.get("status"),
    };

    const isUpdated = await updateProduct(updateProductInformation);

    if (!isUpdated) {
      return Response.json({ success: false, message: "Failed to update product" }, { status: 400 });
    }

    console.log("Product updated successfully");

    /// **Handle New Images**
    const imageFiles = formData.getAll("new_images") as File[];
    const newImages = [];

    for (const imageFile of imageFiles) {
      const buffer = await imageFile.arrayBuffer();
      const image_id = await addImage(Buffer.from(buffer)); // Insert image into `images`
      if (!image_id) throw new Error("Failed to insert image");

      await linkProductImage(formData.get("product_slug"), image_id);

      // Convert Buffer to Base64
      const base64Image = Buffer.from(buffer).toString("base64");
      newImages.push({ image_id, image: `${base64Image}` });
    }

    /// **Handle Deleted Images**
    const deletedImagesIds = formData.getAll("deleted_images");

    for (const deletedImageId of deletedImagesIds) {
      console.log("Deleting Image:", deletedImageId);
      const isDeleted = await deleteProductImage(formData.get("product_slug"), deletedImageId);
      if (!isDeleted) throw new Error(`Failed to delete image ID: ${deletedImageId}`);
    }

    /// **Return Success Response**
    return Response.json({ success: true, message: "Product updated successfully", newImages });

  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
