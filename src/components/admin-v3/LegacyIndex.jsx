import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, Filter } from 'lucide-react';
import { SectionCard, StatusBadge, LoadingState, EmptyState } from '@/components/admin-v3/shared/SharedComponents';
import { LEGACY_ROUTES, WORKSPACES, getRouteStats } from '@/lib/adminV3Routes';
import { ROUTE_CLASSIFICATIONS, ROUTE_RECOMMENDATIONS } from '@/lib/adminV3Adapters';

export default function LegacyIndex() {
  const [search, setSearch] = useState('');
  const [workspaceFilter, setWorkspaceFilter] = useState('all');
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [sidebarFilter, setSidebarFilter] = useState('all');

  const stats = getRouteStats();

  const filtered = useMemo(() => {
    let result = LEGACY_ROUTES;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => r.label.toLowerCase().includes(q) || r.path.toLowerCase().includes(q));
    }
    if (workspaceFilter !== 'all') result = result.filter(r => r.workspace === workspaceFilter);
    if (classificationFilter !== 'all') result = result.filter(r => r.classification === classificationFilter);
    if (sidebarFilter !== 'all') result = result.filter(r => sidebarFilter === 'in' ? r.inSidebar : !r.inSidebar);
    return result;
  }, [search, workspaceFilter, classificationFilter, sidebarFilter]);

  const grouped = useMemo(() => {
    const groups = {};
    WORKSPACES.forEach(w => groups[w] = []);
    filtered.forEach(r => { if (groups[r.workspace]) groups[r.workspace].push(r); });
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Routes</p><p className="text-xl font-semibold text-foreground">{stats.total}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">In Sidebar</p><p className="text-xl font-semibold text-foreground">{stats.inSidebar}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Not In Sidebar</p><p className="text-xl font-semibold text-orange-400">{stats.notInSidebar}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Primary</p><p className="text-xl font-semibold text-green-400">{stats.byClassification.primary || 0}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Duplicate Candidates</p><p className="text-xl font-semibold text-red-400">{stats.byClassification.duplicate_candidate || 0}</p></div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search routes by name or path…"
            className="w-full bg-secondary/30 border border-border/40 rounded-lg pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
          />
        </div>
        <select value={workspaceFilter} onChange={e => setWorkspaceFilter(e.target.value)} className="bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground">
          <option value="all">All workspaces</option>
          {WORKSPACES.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <select value={classificationFilter} onChange={e => setClassificationFilter(e.target.value)} className="bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground">
          <option value="all">All types</option>
          {Object.keys(ROUTE_CLASSIFICATIONS).map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={sidebarFilter} onChange={e => setSidebarFilter(e.target.value)} className="bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-xs text-foreground">
          <option value="all">All routes</option>
          <option value="in">In sidebar</option>
          <option value="out">Not in sidebar</option>
        </select>
      </div>

      {/* ── Route list grouped by workspace ── */}
      <div className="space-y-4">
        {WORKSPACES.map(ws => {
          const routes = grouped[ws] || [];
          if (routes.length === 0) return null;
          return (
            <SectionCard key={ws} title={ws} count={routes.length}>
              <div className="p-2 space-y-1">
                {routes.map(route => (
                  <div key={route.path} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors">
                    <Link to={route.path} className="flex-1 min-w-0 group">
                      <p className="text-sm text-foreground/80 group-hover:text-primary truncate">{route.label}</p>
                      <p className="text-[10px] text-muted-foreground/40 truncate">{route.path}</p>
                    </Link>
                    <span className="text-[9px] text-muted-foreground/50 whitespace-nowrap hidden md:inline">{route.classification.replace(/_/g, ' ')}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border whitespace-nowrap ${route.inSidebar ? 'text-green-400 border-green-500/20' : 'text-orange-400 border-orange-500/20'}`}>
                      {route.inSidebar ? 'sidebar' : 'hidden'}
                    </span>
                    <span className="text-[9px] text-muted-foreground/40 whitespace-nowrap hidden lg:inline" title={ROUTE_RECOMMENDATIONS[route.recommendation]}>
                      {route.recommendation}
                    </span>
                    <Link to={route.path} className="text-muted-foreground/30 hover:text-primary"><ExternalLink className="w-3 h-3" /></Link>
                  </div>
                ))}
              </div>
            </SectionCard>
          );
        })}
        {filtered.length === 0 && (
          <SectionCard title="No results">
            <EmptyState message={`No routes found matching your filters.`} />
          </SectionCard>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="border border-border/20 rounded-lg px-4 py-3 bg-card/20">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Classification Legend</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {Object.entries(ROUTE_CLASSIFICATIONS).map(([key, desc]) => (
            <div key={key} className="flex items-start gap-2">
              <span className="text-[9px] text-muted-foreground/70 uppercase whitespace-nowrap mt-0.5">{key.replace(/_/g, ' ')}:</span>
              <span className="text-[10px] text-muted-foreground/50">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}