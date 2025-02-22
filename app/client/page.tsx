"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "@/redux/slices/categorySlice";
import { setProducts } from "@/redux/slices/productSlice";
import { RootState } from "@/redux/store";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import Tabs from "@/components/Tabs";
import ProductCard from "@/components/Product/product";
import ProductSkeleton from "@/components/Product/ProductSkeleton";

export default function HomePage() {
  const dispatch = useDispatch();
  
  // Get data from Redux
  const categoriesList = useSelector((state: RootState) => state.categories.items);
  const productsList = useSelector((state: RootState) => state.products.items);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      let categories: Category[] = categoriesList;
      let products: Product[] = productsList;

      // ✅ If Redux is empty, check Local Storage
      if (categories.length === 0 || products.length === 0) {
        console.log("Redux is empty, checking Local Storage...");
        const cachedCategories = localStorage.getItem("categories");
        const cachedProducts = localStorage.getItem("products");

        if (cachedCategories && cachedProducts) {
          categories = JSON.parse(cachedCategories);
          products = JSON.parse(cachedProducts);
          console.log("Loaded from Local Storage");

          // ✅ Restore to Redux
          dispatch(setCategories(categories));
          dispatch(setProducts(products));
        }
      }

      // ✅ If both Redux and Local Storage are empty, fetch from API
      if (categories.length === 0 || products.length === 0) {
        console.log("Fetching from API...");
        try {
          const categoriesResponse = await fetch("/api/categories");
          categories = await categoriesResponse.json();
          const productsResponse = await fetch("/api/products");
          products = await productsResponse.json();

          // ✅ Save in Redux
          dispatch(setCategories(categories));
          dispatch(setProducts(products));

          // ✅ Save in Local Storage for future use
          localStorage.setItem("categories", JSON.stringify(categories));
          localStorage.setItem("products", JSON.stringify(products));
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }

      // ✅ Set Active Category to First One
      setActiveCategory(categories.length > 0 ? categories[0] : null);
      setLoading(false);
    };

    loadData();
  }, [dispatch, categoriesList, productsList]);

  // ✅ Update filtered products when activeCategory changes
  useEffect(() => {
    if (activeCategory) {
      const filtered = productsList.filter(
        (product) => product.category === activeCategory.category_slug
      );
      setFilteredProducts(filtered);
    }
  }, [activeCategory, productsList]);

  return (
    <section id="products">
      <div className="products-container container">
        {/* Tabs Navigation */}
        {activeCategory && (
          <div className="products-categories">
            <Tabs categories={categoriesList} onCategorySelect={setActiveCategory} />
          </div>
        )}

        {/* Product Display */}
        <div className="product-presentation row mt-3">
          {loading ? (
            <div className="row mt-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="product-presentation row mt-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.product_id} className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p>No products available in this category.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
