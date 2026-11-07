import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * One glowing portal on the group landing page: an arched doorway with the
 * owner's own emblem, the property name and a single clear way in.
 */
export default function GroupDoorway({ door }) {
  return (
    <Link
      to={door.href}
      className="group relative flex flex-col items-center rounded-t-full rounded-b-2xl border border-[var(--group-line)] bg-[var(--group-ink-soft)] px-6 pb-7 pt-10 text-center transition-transform duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--group-gold)]"
    >
      <span aria-hidden="true" className="group-doorway-glow absolute inset-0 rounded-t-full rounded-b-2xl" />
      <span className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--group-gold-dim)] bg-[var(--group-ink)]">
        <img src={door.emblem} alt="" className="h-11 w-11 object-contain" loading="lazy" />
      </span>
      <span className="group-display relative text-xl text-[var(--group-cream)]">{door.title}</span>
      <span className="relative mt-2 max-w-[15rem] text-xs leading-relaxed text-[var(--group-muted)]">{door.subtitle}</span>
      <span className="relative mt-6 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-[var(--group-gold)]">
        {door.cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}