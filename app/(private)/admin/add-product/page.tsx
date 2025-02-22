"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setCategories } from "@/redux/slices/categorySlice";
import { Category } from "@/types/category";
import { setProducts } from "@/redux/slices/productSlice"; // Import setProducts action


import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import './add-product.css';
import Link from "next/link";

export default function AddProduct() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get categories from Redux state
  const categories = useSelector((state: RootState) => state.categories.items);

  const [product, setProduct] = useState({
    product_name: "",
    description: "",
    price: "",
    category: "",
    status: "active",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const products = useSelector((state: RootState) => state.products.items); // Get products from Redux

useEffect(() => {
  const storedProducts = localStorage.getItem("products");

  if (products.length > 0) {
    return; // Products already in Redux, no need to fetch
  } else if (storedProducts) {
    dispatch(setProducts(JSON.parse(storedProducts))); // Load from local storage
  }
}, [products, dispatch]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("product_name", product.product_name);
  formData.append("description", product.description);
  formData.append("price", product.price);
  formData.append("category", product.category);
  formData.append("status", product.status);
  images.forEach((image) => formData.append("images", image));

  const response = await fetch("/api/products", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    /*console.log("response ok");
    console.log(response);
    */
    const newProduct = await response.json();

    // Update Redux state
    const updatedProducts = [...products, newProduct];
    dispatch(setProducts(updatedProducts));

    console.log("data");
    console.log(updatedProducts);
    
    // Update Local Storage
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // ✅ Show toast when item is added to cart
    toast.success(`${newProduct.product_name} added to Database!`);

    router.push("/admin");
  } else {
    alert("Failed to add product");
  }
};

  return (
    <div className="container add-product-conatiner mt-5">
      <div className="add-product-header">
        <h4 className="">Add New Product</h4>
      </div>
      <form onSubmit={handleSubmit} className="card p-4 shadow row">
        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 add-product-cart">
          <div className="">
            <label className="form-label">Product Name</label>
            <input type="text" name="product_name" className="form-control" value={product.product_name} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 add-product-cart">
          {/* Category Select Dropdown */}
          <div className="">
            <label className="form-label">Category</label>
            <select name="category" className="form-select" value={product.category} onChange={handleInputChange} required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.category_slug} value={cat.category_slug}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 add-product-cart">
          <div className="mb-3">
            <label className="form-label">Price (DA)</label>
            <input type="number" name="price" className="form-control" value={product.price} onChange={handleInputChange} required />
          </div>   
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 add-product-cart">
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" value={product.status} onChange={handleInputChange}>
              <option value="1">Available</option>
              <option value="0">Inavailable</option>
            </select>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 add-product-cart">
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows={3} value={product.description} onChange={handleInputChange} required></textarea>
          </div>
        </div>
        {/* Image Upload Section */}
        <div className="mb-3">
          <label className="form-label">Product Images</label>
          <div className="d-flex flex-wrap">
            {previewImages.map((image, index) => (
              <div key={index} className="position-relative m-2">
                <img src={image} alt={`Preview ${index}`} className="rounded border shadow-sm" width="100" height="100" />
                <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0" onClick={() => removeImage(index)}>
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
        <div className="form-actions">
          <div className="submit-action">
            <button type="submit" className="btn btn-success">
              <i className="fa-solid fa-plus"></i>
              Add Product
            </button>
          </div>
          <div className="back-action">
            <Link href="/admin" className="btn btn-secondary">
              <i className="fa-solid fa-right-from-bracket"></i>
              Back
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
