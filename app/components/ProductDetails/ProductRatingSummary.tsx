import React from "react";
import { Star } from "lucide-react";
import ReviewModal from "./ReviewModal";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ProductRatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  hoveredRating: number;
  setHoveredRating: (rating: number) => void;
 
  reviewsPerPage: number;
  handleAddReview: () => void;
}

export default function ProductRatingSummary({ averageRating, totalReviews, ratingBreakdown,setShowReviewModal,showReviewModal,reviewText,
  setReviewText,
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,handleAddReview, }: ProductRatingSummaryProps) {
  return (
   <div className="p-[16px] md:p-[32px] mt-[16px] md:mt-[32px] bg-white rounded-lg shadow-sm  flex flex-col md:flex-col lg:flex-row gap-6 md:gap-10 lg:gap-8">

  {/* Left Section */}
  <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-end gap-6 md:gap-8 w-full lg:w-2/5">

    {/* Average Rating */}
    <div className="text-center lg:text-left">
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
        {averageRating.toFixed(1)}
        <p className="text-xs md:text-sm text-gray-600 mt-2">Based on {totalReviews} reviews</p>
      </div>
      <div className="flex justify-center lg:justify-start text-yellow-400 gap-1.5 mt-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" style={{ opacity: i < Math.floor(averageRating) ? 1 : 0.3 }} />
        ))}
      </div>
    </div>

    {/* Rating Bars */}
    <div className="flex-1 w-full space-y-2 mt-4 md:mt-0">
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = ratingBreakdown[stars] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return (
          <div key={stars} className="flex items-center gap-3">
            <span className="text-xs md:text-sm font-semibold text-gray-700 w-6 md:w-8">{stars} ★</span>
            <div className="flex-1 h-4 md:h-6 bg-gray-200 rounded">
              <div className="h-full bg-yellow-400 rounded" style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-xs md:text-sm text-gray-600 w-6 md:w-8 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  </div>

  {/* Right Section */}
  <div className="w-full lg:w-2/5 text-center  ">
    <div className="flex justify-center  w-full mt-6 md:mt-10 lg:mt-16 text-gray-700 text-sm md:text-base">
      Hi, steve your opinion helps us serve better
    </div>
    <div className="flex justify-center  w-full">
      <button
        onClick={() => setShowReviewModal(true)}
        className="bg-[#C9A040] hover:bg-yellow-700 text-gray-900 text-xs md:text-sm font-semibold leading-[22px] px-4 md:px-6 py-2 md:py-3 rounded-lg mt-4 flex items-center gap-2"
      >
        <HugeiconsIcon icon={PencilEdit02Icon} /> Write Review
      </button>
    </div>

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
</div>

  );
}
