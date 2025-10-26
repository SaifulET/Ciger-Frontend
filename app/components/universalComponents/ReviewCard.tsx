"use client";

import Image from "next/image";
import quoteIcon from "@/public/doubleQuote.svg";
import starIcon from "@/public/star.svg";

interface Review {
  image: string;
  name: string;
  review: string;
  location: string;
  rating: number;
}

interface ReviewCardProps {
  Review:Review ;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ Review }) => {
  const { image , name, review, location,rating } = Review;

  return (
     <div className="flex flex-col items-start px-[24px] py-[12px] gap-3 w-[362.67px] h-[172px] bg-[#F5F5F5] rounded-[12px]">
      {/* Quote Icon */}
      <Image src={quoteIcon} alt="quote" width={24} height={24} />

      {/* Review Text */}
      <p className="text-sm text-gray-700">{review}</p>

      {/* Bottom Section */}
      <div className="flex items-center justify-between w-full">
        {/* Avatar + Name */}
        <div className="flex items-center gap-2">
          <Image
            src={image}
            alt={name}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-gray-400">{location}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Image src={starIcon} alt="star" width={16} height={16} /> {/* star from local */}
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
