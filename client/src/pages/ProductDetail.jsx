import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Banknote,
  Check,
  MessageCircle,
  RotateCcw,
  ShoppingBag,
  Star,
  Truck
} from 'lucide-react';
import api, { apiErrorMessage } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import RatingStars from '../components/RatingStars.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import PageLoader from '../components/PageLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  discountPercent,
  formatDate,
  formatPKR,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT
} from '../lib/format.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setProduct(null);
    setReviews([]);

    api
      .get(`/products/slug/${slug}`)
      .then(async ({ data }) => {
        if (!active) return;
        setProduct(data.product);
        setQty(1);
        setReviewRating(5);
        setReviewComment('');
        setReviewError('');
        const reviewResponse = await api.get(`/products/${data.product._id}/reviews`);
        if (active) setReviews(reviewResponse.data.items);
      })
      .catch((requestError) => {
        if (active) {
          setError(apiErrorMessage(requestError, 'That product could not be found.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const productId = product?._id;
  const categoryId = product?.category?._id;

  useEffect(() => {
    if (!productId || !categoryId) return undefined;
    let active = true;

    api
      .get('/products', { params: { category: categoryId, limit: 6 } })
      .then(({ data }) => {
        if (!active) return;
        setRelated(data.items.filter((item) => item._id !== productId).slice(0, 4));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [productId, categoryId]);

  if (loading) return <PageLoader label="Opening the product…" />;

  if (error || !product) {
    return (
      <div className="container section">
        <EmptyState
          icon={ShoppingBag}
          title="We could not find that product"
          text={error || 'It may have sold out or moved to another shelf.'}
          actionLabel="Back to the shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const soldOut = product.stock < 1;
  const discount = discountPercent(product);
  const rating = Number(product.rating) || 0;

  const handleAdd = (buyNow = false) => {
    if (soldOut) return;
    addItem(product, qty);
    if (buyNow) {
      navigate('/checkout');
      return;
    }
    toast.success(`${qty} × ${product.name} added to your bag.`);
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setSubmittingReview(true);
    setReviewError('');

    try {
      const { data } = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews((current) => [data.review, ...current]);
      setProduct((current) => ({
        ...current,
        rating: data.rating,
        numReviews: data.numReviews
      }));
      setReviewComment('');
      setReviewRating(5);
      toast.success('Thanks — your review is live.');
    } catch (requestError) {
      setReviewError(apiErrorMessage(requestError, 'Could not submit your review.'));
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <div className="container">
        <nav className="breadcrumbs product-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
            </>
          )}
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-gallery">
            <div className="product-gallery-main">
              <img
                src={product.images?.[0] || '/products/placeholder.svg'}
                alt={product.name}
              />
              {discount > 0 && <span className="gallery-badge">Save {discount}%</span>}
            </div>
            <div className="gallery-note">
              <Check size={15} /> Carefully packed and checked before dispatch
            </div>
          </div>

          <div className="product-detail-info">
            <span className="product-detail-brand">
              {product.brand}
              {product.category && <span>· {product.category.name}</span>}
            </span>
            <h1>{product.name}</h1>

            <div className="product-detail-meta">
              <RatingStars rating={rating} count={product.numReviews} size={16} showValue />
              <a href="#reviews">Read reviews</a>
              <span className={`stock-pill ${soldOut ? 'is-out' : product.stock <= 5 ? 'is-low' : ''}`}>
                {soldOut ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
              </span>
            </div>

            <div className="product-detail-price">
              <span className="price-lg">{formatPKR(product.price)}</span>
              {discount > 0 && <span className="price-was">{formatPKR(product.compareAtPrice)}</span>}
              {discount > 0 && <span className="save-badge">You save {discount}%</span>}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="purchase-box">
              <div className="purchase-row">
                <QuantityStepper
                  value={qty}
                  onChange={setQty}
                  max={Math.max(1, Math.min(20, product.stock))}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-lg purchase-btn"
                  onClick={() => handleAdd(false)}
                  disabled={soldOut}
                >
                  <ShoppingBag size={18} /> Add to bag
                </button>
                <button
                  type="button"
                  className="btn btn-dark btn-lg purchase-btn"
                  onClick={() => handleAdd(true)}
                  disabled={soldOut}
                >
                  Buy now
                </button>
              </div>
              {soldOut ? (
                <p className="stock-note">
                  This one has sold out. Browse the shop for similar finds.
                </p>
              ) : (
                <p className="stock-note">
                  Order today — expected delivery in 3–5 working days.
                </p>
              )}
            </div>

            <ul className="purchase-perks">
              <li>
                <Truck size={17} />
                <span>
                  <strong>Free delivery</strong> on orders over {formatPKR(FREE_SHIPPING_THRESHOLD)}
                </span>
              </li>
              <li>
                <Banknote size={17} />
                <span>
                  <strong>Cash on delivery</strong> · flat {formatPKR(SHIPPING_FLAT)} below the
                  free-delivery threshold
                </span>
              </li>
              <li>
                <RotateCcw size={17} />
                <span>
                  <strong>7-day returns</strong> if something is not quite right
                </span>
              </li>
              <li>
                <MessageCircle size={17} />
                <span>
                  <strong>Need help?</strong> WhatsApp us at 0300 111 2233
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container product-extra-grid">
          <div className="detail-panel">
            <span className="eyebrow">The details</span>
            <h2>Everything you need to know</h2>
            <p className="detail-description">{product.description}</p>
            {product.specs?.length > 0 && (
              <table className="spec-table">
                <tbody>
                  {product.specs.map((spec) => (
                    <tr key={`${spec.label}-${spec.value}`}>
                      <th scope="row">{spec.label}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="detail-panel detail-panel-soft">
            <span className="eyebrow">Delivery & care</span>
            <h2>From our shelf to yours</h2>
            <ul className="detail-list">
              <li>
                <Truck size={18} />
                <span>Dispatched within 24 hours from Lahore or Karachi.</span>
              </li>
              <li>
                <Banknote size={18} />
                <span>COD, Easypaisa, JazzCash and bank transfer are all welcome.</span>
              </li>
              <li>
                <RotateCcw size={18} />
                <span>Unused items can be returned within 7 days of delivery.</span>
              </li>
              <li>
                <MessageCircle size={18} />
                <span>Questions? Our team replies on WhatsApp within a few hours.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-tint" id="reviews">
        <div className="container reviews-layout">
          <div className="reviews-summary">
            <span className="eyebrow">Customer reviews</span>
            <h2>What shoppers are saying</h2>
            <div className="rating-big">
              {rating.toFixed(1)}
              <small>/5</small>
            </div>
            <RatingStars rating={rating} size={18} />
            <p>Based on {product.numReviews} reviews</p>
          </div>

          <div className="reviews-main">
            {user ? (
              <form className="review-form" onSubmit={submitReview}>
                <h3>Share your thoughts</h3>
                <div className="rating-input" role="radiogroup" aria-label="Your rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value <= reviewRating ? 'is-active' : ''}
                      onClick={() => setReviewRating(value)}
                      aria-label={`${value} star${value === 1 ? '' : 's'}`}
                      aria-checked={reviewRating === value}
                      role="radio"
                    >
                      <Star size={22} fill={value <= reviewRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="How did it arrive? How is the quality?"
                  maxLength={600}
                  minLength={3}
                  required
                  rows={3}
                />
                {reviewError && <p className="form-error">{reviewError}</p>}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingReview || reviewComment.trim().length < 3}
                >
                  {submittingReview ? 'Posting…' : 'Post review'}
                </button>
              </form>
            ) : (
              <div className="review-login">
                <p>Sign in to leave a review and help other shoppers.</p>
                <Link
                  className="btn btn-outline"
                  to="/login"
                  state={{ from: location.pathname }}
                >
                  Sign in to review
                </Link>
              </div>
            )}

            <div className="review-list">
              {reviews.length === 0 ? (
                <p className="muted">No written reviews yet — be the first to share.</p>
              ) : (
                reviews.map((review) => (
                  <article className="review-item" key={review._id}>
                    <span className="avatar">{review.name?.charAt(0) || 'D'}</span>
                    <div>
                      <div className="review-head">
                        <strong>{review.name}</strong>
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                      <RatingStars rating={review.rating} size={13} />
                      <p>{review.comment}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2>More from {product.category?.name || 'the bazaar'}</h2>
              </div>
              <Link to={`/shop?category=${product.category?.slug || ''}`} className="text-link">
                View category
              </Link>
            </div>
            <div className="product-grid product-grid-four">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
