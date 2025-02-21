import { getCategories, addCategory, updateCategory, deleteCategory } from "@/services/categoryService";
import { NextResponse } from "next/server";

// GET All Categories
export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

// POST - Add Category
export async function POST(req: Request) {
  const { category_id, category_slug, category_name } = await req.json();
  await addCategory(category_id, category_slug, category_name);
  return NextResponse.json({ message: "Category added successfully" });
}

// PUT - Update Category
export async function PUT(req: Request) {
  const { category_id, category_slug, category_name } = await req.json();
  await updateCategory(category_id, category_slug, category_name);
  return NextResponse.json({ message: "Category updated successfully" });
}

// DELETE - Remove Category
export async function DELETE(req: Request) {
  const { category_id, category_slug } = await req.json();
  await deleteCategory(category_id, category_slug);
  return NextResponse.json({ message: "Category deleted successfully" });
}
