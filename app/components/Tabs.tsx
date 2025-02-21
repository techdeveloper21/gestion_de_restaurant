"use client";
import { Category } from "@/types/category";
import { useState } from "react";

interface TabsProps {
  categories: Category[];
  onCategorySelect: (category: string) => void; // Callback to update active category
}

export default function Tabs({ categories, onCategorySelect }: TabsProps) {
  console.log('hello from tab');
  console.log(categories)
  const [activeTab, setActiveTab] = useState(categories[0].category_name); // Default to first category

  return (
    <ul className="nav nav-underline">
      {categories.map((category) => (
        <li className="nav-item category-item" key={category.category_id}>
          <a
            className={`nav-link category-item-link ${activeTab === category.category_name ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(category.category_name);
              onCategorySelect(category); // Notify parent about the selection
            }}
          >
            {category.category_name}
          </a>
        </li>
      ))}
    </ul>
  );
}

