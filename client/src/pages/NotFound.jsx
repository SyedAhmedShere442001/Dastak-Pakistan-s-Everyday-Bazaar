import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found-inner">
        <span className="not-found-icon">
          <Compass size={32} />
        </span>
        <p className="not-found-code">404</p>
        <h1>This aisle does not exist.</h1>
        <p>
          The page you were looking for may have moved, or the link might be a little off.
          Let&apos;s get you back to the bazaar.
        </p>
        <div className="not-found-actions">
          <Link className="btn btn-primary" to="/">
            <ArrowLeft size={16} /> Back home
          </Link>
          <Link className="btn btn-outline" to="/shop">
            Browse products
          </Link>
        </div>
      </div>
    </section>
  );
}
