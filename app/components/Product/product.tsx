import React from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import "./product.css";
import Link from "next/link"; // Import Link from Next.js


interface ProductProps {
  product: Product;
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="thumbnail">
      {/* Product Image */}
      {product.images.length > 0 && (
        <Image
          src={`data:image/png;base64,${product.images[0].image}`}
          alt={product.product_name}
          className="product-img"
          priority // Ensures the image loads quickly for better performance
        />
      )}
        <div className="price">${product.price}DA</div>
        <div className="caption">
            <h4>{product.product_name}</h4>
            <p>{product.description}</p>
            <Link href={`/client/product/${product.product_slug}`} className="btn btn-order btn-add-to-cart">
                <span className="fa fa-shopping-cart"></span> 
                Commander
            </Link>
        </div>
    </div>
  );
};

export default ProductCard;
