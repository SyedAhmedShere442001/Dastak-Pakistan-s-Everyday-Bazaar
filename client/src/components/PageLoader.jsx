import { Loader2 } from 'lucide-react';

export default function PageLoader({ label = 'Loading the bazaar…' }) {
  return (
    <div className="page-loader">
      <Loader2 className="spin" size={28} />
      <p>{label}</p>
    </div>
  );
}
