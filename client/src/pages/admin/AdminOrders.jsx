import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ClipboardList, Eye, Search, X } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client.js';
import PageLoader from '../../components/PageLoader.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  formatDate,
  formatPKR,
  PAYMENT_LABELS,
  STATUS_LABELS,
  STATUS_TONES
} from '../../lib/format.js';
import AdminPager from './AdminPager.jsx';

const STATUS_OPTIONS = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const toast = useToast();

  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ items: [], total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [updatingId, setUpdatingId] = useState('');
  const [pendingCancel, setPendingCancel] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setKeyword(keywordInput.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [keywordInput]);

  useEffect(() => {
    setPage(1);
  }, [keyword, status]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    api
      .get('/orders/admin', {
        params: {
          keyword: keyword || undefined,
          status: status || undefined,
          page,
          limit: 20
        }
      })
      .then(({ data: response }) => {
        if (active) setData(response);
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
  }, [keyword, status, page, reloadKey]);

  const applyOrderUpdate = (orderId, patch) => {
    setData((current) => ({
      ...current,
      items: current.items.map((order) =>
        order._id === orderId ? { ...order, ...patch } : order
      )
    }));
  };

  const patchOrder = async (order, payload, successMessage) => {
    setUpdatingId(order._id);
    try {
      const { data: response } = await api.patch(`/orders/${order._id}/status`, payload);
      applyOrderUpdate(order._id, {
        status: response.order.status,
        isPaid: response.order.isPaid,
        paidAt: response.order.paidAt,
        statusHistory: response.order.statusHistory
      });
      toast.success(successMessage);
      return true;
    } catch (requestError) {
      toast.error(apiErrorMessage(requestError, 'Could not update that order.'));
      return false;
    } finally {
      setUpdatingId('');
    }
  };

  const handleStatusChange = (order, nextStatus) => {
    if (nextStatus === order.status) return;

    if (nextStatus === 'cancelled') {
      setPendingCancel({ order, nextStatus });
      return;
    }

    patchOrder(
      order,
      { status: nextStatus },
      `Order #${order.orderNumber} marked ${STATUS_LABELS[nextStatus].toLowerCase()}.`
    );
  };

  const handleCancelConfirm = async () => {
    if (!pendingCancel) return;
    const { order, nextStatus } = pendingCancel;
    const updated = await patchOrder(
      order,
      { status: nextStatus },
      `Order #${order.orderNumber} cancelled and stock restored.`
    );
    if (updated) setPendingCancel(null);
  };

  const togglePaid = (order) =>
    patchOrder(
      order,
      { isPaid: !order.isPaid },
      order.isPaid
        ? `Order #${order.orderNumber} marked unpaid.`
        : `Payment recorded for #${order.orderNumber}.`
    );

  const hasFilters = Boolean(keyword || status);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Orders</h1>
          <p>
            {loading
              ? 'Loading the order book…'
              : `${data.total} order${data.total === 1 ? '' : 's'} in this view`}
          </p>
        </div>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={16} />
          <input
            type="search"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="Search order number, name, phone or city…"
          />
          {keywordInput && (
            <button
              type="button"
              onClick={() => setKeywordInput('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </label>

        <select
          className="admin-select"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {STATUS_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="inline-error">
          {error}
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Try again
          </button>
        </div>
      ) : loading ? (
        <PageLoader label="Fetching the order book…" />
      ) : data.items.length === 0 ? (
        <div className="admin-empty">
          <ClipboardList size={30} />
          <h2>{hasFilters ? 'No orders matched' : 'No orders yet'}</h2>
          <p>
            {hasFilters
              ? 'Try another status, or clear the search.'
              : 'New orders will appear here the moment a shopper checks out.'}
          </p>
          {hasFilters && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setKeywordInput('');
                setStatus('');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="admin-table admin-table-orders">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => {
                  const itemCount = order.items.reduce((total, item) => total + item.qty, 0);
                  const busy = updatingId === order._id;
                  return (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/orders/${order._id}`} className="table-link">
                          #{order.orderNumber}
                        </Link>
                        <small className="table-sub">{formatDate(order.createdAt)}</small>
                      </td>
                      <td>
                        <strong className="table-strong">
                          {order.user?.name || order.shippingAddress.fullName}
                        </strong>
                        <small className="table-sub">
                          {order.shippingAddress.city} · {order.shippingAddress.phone}
                        </small>
                      </td>
                      <td>
                        <div className="table-thumbs">
                          {order.items.slice(0, 3).map((item) => (
                            <img
                              key={`${order._id}-${item.slug}`}
                              src={item.image}
                              alt={item.name}
                              title={item.name}
                            />
                          ))}
                          {order.items.length > 3 && <span>+{order.items.length - 3}</span>}
                        </div>
                        <small className="table-sub">
                          {itemCount} item{itemCount === 1 ? '' : 's'}
                        </small>
                      </td>
                      <td>
                        <strong className="table-strong">{formatPKR(order.totalPrice)}</strong>
                      </td>
                      <td>
                        <span className="payment-label">{PAYMENT_LABELS[order.paymentMethod]}</span>
                        {order.status !== 'cancelled' ? (
                          <button
                            type="button"
                            className={`pay-toggle ${order.isPaid ? 'is-paid' : ''}`}
                            onClick={() => togglePaid(order)}
                            disabled={busy}
                            title={order.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                          >
                            {order.isPaid ? 'Paid' : 'Mark paid'}
                          </button>
                        ) : (
                          <span className="pay-badge is-unpaid">No payment</span>
                        )}
                      </td>
                      <td>
                        <select
                          className={`status-select tone-${STATUS_TONES[order.status]}`}
                          value={order.status}
                          onChange={(event) => handleStatusChange(order, event.target.value)}
                          disabled={busy || order.status === 'cancelled'}
                          aria-label={`Status for order ${order.orderNumber}`}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {STATUS_LABELS[option]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link
                            to={`/orders/${order._id}`}
                            className="table-icon-btn"
                            title="Open order"
                            aria-label={`Open order ${order.orderNumber}`}
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <AdminPager page={page} pages={data.pages} total={data.total} onChange={setPage} />
        </>
      )}

      {pendingCancel && (
        <div
          className="confirm-backdrop"
          role="presentation"
          onClick={() => (updatingId ? null : setPendingCancel(null))}
        >
          <div
            className="confirm-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="confirm-icon">
              <AlertTriangle size={22} />
            </span>
            <h2 id="cancel-order-title">Cancel this order?</h2>
            <p>
              Order <strong>#{pendingCancel.order.orderNumber}</strong> will be marked cancelled and
              its items returned to stock. The customer is not refunded automatically.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setPendingCancel(null)}
                disabled={Boolean(updatingId)}
              >
                Keep order
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancelConfirm}
                disabled={Boolean(updatingId)}
              >
                {updatingId ? 'Cancelling…' : 'Cancel order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
