import React from "react";
import "./product.css"; // Keep existing styles

const ProductSkeleton = () => {
  return (
    <div className="thumbnail skeleton">
      <div className="skeleton-img"></div>
      <div className="skeleton-price"></div>
      <div className="caption">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-description"></div>
        <div className="skeleton-text skeleton-description"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
