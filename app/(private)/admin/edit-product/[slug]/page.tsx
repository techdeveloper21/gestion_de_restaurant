"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "@/redux/slices/categorySlice";
import { RootState } from "@/redux/store";
import Link from "next/link";

import Image from "next/image";


export default function EditProduct() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const categories = useSelector((state: RootState) => state.categories.items);
  const products = useSelector((state: RootState) => state.products.items);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [existingImages, setExistingImages] = useState<{ image_id: number; image: string }[]>([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  // Fetch categories from localStorage or API
  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");

    if (categories.length > 0) {
      return; // Categories are already in Redux, no need to fetch
    } else if (storedCategories) {
      dispatch(setCategories(JSON.parse(storedCategories))); // Load from local storage
    } else {
      async function fetchCategories() {
        const res = await fetch("/api/categories");
        const data = await res.json();
        dispatch(setCategories(data)); // Store in Redux
        localStorage.setItem("categories", JSON.stringify(data)); // Store in local storage
      }
      fetchCategories();
    }
  }, [categories, dispatch]);

  useEffect(() => {
    if (!slug) return;

    // Check Redux first
    if (products.length > 0) {
      const productFromRedux = products.find((p) => p.product_slug === slug);
      if (productFromRedux) {
        setSelectedProduct(productFromRedux);
        setExistingImages(productFromRedux.images || []);
        return;
      }
    }

    // Check local storage
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      const parsedProducts: Product[] = JSON.parse(storedProducts);
      const productFromStorage = parsedProducts.find((p) => p.product_slug === slug);
      if (productFromStorage) {
        setSelectedProduct(productFromStorage);
        setExistingImages(productFromStorage.images || []);
        return;
      }
    }

    // Fetch from API
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const productData: Product = await res.json();
        setSelectedProduct(productData);
        setExistingImages(productData.images || []);

        ///const updatedProducts = [...products, productData];
        //dispatch(setProducts(updatedProducts));
        //localStorage.setItem("products", JSON.stringify(updatedProducts));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    fetchProduct();
  }, [slug, products, dispatch]);

  useEffect(() => {
    console.log(selectedProduct);
  }, [selectedProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setNewImages([...newImages, ...newFiles]);
    }
  };

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index].image_id;
    setDeletedImages([...deletedImages, imageToRemove]);
    setExistingImages(existingImages.filter((_, i) => i !== index));

    console.log(deletedImages);
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append("product_slug", slug);
    formData.append("product_name", selectedProduct.product_name);
    formData.append("description", selectedProduct.description);
    formData.append("price", selectedProduct.price);
    formData.append("category", selectedProduct.category);
    formData.append("status", selectedProduct.status);


    newImages.forEach((image) => formData.append("new_images", image));
    deletedImages.forEach((img) => formData.append("deleted_images", img));

    console.log('formData');

    console.log(formData);

    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update product");

      console.log(res);

      alert("Product updated successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    selectedProduct && (
      <div className="container add-product-container mt-5">
        <div className="add-product-header">
          <h4>Update product: {selectedProduct.product_name}</h4>
        </div>
        <form onSubmit={handleSubmit} className="card p-4 shadow row">
          <div className="col-lg-6 col-md-6 col-sm-12 add-product-cart">
            <label className="form-label">Product Name</label>
            <input type="text" name="product_name" className="form-control" value={selectedProduct.product_name} onChange={handleInputChange} required />
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 add-product-cart">
            <label className="form-label">Category</label>
            <select name="category" className="form-select" value={selectedProduct.category} onChange={handleInputChange} required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.category_slug} value={cat.category_slug}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 add-product-cart">
            <label className="form-label">Price (DA)</label>
            <input type="number" name="price" className="form-control" value={selectedProduct.price} onChange={handleInputChange} required />
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 add-product-cart">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" value={selectedProduct.status} onChange={handleInputChange}>
              <option value="1">Available</option>
              <option value="0">Unavailable</option>
            </select>
          </div>

          <div className="col-lg-12 add-product-cart">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows={3} value={selectedProduct.description} onChange={handleInputChange} required></textarea>
          </div>

          {/* Images Section */}
          <div className="col-lg-12 add-product-cart">
            <label className="form-label">Product Images</label>
            <div className="d-flex flex-wrap">
              {existingImages.map((image, index) => (
                <div key={index} className="position-relative m-2">
                  <Image
                    src={`data:image/png;base64,${image.image}`}
                    alt="Product"
                    width={100}
                    height={100}
                    className="rounded border shadow-sm"
                  />
                  <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" onClick={() => removeExistingImage(index)}>
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              ))}

              {newImages.map((image, index) => (
                <div key={index} className="position-relative m-2">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="New"
                    width={100}
                    height={100}
                    className="rounded border shadow-sm"
                  />
                  <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" onClick={() => removeNewImage(index)}>
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              ))}
              <label className="d-flex align-items-center justify-content-center border rounded shadow-sm m-2" style={{ width: "100px", height: "100px", cursor: "pointer" }}>
                <i className="fa fa-plus fa-2x text-muted"></i>
                <input type="file" className="d-none" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="col-lg-12 mt-4">
            <button type="submit" className="btn btn-primary me-2">
              Update Product
            </button>
            <Link href="/admin">
              <button type="button" className="btn btn-secondary">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    )
  );
}
