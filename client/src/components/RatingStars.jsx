import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, count, size = 14, showValue = false }) {
  const rounded = Math.round(rating);

  return (
    <span className="stars" title={`${Number(rating).toFixed(1)} out of 5 stars`}>
      <span className="stars-icons" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rounded ? 'star-filled' : 'star-empty'}
            fill={star <= rounded ? 'currentColor' : 'none'}
            strokeWidth={1.6}
          />
        ))}
      </span>
      {showValue && <span className="stars-value">{Number(rating).toFixed(1)}</span>}
      {count !== undefined && count !== null && <span className="stars-count">({count})</span>}
    </span>
  );
}
