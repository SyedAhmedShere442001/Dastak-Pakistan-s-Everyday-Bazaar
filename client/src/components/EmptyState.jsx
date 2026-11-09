import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, text, actionLabel, actionTo, children }) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-icon">
          <Icon size={30} />
        </span>
      )}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {actionLabel && actionTo && (
        <Link className="btn btn-primary" to={actionTo}>
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
