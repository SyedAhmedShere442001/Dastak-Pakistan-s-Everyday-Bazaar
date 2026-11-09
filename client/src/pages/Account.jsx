import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  ShoppingBag
} from 'lucide-react';
import api, { apiErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate } from '../lib/format.js';

export default function Account() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const updateProfileField = (field) => (event) =>
    setProfile((current) => ({ ...current, [field]: event.target.value }));

  const updatePasswordField = (field) => (event) =>
    setPasswords((current) => ({ ...current, [field]: event.target.value }));

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileError('');
    setSavingProfile(true);
    try {
      const { data } = await api.put('/auth/profile', profile);
      updateUser(data.user);
      toast.success('Your details have been updated.');
    } catch (requestError) {
      setProfileError(apiErrorMessage(requestError));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');

    if (passwords.newPassword.length < 6) {
      setPasswordError('Your new password must be at least 6 characters long.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('The two new passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/auth/profile', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated.');
    } catch (requestError) {
      setPasswordError(apiErrorMessage(requestError));
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('You have been signed out.');
    navigate('/');
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>My account</span>
          </nav>
          <h1>My account</h1>
          <p>Keep your details fresh and your orders easy to find.</p>
        </div>
      </section>

      <div className="container account-layout">
        <aside className="account-sidebar">
          <div className="account-user">
            <span className="avatar avatar-lg">{user.name.charAt(0)}</span>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <small>Member since {formatDate(user.createdAt)}</small>
          </div>

          <nav className="account-nav">
            <Link to="/orders">
              <Package size={17} /> My orders <ArrowRight size={15} />
            </Link>
            <Link to="/shop">
              <ShoppingBag size={17} /> Continue shopping <ArrowRight size={15} />
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin">
                <LayoutDashboard size={17} /> Admin dashboard <ArrowRight size={15} />
              </Link>
            )}
          </nav>

          <button type="button" className="btn btn-ghost btn-block" onClick={handleLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </aside>

        <div className="account-main">
          <section className="detail-panel">
            <h2>Profile details</h2>
            <p className="muted">This is how we address your orders.</p>
            <form className="auth-form" onSubmit={saveProfile}>
              <div className="form-grid">
                <label className="field">
                  <span>Full name</span>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={updateProfileField('name')}
                    required
                    minLength={2}
                  />
                </label>
                <label className="field">
                  <span>Phone number</span>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={updateProfileField('phone')}
                    placeholder="0300 1234567"
                  />
                </label>
                <label className="field field-span-2">
                  <span>Email address</span>
                  <input type="email" value={user.email} disabled />
                  <small>Your email is used for sign-in and cannot be changed here.</small>
                </label>
              </div>
              {profileError && <div className="form-error-banner">{profileError}</div>}
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? <Loader2 size={16} className="spin" /> : null}
                {savingProfile ? 'Saving…' : 'Save details'}
              </button>
            </form>
          </section>

          <section className="detail-panel">
            <h2>Change password</h2>
            <p className="muted">Use at least 6 characters and something you do not reuse.</p>
            <form className="auth-form" onSubmit={savePassword}>
              <label className="field">
                <span>Current password</span>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={updatePasswordField('currentPassword')}
                  autoComplete="current-password"
                  required
                />
              </label>
              <div className="form-grid">
                <label className="field">
                  <span>New password</span>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={updatePasswordField('newPassword')}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </label>
                <label className="field">
                  <span>Confirm new password</span>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={updatePasswordField('confirmPassword')}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </label>
              </div>
              {passwordError && <div className="form-error-banner">{passwordError}</div>}
              <button type="submit" className="btn btn-outline" disabled={savingPassword}>
                {savingPassword ? <Loader2 size={16} className="spin" /> : null}
                {savingPassword ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
