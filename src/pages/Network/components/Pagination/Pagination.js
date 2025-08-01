import React from 'react';
import { PrimaryButton, SecondaryButton } from '../../../general/buttons';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  loading = false,
  showPageNumbers = 5 // How many page numbers to show
}) => {
  if (totalPages <= 1) return null;

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const half = Math.floor(showPageNumbers / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + showPageNumbers - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < showPageNumbers) {
      start = Math.max(1, end - showPageNumbers + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <div className="pagination__info">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="pagination__controls">
        {/* Previous button */}
        <SecondaryButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          size="small"
          className="pagination__nav-btn"
        >
          ← Previous
        </SecondaryButton>
        
        {/* First page if not in range */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={loading}
              className="pagination__page-btn"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="pagination__ellipsis">...</span>}
          </>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`pagination__page-btn ${
              page === currentPage ? 'pagination__page-btn--active' : ''
            }`}
          >
            {page}
          </button>
        ))}
        
        {/* Last page if not in range */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="pagination__ellipsis">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className="pagination__page-btn"
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* Next button */}
        <SecondaryButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          size="small"
          className="pagination__nav-btn"
        >
          Next →
        </SecondaryButton>
      </div>
    </div>
  );
};

export default Pagination;
