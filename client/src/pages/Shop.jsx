import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  SearchX,
  SlidersHorizontal,
  X
} from 'lucide-react';
import api from '../api/client.js';
import { apiErrorMessage } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useCategories } from '../hooks/useCategories.js';
import { PRICE_RANGES } from '../lib/format.js';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' }
];

function ProductSkeletons({ count = 6 }) {
  return Array.from({ length: count }, (_, index) => (
    <div className="product-card skeleton-card" key={index}>
      <div className="skeleton skeleton-media" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-line-short" />
    </div>
  ));
}

function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const end = Math.min(pages, start + 4);
  const numbers = [];
  for (let index = start; index <= end; index += 1) numbers.push(index);

  return (
    <nav className="pagination" aria-label="Product pages">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft size={16} /> Previous
      </button>
      {numbers.map((number) => (
        <button
          key={number}
          type="button"
          className={number === page ? 'is-current' : ''}
          onClick={() => onChange(number)}
          aria-current={number === page ? 'page' : undefined}
        >
          {number}
        </button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pages}>
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default function Shop() {
  const categories = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [sort, setSort] = useState(sortParam);
  const [priceKey, setPriceKey] = useState('');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState({ items: [], total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activeCategory = categories.find((category) => category.slug === categoryParam);

  useEffect(() => {
    setSort(sortParam);
  }, [sortParam]);

  useEffect(() => {
    setPage(1);
  }, [keyword, categoryParam, priceKey, sort]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const range = PRICE_RANGES.find((entry) => entry.key === priceKey);
    const params = {
      keyword: keyword || undefined,
      category: categoryParam || undefined,
      sort,
      page,
      limit: 12
    };
    if (range) {
      params.minPrice = range.min;
      if (range.max !== undefined) params.maxPrice = range.max;
    }

    api
      .get('/products', { params })
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
  }, [keyword, categoryParam, sort, priceKey, page, reloadKey]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    setPage(1);
  };

  const updateSort = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'newest') next.set('sort', value);
    else next.delete('sort');
    setSearchParams(next);
    setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceKey('');
    setSort('newest');
    setPage(1);
  };

  const activeFilterCount =
    (keyword ? 1 : 0) + (categoryParam ? 1 : 0) + (priceKey ? 1 : 0);

  const heading = keyword
    ? `Results for “${keyword}”`
    : activeCategory?.name || 'All products';
  const subheading = keyword
    ? 'Everything in the bazaar that matches your search.'
    : activeCategory?.tagline || 'A little bit of everything, thoughtfully chosen.';

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            {activeCategory ? <Link to="/shop">Shop</Link> : <span>Shop</span>}
            {activeCategory && (
              <>
                <span>/</span>
                <span>{activeCategory.name}</span>
              </>
            )}
          </nav>
          <div className="page-header-row">
            <div>
              <h1>{heading}</h1>
              <p>{subheading}</p>
            </div>
            {activeCategory && (
              <span className="page-header-icon" aria-hidden="true">
                <CategoryIcon icon={activeCategory.icon} size={30} />
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="container shop-layout">
        <aside className={`shop-filters ${filtersOpen ? 'is-open' : ''}`}>
          <div className="filters-head">
            <span>
              <SlidersHorizontal size={17} /> Filters
            </span>
            <button
              type="button"
              className="filters-close"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>

          <div className="filter-group">
            <h3>Category</h3>
            <button
              type="button"
              className={`filter-option ${!categoryParam ? 'is-selected' : ''}`}
              onClick={() => {
                updateParam('category', '');
                setFiltersOpen(false);
              }}
            >
              All categories
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                className={`filter-option ${categoryParam === category.slug ? 'is-selected' : ''}`}
                onClick={() => {
                  updateParam('category', category.slug);
                  setFiltersOpen(false);
                }}
              >
                <span>
                  <CategoryIcon icon={category.icon} size={16} /> {category.name}
                </span>
                <small>{category.productCount}</small>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3>Price</h3>
            <label className="filter-radio">
              <input
                type="radio"
                name="price"
                checked={!priceKey}
                onChange={() => {
                  setPriceKey('');
                  setFiltersOpen(false);
                }}
              />
              <span>Any price</span>
            </label>
            {PRICE_RANGES.map((range) => (
              <label className="filter-radio" key={range.key}>
                <input
                  type="radio"
                  name="price"
                  checked={priceKey === range.key}
                  onChange={() => {
                    setPriceKey(range.key);
                    setFiltersOpen(false);
                  }}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>

          <p className="filter-note">
            All prices are in Pakistani Rupees and include applicable taxes.
          </p>
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <span className="shop-count">
              {loading ? 'Loading the shelves…' : `${data.total} products`}
            </span>
            <div className="shop-toolbar-right">
              <button
                type="button"
                className="filter-toggle"
                onClick={() => setFiltersOpen((open) => !open)}
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
              </button>
              <label className="sort-select">
                <span>Sort by</span>
                <select value={sort} onChange={(event) => updateSort(event.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="active-filters">
              {keyword && (
                <button type="button" className="filter-chip" onClick={() => updateParam('keyword', '')}>
                  “{keyword}” <X size={13} />
                </button>
              )}
              {activeCategory && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => updateParam('category', '')}
                >
                  {activeCategory.name} <X size={13} />
                </button>
              )}
              {priceKey && (
                <button type="button" className="filter-chip" onClick={() => setPriceKey('')}>
                  {PRICE_RANGES.find((range) => range.key === priceKey)?.label} <X size={13} />
                </button>
              )}
              <button type="button" className="clear-filters" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}

          {error && (
            <div className="inline-error">
              {error}
              <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
                Try again
              </button>
            </div>
          )}

          {!error && (
            <>
              {loading ? (
                <div className="product-grid">
                  <ProductSkeletons count={9} />
                </div>
              ) : data.items.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="Nothing matched that search"
                  text="Try a different phrase, widen the price range, or browse a category."
                  actionLabel="Browse everything"
                  actionTo="/shop"
                >
                  {activeFilterCount > 0 && (
                    <button type="button" className="btn btn-outline" onClick={clearFilters}>
                      Clear filters
                    </button>
                  )}
                </EmptyState>
              ) : (
                <>
                  <div className="product-grid">
                    {data.items.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                  <Pagination page={page} pages={data.pages} onChange={setPage} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
