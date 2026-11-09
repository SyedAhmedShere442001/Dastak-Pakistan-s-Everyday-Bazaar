import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Store
} from 'lucide-react';
import { LogoMark } from '../../components/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: PackagePlus },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.info('Signed out of the admin desk.');
    navigate('/');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="logo admin-brand" aria-label="Dastak admin dashboard">
          <LogoMark />
          <span className="logo-text">
            Dastak
            <small>Pakistan</small>
          </span>
        </Link>
        <span className="admin-label">Admin desk</span>

        <nav className="admin-nav">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <Link to="/" className="admin-store-link">
            <Store size={16} /> View storefront
          </Link>
          <div className="admin-user">
            <span className="avatar">{user.name.charAt(0)}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-block" onClick={handleLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar-eyebrow">Dastak admin</span>
            <strong>Bazaar control room</strong>
          </div>
          <Link to="/" className="admin-topbar-link">
            <ArrowLeft size={15} /> Back to store
          </Link>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
