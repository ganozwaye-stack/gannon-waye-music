import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { MERCH_DROP_AT } from '@/config/merchDrop';

// Full-width banner along the bottom of the home hero: the Set Free merch
// drop, stretched the whole length of the page as the owner directed.
// Live countdown until 5pm AEST, then a shop-it-now strip.
const pad = (n) => String(n).padStart(2, '0');

export default function MerchDropBanner() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = MERCH_DROP_AT - now;
  const dropped = diff <= 0;
  const s = Math.max(0, Math.floor(diff / 1000));

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-primary/40 bg-[#05060b]/85 backdrop-blur-md">
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)' }} />
      <Link to="/store" className="group flex items-center justify-between gap-4 px-5 md:px-10 py-3">
        <span className="flex items-center gap-2.5 min-w-0">
          <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
          <span className="font-body text-[10px] md:text-xs tracking-[0.22em] uppercase gradient-gold-glow truncate">
            {dropped ? 'The Set Free merch has dropped · Shop the collection' : 'The Set Free merch drop · Today 5pm AEST'}
          </span>
        </span>
        {!dropped && (
          <span className="font-body text-xs md:text-sm font-bold tabular-nums tracking-[0.2em] text-primary whitespace-nowrap">
            {pad(Math.floor(s / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}
          </span>
        )}
        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
      </Link>
    </div>
  );
}