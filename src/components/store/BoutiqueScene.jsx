/**
 * MerchStoreScene — Interactive CSS luxury Merch Store interior.
 * Renders when BOUTIQUE_HERO_IMAGE is missing or fails to load.
 * All zones are clickable — triggers product quick-view modal via onOpenModal prop.
 *
 * Layout (approved concept):
 *   Back wall: glowing GANNON WAYE sign + Merch Store subtitle
 *   Far-right: poster feature wall
 *   Left hoodie rail: front-print hoodies
 *   Right hoodie rail: back-print hoodies
 *   Centre pedestal: Winter Writing & Comfort Bundle hero
 *   Centre counter: journal/pen/thermos, rolled posters, register
 *   Right shelf: mug + CD/tote
 *   Far-left corner: Mum's Garden tribute nook, spotlight + candles
 *   Warm wood floor
 *   NO microphone, NO speaker, NO performance area.
 */

import { useState } from 'react';

const G = '#D4AF37';
const GOLD_DIM = 'rgba(212,175,55,0.18)';
const GOLD_TEXT = 'rgba(212,175,55,0.5)';

function ZoneButton({ style, label, onClick, children, 'aria-label': ariaLabel }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || label}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        cursor: onClick ? 'pointer' : 'default',
        outline: hovered && onClick ? `1px solid rgba(212,175,55,0.55)` : 'none',
        boxShadow: hovered && onClick ? '0 0 22px rgba(212,175,55,0.25)' : (style?.boxShadow || 'none'),
        transition: 'outline 0.18s, box-shadow 0.18s',
        borderRadius: style?.borderRadius || '6px',
      }}
    >
      {children}
      {hovered && onClick && label && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          marginBottom: '6px', whiteSpace: 'nowrap',
          background: 'rgba(10,8,4,0.95)', border: `1px solid ${GOLD_DIM}`,
          color: G, padding: '4px 10px', borderRadius: '999px',
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          pointerEvents: 'none', zIndex: 50,
          boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
        }}>{label}</div>
      )}
    </div>
  );
}

function ProductImg({ src, emoji = '🛍️', alt, style }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', background: 'rgba(0,0,0,0.3)', ...style }}>
        {emoji}
      </div>
    );
  }
  return <img src={src} alt={alt || ''} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />;
}

export default function BoutiqueScene({ onOpenModal }) {
  const open = (id) => onOpenModal && onOpenModal(id);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '600px',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #050403 0%, #0d0b07 40%, #17120a 100%)',
      fontFamily: "'Inter', sans-serif",
      userSelect: 'none',
    }}>

      {/* ── CEILING DOWNLIGHTS ── */}
      {[18, 38, 62, 82].map(x => (
        <div key={x} style={{
          position: 'absolute', top: 0,
          left: `${x}%`, transform: 'translateX(-50%)',
          width: '180px', height: '140px',
          background: `radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 1,
        }} />
      ))}

      {/* ── BACK WALL ── */}
      <div style={{
        position: 'absolute',
        top: '3%', left: '5%', right: '5%', height: '60%',
        background: 'linear-gradient(180deg, #1a1610 0%, #0e0b07 100%)',
        border: `1px solid rgba(212,175,55,0.06)`,
        zIndex: 2,
      }} />

      {/* ── WALL SIDE PANELS ── */}
      <div style={{ position: 'absolute', top: '3%', left: '5%', width: '12%', height: '60%', background: 'linear-gradient(90deg, #1c1810, #1a1610)', border: `1px solid rgba(212,175,55,0.05)`, borderRight: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: '3%', right: '5%', width: '12%', height: '60%', background: 'linear-gradient(270deg, #1c1810, #1a1610)', border: `1px solid rgba(212,175,55,0.05)`, borderLeft: 'none', zIndex: 2 }} />

      {/* ── GLOWING STORE SIGN ── */}
      <div style={{
        position: 'absolute',
        top: '6%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 10,
      }}>
        <div style={{
          display: 'inline-block',
          padding: '10px 36px 12px',
          border: `1px solid ${GOLD_DIM}`,
          borderRadius: '4px',
          background: 'rgba(0,0,0,0.72)',
          boxShadow: `0 0 60px rgba(212,175,55,0.28), inset 0 0 30px rgba(212,175,55,0.07)`,
        }}>
          <div style={{
            fontSize: 'clamp(1rem, 3.8vw, 2.4rem)',
            fontWeight: 900,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            background: `linear-gradient(90deg, #B8860B 0%, ${G} 30%, #FFF8DC 50%, ${G} 70%, #B8860B 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            GANNON WAYE
          </div>
          <div style={{ fontSize: '9px', color: GOLD_TEXT, letterSpacing: '0.32em', textTransform: 'uppercase', marginTop: '4px' }}>
            Merch Store
          </div>
        </div>
        <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${G}, transparent)`, marginTop: '5px', boxShadow: `0 0 14px rgba(212,175,55,0.9)` }} />
      </div>

      {/* ── POSTER FEATURE WALL (back centre-right) ── */}
      <ZoneButton
        aria-label="Shop Wall Posters"
        label="Shop Posters"
        onClick={() => open('wall-poster')}
        style={{
          position: 'absolute', top: '14%', left: '24%', right: '24%', height: '26%',
          zIndex: 5, display: 'flex', gap: '8px', padding: '6px',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        {[
          { src: '', emoji: '🖼️', label: 'Respect Is Earned' },
          { src: '', emoji: '🖼️', label: 'Thankyou Halo' },
          { src: '', emoji: '🖼️', label: 'Choosing Peace' },
          { src: '', emoji: '🖼️', label: 'No Game' },
        ].map((p, i) => (
          <div key={i} style={{
            flex: i === 0 ? 1.5 : 1,
            border: `1px solid rgba(212,175,55,${i === 0 ? '0.35' : '0.18'})`,
            borderRadius: '2px',
            overflow: 'hidden',
            background: '#0a0800',
            boxShadow: i === 0 ? '2px 2px 14px rgba(212,175,55,0.15)' : '1px 1px 8px rgba(0,0,0,0.7)',
            position: 'relative',
          }}>
            <ProductImg src={p.src} emoji={p.emoji} alt={p.label} style={{ objectFit: 'contain' }} />
            {i === 0 && (
              <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(212,175,55,0.88)', color: '#111', fontSize: '5px', fontWeight: 800, padding: '1px 4px', borderRadius: '2px', textTransform: 'uppercase' }}>
                From $39
              </div>
            )}
          </div>
        ))}
      </ZoneButton>

      {/* ── LEFT HOODIE RAIL (front print) ── */}
      <ZoneButton
        label="Front Print Hoodie — $89"
        onClick={() => open('front-hoodie')}
        style={{
          position: 'absolute', top: '24%', left: '5%', width: '18%',
          zIndex: 6, padding: '0 0 8px 0',
          background: 'transparent',
        }}
      >
        {/* Rail */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, rgba(180,160,100,0.25), rgba(212,175,55,0.7), rgba(180,160,100,0.25))`, borderRadius: '2px', boxShadow: '0 2px 8px rgba(212,175,55,0.3)', marginBottom: '4px' }} />
        {/* Hoodies */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', padding: '0 4px' }}>
          {[
            { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png', emoji: '🖤' },
            { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png', emoji: '🖤' },
            { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png', emoji: '🖤' },
          ].map((h, i) => (
            <div key={i} style={{ flex: 1, aspectRatio: '0.7/1', background: 'linear-gradient(180deg, #2a2a2a, #111)', borderRadius: '4px 4px 6px 6px', overflow: 'hidden', boxShadow: '1px 3px 12px rgba(0,0,0,0.7)', position: 'relative' }}>
              <ProductImg src={h.src} emoji={h.emoji} alt="Front print hoodie" style={{ objectFit: 'contain', padding: '4px' }} />
              {/* Hanger */}
              <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '7px', background: 'rgba(212,175,55,0.5)' }} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '6px', color: GOLD_TEXT, fontSize: '7px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Front Print · $89
        </div>
      </ZoneButton>

      {/* ── RIGHT HOODIE RAIL (back print) ── */}
      <ZoneButton
        label="Back Print Hoodie — $89"
        onClick={() => open('back-hoodie')}
        style={{
          position: 'absolute', top: '24%', right: '5%', width: '18%',
          zIndex: 6, padding: '0 0 8px 0',
          background: 'transparent',
        }}
      >
        <div style={{ height: '3px', background: `linear-gradient(90deg, rgba(180,160,100,0.25), rgba(212,175,55,0.7), rgba(180,160,100,0.25))`, borderRadius: '2px', boxShadow: '0 2px 8px rgba(212,175,55,0.3)', marginBottom: '4px' }} />
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', padding: '0 4px' }}>
          {[
            { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png', emoji: '🖤' },
            { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png', emoji: '🖤' },
            { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png', emoji: '🖤' },
          ].map((h, i) => (
            <div key={i} style={{ flex: 1, aspectRatio: '0.7/1', background: 'linear-gradient(180deg, #2a2a2a, #111)', borderRadius: '4px 4px 6px 6px', overflow: 'hidden', boxShadow: '1px 3px 12px rgba(0,0,0,0.7)', position: 'relative' }}>
              <ProductImg src={h.src} emoji={h.emoji} alt="Back print hoodie" style={{ objectFit: 'contain', padding: '4px' }} />
              <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '7px', background: 'rgba(212,175,55,0.5)' }} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '6px', color: GOLD_TEXT, fontSize: '7px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Back Print · $89
        </div>
      </ZoneButton>

      {/* ── CENTRE COUNTER BASE ── */}
      <div style={{
        position: 'absolute',
        bottom: '30%', left: '22%', right: '22%', height: '8%',
        background: 'linear-gradient(180deg, #2e2412 0%, #1a1208 100%)',
        border: `1px solid rgba(212,175,55,0.25)`,
        borderRadius: '4px',
        boxShadow: '0 4px 24px rgba(212,175,55,0.1), 0 8px 32px rgba(0,0,0,0.6)',
        zIndex: 7,
      }} />

      {/* ── WINTER BUNDLE HERO (centre display) ── */}
      <ZoneButton
        label="Winter Bundle — $129"
        onClick={() => open('winter-writing-comfort-bundle')}
        style={{
          position: 'absolute',
          bottom: '35%', left: '50%', transform: 'translateX(-50%)',
          width: '22%', zIndex: 8,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'transparent',
        }}
      >
        {/* Spotlight */}
        <div style={{ position: 'absolute', top: '-70px', left: '50%', transform: 'translateX(-50%)', width: '180%', height: '100px', background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.28) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ width: '80%', aspectRatio: '1/1', background: '#0a0800', border: `1px solid rgba(212,175,55,0.28)`, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 28px rgba(212,175,55,0.18)' }}>
          <ProductImg src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg" emoji="❄️" alt="Winter Bundle" style={{ objectFit: 'contain', padding: '8px' }} />
        </div>

        <div style={{ display: 'flex', gap: '6px', marginTop: '5px', alignItems: 'flex-end' }}>
          {/* Journal */}
          <div style={{ width: '32px', height: '38px', background: 'linear-gradient(135deg, #1a1200, #2e2200)', border: `1px solid rgba(212,175,55,0.3)`, borderRadius: '2px', overflow: 'hidden' }}>
            <ProductImg src="" emoji="📓" alt="Journal" style={{ objectFit: 'cover' }} />
          </div>
          {/* Thermos */}
          <div style={{ width: '18px', height: '44px', background: 'linear-gradient(180deg, #222, #0d0d0d)', border: `1px solid rgba(212,175,55,0.2)`, borderRadius: '2px 2px 4px 4px', overflow: 'hidden' }}>
            <ProductImg src="" emoji="🫙" alt="Thermos" style={{ objectFit: 'cover' }} />
          </div>
          {/* Pen */}
          <div style={{ width: '6px', height: '40px', background: `linear-gradient(180deg, #B8860B, #D4AF37, #B8860B)`, borderRadius: '3px', boxShadow: '0 1px 6px rgba(212,175,55,0.4)' }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <div style={{ color: G, fontSize: '8px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Winter Bundle</div>
          <div style={{ color: '#666', fontSize: '7px', letterSpacing: '0.08em' }}>$129 + postage</div>
        </div>
      </ZoneButton>

      {/* ── JOURNAL / PEN / THERMOS BUNDLE (beside centre) ── */}
      <ZoneButton
        label="Journal Bundle — $59"
        onClick={() => open('journal-pen-thermos-bundle')}
        style={{
          position: 'absolute',
          bottom: '36%', left: '26%',
          width: '10%', zIndex: 8,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'transparent',
        }}
      >
        <div style={{ width: '100%', aspectRatio: '1/1', background: '#0a0800', border: `1px solid rgba(212,175,55,0.2)`, borderRadius: '6px', overflow: 'hidden' }}>
          <ProductImg src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg" emoji="📓" alt="Journal Bundle" style={{ objectFit: 'contain', padding: '4px' }} />
        </div>
        <div style={{ color: GOLD_TEXT, fontSize: '6px', textAlign: 'center', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Journal<br/>$59</div>
      </ZoneButton>

      {/* ── ROLLED POSTERS (right of centre) ── */}
      <ZoneButton
        label="Wall Posters"
        onClick={() => open('wall-poster')}
        style={{
          position: 'absolute',
          bottom: '36%', right: '26%',
          width: '7%', zIndex: 8,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
          background: 'transparent',
        }}
      >
        {[40, 48, 34].map((h, i) => (
          <div key={i} style={{
            width: '100%', height: `${h}px`,
            background: `linear-gradient(90deg, #1a1208, #${i === 1 ? '2a1e0a' : '141008'}, #0d0a05)`,
            border: `1px solid rgba(212,175,55,${i === 1 ? '0.32' : '0.14'})`,
            borderRadius: '50% / 40%',
            transform: `rotate(${i * 8 - 6}deg)`,
            boxShadow: '1px 2px 8px rgba(0,0,0,0.6)',
          }} />
        ))}
        <div style={{ color: 'rgba(212,175,55,0.3)', fontSize: '5px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>Posters</div>
      </ZoneButton>

      {/* ── REGISTER / CHECKOUT DEVICE ── */}
      <div style={{
        position: 'absolute',
        bottom: '37%', left: 'calc(50% + 12%)',
        width: '7%', zIndex: 8,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ width: '100%', height: '26px', background: 'linear-gradient(135deg, #111, #0a0a0a)', border: `1px solid rgba(212,175,55,0.22)`, borderRadius: '3px 3px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 8px rgba(212,175,55,0.05), 0 0 12px rgba(212,175,55,0.1)' }}>
          <div style={{ width: '75%', height: '12px', background: 'rgba(212,175,55,0.06)', border: `1px solid rgba(212,175,55,0.1)`, borderRadius: '2px' }} />
        </div>
        <div style={{ width: '78%', height: '7px', background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)', border: `1px solid rgba(212,175,55,0.14)`, borderTop: 'none', borderRadius: '0 0 2px 2px' }} />
        <div style={{ color: 'rgba(212,175,55,0.2)', fontSize: '5px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Checkout</div>
      </div>

      {/* ── RIGHT SHELF — MUG + CD + TOTE ── */}
      <div style={{ position: 'absolute', top: '38%', right: '24%', width: '15%', zIndex: 6 }}>
        <div style={{ height: '2px', background: `linear-gradient(90deg, rgba(180,140,60,0.2), rgba(212,175,55,0.55), rgba(180,140,60,0.2))`, borderRadius: '1px', marginBottom: '6px' }} />
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          {/* Mug */}
          <ZoneButton label="Coffee Mug — $9.90" onClick={() => open('mug')} style={{ flex: 1.2, position: 'relative', background: 'transparent' }}>
            <div style={{ paddingBottom: '100%', background: 'linear-gradient(135deg, #1e1e1e, #0d0d0d)', border: `1px solid rgba(212,175,55,0.25)`, borderRadius: '2px 2px 5px 5px', overflow: 'hidden', position: 'relative', boxShadow: '1px 2px 10px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <ProductImg src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d1e8a7822_MugFront.png" emoji="☕" alt="Mug" style={{ objectFit: 'contain', padding: '4px' }} />
              </div>
              <div style={{ position: 'absolute', right: '-5px', top: '20%', width: '6px', height: '30%', border: `1px solid rgba(212,175,55,0.2)`, borderLeft: 'none', borderRadius: '0 3px 3px 0' }} />
            </div>
            <div style={{ textAlign: 'center', color: GOLD_TEXT, fontSize: '5px', marginTop: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Mug · $9.90</div>
          </ZoneButton>
          {/* CD */}
          <ZoneButton label="CD Collection" onClick={() => open('cd')} style={{ flex: 1, position: 'relative', background: 'transparent' }}>
            <div style={{ paddingBottom: '120%', background: 'linear-gradient(135deg, #111, #0a0a0a)', border: `1px solid rgba(212,175,55,0.15)`, borderRadius: '2px', overflow: 'hidden', position: 'relative', boxShadow: '1px 2px 8px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <ProductImg src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png" emoji="💿" alt="CD" style={{ objectFit: 'contain', padding: '3px' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(212,175,55,0.25)', fontSize: '4px', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Sold Out</div>
            </div>
            <div style={{ textAlign: 'center', color: GOLD_TEXT, fontSize: '5px', marginTop: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>CD</div>
          </ZoneButton>
          {/* Tote */}
          <ZoneButton label="Tote Bag" onClick={() => open('tote-bag')} style={{ flex: 1, position: 'relative', background: 'transparent' }}>
            <div style={{ paddingBottom: '110%', background: 'linear-gradient(135deg, #111, #0a0a0a)', border: `1px solid rgba(212,175,55,0.12)`, borderRadius: '2px', overflow: 'hidden', position: 'relative', boxShadow: '1px 2px 8px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <ProductImg src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png" emoji="👜" alt="Tote" style={{ objectFit: 'contain', padding: '3px' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center', color: GOLD_TEXT, fontSize: '5px', marginTop: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tote</div>
          </ZoneButton>
        </div>
      </div>

      {/* ── MUM'S GARDEN TRIBUTE CORNER (far left) ── */}
      <ZoneButton
        label="Mum's Garden — Private Tribute"
        onClick={() => { window.location.href = '/mums-garden'; }}
        aria-label="Visit Mum's Garden tribute"
        style={{
          position: 'absolute',
          bottom: '30%', left: '5%', width: '14%',
          zIndex: 6,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
          background: 'transparent', padding: '0 0 8px',
        }}
      >
        {/* Warm spotlight */}
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '200%', height: '90px', background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,120,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Greenery row */}
        <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
          {[28, 38, 24, 32, 22].map((h, i) => (
            <div key={i} style={{
              width: '14%', height: `${h}px`,
              background: `radial-gradient(ellipse at 50% 70%, rgba(38,72,22,0.9) 0%, rgba(18,38,10,0.7) 100%)`,
              borderRadius: '50% 50% 20% 20%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }} />
          ))}
        </div>

        {/* Candles */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '3px', height: '4px', background: 'radial-gradient(ellipse, #fff7aa 0%, #ffd700 50%, transparent 100%)', borderRadius: '50%', boxShadow: '0 0 6px rgba(255,220,80,0.8)' }} />
              <div style={{ width: '7px', height: '18px', background: 'linear-gradient(180deg, #e8e0d0, #c8c0b0)', borderRadius: '1px', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
            </div>
          ))}
        </div>

        {/* Framed photo */}
        <div style={{ width: '55%', paddingBottom: '65%', position: 'relative', border: `1px solid rgba(255,210,160,0.4)`, background: 'linear-gradient(135deg, #1f1000, #0d0800)', borderRadius: '2px', boxShadow: '0 2px 16px rgba(255,200,140,0.18)' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '3px' }}>
            <div style={{ color: 'rgba(255,210,160,0.55)', fontSize: '16px', lineHeight: 1 }}>♡</div>
            <div style={{ color: 'rgba(255,210,160,0.28)', fontSize: '5px', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>Sonia</div>
          </div>
        </div>

        <div style={{ color: 'rgba(255,210,160,0.5)', fontSize: '6.5px', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.6 }}>
          Mum's<br />Garden
        </div>
      </ZoneButton>

      {/* ── FLOOR ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '32%',
        background: 'linear-gradient(180deg, #100d07 0%, #1c1508 55%, #0d0a04 100%)',
        borderTop: `1px solid rgba(212,175,55,0.04)`,
        zIndex: 3,
      }}>
        {/* Planks */}
        {[18, 36, 55, 74].map(p => (
          <div key={p} style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, height: '1px', background: 'rgba(212,175,55,0.035)' }} />
        ))}
        {[12, 25, 38, 52, 65, 78, 88].map(p => (
          <div key={p} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: '1px', background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.03), transparent)' }} />
        ))}
      </div>

      {/* ── AMBIENT SIDE GLOWS ── */}
      <div style={{ position: 'absolute', top: '3%', left: 0, width: '80px', bottom: '32%', background: 'linear-gradient(90deg, rgba(212,175,55,0.04), transparent)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: '3%', right: 0, width: '80px', bottom: '32%', background: 'linear-gradient(270deg, rgba(212,175,55,0.04), transparent)', pointerEvents: 'none', zIndex: 1 }} />

      {/* ── INTERACTIVE HINT ── */}
      <div style={{
        position: 'absolute', bottom: '33%', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(212,175,55,0.22)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 20,
      }}>
        Hover zones to explore · Click to shop
      </div>
    </div>
  );
}