import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo.jsx';
import { useCategories } from '../hooks/useCategories.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Footer() {
  const categories = useCategories();
  const toast = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    toast.success('You are on the list — watch out for the next Dastak edit.');
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-newsletter">
          <div>
            <span className="eyebrow eyebrow-light">The Dastak letter</span>
            <h2>A little bazaar in your inbox.</h2>
            <p>New arrivals, festive edits and quiet price drops — once a week, no noise.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <Mail size={18} aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              required
            />
            <button type="submit" className="btn btn-accent">
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              A carefully curated online bazaar for Pakistan — thoughtful fashion, honest
              electronics, homeware and pantry staples, delivered from Karachi to Gilgit.
            </p>
            <ul className="footer-contact">
              <li>
                <MapPin size={15} /> Gulberg III, Lahore, Punjab
              </li>
              <li>
                <Phone size={15} /> 0300 111 2233
              </li>
              <li>
                <Mail size={15} /> salam@dastak.pk
              </li>
              <li>
                <Clock3 size={15} /> Mon–Sat, 9am–9pm PKT
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop">All products</Link>
            {categories.slice(0, 5).map((category) => (
              <Link key={category._id} to={`/shop?category=${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Help</h4>
            <Link to="/orders">Track your order</Link>
            <Link to="/about">About Dastak</Link>
            <Link to="/contact">Contact us</Link>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create an account</Link>
          </div>

          <div className="footer-col">
            <h4>We accept</h4>
            <div className="payment-badges">
              <span>Cash on delivery</span>
              <span>Easypaisa</span>
              <span>JazzCash</span>
              <span>Bank transfer</span>
            </div>
            <p className="footer-small">
              Free delivery on orders over Rs 5,000. A flat Rs 250 applies below that,
              anywhere in Pakistan.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Dastak. Made with care in Pakistan.</span>
          <span>Karachi · Lahore · Islamabad · Peshawar · Quetta</span>
        </div>
      </div>
    </footer>
  );
}
