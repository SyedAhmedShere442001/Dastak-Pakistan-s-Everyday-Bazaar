import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Headphones,
  Leaf,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from 'lucide-react';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import { useCategories } from '../hooks/useCategories.js';

const testimonials = [
  {
    quote:
      'Ordered a lawn suit on Thursday and it reached my doorstep in Lahore on Saturday. The fabric was exactly like the photos.',
    name: 'Sana Malik',
    city: 'Lahore'
  },
  {
    quote:
      'The AirBuds arrived well packed and the COD process was effortless. This is how online shopping in Pakistan should feel.',
    name: 'Bilal Ahmed',
    city: 'Karachi'
  },
  {
    quote:
      'I was nervous about ordering pottery online, but the Multani vase came wrapped beautifully. It now lives on our console.',
    name: 'Hira Qureshi',
    city: 'Islamabad'
  }
];

function ProductSkeletons({ count = 4 }) {
  return Array.from({ length: count }, (_, index) => (
    <div className="product-card skeleton-card" key={index}>
      <div className="skeleton skeleton-media" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-line-short" />
    </div>
  ));
}

export default function Home() {
  const categories = useCategories();
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');

    Promise.all([
      api.get('/products', { params: { featured: 'true', limit: 8, sort: 'popular' } }),
      api.get('/products', { params: { limit: 4, sort: 'newest' } })
    ])
      .then(([featuredResponse, newResponse]) => {
        if (!active) return;
        setFeatured(featuredResponse.data.items);
        setNewArrivals(newResponse.data.items);
      })
      .catch(() => {
        if (active) setLoadError('The shelves are taking a moment to load. Please refresh.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <img className="hero-bg" src="/images/hero.png" alt="" aria-hidden="true" />
        <div className="hero-wash" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={15} /> Pakistan&apos;s everyday bazaar
            </span>
            <h1>
              Everyday bazaar,
              <br />
              <em>delivered.</em>
            </h1>
            <p>
              Lawn suits, Peshawari chappals, honest electronics and pantry staples — a
              thoughtfully curated shop for homes from Karachi to Gilgit.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" to="/shop">
                Shop the bazaar <ArrowRight size={17} />
              </Link>
              <Link className="btn btn-outline btn-lg" to="/shop?sort=popular">
                This week&apos;s picks
              </Link>
            </div>
            <div className="hero-trust">
              <div>
                <span className="trust-icon">
                  <Truck size={18} />
                </span>
                <span>
                  <strong>Free delivery</strong>
                  <small>on orders over Rs 5,000</small>
                </span>
              </div>
              <div>
                <span className="trust-icon">
                  <Banknote size={18} />
                </span>
                <span>
                  <strong>Cash on delivery</strong>
                  <small>at your doorstep, nationwide</small>
                </span>
              </div>
            </div>
          </div>

          <div className="hero-cards" aria-hidden="true">
            <div className="hero-float hero-float-top">
              <BadgeCheck size={20} />
              <div>
                <strong>4.8 average rating</strong>
                <small>from 12,000+ shoppers</small>
              </div>
            </div>
            <div className="hero-float hero-float-bottom">
              <Star size={20} fill="currentColor" />
              <div>
                <strong>Loved in 40+ cities</strong>
                <small>Karachi to Gilgit</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="value-strip">
        <div className="container value-strip-inner">
          <div>
            <Truck size={21} />
            <span>
              <strong>Nationwide delivery</strong>
              <small>3–5 working days</small>
            </span>
          </div>
          <div>
            <Banknote size={21} />
            <span>
              <strong>Pay when it arrives</strong>
              <small>COD, Easypaisa, JazzCash or bank</small>
            </span>
          </div>
          <div>
            <RotateCcw size={21} />
            <span>
              <strong>7-day returns</strong>
              <small>simple and no fuss</small>
            </span>
          </div>
          <div>
            <Headphones size={21} />
            <span>
              <strong>Real people on WhatsApp</strong>
              <small>Mon–Sat, 9am–9pm</small>
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Browse the aisles</span>
              <h2>Shop by category</h2>
              <p>Six little departments, one trusted shop.</p>
            </div>
            <Link to="/shop" className="text-link">
              All products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-grid">
            {categories.length === 0 &&
              Array.from({ length: 6 }, (_, index) => (
                <div className="category-card skeleton-card" key={index}>
                  <div className="skeleton skeleton-icon" />
                  <div className="skeleton skeleton-line" />
                </div>
              ))}
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${category.slug}`}
                className={`category-card cat-${category.slug}`}
              >
                <span className="category-icon">
                  <CategoryIcon icon={category.icon} size={24} />
                </span>
                <span className="category-copy">
                  <strong>{category.name}</strong>
                  <small>{category.tagline}</small>
                </span>
                <span className="category-foot">
                  {category.productCount} products
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Handpicked</span>
              <h2>Loved across Pakistan</h2>
              <p>Our most-ordered pieces this season, tested by real homes.</p>
            </div>
            <Link to="/shop?sort=popular" className="text-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loadError && <div className="inline-error">{loadError}</div>}

          <div className="product-grid">
            {loading ? (
              <ProductSkeletons count={8} />
            ) : (
              featured.map((product) => <ProductCard key={product._id} product={product} />)
            )}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="promo-band">
          <div className="promo-copy">
            <span className="eyebrow eyebrow-light">The winter edit</span>
            <h2>
              Warm layers,
              <br />
              cosy corners.
            </h2>
            <p>
              Soft cotton for the bed, slow evenings with chai, and small beautiful things
              for the table. A quieter kind of season, sorted.
            </p>
            <Link className="btn btn-accent btn-lg" to="/shop?sort=newest">
              Shop the edit <ArrowRight size={17} />
            </Link>
          </div>
          <div className="promo-art" aria-hidden="true">
            <div className="promo-arch">
              <Sparkles size={34} />
              <Leaf size={26} />
              <span>Winter, sorted.</span>
            </div>
            <div className="promo-chip promo-chip-a">
              <ShieldCheck size={16} /> 7-day returns
            </div>
            <div className="promo-chip promo-chip-b">
              <Truck size={16} /> Free over Rs 5,000
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Fresh on the shelves</span>
              <h2>New this week</h2>
              <p>New finds, added by our team in Lahore and Karachi.</p>
            </div>
            <Link to="/shop?sort=newest" className="text-link">
              See what&apos;s new <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid product-grid-four">
            {loading ? (
              <ProductSkeletons count={4} />
            ) : (
              newArrivals.map((product) => <ProductCard key={product._id} product={product} />)
            )}
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <div className="section-head centered">
            <div>
              <span className="eyebrow">Word of mouth</span>
              <h2>Kind words from our customers</h2>
            </div>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <figure className="testimonial-card" key={testimonial.name}>
                <div className="testimonial-stars" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={15} fill="currentColor" />
                  ))}
                </div>
                <blockquote>“{testimonial.quote}”</blockquote>
                <figcaption>
                  <span className="avatar">{testimonial.name.charAt(0)}</span>
                  <span>
                    <strong>{testimonial.name}</strong>
                    <small>{testimonial.city}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
