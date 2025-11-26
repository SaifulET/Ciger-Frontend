"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate which 4 pages to show
  const getVisiblePages = () => {
    if (totalPages <= 4) {
      // If total pages is 4 or less, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate start page to show 4 pages around current page
    let startPage = currentPage - 1;
    
    // Adjust if we're near the beginning
    if (currentPage <= 2) {
      startPage = 1;
    }
    // Adjust if we're near the end
    else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 3;
    }

    // Ensure we don't go below page 1
    startPage = Math.max(1, startPage);
    
    // Ensure we don't go beyond total pages
    const endPage = Math.min(totalPages, startPage + 3);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-8 h-8 flex items-center justify-center border rounded-full text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        &lt;
      </button>

      {/* Show only 4 pages */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center border rounded-lg transition-colors ${
            currentPage === page 
              ? "bg-[#C9A040] text-white" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-8 h-8 flex items-center justify-center border rounded-full text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;