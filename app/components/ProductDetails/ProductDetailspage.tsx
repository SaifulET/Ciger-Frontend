"use client";
import React, { useState, useEffect } from "react";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductRatingSummary from "./ProductRatingSummary";
import ReviewsSection from "./ReviewSection";
import RelatedProducts from "./RelatedProduct";
import { Product, RelatedProduct } from "./product";

// Move mock data outside component to avoid regeneration
const mockReviews = Array(26)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    author: "Sarah Rodriguez",
    location: "New York, USA",
    rating: 5,
    date: "15 days ago", // Fixed date instead of random
    text: "This tastes like professional-grade, and tastes really smooth with my lungs. Highly recommended!"
  }));

const product: Product = {
  id: 1,
  brand: "Good Stuff",
  name: "Red Pipe Tobacco",
  title: "Good Stuff Red Pipe Tobacco",
  price: 19.97,
  originalPrice: 24.99,
  inStock: true,
  newArrival: false,
  bestSeller: true,
  images: ["https://www.smoke-king.co.uk/cdn/shop/files/3lhu0xaylcd.jpg?v=1715968268&width=360", "https://www.smoke-king.co.uk/cdn/shop/files/tp2wcc2x0bl.jpg?v=1716906307&width=360", "https://www.smoke-king.co.uk/cdn/shop/files/lqnt4yywaq2.jpg?v=1716906474&width=360"],
  colors: ["Red", "Black", "Brown", "Blue"],
  description: "A rich blend of premium pipe tobacco. Enjoy smooth and flavorful smoking experience.",
  reviews: mockReviews,
  totalReviews: 26,
  averageRating: 4.9,
  ratingBreakdown: { 5: 20, 4: 5, 3: 0, 2: 0, 1: 1 }
};

const relatedProducts: RelatedProduct[] = [
  { id: 1, brand: "Good Stuff", name: "Red Pipe Tobacco - 11 oz Bag", image: "https://www.smoke-king.co.uk/cdn/shop/files/3lhu0xaylcd.jpg?v=1715968268&width=360", currentPrice: "12.99", originalPrice: "15.99", newBestSeller: true },
  { id: 2, brand: "Good Stuff", name: "Red Pipe Tobacco - 11 oz Bag", image: "https://www.smoke-king.co.uk/cdn/shop/files/3lhu0xaylcd.jpg?v=1715968268&width=360", currentPrice: "12.99" },
  { id: 3, brand: "Good Stuff", name: "Red Pipe Tobacco - 11 oz Bag", image: "https://www.smoke-king.co.uk/cdn/shop/files/3lhu0xaylcd.jpg?v=1715968268&width=360", currentPrice: "12.99" },
  { id: 4, brand: "Good Stuff", name: "Red Pipe Tobacco - 11 oz Bag", image: "https://www.smoke-king.co.uk/cdn/shop/files/3lhu0xaylcd.jpg?v=1715968268&width=360", currentPrice: "12.99" },
  { id: 5, brand: "Good Stuff", name: "Red Pipe Tobacco - 11 oz Bag", image: "https://www.smoke-king.co.uk/cdn/shop/files/3lhu0xaylcd.jpg?v=1715968268&width=360", currentPrice: "12.99" },
  { id: 6, brand: "Good Stuff", name: "Red Pipe Tobacco - 11 oz Bag", image: "https://www.smoke-king.co.uk/cdn/shop/files/3lhu0xaylcd.jpg?v=1715968268&width=360", currentPrice: "12.99" }
];

export default function ProductDetailPage() {
  const [isClient, setIsClient] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState(0);

  // Product States
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Red");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Review States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = 5;

  // Related products carousel
  const [relatedIndex, setRelatedIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToCart = () => {
    setCartItems(cartItems + quantity);
    setQuantity(1);
  };

  const handleAddReview = () => {
    if (reviewText.trim() && rating > 0) {
      setShowReviewModal(false);
      setReviewText("");
      setRating(0);
    }
  };

  // Prevent hydration by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen px-[42px] py-8 m-10">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-300 h-[500px] rounded"></div>
            <div className="bg-gray-300 h-[500px] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="px-[10px] md:px-[42px] py-8 space-y-12 md:m-10">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImages 
            images={product.images} 
            currentImageIndex={currentImageIndex} 
            setCurrentImageIndex={setCurrentImageIndex} 
          />
          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            handleAddToCart={handleAddToCart}
          />
        </div>

        {/* Product Description */}
        <ProductDescription description={product.description} />

        {/* Rating Summary */}
        <ProductRatingSummary 
          averageRating={product.averageRating} 
          totalReviews={product.totalReviews} 
          ratingBreakdown={product.ratingBreakdown}
          showReviewModal={showReviewModal}
          setShowReviewModal={setShowReviewModal}
          reviewText={reviewText}
          setReviewText={setReviewText}
          rating={rating}
          setRating={setRating}
          hoveredRating={hoveredRating}
          setHoveredRating={setHoveredRating}
          reviewsPerPage={reviewsPerPage}
          handleAddReview={handleAddReview} 
        />

        {/* Reviews */}
        <ReviewsSection
          product={product}
          showReviewModal={showReviewModal}
          setShowReviewModal={setShowReviewModal}
          reviewText={reviewText}
          setReviewText={setReviewText}
          rating={rating}
          setRating={setRating}
          hoveredRating={hoveredRating}
          setHoveredRating={setHoveredRating}
          currentReviewPage={currentReviewPage}
          setCurrentReviewPage={setCurrentReviewPage}
          reviewsPerPage={reviewsPerPage}
          handleAddReview={handleAddReview}
        />

        {/* Related Products */}
        <RelatedProducts 
          relatedProducts={relatedProducts} 
          currentIndex={relatedIndex} 
          setCurrentIndex={setRelatedIndex}
          onAddCart={()=>{}} 
        />
      </main>
    </div>
  );
}