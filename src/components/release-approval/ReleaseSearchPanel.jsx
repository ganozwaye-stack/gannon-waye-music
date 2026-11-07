import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Search by title, then either open the one match or show a picker. Duplicate
// titles exist, so a picker never auto-picks.
export default function ReleaseSearchPanel({
  query, onQueryChange, onSearch, searching, matches, notFoundQuery, suggestions, onOpen,
}) {
  const showPicker = Array.isArray(matches) && matches.length > 1;
  const showNone = Array.isArray(matches) && matches.length === 0;

  return (
    <section className="rounded-lg border border-border/60 bg-card p-5">
      <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="mb-1 block font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">
            Release title
          </span>
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Enter a song title to begin"
            aria-label="Enter a song title to begin"
            autoFocus
          />
        </label>
        <Button type="submit" disabled={searching} className="sm:mt-5">
          <Search className="mr-1.5 h-4 w-4" />
          {searching ? 'Searching…' : 'Find release'}
        </Button>
      </form>

      {showPicker ? (
        <div className="mt-4">
          <p className="font-body text-xs text-amber-300">
            {matches.length} records share that title. Pick the exact record.
          </p>
          <ul className="mt-2 divide-y divide-border/40 rounded-md border border-border/60">
            {matches.map((record) => (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() => onOpen(record.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-primary/5"
                >
                  <span className="font-body text-sm text-foreground">{record.title}</span>
                  <span className="font-body text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {record.status || 'NOT BUILT'} · {record.release_date || 'no date'} · {record.id}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showNone ? (
        <div className="mt-4">
          <p className="font-body text-sm text-foreground">No release titled “{notFoundQuery}”.</p>
          <p className="mt-1 font-body text-xs text-muted-foreground">
            Nothing was created. Closest titles:
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((title) => (
              <li key={title} className="rounded-full border border-border/60 px-3 py-1 font-body text-xs text-foreground/80">
                {title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}