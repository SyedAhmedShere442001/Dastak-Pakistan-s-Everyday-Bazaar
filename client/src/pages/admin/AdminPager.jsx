import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPager({ page, pages, total, onChange }) {
  if (pages <= 1) return null;

  return (
    <div className="admin-pager">
      <span>
        Page {page} of {pages} · {total} total
      </span>
      <div className="admin-pager-buttons">
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={15} /> Previous
        </button>
        <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
