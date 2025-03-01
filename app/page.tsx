"use client";
import { useState } from "react";
import Image from "next/image";
import Tabs from "./components/Tabs";

// Sample product data
const allProducts = [
  { id: 1, name: "Menu Classic", category: "Menus", image: "/images/m1.png" },
  { id: 2, name: "Menu Big", category: "Menus", image: "/images/m2.png" },
  { id: 3, name: "Classic", category: "Burgers", image: "/images/b1.png" },
  { id: 4, name: "Coca-Cola", category: "Boissons", image: "/images/bo1.png" },
  { id: 5, name: "Frites", category: "Snacks", image: "/images/s1.png" },
  { id: 6, name: "Salade", category: "Salades", image: "/images/sa1.png" },
];

export default function Home() {
  const categories = ["Menus", "Burgers", "Snacks", "Salades", "Boissons"];
  const [activeCategory, setActiveCategory] = useState(categories[0]); // Default to "Active"

  // Filter products based on selected category
  const filteredProducts =
    activeCategory === "Active"
      ? allProducts // Show all products for "Active"
      : allProducts.filter((product) => product.category === activeCategory);

  return (
    <section id="products">
      <div className="products-container container">
        {/* Tabs Navigation */}
        <div className="products-categories">
          <Tabs categories={categories} onCategorySelect={setActiveCategory} />
        </div>

        {/* Product List */}
        <div className="products-list row mt-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="col-md-4">
                <div className="card">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={150}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products available in this category.</p>
          )}
        </div>
      </div>
    </section>
  );
}
