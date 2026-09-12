import HeroOrbitRing from '@/components/public/HeroOrbitRing';
import { HERO_HEART_ART } from '@/lib/heroDesignDefaults';

// A scaled, live mirror of the public hero so the owner sees exactly what is
// locked in, before saving it live.
export default function HeroDesignPreview({ settings, title = 'Set Free' }) {
  const s = settings;
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/40"
      style={{ background: '#0a0a0e' }}
      aria-label="Hero design live preview"
    >
      {/* Galaxy plate. The over-scan bleeds it past every edge so no baked
          edge of the image can ever show, at any screen size. */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: `-${s.galaxy_scan_pct}%`,
          background: `radial-gradient(90% 70% at 50% ${s.galaxy_pos_y}%, rgba(212,175,55,0.09), rgba(10,10,14,0) 65%)`,
        }}
      />
      {/* Heart plate with the tilted orbit ring and sparks */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-square" style={{ width: `${36 * s.heart_size_pct / 100}%` }}>
          <img
            src={HERO_HEART_ART}
            alt="Set Free artwork, the heart shell"
            className="relative w-full h-full object-cover rounded-full border-2 border-primary/40 select-none"
            style={{ boxShadow: '0 0 40px rgba(212,175,55,0.35), 0 14px 40px rgba(0,0,0,0.6)' }}
          />
          <HeroOrbitRing ring={s} />
        </div>
      </div>
      {/* Labels */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <p className="font-body text-[8px] tracking-[0.5em] uppercase gradient-gold-text mb-1">
          {s.eyebrow_label}
        </p>
        <h3 className="font-body text-xl tracking-[0.14em] uppercase gradient-gold-glow">
          {title}
        </h3>
      </div>
    </div>
  );
}