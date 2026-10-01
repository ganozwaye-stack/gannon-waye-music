import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// A slim centred pill under the two hero cards pointing at the previous
// release, so it never competes with SET FREE for space.
export default function PreviousReleaseChip({ release, to }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <Link
        to={to}
        className="group inline-flex max-w-full items-center gap-3 rounded-full border border-primary/30 bg-background/40 py-1.5 pl-1.5 pr-4 backdrop-blur"
      >
        {release.artwork_url && (
          <img src={release.artwork_url} alt="" className="h-8 w-8 shrink-0 rounded-full border border-primary/30 object-cover" />
        )}
        <span className="hidden font-body text-[9px] uppercase tracking-[0.3em] text-primary/70 sm:inline">Previous release</span>
        <span className="truncate font-body text-xs uppercase tracking-[0.12em] gradient-gold-text">{release.title}</span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </Link>
      {release.title === 'Without You Here' && (
        <Link
          to="/remember-mum"
          className="inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-wider gradient-gold-text transition-opacity hover:opacity-80"
        >
          Read Mum's story <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}