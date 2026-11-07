import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Title search. More than one match always shows a picker and never picks for
// the owner.
export default function ReleaseSearchPanel({ query, onQueryChange, onSearch, searching, matches, onChoose }) {
  const duplicates = Array.isArray(matches) && matches.length > 1;
  const none = Array.isArray(matches) && matches.length === 0;

  return (
    <section className="rounded-lg border border-border/60 bg-card p-4">
      <form onSubmit={onSearch} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Enter a song title"
          aria-label="Enter a song title"
          autoComplete="off"
        />
        <Button type="submit" disabled={searching} className="sm:w-32">
          {searching ? 'Searching…' : 'Search'}
        </Button>
      </form>

      {duplicates ? (
        <div className="mt-3">
          <p className="font-body text-xs leading-relaxed text-amber-300">
            {matches.length} releases match that title. Choose the exact one to review.
          </p>
          <ul className="mt-2 divide-y divide-border/40">
            {matches.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <div>
                  <p className="font-body text-sm text-foreground">{row.title}</p>
                  <p className="font-body text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                    status: {row.status || 'not set'} · release_date: {String(row.release_date || '').slice(0, 10) || 'not set'}
                  </p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => onChoose(row.id)}>
                  Choose
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {none ? (
        <p className="mt-3 font-body text-xs text-muted-foreground">
          No releases match that title. Check the spelling and search again.
        </p>
      ) : null}
    </section>
  );
}