"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";
import Image from "next/image";
import "./productDetails.css";
import Link from "next/link";

export default function ProductDetails() {
  const { slug } = useParams(); // ✅ Correct way for App Router
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="container product-details-container">
        <div className="product-details-presnetation row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 product-details-presnetation-cart">
                <div className="product-images">
                    <Image
                      src={`data:image/png;base64,${product.images[0]?.image}`}
                      alt={product.product_name}
                      width={400}
                      height={400}
                    />
                    <div className="image-carousel">
                      {product.images.map((img, index) => (
                        <Image
                          key={index}
                          src={`data:image/png;base64,${img.image}`}
                          alt={product.product_name}
                          width={80}
                          height={80}
                          className="thumbnail-img"
                        />
                      ))}
                    </div>
                </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 product-details-presnetation-cart">
                <div className="product-info">
                    <h1>{product.product_name}</h1>
                    <p>{product.description}</p>
                    <div className="price">{product.price}DA</div>
                    <div className="quantity-selector">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <input 
                          value={quantity} 
                          type="text" 
                          className="input-qunatity" 
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 1;
                            setQuantity(newValue > 0 ? newValue : 1);
                          }} 
                        />
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <div className="actions">
                        <div className="action validat-action">
                            <button className="btn btn-success validate-btn"><i className="fa-solid fa-check"></i>Validate</button>
                        </div>
                        <div className="action back-action">
                            <Link href="/client">
                              <button className="btn btn-secondary validate-btn">
                                <i className="fa-solid fa-arrow-left"></i> 
                                Back
                              </button>
                            </Link>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
