import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import api, { apiErrorMessage } from '../api/client.js';
import PageLoader from '../components/PageLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import {
  formatDate,
  formatPKR,
  PAYMENT_LABELS,
  STATUS_LABELS,
  STATUS_TONES
} from '../lib/format.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    api
      .get('/orders/mine')
      .then(({ data }) => {
        if (active) setOrders(data.items);
      })
      .catch((requestError) => {
        if (active) setError(apiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>My orders</span>
          </nav>
          <h1>My orders</h1>
          <p>
            Assalam-o-alaikum, {user?.name?.split(' ')[0] || 'friend'}. Everything you have
            ordered, in one place.
          </p>
        </div>
      </section>

      <div className="container orders-page">
        {loading ? (
          <PageLoader label="Fetching your orders…" />
        ) : error ? (
          <div className="inline-error">
            {error}
            <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            text="When you place an order, you will be able to follow its journey right here."
            actionLabel="Start shopping"
            actionTo="/shop"
          />
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const itemCount = order.items.reduce((total, item) => total + item.qty, 0);
              return (
                <article className="order-card" key={order._id}>
                  <header className="order-card-head">
                    <div className="order-id">
                      <span>#{order.orderNumber}</span>
                      <small>Placed {formatDate(order.createdAt)}</small>
                    </div>
                    <span className={`status-badge tone-${STATUS_TONES[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </header>

                  <div className="order-card-body">
                    <div className="order-thumbs">
                      {order.items.slice(0, 3).map((item) => (
                        <Link
                          to={`/product/${item.slug}`}
                          key={`${order._id}-${item.slug}`}
                          className="order-thumb"
                        >
                          <img src={item.image} alt={item.name} />
                        </Link>
                      ))}
                      {order.items.length > 3 && (
                        <span className="order-thumb-more">+{order.items.length - 3}</span>
                      )}
                    </div>

                    <div className="order-card-meta">
                      <strong>
                        {order.items[0]?.name}
                        {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                      </strong>
                      <span>
                        {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
                        {formatPKR(order.totalPrice)} · {PAYMENT_LABELS[order.paymentMethod]}
                      </span>
                      <small>
                        Delivering to {order.shippingAddress.city}, {order.shippingAddress.province}
                      </small>
                    </div>

                    <Link className="btn btn-outline btn-sm" to={`/orders/${order._id}`}>
                      View details <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
