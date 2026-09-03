import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Music, ShoppingBag, Mail, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';
import { fetchLiveStoreProducts, formatAudPrice } from '@/lib/liveStoreProducts';

const STATIC_PAGES = [
  { label: 'My Story', path: '/this-is-my-life', icon: BookOpen, description: 'About Gannon: ten-episode life series' },
  { label: 'Contact', path: '/contact', icon: Mail, description: 'Music, media, collaboration, or business enquiries' },
  { label: 'Lyrics', path: '/lyrics', icon: FileText, description: 'Read every word' },
  { label: 'Videos', path: '/videos', icon: Music, description: 'Instagram & TikTok content' },
  { label: 'FAQ', path: '/faq', icon: FileText, description: 'Common questions answered' },
];

export default function SiteSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const { data: releaseCandidates = [] } = useQuery({
    queryKey: ['site-search-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 100),
    initialData: [],
  });
  const releases = releaseCandidates.filter(isPublicRelease);

  const { data: products = [] } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => fetchLiveStoreProducts(),
    initialData: [],
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const matchedPages = STATIC_PAGES.filter(p =>
    p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  const matchedReleases = releases.filter((release) =>
    release.title?.toLowerCase().includes(q) || release.description?.toLowerCase().includes(q)
  );

  const matchedProducts = products.filter(p =>
    p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
  );

  const hasResults = matchedPages.length + matchedReleases.length + matchedProducts.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label="Search the Gannon Waye site"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-w-2xl w-full mx-auto px-3 sm:px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-20 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-10">
        {/* Search input */}
        <div className="relative flex items-center gap-2 sm:gap-3 bg-card border border-primary/30 rounded-2xl px-3 sm:px-5 py-3 sm:py-4 mb-4 sm:mb-8">
          <Search className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            name="site-search"
            aria-label="Search music, merchandise, and stories"
            placeholder="Search music, merch, stories..."
            className="flex-1 min-w-0 bg-transparent font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-10 w-10 -mr-2 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100dvh-7rem)] sm:max-h-[60vh] pb-4">
          {q === '' && (
            <div className="space-y-2">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 px-1 mb-3">Quick Links</p>
              {STATIC_PAGES.slice(0, 5).map(page => (
                <ResultItem key={page.path} icon={page.icon} label={page.label} description={page.description} path={page.path} onClose={onClose} />
              ))}
            </div>
          )}

          {q !== '' && !hasResults && (
            <p className="font-body text-sm text-muted-foreground text-center py-10">No results for &ldquo;{query}&rdquo;</p>
          )}

          {q !== '' && matchedReleases.length > 0 && (
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 px-1 mb-3">Music</p>
              <div className="space-y-2">
                {matchedReleases.map(r => (
                  <ResultItem key={r.id} icon={Music} label={r.title} description={r.description || r.type} path={`/release/${r.id}`} onClose={onClose} />
                ))}
              </div>
            </div>
          )}

          {q !== '' && matchedProducts.length > 0 && (
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 px-1 mb-3">Merch</p>
              <div className="space-y-2">
                {matchedProducts.map(p => (
                  <ResultItem key={p.id} icon={ShoppingBag} label={p.name} description={`${formatAudPrice(p.sale_price)} AUD`} path="/store" onClose={onClose} />
                ))}
              </div>
            </div>
          )}

          {q !== '' && matchedPages.length > 0 && (
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 px-1 mb-3">Pages</p>
              <div className="space-y-2">
                {matchedPages.map(page => (
                  <ResultItem key={page.path} icon={page.icon} label={page.label} description={page.description} path={page.path} onClose={onClose} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ResultItem({ icon: Icon, label, description, path, onClose }) {
  return (
    <Link
      to={path}
      onClick={onClose}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">{label}</p>
        {description && <p className="font-body text-xs text-muted-foreground line-clamp-1">{description}</p>}
      </div>
    </Link>
  );
}