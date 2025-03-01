"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setCategories, setProducts } from "@/redux/slices/adminSlice";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import "./admin.css";
import { deleteProductFromState } from "@/redux/slices/productSlice";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function AdminProductTable() {
  const dispatch = useDispatch();

  // Redux State
  const categoriesList = useSelector((state: RootState) => state.admin?.categories || []);
  const productsList = useSelector((state: RootState) => state.admin?.products || []);

  // Component State
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5); // Default 5

  useEffect(() => {
    const fetchData = async () => {
      const storedCategories = localStorage.getItem("categories");
      const storedProducts = localStorage.getItem("products");

      if (storedCategories) {
        dispatch(setCategories(JSON.parse(storedCategories)));
      } else {
        const categoriesResponse = await fetch("/api/categories");
        const categories: Category[] = await categoriesResponse.json();
        dispatch(setCategories(categories));
        localStorage.setItem("categories", JSON.stringify(categories));
      }

      if (storedProducts) {
        dispatch(setProducts(JSON.parse(storedProducts)));
      } else {
        const productsResponse = await fetch("/api/products");
        const products: Product[] = await productsResponse.json();
        dispatch(setProducts(products));
        localStorage.setItem("products", JSON.stringify(products));
      }
    };

    fetchData();
  }, [dispatch]);

  // Update filtered products when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(productsList);
    } else {
      const filtered = productsList.filter((product) => product.category === activeCategory);
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); // Reset to first page
  }, [activeCategory, productsList]);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleDelete = async () => {
    if (!selectedProduct) return;

    const response = await fetch(`/api/products/${selectedProduct.product_slug}`, { method: "DELETE" });

    if (response.ok) {
      dispatch(deleteProductFromState(selectedProduct.product_slug));

      // Update local storage
      const updatedProducts = productsList.filter((p) => p.product_slug !== selectedProduct.product_slug);
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      ///alert(`${selectedProduct.product_name} deleted successfully`);
      // ✅ Show toast when item is added to cart
      toast.success(`${selectedProduct.product_name} deleted successfully!`);
    } else {
      alert("Failed to delete the product");
    }

    setSelectedProduct(null);
    const modalElement = document.getElementById("deleteModal") as HTMLElement;
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  };

  return (
    <div className="admin-home-product-presentation">
      {/* Tabs for Categories */}
      <div className="table-header-presentation">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All
            </button>
          </li>
          {categoriesList.map((category) => (
            <li className="nav-item" key={category.category_slug}>
              <button
                className={`nav-link ${activeCategory === category.category_slug ? "active" : ""}`}
                onClick={() => setActiveCategory(category.category_slug)}
              >
                {category.category_name}
              </button>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-end mb-3">
          <select
            className="form-select w-auto"
            value={productsPerPage}
            onChange={(e) => {
              setProductsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
      </div>
      {/* Products Table */}
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <tr key={product.product_id}>
                <td>
                  <img src={`data:image/png;base64,${product.images?.[0]?.image || ""}`} 
                       alt={product.product_name} 
                       className="product-img" />
                </td>
                <td>{product.product_name}</td>
                <td>{product.description}</td>
                <td>
                  <div className="table-action">
                    <button className="btn btn-info btn-sm me-2">
                      <i className="fa fa-eye"></i>
                    </button>
                    <Link href={`/admin/edit-product/${product.product_slug}`} className="btn btn-warning btn-sm me-2">
                      <i className="fa fa-edit"></i>
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No products available in this category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      {filteredProducts.length > productsPerPage && (
        <nav>
          <ul className="pagination justify-content-center">
            {/* First Page Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                &laquo;&laquo;
              </button>
            </li>

            {/* Previous Page Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
              </button>
            </li>

            {/* Page Numbers */}
            {(() => {
              const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
              const maxPagesToShow = 3; // Number of page numbers to show at a time
              const pages = [];

              let startPage = Math.max(1, currentPage - 1);
              let endPage = Math.min(totalPages, currentPage + 1);
            
              if (currentPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
              } else if (currentPage === totalPages) {
                startPage = Math.max(1, totalPages - maxPagesToShow + 1);
              }
            
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i)}>
                      {i}
                    </button>
                  </li>
                );
              }
            
              if (startPage > 1) {
                pages.unshift(
                  <li key="dots-start" className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }
            
              if (endPage < totalPages) {
                pages.push(
                  <li key="dots-end" className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }
            
              return pages;
            })()}

            {/* Next Page Button */}
            <li className={`page-item ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
              >
                &gt;
              </button>
            </li>
          
            {/* Last Page Button */}
            <li className={`page-item ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(Math.ceil(filteredProducts.length / productsPerPage))}
                disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
              >
                &raquo;&raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Bootstrap Delete Confirmation Modal */}
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex={-1}
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedProduct ? (
                <p>Are you sure you want to delete <strong>{selectedProduct.product_name}</strong>?</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                No
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
