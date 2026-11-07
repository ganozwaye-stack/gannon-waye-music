import React from 'react';
import { isHeroImage, isSet } from '@/components/release-approval/approvalFields';

// The artwork field, as a thumbnail. A site hero image is called out, never
// presented as a cover.
export default function ArtworkPreview({ url }) {
  const hero = isHeroImage(url);

  return (
    <div className="space-y-2">
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
      <p className="break-all font-body text-xs text-muted-foreground">{isSet(url) ? url : 'artwork_url'}</p>
      {hero ? (
        <p className="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 font-body text-xs leading-relaxed text-amber-300">
          This is the site hero image, not a cover
        </p>
      ) : null}
    </div>
  );
}