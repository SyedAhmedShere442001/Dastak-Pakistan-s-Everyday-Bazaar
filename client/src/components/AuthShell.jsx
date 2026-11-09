import { BadgeCheck, RotateCcw, Truck } from 'lucide-react';
import Logo from './Logo.jsx';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <section className="auth-page">
      <div className="container auth-layout">
        <aside className="auth-panel">
          <Logo />
          <div className="auth-panel-copy">
            <span className="eyebrow eyebrow-light">Dastak, everyday</span>
            <h1>Good things, delivered to your doorstep.</h1>
            <p>
              One account for orders, faster checkout and little updates when new things
              arrive on the shelves.
            </p>
            <ul>
              <li>
                <Truck size={17} /> Nationwide delivery with cash on delivery
              </li>
              <li>
                <RotateCcw size={17} /> 7-day easy returns
              </li>
              <li>
                <BadgeCheck size={17} /> Handpicked products, honest prices
              </li>
            </ul>
          </div>
          <blockquote className="auth-quote">
            “The blue pottery vase is now the first thing guests ask about.”
            <span>— Hira, Islamabad</span>
          </blockquote>
        </aside>

        <div className="auth-card">
          <div className="auth-card-head">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
          {footer}
        </div>
      </div>
    </section>
  );
}
