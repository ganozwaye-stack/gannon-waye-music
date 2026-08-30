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
        background: '#0a0a0a'
      }}>
      
      {/* Fixed storefront image — full-bleed, never moved */}
      <img
        src={BOUTIQUE_HERO_IMAGE}
        alt="Gannon Waye Boutique — official merch store"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }} />
      

      {/* Legibility veil so the headline reads over the neon render */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
          'linear-gradient(to bottom, rgba(8,8,14,0.28) 0%, rgba(8,8,14,0.08) 38%, rgba(8,8,14,0.52) 78%, rgba(8,8,14,0.92) 100%)'
        }} />
      

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
          padding: '0 16px'
        }}>
        
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.7)',
            marginBottom: '14px'
          }}>
          
          Boutique · Step Inside
        </p>

        {/* Neon name — restored */}
        <h1
          className="gw-neon-name"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#FDF4E0',
            margin: 0,
            lineHeight: 1,
            textShadow:
              '0 0 6px rgba(253,244,224,0.9), 0 0 18px rgba(212,175,55,0.7), 0 0 42px rgba(212,175,55,0.45), 0 0 80px rgba(212,175,55,0.25)',
            animation: 'gwNeonPulse 3.6s ease-in-out infinite',
          }}>
          Gannon Waye
        </h1>

        {/* Thin gold underline */}
        <div
          style={{
            width: 'clamp(120px, 22vw, 280px)',
            height: '1px',
            margin: '18px 0 14px',
            background: 'linear-gradient(90deg, transparent, #C5A059 25%, #C5A059 75%, transparent)',
            boxShadow: '0 0 10px rgba(197,160,89,0.6)',
          }}
        />

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#EAEAEA',
            margin: 0,
            fontWeight: 500,
          }}>
          Merch Store
        </p>
      </div>

      <style>{`
        @keyframes gwNeonPulse {
          0%, 100% { text-shadow: 0 0 6px rgba(253,244,224,0.85), 0 0 16px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.4); }
          50%       { text-shadow: 0 0 8px rgba(253,244,224,1), 0 0 24px rgba(212,175,55,0.85), 0 0 58px rgba(212,175,55,0.55), 0 0 96px rgba(212,175,55,0.3); }
        }
      `}</style>
    </section>);

}