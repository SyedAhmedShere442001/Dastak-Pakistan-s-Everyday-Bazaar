import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Banknote,
  HeartHandshake,
  MapPin,
  PackageCheck,
  Sparkles,
  Truck
} from 'lucide-react';

const values = [
  {
    icon: Sparkles,
    title: 'Chosen, not scraped',
    text: 'Every product is selected by our small team in Lahore and Karachi — things we would actually use at home.'
  },
  {
    icon: HeartHandshake,
    title: 'Local makers first',
    text: 'From Multan pottery to Mardan chappals, we work with Pakistani makers and small brands wherever we can.'
  },
  {
    icon: Truck,
    title: 'Plain-spoken delivery',
    text: 'Clear timelines, honest shipping charges and a real person on WhatsApp if something goes sideways.'
  }
];

export default function About() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>About Dastak</span>
          </nav>
          <h1>A neighbourhood bazaar, online.</h1>
          <p>
            Dastak began with a simple idea: shopping online in Pakistan should feel as warm
            and trustworthy as walking into a shop where they know your name.
          </p>
        </div>
      </section>

      <section className="container">
        <div className="about-story">
          <div className="about-story-media">
            <img src="/images/hero.png" alt="A flat lay of Pakistani products on cream linen" />
          </div>
          <div className="about-story-copy">
            <span className="eyebrow">Our story</span>
            <h2>Built for the way Pakistan shops.</h2>
            <p>
              We are a small team of four, spread between Lahore and Karachi. We started Dastak
              because finding good everyday things online often meant guessing from blurry
              photos, chasing couriers, or paying for delivery that cost more than the order.
            </p>
            <p>
              So we set out to do the quiet things right: accurate photographs, real stock
              counts, careful packing, fair delivery charges and cash on delivery for anyone who
              wants it. No dark patterns, no surprise fees.
            </p>
            <div className="about-stats">
              <div>
                <strong>40+</strong>
                <span>Cities served</span>
              </div>
              <div>
                <strong>12,000+</strong>
                <span>Happy shoppers</span>
              </div>
              <div>
                <strong>4.8/5</strong>
                <span>Average rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head centered">
            <div>
              <span className="eyebrow">What we care about</span>
              <h2>Three things we refuse to rush</h2>
            </div>
          </div>
          <div className="value-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <article className="value-card" key={title}>
                <span className="value-icon">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-delivery">
          <div className="detail-panel">
            <span className="eyebrow">Delivery</span>
            <h2>From our shelf to your doorstep</h2>
            <ul className="detail-list">
              <li>
                <Truck size={18} />
                <span>
                  Orders are dispatched within 24 hours and usually arrive in 3–5 working days.
                  Remote areas may take a day or two longer.
                </span>
              </li>
              <li>
                <Banknote size={18} />
                <span>
                  Delivery is free over Rs 5,000. Below that, a flat Rs 250 applies anywhere in
                  Pakistan.
                </span>
              </li>
              <li>
                <MapPin size={18} />
                <span>
                  We deliver through trusted courier partners to all major cities, including
                  Karachi, Lahore, Islamabad, Peshawar, Quetta, Gilgit and AJK.
                </span>
              </li>
            </ul>
          </div>

          <div className="detail-panel detail-panel-soft">
            <span className="eyebrow">Returns</span>
            <h2>If it is not quite right</h2>
            <ul className="detail-list">
              <li>
                <PackageCheck size={18} />
                <span>
                  Unused items in original packaging can be returned within 7 days of delivery.
                </span>
              </li>
              <li>
                <HeartHandshake size={18} />
                <span>
                  If something arrives damaged, message us on WhatsApp with a photo and we will
                  make it right.
                </span>
              </li>
              <li>
                <Banknote size={18} />
                <span>
                  Refunds are processed to your original payment method, or as a bank transfer
                  for cash-on-delivery orders.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="cta-band">
          <div>
            <span className="eyebrow eyebrow-light">Ready when you are</span>
            <h2>Come see what is new on the shelves.</h2>
          </div>
          <Link className="btn btn-accent btn-lg" to="/shop">
            Shop the bazaar <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
