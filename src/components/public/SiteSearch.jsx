import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Music, ShoppingBag, Users, BookOpen, FileText, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const STATIC_PAGES = [
  { label: 'About', path: '/about', icon: BookOpen, description: 'About Gannon Waye Music and the independent artist building it' },
  { label: 'My Story', path: '/this-is-my-life', icon: BookOpen, description: 'About Gannon — ten-episode life series' },
  { label: 'Community', path: '/community', icon: Users, description: 'Fan messages and connection' },
  { label: 'Back This Project', path: '/back-this', icon: Heart, description: 'Support the music directly' },
  { label: 'Lyrics', path: '/lyrics', icon: FileText, description: 'Read every word' },
  { label: 'Videos', path: '/videos', icon: Music, description: 'Instagram & TikTok content' },
  { label: 'FAQ', path: '/faq', icon: FileText, description: 'Common questions answered' },
];

export default function SiteSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const { data: products = [] } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }),
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

  const matchedReleases = releases.filter(r =>
    r.is_published && (r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
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
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-w-2xl w-full mx-auto px-4 pt-20 pb-10">
        {/* Search input */}
        <div className="relative flex items-center gap-3 bg-card border border-primary/30 rounded-2xl px-5 py-4 mb-8">
          <Search className="w-5 h-5 text-primary flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search music, merch, stories..."
            className="flex-1 bg-transparent font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6 overflow-y-auto max-h-[60vh]">
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
                  <ResultItem key={r.id} icon={Music} label={r.title} description={r.description || r.type} path="/music" onClose={onClose} />
                ))}
              </div>
            </div>
          )}

          {q !== '' && matchedProducts.length > 0 && (
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 px-1 mb-3">Merch</p>
              <div className="space-y-2">
                {matchedProducts.map(p => (
                  <ResultItem key={p.id} icon={ShoppingBag} label={p.name} description={`$${p.price?.toFixed(2)}`} path="/store" onClose={onClose} />
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
