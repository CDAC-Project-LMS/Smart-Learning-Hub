import React from 'react';

export default function StarRating({ rating = 0, onChange = null, size = '1rem' }) {
  const stars = [1, 2, 3, 4, 5];
  const isInteractive = typeof onChange === 'function';

  return (
    <span style={{ fontSize: size, color: 'var(--accent-dark)' }}>
      {stars.map((star) => (
        <i
          key={star}
          className={`bi ${star <= Math.round(rating) ? 'bi-star-fill' : 'bi-star'}`}
          style={{ cursor: isInteractive ? 'pointer' : 'default', marginRight: 2 }}
          onClick={() => isInteractive && onChange(star)}
        />
      ))}
    </span>
  );
}
