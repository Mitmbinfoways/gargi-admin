import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return {
      pages: Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i),
      startPage,
      endPage,
    };
  };

  const { pages, endPage } = getPageNumbers();

  return (
    <nav className="p-1 flex justify-center text-black items-center space-x-2 rounded-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="disabled:opacity-50 hover:bg-blue-100 p-2 rounded-full transition"
      >
        &lt;
      </button>

      {/* First Page Button */}
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-full ${currentPage === 1 ? "bg-blue-600 text-white" : "hover:bg-blue-100"
              }`}
          >
            1
          </button>
          {pages[0] > 2 && <span className="text-gray-400">...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-full ${currentPage === page ? "bg-blue-600 text-white" : "hover:bg-blue-100"
            }`}
        >
          {page}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-full ${currentPage === totalPages ? "bg-blue-600 text-white" : "hover:bg-blue-100"
              }`}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="disabled:opacity-50 hover:bg-blue-100 p-2 rounded-full transition"
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
