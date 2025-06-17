import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        ← Prev
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
