import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronLeft, ArrowRight } from 'lucide-react';
import { LEGACY_ROUTES, getRouteStats } from '@/lib/adminV3Routes';

const TABS = [
  { key: 'today', label: 'Today' },
  { key: 'music', label: 'Music & Mastering' },
  { key: 'content', label: 'Content & Publishing' },
  { key: 'store', label: 'Store & Fulfilment' },
  { key: 'coaching', label: 'Coaching & Clients' },
  { key: 'fans', label: 'Fans & Support' },
  { key: 'money', label: 'Money & Payments' },
  { key: 'systems', label: 'Systems & Approvals' },
  { key: 'legacy', label: 'Legacy Index' },
];

const TAB_WORKSPACE_MAP = {
  today: 'Today',
  music: 'Music and Mastering',
  content: 'Content and Publishing',
  store: 'Store and Fulfilment',
  coaching: 'Coaching and Clients',
  fans: 'Fans and Support',
  money: 'Money and Payments',
  systems: 'Systems and Approvals',
};

function GlobalSearch({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return LEGACY_ROUTES.filter(r =>
      r.label.toLowerCase().includes(q) || r.path.toLowerCase().includes(q) || r.workspace.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="Search any admin page…  (⌘K)"
          className="w-full bg-secondary/30 border border-border/40 rounded-lg pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
        />
      </div>
      {open && query.trim() && (
        <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-xs text-muted-foreground">No routes found for "{query}"</p>
          ) : (
            results.map(r => (
              <Link
                key={r.path}
                to={r.path}
                onClick={() => { setQuery(''); setOpen(false); }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{r.label}</p>
                  <p className="text-[10px] text-muted-foreground/50">{r.path}</p>
                </div>
                <span className="text-[9px] text-muted-foreground/40">{r.workspace}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground/30" />
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function OwnerCommandShell({ activeTab, onTabChange, children }) {
  const location = useLocation();
  const stats = getRouteStats();
  const currentWorkspace = TAB_WORKSPACE_MAP[activeTab] || 'Today';

  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="px-4 lg:px-8 py-3 flex items-center gap-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0" title="Back to admin">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Admin</span>
          </Link>
          <div className="hidden lg:block">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary">Owner Command</p>
            <p className="text-sm font-semibold text-foreground">V3 · {currentWorkspace}</p>
          </div>
          <GlobalSearch />
          <Link to="/admin/dashboard" className="text-xs text-muted-foreground hover:text-foreground hidden md:block shrink-0">Old Dashboard →</Link>
        </div>

        {/* ── Tab Bar ── */}
        <div className="px-4 lg:px-8 pb-px overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-4 py-2 text-xs font-medium tracking-wide transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="px-4 lg:px-8 py-2 flex items-center gap-2 text-[10px] text-muted-foreground/50">
        <Link to="/admin" className="hover:text-foreground">Admin</Link>
        <span>/</span>
        <Link to="/admin/owner-command-v3" className="hover:text-foreground">Owner Command V3</Link>
        <span>/</span>
        <span className="text-foreground/70">{currentWorkspace}</span>
        {activeTab === 'legacy' && (
          <span className="ml-auto text-[10px] text-muted-foreground/40">{stats.total} routes · {stats.inSidebar} in sidebar</span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-4 lg:px-8 pb-12">
        {children}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 lg:px-8 py-4 border-t border-border/20">
        <p className="text-[10px] text-muted-foreground/40">
          Owner Command V3 · Read-only aggregation layer · No records created, no automations triggered, no content published · Protected by admin authentication
        </p>
      </div>
    </div>
  );
}