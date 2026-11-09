import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react';
import AuthShell from '../components/AuthShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiErrorMessage } from '../api/client.js';

const DEMOS = [
  { label: 'Customer demo', email: 'customer@dastak.pk', password: 'Customer@123' },
  { label: 'Admin demo', email: 'admin@dastak.pk', password: 'Admin@123' }
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/';

  if (user) return <Navigate to={from} replace />;

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const signedIn = await login(form.email, form.password);
      toast.success(`Welcome back, ${signedIn.name.split(' ')[0]}.`);
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'Those details did not match our records.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders, check out faster and leave reviews."
      footer={
        <p className="auth-switch">
          New to Dastak?{' '}
          <Link to="/register" state={{ from }}>
            Create an account
          </Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email address</span>
          <div className="input-icon">
            <Mail size={17} />
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div className="input-icon">
            <LockKeyhole size={17} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>

        {error && <div className="form-error-banner">{error}</div>}

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={18} className="spin" /> Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="demo-box">
        <p>Just exploring? Fill in a demo account:</p>
        <div>
          {DEMOS.map((demo) => (
            <button
              key={demo.email}
              type="button"
              className="demo-btn"
              onClick={() =>
                setForm({ email: demo.email, password: demo.password })
              }
            >
              {demo.label}
            </button>
          ))}
        </div>
        <small>Admin demo opens the product and order dashboard.</small>
      </div>
    </AuthShell>
  );
}
