import React from 'react';

export default function Pagination({ pageNumber, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center mt-4">
        <li className={`page-item ${pageNumber === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(pageNumber - 1)}>
            Previous
          </button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === pageNumber ? 'active' : ''}`}>
            <button
              className="page-link"
              style={p === pageNumber ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
              onClick={() => onPageChange(p)}
            >
              {p + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${pageNumber >= totalPages - 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(pageNumber + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
