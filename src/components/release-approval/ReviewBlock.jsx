import React from 'react';

export default function ReviewBlock({ letter, title, caption, children }) {
  return (
    <section className="rounded-lg border border-border/60 bg-card p-4">
      <header className="mb-3 flex items-baseline gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/50 font-body text-[0.6rem] text-primary">
          {letter}
        </span>
        <h2 className="font-display text-lg text-foreground">{title}</h2>
      </header>
      {caption ? (
        <p className="mb-3 font-body text-xs leading-relaxed text-muted-foreground">{caption}</p>
      ) : null}
      {children}
    </section>
  );
}