import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { artworkWarning, hasValue } from '@/components/release-approval/approvalFields';

export default function ArtworkPreview({ url }) {
  const warning = artworkWarning(url);
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="h-44 w-44 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
        {hasValue(url) ? (
          <img src={String(url)} alt="Release artwork" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-body text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
            No artwork
          </div>
        )}
      </div>
      <div className="min-w-[12rem] flex-1">
        <p className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">artwork_url</p>
        <p className="mt-1 break-all font-body text-xs text-foreground/80">{hasValue(url) ? String(url) : 'NOT BUILT'}</p>
        {warning ? (
          <p className="mt-3 inline-flex items-start gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 font-body text-xs leading-relaxed text-amber-300">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {warning}
          </p>
        ) : (
          <p className="mt-3 font-body text-xs text-emerald-400">Square cover image.</p>
        )}
      </div>
    </div>
  );
}