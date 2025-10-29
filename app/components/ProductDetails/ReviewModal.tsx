import React from "react";
import { X, Star } from "lucide-react";

interface ReviewModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  hoveredRating: number;
  setHoveredRating: (rating: number) => void;
  handleAddReview: () => void;
}

export default function ReviewModal({ show, setShow, reviewText, setReviewText, rating, setRating, hoveredRating, setHoveredRating, handleAddReview }: ReviewModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center p-8 ">
          <h2 className="text-3xl font-bold text-gray-900">Write your Review</h2>
          <button onClick={() => setShow(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          <div>
            <label className="text-lg font-bold text-gray-900 mb-3 block">Rate</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition"
                >
                  <Star
                    className={`w-10 h-10 ${star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-lg font-bold text-gray-900 mb-3 block">Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-8  rounded-b-lg bg-gray-50">
          <button onClick={() => setShow(false)} className="px-8 py-3 text-gray-900 border-2 border-gray-300 rounded hover:bg-gray-100 font-bold">
            Cancel
          </button>
          <button
            onClick={handleAddReview}
            disabled={!reviewText.trim() || rating === 0}
            className="px-8 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}
