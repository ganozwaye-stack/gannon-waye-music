import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Releases listed by song title: click one to open its single review screen. */
export default function ReleaseTitleList({ releases, loading, selectedId, onSelect }) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const visible = releases.filter((release) => (
    !needle || `${release.title} ${release.version_label || ''}`.toLowerCase().includes(needle)
  ));

  return (
    <aside className="rounded-lg border border-border bg-card p-3">
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a song title"
          aria-label="Find a song title"
          className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {loading ? (
        <p className="px-2 py-6 text-xs text-muted-foreground">Loading releases…</p>
      ) : (
        <ul className="max-h-[62vh] space-y-1 overflow-y-auto pr-1">
          {visible.map((release) => {
            const active = release.id === selectedId;
            return (
              <li key={release.id}>
                <button
                  type="button"
                  onClick={() => onSelect(release.id)}
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-left transition-colors',
                    active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )}
                >
                  <span className="block text-sm leading-tight">{release.title}</span>
                  <span className="mt-0.5 block text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {release.version_label || 'No version'} · {(release.status || 'unknown').replace(/_/g, ' ')}
                  </span>
                </button>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="px-2 py-6 text-xs text-muted-foreground">No release matches that title.</li>
          )}
        </ul>
      )}
    </aside>
  );
}