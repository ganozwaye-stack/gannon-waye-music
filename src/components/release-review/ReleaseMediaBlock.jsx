import React from 'react';
import { ImageOff } from 'lucide-react';

/** Artwork and the listen, side by side at the top of the review screen. */
export default function ReleaseMediaBlock({ form }) {
  return (
    <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-[150px_minmax(0,1fr)]">
      <div className="aspect-square w-full max-w-[150px] overflow-hidden rounded-md border border-border bg-secondary">
        {form.artwork_url ? (
          <img src={form.artwork_url} alt={`${form.title || 'Release'} artwork`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageOff className="h-5 w-5" />
            <span className="text-[0.6rem] uppercase tracking-[0.16em]">No artwork</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-2">
        <h2 className="font-display text-2xl leading-tight text-foreground">{form.title || 'Untitled release'}</h2>
        <p className="text-xs text-muted-foreground">
          {form.version_label || 'No version label'} · {(form.type || 'single')} · {(form.status || 'unknown').replace(/_/g, ' ')}
          {form.release_date ? ` · ${form.release_date}` : ''}
        </p>
        {form.audio_preview_url ? (
          <audio controls preload="none" src={form.audio_preview_url} className="mt-2 w-full">
            Your browser does not support audio playback.
          </audio>
        ) : (
          <p className="mt-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            No audio attached yet. Paste a preview link under Listen and identifiers to hear it here.
          </p>
        )}
      </div>
    </div>
  );
}