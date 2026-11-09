import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import AuthShell from '../components/AuthShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiErrorMessage } from '../api/client.js';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
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

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('The two passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const created = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      toast.success(`Welcome to Dastak, ${created.name.split(' ')[0]}.`);
      navigate(from === '/login' ? '/' : from, { replace: true });
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'Could not create your account.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a minute — and makes every order easier."
      footer={
        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" state={{ from }}>
            Sign in
          </Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Full name</span>
          <div className="input-icon">
            <UserRound size={17} />
            <input
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="Ayesha Khan"
              autoComplete="name"
              required
              minLength={2}
            />
          </div>
        </label>

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
          <span>
            Phone number <small>(optional)</small>
          </span>
          <div className="input-icon">
            <Phone size={17} />
            <input
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              placeholder="0300 1234567"
              autoComplete="tel"
            />
          </div>
        </label>

        <div className="form-grid">
          <label className="field">
            <span>Password</span>
            <div className="input-icon">
              <LockKeyhole size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
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

          <label className="field">
            <span>Confirm password</span>
            <div className="input-icon">
              <LockKeyhole size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                placeholder="Repeat password"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>
          </label>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={18} className="spin" /> Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>

        <p className="auth-legal">
          By creating an account you agree to our delivery and returns policy. We will never
          sell your details.
        </p>
      </form>
    </AuthShell>
  );
}
