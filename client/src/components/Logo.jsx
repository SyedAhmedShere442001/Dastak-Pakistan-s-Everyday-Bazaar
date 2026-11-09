import { Link } from 'react-router-dom';

export function LogoMark({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Dastak"
      className="logo-mark-svg"
    >
      <rect width="48" height="48" rx="13" fill="#0b6b53" />
      <path
        d="M14 36V24a10 10 0 0 1 20 0v12"
        fill="none"
        stroke="#fbf8f3"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="33" r="2.6" fill="#e8a33d" />
    </svg>
  );
}

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="logo" aria-label="Dastak — home">
      <LogoMark />
      <span className="logo-text">
        Dastak
        <small>{compact ? 'Pakistan' : "Pakistan's everyday bazaar"}</small>
      </span>
    </Link>
  );
}
