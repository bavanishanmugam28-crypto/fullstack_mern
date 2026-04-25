import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

function Pagination({ totalPages, currentPage, setPage }) {
  // 1. Don't render anything if there's only 1 page (or 0)
  if (!totalPages || totalPages <= 1) return null;

  // 2. Smart Pagination Logic (handles the "..." truncation)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // How many numbers to show at once

    if (totalPages <= maxVisiblePages + 2) {
      // If total pages is small, show all of them (e.g., 1 2 3 4 5)
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // If we are near the beginning (e.g., 1 2 3 4 ... 20)
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      }
      // If we are near the end (e.g., 1 ... 17 18 19 20)
      else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      }
      // If we are in the middle (e.g., 1 ... 8 9 10 ... 20)
      else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  return (
    <nav
      aria-label="Product pagination"
      className="mt-5 mb-4 d-flex justify-content-center"
    >
      <ul className="pagination pagination-md align-items-center gap-2 m-0">
        {/* --- PREVIOUS BUTTON --- */}
        <li
          className={`page-item ${currentPage === 1 ? "disabled opacity-50" : ""}`}
        >
          <button
            className="page-link border-0 shadow-sm rounded-circle d-flex align-items-center justify-content-center text-primary"
            style={{ width: "40px", height: "40px" }}
            onClick={handlePrev}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        </li>

        {/* --- PAGE NUMBERS --- */}
        {getPageNumbers().map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? "active" : ""}`}
          >
            {page === "..." ? (
              // Ellipsis display
              <span
                className="page-link border-0 bg-transparent text-muted px-2 d-flex align-items-end justify-content-center"
                style={{ width: "35px", height: "40px" }}
              >
                <MoreHorizontal size={18} className="mb-1" />
              </span>
            ) : (
              // Clickable page numbers
              <button
                className={`page-link border-0 shadow-sm rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-secondary hover-primary"
                }`}
                style={{ width: "40px", height: "40px", fontSize: "0.95rem" }}
                onClick={() => setPage(page)}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* --- NEXT BUTTON --- */}
        <li
          className={`page-item ${currentPage === totalPages ? "disabled opacity-50" : ""}`}
        >
          <button
            className="page-link border-0 shadow-sm rounded-circle d-flex align-items-center justify-content-center text-primary"
            style={{ width: "40px", height: "40px" }}
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
