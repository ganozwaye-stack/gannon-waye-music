import React from 'react';
import { isHeroPlaceholder, isSet } from '@/components/release-control-review/reviewValues';

// artwork_url as a thumbnail plus the raw URL text.
export default function ArtworkBlock({ url }) {
  return (
    <section className="rounded-lg border border-border/60 bg-card p-4">
      <h2 className="font-display text-lg text-foreground">Artwork</h2>
      <div className="mt-3 space-y-2">
        {isSet(url) ? (
          <img
            src={url}
            alt="Release artwork"
            className="h-40 w-40 rounded-md border border-border/60 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed border-border/70 bg-secondary/40">
            <span className="rounded border border-border/70 bg-secondary/60 px-2 py-0.5 font-body text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
              NOT SET
            </span>
          </div>
        )}
        <p className="break-all font-mono text-[0.68rem] text-muted-foreground">
          {isSet(url) ? url : 'artwork_url: NOT SET'}
        </p>
        {isHeroPlaceholder(url) ? (
          <p className="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 font-body text-xs leading-relaxed text-amber-300">
            Site hero placeholder, not a cover
          </p>
        ) : null}
      </div>
    </section>
  );
}