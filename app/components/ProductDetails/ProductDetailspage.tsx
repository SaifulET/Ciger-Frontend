"use client";
import React, { useState, useEffect } from "react";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductRatingSummary from "./ProductRatingSummary";
import ReviewsSection from "./ReviewSection";
import RelatedProducts from "./RelatedProduct";
import { useProductsStore } from "../../store/productDetailsStore";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [isClient, setIsClient] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);

  const reviewsPerPage = 5;

  // Zustand store
  const {
    currentProduct,
    relatedProducts,
    reviews,
    cartItems,
    loading,
    fetchProductById,
    addToCart,
    setCartItems,
    addReview,
  } = useProductsStore();

  useEffect(() => {
    setIsClient(true);
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  useEffect(() => {
    if (currentProduct?.colors?.[0]) {
      setSelectedColor(currentProduct.colors[0]);
    }
  }, [currentProduct]);

  const handleAddToCart = () => {
    addToCart(quantity);
    setQuantity(1);
  };

  const handleAddReview = () => {
    if (reviewText.trim() && rating > 0) {
      addReview(productId, {
        text: reviewText,
        rating: rating,
      });
      setShowReviewModal(false);
      setReviewText("");
      setRating(5);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-300 h-[500px] rounded"></div>
            <div className="bg-gray-300 h-[500px] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading.product && !currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-[16px] md:mx-[32px]">
      <main className="">

      <div className="flex items-center gap-2 pt-[16px] md:pt-[32px]">
  <Link href="/pages/products">Products</Link>
  <span>&gt;</span>
  <Link href={`/pages/products?sub=${currentProduct.category?.replace(/\s+/g, "")}`}>{currentProduct.category}</Link>
  <span>&gt;</span>
  <Link href={`/pages/products?sub=${currentProduct.category?.replace(/\s+/g, "")}&subPro=${currentProduct.subCategory?.replace(/\s+/g, "")}`}>{currentProduct.subCategory}</Link>
</div>
        {/* Product Section */}
        <div className="pt-[16px] md:pt-[32px] grid grid-cols-1 lg:grid-cols-2 gap-[16px] md:gap-[32px]">
          <ProductImages 
            images={currentProduct.images} 
            currentImageIndex={currentImageIndex} 
            setCurrentImageIndex={setCurrentImageIndex} 
          />
          <ProductInfo
            product={currentProduct}
           
           
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            
          />
        </div>

        {/* Product Description */}
        <ProductDescription description={currentProduct.description} />

        {/* Rating Summary */}
        <ProductRatingSummary 
          averageRating={currentProduct.averageRating} 
          totalReviews={currentProduct.totalReviews} 
          ratingBreakdown={currentProduct.ratingBreakdown}
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
          product={currentProduct}
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
          currentIndex={0} 
          setCurrentIndex={() => {}} 
          
        />
      </main>
    </div>
  );
}