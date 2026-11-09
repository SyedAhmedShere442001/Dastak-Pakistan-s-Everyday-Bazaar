import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  MapPin,
  MessageCircle,
  Phone
} from 'lucide-react';
import api, { apiErrorMessage } from '../api/client.js';
import PageLoader from '../components/PageLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import {
  formatDate,
  formatDateTime,
  formatPKR,
  ORDER_TIMELINE,
  PAYMENT_LABELS,
  STATUS_LABELS,
  STATUS_TONES
} from '../lib/format.js';

const DAY = 24 * 60 * 60 * 1000;

function OrderTimeline({ order }) {
  if (order.status === 'cancelled') {
    const cancelled = order.statusHistory.find((event) => event.status === 'cancelled');
    return (
      <div className="cancel-banner">
        <CircleAlert size={20} />
        <div>
          <strong>This order was cancelled</strong>
          <span>
            {cancelled ? `Cancelled on ${formatDateTime(cancelled.at)}` : 'No payment was taken.'}
          </span>
        </div>
      </div>
    );
  }

  const events = new Map(order.statusHistory.map((event) => [event.status, event.at]));

  return (
    <ol className="order-timeline">
      {ORDER_TIMELINE.map((status, index) => {
        const at = events.get(status);
        const done = Boolean(at);
        const current = order.status === status;
        return (
          <li key={status} className={`${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}>
            <span className="timeline-dot">{done ? <Check size={12} /> : index + 1}</span>
            <div>
              <strong>{STATUS_LABELS[status]}</strong>
              <small>{at ? formatDateTime(at) : 'Pending'}</small>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const justPlaced = searchParams.get('placed') === '1';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    api
      .get(`/orders/${id}`)
      .then(({ data }) => {
        if (active) setOrder(data.order);
      })
      .catch((requestError) => {
        if (active) setError(apiErrorMessage(requestError, 'That order could not be found.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <PageLoader label="Opening your order…" />;

  if (error || !order) {
    return (
      <div className="container section">
        <EmptyState
          icon={MapPin}
          title="We could not open that order"
          text={error || 'Please check the link or head back to your orders.'}
          actionLabel="Back to my orders"
          actionTo="/orders"
        />
      </div>
    );
  }

  const itemCount = order.items.reduce((total, item) => total + item.qty, 0);
  const eta = new Date(new Date(order.createdAt).getTime() + 5 * DAY);
  const deliverable = !['delivered', 'cancelled'].includes(order.status);

  const paymentStatus = order.isPaid
    ? order.paymentMethod === 'cod'
      ? 'Paid on delivery'
      : 'Payment received'
    : order.status === 'cancelled'
      ? 'No payment taken'
      : order.paymentMethod === 'cod'
        ? 'Pay on delivery'
        : 'Awaiting payment';

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/orders">My orders</Link>
            <span>/</span>
            <span>#{order.orderNumber}</span>
          </nav>
          <div className="page-header-row">
            <div>
              <h1>Order #{order.orderNumber}</h1>
              <p>
                Placed {formatDateTime(order.createdAt)} · {itemCount} item
                {itemCount === 1 ? '' : 's'}
              </p>
            </div>
            <span className={`status-badge tone-${STATUS_TONES[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
        </div>
      </section>

      <div className="container order-detail-layout">
        <div className="order-detail-main">
          {justPlaced && (
            <div className="success-banner">
              <span className="success-icon">
                <CheckCircle2 size={24} />
              </span>
              <div>
                <h2>Shukriya — your order is in!</h2>
                <p>
                  We have noted your order and will call {order.shippingAddress.phone} to confirm.
                  Keep your phone nearby.
                </p>
              </div>
            </div>
          )}

          <section className="detail-panel">
            <div className="panel-heading-row">
              <h2>Order status</h2>
              {deliverable && (
                <span className="eta-pill">
                  <Clock3 size={14} /> Expected by {formatDate(eta)}
                </span>
              )}
            </div>
            <OrderTimeline order={order} />
          </section>

          <section className="detail-panel">
            <div className="panel-heading-row">
              <h2>Items in this order</h2>
              <span className="muted">{itemCount} items</span>
            </div>
            <ul className="order-items-list">
              {order.items.map((item) => (
                <li key={`${order._id}-${item.slug}`}>
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-copy">
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    <small>
                      {item.brand} · Qty {item.qty} · {formatPKR(item.price)} each
                    </small>
                  </div>
                  <strong>{formatPKR(item.price * item.qty)}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="order-help">
            <MessageCircle size={20} />
            <div>
              <strong>Need to change something?</strong>
              <p>
                Message us on WhatsApp at <a href="tel:03001112233">0300 111 2233</a> or email{' '}
                <a href="mailto:salam@dastak.pk">salam@dastak.pk</a> with your order number.
              </p>
            </div>
          </section>
        </div>

        <aside className="order-sidebar">
          <section className="summary-card">
            <h2>Delivery address</h2>
            <address>
              <strong>{order.shippingAddress.fullName}</strong>
              <span>{order.shippingAddress.street}</span>
              <span>
                {order.shippingAddress.city}, {order.shippingAddress.province}
                {order.shippingAddress.postalCode
                  ? ` ${order.shippingAddress.postalCode}`
                  : ''}
              </span>
              <span className="address-phone">
                <Phone size={14} /> {order.shippingAddress.phone}
              </span>
            </address>
          </section>

          <section className="summary-card">
            <h2>Payment</h2>
            <div className="payment-summary-row">
              <span>{PAYMENT_LABELS[order.paymentMethod]}</span>
              <span className={`pay-badge ${order.isPaid ? 'is-paid' : 'is-unpaid'}`}>
                {paymentStatus}
              </span>
            </div>

            <div className="summary-row">
              <span>Items</span>
              <strong>{formatPKR(order.itemsPrice)}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>{order.shippingPrice === 0 ? 'Free' : formatPKR(order.shippingPrice)}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPKR(order.totalPrice)}</strong>
            </div>

            {order.notes && (
              <div className="order-notes">
                <span>Order note</span>
                <p>{order.notes}</p>
              </div>
            )}
          </section>

          <Link className="btn btn-outline btn-block" to="/orders">
            Back to my orders
          </Link>
        </aside>
      </div>
    </>
  );
}
