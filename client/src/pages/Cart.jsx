import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck
} from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  formatPKR,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT
} from '../lib/format.js';

export default function Cart() {
  const { items, setQty, removeItem, clearCart, subtotal, count } = useCart();
  const toast = useToast();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleRemove = (item) => {
    removeItem(item._id);
    toast.info(`${item.name} removed from your bag.`);
  };

  const handleClear = () => {
    if (!window.confirm('Remove everything from your bag?')) return;
    clearCart();
    toast.info('Your bag is now empty.');
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Your bag</span>
          </nav>
          <h1>Your bag</h1>
          <p>{count > 0 ? `${count} item${count === 1 ? '' : 's'} ready for checkout.` : 'A few lovely things are waiting.'}</p>
        </div>
      </section>

      <div className="container cart-layout">
        <div className="cart-main">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your bag is empty"
              text="Browse the bazaar and add something lovely — lawn, chappals, attar, or a good cup of chai."
              actionLabel="Start shopping"
              actionTo="/shop"
            />
          ) : (
            <>
              <div className="cart-head-row">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>

              {items.map((item) => (
                <article className="cart-row" key={item._id}>
                  <div className="cart-product">
                    <Link to={`/product/${item.slug}`} className="cart-thumb">
                      <img src={item.image} alt={item.name} />
                    </Link>
                    <div className="cart-product-copy">
                      <span className="product-brand">{item.brand}</span>
                      <Link to={`/product/${item.slug}`} className="cart-name">
                        {item.name}
                      </Link>
                      <span className="cart-unit">{formatPKR(item.price)} each</span>
                      {item.stock <= 5 && (
                        <span className="cart-low">Only {item.stock} left in stock</span>
                      )}
                    </div>
                  </div>

                  <div className="cart-qty">
                    <QuantityStepper
                      value={item.qty}
                      onChange={(nextQty) => setQty(item._id, nextQty)}
                      max={Math.min(item.stock, 20)}
                    />
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => handleRemove(item)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <div className="cart-line-total">{formatPKR(item.price * item.qty)}</div>
                </article>
              ))}

              <div className="cart-actions">
                <Link className="btn btn-ghost" to="/shop">
                  <ArrowLeft size={16} /> Continue shopping
                </Link>
                <button type="button" className="btn btn-ghost" onClick={handleClear}>
                  Clear bag
                </button>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <aside className="summary-card">
            <h2>Order summary</h2>

            <div className="summary-row">
              <span>Subtotal ({count} items)</span>
              <strong>{formatPKR(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>{shipping === 0 ? 'Free' : formatPKR(shipping)}</strong>
            </div>

            <div className="free-shipping">
              <Truck size={18} />
              <div>
                <p>
                  {remaining > 0
                    ? `Add ${formatPKR(remaining)} more for free delivery.`
                    : 'You have unlocked free delivery.'}
                </p>
                <div className="free-shipping-track">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPKR(subtotal + shipping)}</strong>
            </div>

            <Link className="btn btn-primary btn-lg btn-block" to="/checkout">
              Proceed to checkout <ArrowRight size={17} />
            </Link>

            <p className="summary-note">
              <ShieldCheck size={15} /> Secure checkout · Pay online or cash on delivery
            </p>
          </aside>
        )}
      </div>
    </>
  );
}
