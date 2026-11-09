import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Truck,
  UserRound,
  X
} from 'lucide-react';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useCategories } from '../hooks/useCategories.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const categories = useCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const activeCategory = params.get('category') || '';
  const searching = params.has('keyword');

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const handleClick = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [accountOpen]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = keyword.trim();
    setMenuOpen(false);
    navigate(query ? `/shop?keyword=${encodeURIComponent(query)}` : '/shop');
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="announcement">
        <div className="container announcement-inner">
          <span>
            <Truck size={14} /> Free delivery on orders over Rs 5,000
          </span>
          <span className="announcement-secondary">
            Cash on delivery across Pakistan · 7-day easy returns
          </span>
        </div>
      </div>

      <div className="nav-main">
        <div className="container nav-main-inner">
          <button
            type="button"
            className="nav-icon-btn nav-burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={22} />
          </button>

          <Logo />

          <form className="nav-search" onSubmit={submitSearch} role="search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search lawn suits, earbuds, basmati rice…"
              aria-label="Search products"
            />
            <button type="submit">Search</button>
          </form>

          <div className="nav-actions">
            <div className="account-wrap" ref={accountRef}>
              <button
                type="button"
                className="nav-account-btn"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <UserRound size={20} strokeWidth={1.8} />
                <span className="nav-account-label">
                  {user ? `Hi, ${user.name.split(' ')[0]}` : 'Sign in'}
                </span>
                <ChevronDown size={14} className={accountOpen ? 'chevron-open' : ''} />
              </button>

              {accountOpen && (
                <div className="account-menu" role="menu">
                  {user ? (
                    <>
                      <div className="account-menu-head">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <Link to="/orders" role="menuitem">
                        <Package size={16} /> My orders
                      </Link>
                      <Link to="/account" role="menuitem">
                        <UserRound size={16} /> My account
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" role="menuitem">
                          <LayoutDashboard size={16} /> Admin dashboard
                        </Link>
                      )}
                      <button type="button" onClick={handleLogout} role="menuitem">
                        <LogOut size={16} /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="account-menu-head">
                        <strong>Welcome to Dastak</strong>
                        <span>Sign in to track orders and check out faster.</span>
                      </div>
                      <Link to="/login" role="menuitem">
                        Sign in
                      </Link>
                      <Link to="/register" role="menuitem">
                        Create an account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/cart" className="nav-cart">
              <span className="nav-cart-icon">
                <ShoppingBag size={20} strokeWidth={1.8} />
                {count > 0 && <span className="cart-count">{count > 99 ? '99+' : count}</span>}
              </span>
              <span className="nav-cart-label">Bag</span>
            </Link>
          </div>
        </div>
      </div>

      <nav className="nav-cats" aria-label="Product categories">
        <div className="container nav-cats-inner">
          <Link
            to="/shop"
            className={`nav-cat-link ${location.pathname === '/shop' && !activeCategory && !searching ? 'is-active' : ''}`}
          >
            All products
          </Link>
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/shop?category=${category.slug}`}
              className={`nav-cat-link ${activeCategory === category.slug ? 'is-active' : ''}`}
            >
              {category.name}
            </Link>
          ))}
          <span className="nav-cats-note">
            <Truck size={15} /> Delivering to all of Pakistan
          </span>
        </div>
      </nav>

      {menuOpen && (
        <>
          <button
            type="button"
            className="drawer-scrim"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="mobile-drawer" role="dialog" aria-label="Menu">
            <div className="mobile-drawer-head">
              <Logo compact />
              <button
                type="button"
                className="nav-icon-btn"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <form className="nav-search mobile-search" onSubmit={submitSearch} role="search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search the bazaar…"
                aria-label="Search products"
              />
              <button type="submit">Go</button>
            </form>

            <p className="mobile-drawer-label">Categories</p>
            <Link to="/shop" className="mobile-link">
              All products
            </Link>
            {categories.map((category) => (
              <Link key={category._id} to={`/shop?category=${category.slug}`} className="mobile-link">
                {category.name}
                <span>{category.productCount}</span>
              </Link>
            ))}

            <p className="mobile-drawer-label">Your account</p>
            {user ? (
              <>
                <Link to="/orders" className="mobile-link">
                  My orders
                </Link>
                <Link to="/account" className="mobile-link">
                  My account
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="mobile-link">
                    Admin dashboard
                  </Link>
                )}
                <button type="button" className="mobile-link mobile-signout" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link">
                  Sign in
                </Link>
                <Link to="/register" className="mobile-link">
                  Create an account
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </header>
  );
}
