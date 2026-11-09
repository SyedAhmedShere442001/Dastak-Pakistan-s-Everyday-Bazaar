import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Package,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client.js';
import PageLoader from '../../components/PageLoader.jsx';
import {
  formatDate,
  formatPKR,
  STATUS_LABELS,
  STATUS_TONES
} from '../../lib/format.js';

const STATUS_ORDER = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    api
      .get('/admin/stats')
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
  }, [reloadKey]);

  if (loading) return <PageLoader label="Counting the shelves…" />;

  if (error || !data) {
    return (
      <div className="inline-error">
        {error || 'Could not load dashboard data.'}
        <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
          Try again
        </button>
      </div>
    );
  }

  const { stats, recentOrders, lowStock, statusCounts } = data;
  const counts = Object.fromEntries(statusCounts.map((entry) => [entry._id, entry.count]));
  const totalOrders = statusCounts.reduce((total, entry) => total + entry.count, 0) || 1;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Here is how the bazaar is doing today.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/products/new">
          <Plus size={17} /> Add product
        </Link>
      </div>

      <div className="stat-grid">
        <article className="stat-card">
          <span className="stat-icon stat-icon-green">
            <TrendingUp size={20} />
          </span>
          <span className="stat-label">Revenue</span>
          <strong>{formatPKR(stats.revenue)}</strong>
          <small>Average order {formatPKR(stats.avgOrderValue)}</small>
        </article>

        <article className="stat-card">
          <span className="stat-icon stat-icon-blue">
            <ClipboardList size={20} />
          </span>
          <span className="stat-label">Orders</span>
          <strong>{stats.orders}</strong>
          <small>
            {stats.pendingOrders} pending · {stats.cancelledOrders} cancelled
          </small>
        </article>

        <article className="stat-card">
          <span className="stat-icon stat-icon-amber">
            <Package size={20} />
          </span>
          <span className="stat-label">Products</span>
          <strong>{stats.products}</strong>
          <small>
            {stats.activeProducts} live · {stats.lowStockCount} low stock
          </small>
        </article>

        <article className="stat-card">
          <span className="stat-icon stat-icon-violet">
            <Users size={20} />
          </span>
          <span className="stat-label">Customers</span>
          <strong>{stats.customers}</strong>
          <small>Registered shoppers</small>
        </article>
      </div>

      <div className="admin-grid two-column">
        <section className="detail-panel">
          <div className="panel-heading-row">
            <h2>Recent orders</h2>
            <Link to="/admin/orders" className="table-link">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="muted">No orders yet.</p>
          ) : (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/orders/${order._id}`} className="table-link">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td>
                        {order.user?.name || order.shippingAddress.fullName}
                        <small>{order.shippingAddress.city}</small>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{formatPKR(order.totalPrice)}</td>
                      <td>
                        <span className={`status-badge tone-${STATUS_TONES[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="detail-panel">
          <div className="panel-heading-row">
            <h2>Low stock</h2>
            <Link to="/admin/products" className="table-link">
              Manage
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <p className="muted">Everything is comfortably stocked.</p>
          ) : (
            <ul className="low-stock-list">
              {lowStock.map((product) => (
                <li key={product._id}>
                  <img src={product.images?.[0] || '/products/placeholder.svg'} alt={product.name} />
                  <div>
                    <Link to={`/admin/products/${product._id}/edit`}>{product.name}</Link>
                    <small>{product.brand}</small>
                  </div>
                  <span className={product.stock === 0 ? 'stock-out' : 'stock-low'}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="admin-grid two-column">
        <section className="detail-panel">
          <div className="panel-heading-row">
            <h2>Orders by status</h2>
            <span className="muted">{stats.orders} total</span>
          </div>
          <div className="status-bars">
            {STATUS_ORDER.map((status) => {
              const count = counts[status] || 0;
              const percent = Math.round((count / totalOrders) * 100);
              return (
                <div className="status-bar-row" key={status}>
                  <span className="status-bar-label">{STATUS_LABELS[status]}</span>
                  <span className="status-bar-track">
                    <span
                      className={`status-bar bar-${STATUS_TONES[status]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </span>
                  <span className="status-bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="detail-panel detail-panel-soft">
          <h2>Quick actions</h2>
          <div className="quick-actions">
            <Link to="/admin/products/new" className="quick-action">
              <Plus size={18} /> Add a new product
            </Link>
            <Link to="/admin/orders" className="quick-action">
              <ClipboardList size={18} /> Review pending orders
            </Link>
            <Link to="/shop" className="quick-action">
              <Package size={18} /> Browse the live store
            </Link>
          </div>
          <p className="muted admin-note">
            New orders appear here immediately. Update a status once the courier confirms
            pickup so customers can follow along.
          </p>
        </section>
      </div>
    </>
  );
}
