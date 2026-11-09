import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import RatingStars from './RatingStars.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { discountPercent, formatPKR } from '../lib/format.js';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();
  const discount = discountPercent(product);
  const soldOut = product.stock < 1;

  const handleQuickAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (soldOut) return;
    addItem(product, 1);
    toast.success(`${product.name} added to your bag.`);
  };

  return (
    <article className="product-card">
      <div className="product-media">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <img
            src={product.images?.[0] || '/products/placeholder.svg'}
            alt={product.name}
            loading="lazy"
          />
        </Link>
        <div className="product-badges">
          {soldOut && <span className="badge badge-danger">Sold out</span>}
          {!soldOut && discount > 0 && <span className="badge badge-dark">-{discount}%</span>}
          {!soldOut && product.featured && <span className="badge badge-accent">Bestseller</span>}
        </div>
        {!soldOut && (
          <button
            type="button"
            className="quick-add"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to bag`}
            title="Quick add to bag"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <Link to={`/product/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-rating">
          <RatingStars rating={product.rating} count={product.numReviews} />
        </div>
        <div className="product-price-row">
          <span className="price">{formatPKR(product.price)}</span>
          {discount > 0 && <span className="price-was">{formatPKR(product.compareAtPrice)}</span>}
        </div>
      </div>
    </article>
  );
}
