import React from 'react';

/** One titled block on the release review screen. */
export default function ReviewSection({ title, description, action, children }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}