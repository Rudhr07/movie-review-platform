import React from 'react';
import './RatingStars.css';

const RatingStars = ({ value = 0, max = 5, onChange, size = 28, readOnly = false }) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const filled = i <= value;
    stars.push(
      <button
        key={i}
        type="button"
        disabled={readOnly}
        aria-label={`Rate ${i}`}
        onClick={() => !readOnly && onChange && onChange(i)}
        className={`rating-star-btn ${filled ? 'filled' : ''}`}
        style={{ fontSize: size }}
      >
        {filled ? '★' : '☆'}
      </button>
    );
  }
  return <div className="rating-stars" role="radiogroup">{stars}</div>;
};
export default RatingStars;