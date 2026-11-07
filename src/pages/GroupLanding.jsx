import React from 'react';
import { Link } from 'react-router-dom';
import FilmGrain from '@/components/group/FilmGrain';
import GroupDoorway from '@/components/group/GroupDoorway';
import { GROUP_DOORS } from '@/config/groupDoors';

const BRAND_MARK = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/53c9357e2_logo.png';

/**
 * The group landing page at the root. Three doors only: Gannon Waye Music,
 * Coaching and Journals, Wavefront. Thanking You Kindly is a separate ecommerce
 * operation and is deliberately not represented or linked here.
 */
export default function GroupLanding() {
  return (
    <div className="group-site relative min-h-screen overflow-hidden bg-[var(--group-ink)] text-[var(--group-cream)]">
      <FilmGrain />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(245,208,110,0.14),transparent_72%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] bg-[radial-gradient(55%_60%_at_50%_100%,rgba(245,208,110,0.10),transparent_75%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between gap-4 py-7">
          <div className="flex items-center gap-3">
            <img src={BRAND_MARK} alt="" className="h-9 w-9 object-contain" />
            <span className="text-[0.65rem] uppercase tracking-[0.32em] text-[var(--group-muted)]">Independent · Australia</span>
          </div>
          <Link
            to="/contact"
            className="text-[0.65rem] uppercase tracking-[0.24em] text-[var(--group-gold)] transition-opacity hover:opacity-75"
          >
            Contact
          </Link>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center sm:py-24">
          <h1 className="group-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[1.02] text-[var(--group-cream)]">
            Gannon Waye
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--group-muted)] sm:text-base">
            Music written from the lived part of life, coaching and journals for the work underneath,
            and the systems that carry both.
          </p>
        </section>

        <section aria-label="Choose where to go" className="grid gap-5 pb-14 sm:gap-6 md:grid-cols-3">
          {GROUP_DOORS.map((door) => (
            <GroupDoorway key={door.key} door={door} />
          ))}
        </section>

        <footer className="flex flex-col items-center gap-2 border-t border-[var(--group-line)] py-6 text-center text-[0.62rem] uppercase tracking-[0.24em] text-[var(--group-muted)]">
          <span>© {new Date().getFullYear()} Gannon Waye</span>
          <Link to="/contact" className="text-[var(--group-gold)] transition-opacity hover:opacity-75">Enquiries</Link>
        </footer>
      </div>
    </div>
  );
}