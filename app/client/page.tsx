"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import Tabs from "@/components/Tabs";
import ProductCard from "@/components/Product/product";
import ProductSkeleton from "@/components/Product/ProductSkeleton";

export default function HomePage() {
  const [categoriesList, setCategories] = useState<Category[]>([]);
  const [productsList, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const categoriesResponse = await fetch("/api/categories");
        const categories: Category[] = await categoriesResponse.json();
        setCategories(categories);
        setActiveCategory(categories.length > 0 ? categories[0] : null);

        // Fetch Products
        const productsResponse = await fetch("/api/products");
        const products: Product[] = await productsResponse.json();
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update filtered products when activeCategory changes
  useEffect(() => {
    if (activeCategory) {
      console.log("Active Category");
      console.log(activeCategory);
      const filtered = productsList.filter((product) => product.category === activeCategory.category_slug);
      setFilteredProducts(filtered);
    }
  }, [activeCategory, productsList]);

  return (
    <section id="products">
      <div className="products-container container">
        {/* Tabs Navigation */}
        { activeCategory  && (
          <div className="products-categories">
            <Tabs categories={categoriesList} onCategorySelect={setActiveCategory} />
          </div>
          )
        }
        {/* Product Display */}
        <div className="product-presentation row mt-3">
          {loading ? (
          <div className="row mt-3">
            {[...Array(6)].map((_, index) => ( // Render 6 skeletons
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
