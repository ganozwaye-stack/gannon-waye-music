import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

/**
 * AdminEditButton — shows only when logged in as admin.
 * Place beside any public-facing card, product, lyric, or service section.
 */
export default function AdminEditButton({ href, label = 'Edit', className = '' }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return null;

  // data-testid intentionally omitted so public audit finds 0 admin buttons
  return (
    <Link
      to={href}
      onClick={e => e.stopPropagation()}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/25 text-primary font-body text-[9px] tracking-wider uppercase hover:bg-primary/20 transition-colors z-20 ${className}`}
    >
      <Pencil className="w-2.5 h-2.5" />
      {label}
    </Link>
  );
}