import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Eye,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client.js';
import PageLoader from '../../components/PageLoader.jsx';
import { useCategories } from '../../hooks/useCategories.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatPKR } from '../../lib/format.js';
import AdminPager from './AdminPager.jsx';

export default function AdminProducts() {
  const categories = useCategories();
  const toast = useToast();

  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ items: [], total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setKeyword(keywordInput.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [keywordInput]);

  useEffect(() => {
    setPage(1);
  }, [keyword, category]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    api
      .get('/products/admin/list', {
        params: {
          keyword: keyword || undefined,
          category: category || undefined,
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
  }, [keyword, category, page, reloadKey]);

  const handleDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);

    try {
      const { data: response } = await api.delete(`/products/${pendingDelete._id}`);
      toast.success(response.message || 'Product removed.');
      setPendingDelete(null);

      if (data.items.length === 1 && page > 1) setPage((current) => current - 1);
      else setReloadKey((key) => key + 1);
    } catch (requestError) {
      toast.error(apiErrorMessage(requestError, 'Could not delete that product.'));
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = Boolean(keyword || category);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Products</h1>
          <p>
            {loading
              ? 'Loading the catalog…'
              : `${data.total} product${data.total === 1 ? '' : 's'} in the catalog`}
          </p>
        </div>
        <Link className="btn btn-primary" to="/admin/products/new">
          <Plus size={17} /> Add product
        </Link>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={16} />
          <input
            type="search"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="Search by name or brand…"
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
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((entry) => (
            <option key={entry._id} value={entry.slug}>
              {entry.name}
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
        <PageLoader label="Fetching the catalog…" />
      ) : data.items.length === 0 ? (
        <div className="admin-empty">
          <PackagePlus size={30} />
          <h2>{hasFilters ? 'Nothing matched those filters' : 'The catalog is empty'}</h2>
          <p>
            {hasFilters
              ? 'Try a different brand or category.'
              : 'Add your first product to open the shelves.'}
          </p>
          {hasFilters ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setKeywordInput('');
                setCategory('');
              }}
            >
              Clear filters
            </button>
          ) : (
            <Link className="btn btn-primary" to="/admin/products/new">
              Add product
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="admin-table admin-table-products">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Visibility</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="table-product">
                        <img
                          src={product.images?.[0] || '/products/placeholder.svg'}
                          alt={product.name}
                        />
                        <div>
                          <Link to={`/admin/products/${product._id}/edit`}>{product.name}</Link>
                          <small>
                            {product.brand} · {product.slug}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{product.category?.name || 'Uncategorised'}</td>
                    <td>
                      <strong>{formatPKR(product.price)}</strong>
                      {product.compareAtPrice > product.price && (
                        <small className="table-was">{formatPKR(product.compareAtPrice)}</small>
                      )}
                    </td>
                    <td>
                      <span
                        className={`stock-pill ${
                          product.stock === 0 ? 'is-out' : product.stock <= 5 ? 'is-low' : ''
                        }`}
                      >
                        {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                      </span>
                    </td>
                    <td>
                      <div className="table-badges">
                        {product.isActive ? (
                          <span className="badge badge-soft">Live</span>
                        ) : (
                          <span className="badge badge-danger">Hidden</span>
                        )}
                        {product.featured && <span className="badge badge-accent">Featured</span>}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/product/${product.slug}`}
                          className="table-icon-btn"
                          title="View in store"
                          aria-label={`View ${product.name} in store`}
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="table-icon-btn"
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          className="table-icon-btn danger"
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => setPendingDelete(product)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AdminPager page={page} pages={data.pages} total={data.total} onChange={setPage} />
        </>
      )}

      {pendingDelete && (
        <div
          className="confirm-backdrop"
          role="presentation"
          onClick={() => (deleting ? null : setPendingDelete(null))}
        >
          <div
            className="confirm-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="confirm-icon">
              <AlertTriangle size={22} />
            </span>
            <h2 id="delete-product-title">Delete this product?</h2>
            <p>
              <strong>{pendingDelete.name}</strong> will be removed from the catalog along with its
              reviews. This cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
              >
                Keep product
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
