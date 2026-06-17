import React from 'react';

export default function LoadingSpinner({ label = 'Loading…', fullPage = false }) {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div className="spinner-border" style={{ color: 'var(--primary)' }} role="status">
        <span className="visually-hidden">{label}</span>
      </div>
      <p className="mt-2 text-muted small">{label}</p>
    </div>
  );

  if (fullPage) {
    return <div className="d-flex flex-1 align-items-center justify-content-center" style={{ minHeight: '60vh' }}>{content}</div>;
  }
  return content;
}
