import { BOUTIQUE_HERO_IMAGE } from '@/config/storeWorldConfig';

// ─────────────────────────────────────────────────────────────────────────
// SYSTEM RULE — LOCKED STOREFRONT HERO  (NON-NEGOTIABLE)
// This neon "GANNON WAYE" retail-store render is the fixed, full-bleed hero
// of the store. It must NEVER be overridden, swapped, moved, or pasted over
// by any agent, admin action, or automation. The ONLY permitted change is to
// the stock shown INSIDE the boutique stage below. Do not edit this URL.
// ─────────────────────────────────────────────────────────────────────────
export default function LockedStorefrontHero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '68vh',
        minHeight: '480px',
        maxHeight: '780px',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      {/* Fixed storefront image — full-bleed, never moved */}
      <img
        src={BOUTIQUE_HERO_IMAGE}
        alt="Thanking You Kindly boutique store"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Legibility veil so the headline reads over the neon render */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(8,8,14,0.28) 0%, rgba(8,8,14,0.08) 38%, rgba(8,8,14,0.52) 78%, rgba(8,8,14,0.92) 100%)',
        }}
      />

      {/* Centered boutique titleplate */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 16px',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.7)',
            marginBottom: '14px',
          }}
        >
          Boutique · Step Inside
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(42px,7vw,86px)',
            letterSpacing: '0.04em',
            margin: 0,
            color: '#D4AF37',
            textShadow: '0 0 26px rgba(212,175,55,0.6), 0 0 60px rgba(212,175,55,0.3)',
          }}
        >
          Thanking You Kindly
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginTop: '18px',
          }}
        >
          Carry the Message
        </p>
      </div>
    </section>
  );
}