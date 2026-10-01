// The one glass panel both hero cards (SET FREE and the welcome) are built on,
// so their edges, padding and button rows line up exactly. Left aligned.
// House style: no em dashes.
export const HERO_BTN_PRIMARY =
  'inline-flex items-center justify-center gap-1.5 h-11 px-6 rounded-full text-[11px] tracking-wider uppercase font-body gradient-gold-button';
export const HERO_BTN_OUTLINE =
  'inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full text-[11px] tracking-wider uppercase font-body border border-primary/40 text-primary hover:bg-primary/10 transition-colors';

export default function HeroGlassPanel({ children }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/25 bg-background/35 p-5 text-left backdrop-blur-md md:p-6">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }}
      />
      {children}
    </div>
  );
}