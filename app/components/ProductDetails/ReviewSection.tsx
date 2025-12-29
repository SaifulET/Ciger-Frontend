import React from "react";
import { Star } from "lucide-react";
import { Product } from "./product";
import ReviewModal from "./ReviewModal";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Cookies from "js-cookie";

interface ReviewsSectionProps {
  product: Product;
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  hoveredRating: number;
  setHoveredRating: (rating: number) => void;
  currentReviewPage: number;
  setCurrentReviewPage: (page: number) => void;
  reviewsPerPage: number;
  handleAddReview: () => void;
}

export default function ReviewsSection({
  product,
  showReviewModal,
  setShowReviewModal,
  reviewText,
  setReviewText,
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,
  currentReviewPage,
  setCurrentReviewPage,
  reviewsPerPage,
  handleAddReview,
}: ReviewsSectionProps) {
  const isLoggedIn = !!Cookies.get("token");
  
  const totalReviewPages = Math.ceil(product.reviews.length / reviewsPerPage);
  const displayedReviews = product.reviews.slice(
    (currentReviewPage - 1) * reviewsPerPage, 
    currentReviewPage * reviewsPerPage
  );

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      alert("Please login to write a review");
      return;
    }
    setShowReviewModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mt-[16px] md:mt-[32px] p-[16px] md:p-[32px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto text-center md:text-left md:pb-[32px]">
          <h2 className="text-[28px] font-semibold text-gray-900 text-left">Reviews</h2>
          <p className="text-left text-gray-600 mt-1">{product.totalReviews} reviews</p>
        </div>

        <div className="w-full hidden lg:flex justify-start lg:justify-end">
          <button
            onClick={handleWriteReview}
            className="bg-[#C9A040] hover:bg-yellow-700 text-gray-900 text-xs md:text-sm font-semibold leading-[22px] px-3 py-2 md:px-5 md:py-3 rounded-lg flex items-center gap-2"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} /> Write Review
          </button>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 mb-8">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((rev) => (
            <div key={rev.id} className="pb-4 md:pb-6 border-b last:border-b-0">
              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                  <img 
                    src={rev.image} 
                    alt="user" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">{rev.author}</p>
                      <p className="text-[14px] text-gray-600">{rev.location}</p>
                    </div>
                    <p className="text-[14px] text-left text-gray-500 mt-1 md:mt-0">{rev.date}</p>
                  </div>
                  <div className="flex justify-start items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-3 h-3 md:w-4 md:h-4 fill-current" 
                          style={{ opacity: i < rev.rating ? 1 : 0.3 }} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-[14px] leading-relaxed text-left">{rev.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalReviewPages > 1 && (
        <div className="flex justify-center md:justify-start items-center">
          <button
            disabled={currentReviewPage === 1}
            onClick={() => setCurrentReviewPage(currentReviewPage - 1)}
            className="w-7 h-7 md:w-8 md:h-8 mr-2 flex items-center justify-center border rounded-full text-gray-600 disabled:opacity-50 hover:bg-gray-100"
          >
            &lt;
          </button>

          {[...Array(totalReviewPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReviewPage(index + 1)}
              className={`w-7 h-7 md:w-8 md:h-8 mr-2 flex items-center justify-center border rounded-lg ${
                currentReviewPage === index + 1 
                  ? "bg-[#D5A23E] text-white border-[#D5A23E]" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentReviewPage === totalReviewPages}
            onClick={() => setCurrentReviewPage(currentReviewPage + 1)}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border rounded-full text-gray-600 disabled:opacity-50 hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      )}

      {/* Modal */}
      <ReviewModal
        show={showReviewModal}
        setShow={setShowReviewModal}
        reviewText={reviewText}
        setReviewText={setReviewText}
        rating={rating}
        setRating={setRating}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        handleAddReview={handleAddReview}
      />
    </div>
  );
}