import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImageIcon, Loader2, Save } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client.js';
import PageLoader from '../../components/PageLoader.jsx';
import { useCategories } from '../../hooks/useCategories.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatPKR } from '../../lib/format.js';

const SAMPLE_IMAGES = [
  { file: 'lawn.svg', label: 'Lawn suit' },
  { file: 'kurta.svg', label: 'Kurta' },
  { file: 'dupatta.svg', label: 'Dupatta' },
  { file: 'khussa.svg', label: 'Khussa' },
  { file: 'chappal.svg', label: 'Chappal' },
  { file: 'earbuds.svg', label: 'Earbuds' },
  { file: 'smartwatch.svg', label: 'Smartwatch' },
  { file: 'powerbank.svg', label: 'Power bank' },
  { file: 'airfryer.svg', label: 'Air fryer' },
  { file: 'bedsheet.svg', label: 'Bedsheet' },
  { file: 'dinnerset.svg', label: 'Dinner set' },
  { file: 'vase.svg', label: 'Vase' },
  { file: 'attar.svg', label: 'Attar' },
  { file: 'facewash.svg', label: 'Face wash' },
  { file: 'dryfruit.svg', label: 'Dry fruit' },
  { file: 'rice.svg', label: 'Rice' },
  { file: 'cricket.svg', label: 'Cricket bat' },
  { file: 'football.svg', label: 'Football' }
];

const EMPTY_FORM = {
  name: '',
  brand: '',
  category: '',
  price: '',
  compareAtPrice: '',
  stock: '0',
  description: '',
  tags: '',
  specs: '',
  image: '/products/placeholder.svg',
  featured: false,
  isActive: true
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const categories = useCategories();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return undefined;
    let active = true;
    setLoading(true);
    setError('');

    api
      .get(`/products/id/${id}`)
      .then(({ data }) => {
        if (!active) return;
        const product = data.product;
        setForm({
          name: product.name || '',
          brand: product.brand || '',
          category: product.category?._id || product.category || '',
          price: String(product.price ?? ''),
          compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
          stock: String(product.stock ?? 0),
          description: product.description || '',
          tags: (product.tags || []).join(', '),
          specs: (product.specs || [])
            .map((spec) => `${spec.label}: ${spec.value}`)
            .join('\n'),
          image: product.images?.[0] || '/products/placeholder.svg',
          featured: Boolean(product.featured),
          isActive: product.isActive !== false
        });
      })
      .catch((requestError) => {
        if (active) setError(apiErrorMessage(requestError, 'Could not load that product.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const update = (field) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const required = ['name', 'brand', 'category', 'price', 'stock', 'description'];
    const missing = required.find((field) => String(form[field]).trim() === '');
    if (missing) {
      setError(`Please fill in the ${missing === 'compareAtPrice' ? 'compare-at price' : missing} field.`);
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === '' ? null : Number(form.compareAtPrice),
      stock: Number(form.stock),
      description: form.description,
      tags: form.tags,
      specs: form.specs,
      image: form.image,
      featured: form.featured,
      isActive: form.isActive
    };

    try {
      if (isEdit) await api.put(`/products/${id}`, payload);
      else await api.post('/products', payload);

      toast.success(isEdit ? 'Product updated.' : 'Product added to the catalog.');
      navigate('/admin/products');
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'Could not save this product.'));
      setSaving(false);
    }
  };

  if (isEdit && loading) return <PageLoader label="Opening the product…" />;

  if (isEdit && error && !form.name) {
    return (
      <div className="inline-error">
        {error}
        <Link to="/admin/products">Back to products</Link>
      </div>
    );
  }

  const discount =
    form.compareAtPrice && Number(form.compareAtPrice) > Number(form.price)
      ? Math.round((1 - Number(form.price) / Number(form.compareAtPrice)) * 100)
      : 0;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <Link to="/admin/products" className="back-link">
            <ArrowLeft size={15} /> All products
          </Link>
          <h1>{isEdit ? 'Edit product' : 'Add a product'}</h1>
          <p>
            {isEdit
              ? 'Update the details shoppers see on the storefront.'
              : 'Fill in the details and put something new on the shelves.'}
          </p>
        </div>
      </div>

      <form className="product-form-layout" onSubmit={handleSubmit} noValidate>
        <div className="product-form-main">
          <section className="admin-form-card">
            <h2>Basics</h2>
            <div className="form-grid">
              <label className="field field-span-2">
                <span>Product name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Embroidered Lawn 3-Piece"
                  maxLength={140}
                  required
                />
              </label>

              <label className="field">
                <span>Brand</span>
                <input
                  type="text"
                  value={form.brand}
                  onChange={update('brand')}
                  placeholder="Zarlish"
                  maxLength={80}
                  required
                />
              </label>

              <label className="field">
                <span>Category</span>
                <select value={form.category} onChange={update('category')} required>
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field field-span-2">
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={update('description')}
                  placeholder="Tell shoppers about the fabric, fit, finish and what makes it special."
                  rows={4}
                  maxLength={2000}
                  required
                />
              </label>

              <label className="field field-span-2">
                <span>
                  Tags <small>(comma separated)</small>
                </span>
                <input
                  type="text"
                  value={form.tags}
                  onChange={update('tags')}
                  placeholder="lawn, summer, embroidered"
                />
              </label>
            </div>
          </section>

          <section className="admin-form-card">
            <h2>Pricing & stock</h2>
            <div className="form-grid">
              <label className="field">
                <span>Price (PKR)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={update('price')}
                  placeholder="4850"
                  required
                />
              </label>

              <label className="field">
                <span>
                  Compare-at price <small>(optional)</small>
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.compareAtPrice}
                  onChange={update('compareAtPrice')}
                  placeholder="5990"
                />
              </label>

              <label className="field">
                <span>Stock quantity</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={update('stock')}
                  placeholder="25"
                  required
                />
              </label>

              <div className="field field-note">
                <span>Preview</span>
                <p>
                  Shoppers will see <strong>{formatPKR(form.price || 0)}</strong>
                  {discount > 0 ? ` with a ${discount}% discount badge.` : '.'}
                </p>
              </div>
            </div>
          </section>

          <section className="admin-form-card">
            <h2>Specifications</h2>
            <label className="field">
              <span>
                One spec per line, formatted as <code>Label: Value</code>
              </span>
              <textarea
                value={form.specs}
                onChange={update('specs')}
                placeholder={'Fabric: Premium cotton lawn\nIncludes: Shirt, trouser and dupatta\nCare: Gentle machine wash'}
                rows={5}
              />
            </label>
          </section>

          <section className="admin-form-card">
            <h2>Product image</h2>
            <div className="form-grid">
              <label className="field field-span-2">
                <span>Image path or URL</span>
                <input
                  type="text"
                  value={form.image}
                  onChange={update('image')}
                  placeholder="/products/lawn.svg or https://…"
                />
              </label>
            </div>

            <span className="sample-label">
              <ImageIcon size={14} /> Or pick a studio illustration
            </span>
            <div className="sample-grid">
              {SAMPLE_IMAGES.map((sample) => {
                const path = `/products/${sample.file}`;
                return (
                  <button
                    type="button"
                    key={sample.file}
                    className={`sample-tile ${form.image === path ? 'is-selected' : ''}`}
                    onClick={() => setForm((current) => ({ ...current, image: path }))}
                    title={sample.label}
                  >
                    <img src={path} alt={sample.label} loading="lazy" />
                    <span>{sample.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="admin-form-card">
            <h2>Visibility</h2>
            <div className="switch-list">
              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={update('featured')}
                />
                <span>
                  <strong>Featured product</strong>
                  <small>Show this product in the homepage bestsellers.</small>
                </span>
              </label>

              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={update('isActive')}
                />
                <span>
                  <strong>Live on the storefront</strong>
                  <small>Uncheck to hide it from shoppers without deleting it.</small>
                </span>
              </label>
            </div>
          </section>

          {error && <div className="form-error-banner">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={18} className="spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={18} /> {isEdit ? 'Save changes' : 'Add product'}
                </>
              )}
            </button>
            <Link className="btn btn-outline btn-lg" to="/admin/products">
              Cancel
            </Link>
          </div>
        </div>

        <aside className="product-form-aside">
          <div className="admin-form-card sticky-card">
            <h2>Storefront preview</h2>
            <div className="preview-product">
              <div className="preview-media">
                <img
                  src={form.image || '/products/placeholder.svg'}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.src = '/products/placeholder.svg';
                  }}
                />
                {discount > 0 && <span className="badge badge-dark">-{discount}%</span>}
              </div>
              <span className="product-brand">{form.brand || 'Brand'}</span>
              <strong>{form.name || 'Product name'}</strong>
              <div className="preview-price">
                <span>{formatPKR(form.price || 0)}</span>
                {discount > 0 && <small>{formatPKR(form.compareAtPrice)}</small>}
              </div>
              <p className="muted">
                {form.isActive ? 'Visible to shoppers' : 'Hidden from the storefront'}
              </p>
            </div>
          </div>
        </aside>
      </form>
    </>
  );
}
