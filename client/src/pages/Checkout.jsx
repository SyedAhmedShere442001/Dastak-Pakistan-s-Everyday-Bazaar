import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Banknote,
  Landmark,
  Loader2,
  LockKeyhole,
  ShoppingBag,
  Smartphone,
  Wallet
} from 'lucide-react';
import api, { apiErrorMessage } from '../api/client.js';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  CITIES,
  formatPKR,
  FREE_SHIPPING_THRESHOLD,
  PROVINCES,
  SHIPPING_FLAT
} from '../lib/format.js';

const PAYMENT_OPTIONS = [
  {
    value: 'cod',
    label: 'Cash on Delivery',
    icon: Banknote,
    description: 'Pay in cash when your order arrives at your door.'
  },
  {
    value: 'easypaisa',
    label: 'Easypaisa',
    icon: Smartphone,
    description: 'Transfer from your Easypaisa wallet after placing the order.'
  },
  {
    value: 'jazzcash',
    label: 'JazzCash',
    icon: Wallet,
    description: 'Transfer from your JazzCash wallet after placing the order.'
  },
  {
    value: 'bank',
    label: 'Bank Transfer',
    icon: Landmark,
    description: 'Pay via IBFT or bank deposit after placing the order.'
  }
];

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    province: 'Punjab',
    postalCode: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;
  const selectedPayment = PAYMENT_OPTIONS.find((option) => option.value === paymentMethod);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const validate = () => {
    if (form.fullName.trim().length < 3) return 'Please enter the recipient’s full name.';
    const digits = form.phone.replace(/\D/g, '');
    if (!/^[0-9+\-\s()]{10,20}$/.test(form.phone.trim()) || digits.length < 10) {
      return 'Enter a valid Pakistani phone number, e.g. 0300 1234567.';
    }
    if (form.street.trim().length < 8) {
      return 'Add a complete street address, including house and block.';
    }
    if (!form.city.trim()) return 'Please enter your city.';
    if (!form.province) return 'Please select your province.';
    if (form.postalCode && !/^\d{4,6}$/.test(form.postalCode.trim())) {
      return 'Postal code should be 4 to 6 digits.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (placing) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPlacing(true);
    setError('');

    try {
      const { data } = await api.post('/orders', {
        items: items.map((item) => ({ productId: item._id, qty: item.qty })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode
        },
        paymentMethod,
        notes: form.notes
      });

      clearCart();
      toast.success(`Order ${data.order.orderNumber} placed. Shukriya!`);
      navigate(`/orders/${data.order._id}?placed=1`, { replace: true });
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container section">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out yet"
          text="Your bag is empty. Add a few things you love and come back."
          actionLabel="Browse the bazaar"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/cart">Bag</Link>
            <span>/</span>
            <span>Checkout</span>
          </nav>
          <h1>Checkout</h1>
          <p>Two minutes to a doorstep delivery — COD available nationwide.</p>
        </div>
      </section>

      <div className="container checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <section className="checkout-panel">
            <div className="panel-head">
              <span className="step-dot">1</span>
              <div>
                <h2>Contact & delivery</h2>
                <p>Where should we bring your order?</p>
              </div>
            </div>

            <div className="checkout-account-banner">
              <LockKeyhole size={15} />
              Ordering as <strong>{user.name}</strong> ({user.email})
            </div>

            <div className="form-grid">
              <label className="field field-span-2">
                <span>Full name</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={update('fullName')}
                  placeholder="Ayesha Khan"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="field">
                <span>Phone number</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="0300 1234567"
                  autoComplete="tel"
                  required
                />
              </label>

              <label className="field">
                <span>
                  Postal code <small>(optional)</small>
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.postalCode}
                  onChange={update('postalCode')}
                  placeholder="75300"
                  autoComplete="postal-code"
                />
              </label>

              <label className="field field-span-2">
                <span>Street address</span>
                <input
                  type="text"
                  value={form.street}
                  onChange={update('street')}
                  placeholder="House 24, Street 8, Block 6, Gulshan-e-Iqbal"
                  autoComplete="street-address"
                  required
                />
              </label>

              <label className="field">
                <span>City</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={update('city')}
                  placeholder="Karachi"
                  list="checkout-cities"
                  autoComplete="address-level2"
                  required
                />
                <datalist id="checkout-cities">
                  {CITIES.map((city) => (
                    <option value={city} key={city} />
                  ))}
                </datalist>
              </label>

              <label className="field">
                <span>Province</span>
                <select value={form.province} onChange={update('province')} required>
                  {PROVINCES.map((province) => (
                    <option value={province} key={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="checkout-panel">
            <div className="panel-head">
              <span className="step-dot">2</span>
              <div>
                <h2>Payment method</h2>
                <p>Choose whatever is easiest for you.</p>
              </div>
            </div>

            <div className="payment-options">
              {PAYMENT_OPTIONS.map(({ value, label, icon: Icon, description }) => (
                <label
                  key={value}
                  className={`payment-option ${paymentMethod === value ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                  />
                  <span className="payment-icon">
                    <Icon size={20} />
                  </span>
                  <span className="payment-copy">
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                  <span className="payment-radio" aria-hidden="true" />
                </label>
              ))}
            </div>

            {paymentMethod !== 'cod' && (
              <div className="payment-note">
                After you place the order, our team will send the{' '}
                <strong>{selectedPayment.label}</strong> account details on SMS and WhatsApp. Your
                order is confirmed once the payment is received.
              </div>
            )}
          </section>

          <section className="checkout-panel">
            <div className="panel-head">
              <span className="step-dot">3</span>
              <div>
                <h2>
                  Order notes <small>(optional)</small>
                </h2>
                <p>A landmark, delivery instruction, or a gift note.</p>
              </div>
            </div>
            <textarea
              className="checkout-notes"
              value={form.notes}
              onChange={update('notes')}
              placeholder="e.g. Please call before delivery. It is a gift — no prices on the parcel."
              maxLength={500}
              rows={3}
            />
          </section>

          {error && <div className="form-error-banner">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={placing}>
            {placing ? (
              <>
                <Loader2 size={18} className="spin" /> Placing your order…
              </>
            ) : (
              `Place order · ${formatPKR(total)}`
            )}
          </button>
          <p className="checkout-legal">
            By placing your order you agree to Dastak&apos;s delivery and returns policy. Prices
            include applicable taxes.
          </p>
        </form>

        <aside className="summary-card checkout-summary">
          <h2>Your order</h2>

          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item._id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <span>{item.name}</span>
                  <small>
                    {item.brand} · Qty {item.qty}
                  </small>
                </div>
                <strong>{formatPKR(item.price * item.qty)}</strong>
              </li>
            ))}
          </ul>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPKR(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>{shipping === 0 ? 'Free' : formatPKR(shipping)}</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPKR(total)}</strong>
          </div>

          <p className="summary-note">
            <LockKeyhole size={15} /> Your details stay private and are only used to fulfil this
            order.
          </p>
        </aside>
      </div>
    </>
  );
}
