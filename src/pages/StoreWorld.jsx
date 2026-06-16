import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORE_PRODUCTS, BOUTIQUE_HERO_IMAGE } from '@/config/storeWorldConfig';
import StoreWorldHotspot from '@/components/store/StoreWorldHotspot';
import BoutiqueScene from '@/components/store/BoutiqueScene';
import ProductQuickViewModal from '@/components/store/ProductQuickViewModal';

const ACCENT = '#D4AF37';

export default function StoreWorld() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null); // productId string

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <div style={{
        textAlign: 'center',
        padding: '56px 24px 28px',
        background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)',
      }}>
        <p style={{ color: '#555', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '14px' }}>
          Official Merch Boutique
        </p>

        {/* Illuminated sign */}
        <div style={{ display: 'inline-block', position: 'relative', marginBottom: '10px' }}>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 6.5vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1,
            background: `linear-gradient(135deg, #B8860B 0%, ${ACCENT} 30%, #FFF8DC 50%, ${ACCENT} 70%, #B8860B 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'glowPulse 3.5s ease-in-out infinite',
          }}>
            GANNON WAYE
          </h1>
          <div style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
            marginTop: '8px',
            boxShadow: `0 0 14px rgba(212,175,55,0.9)`,
          }} />
        </div>

        <p style={{
          color: '#777',
          fontSize: '13px',
          letterSpacing: '0.12em',
          lineHeight: 1.7,
          maxWidth: '520px',
          margin: '14px auto 0',
        }}>
          Step inside the official <em>Thankyou</em> merch boutique.<br />
          Explore the <em>Respect Is Earned</em> collection, bundles, posters and collectables.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
          <button type="button" onClick={() => navigate('/store')} style={btnStyle('primary')}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Shop All Merch
          </button>
          <button type="button" onClick={() => navigate('/store/cart-details')} style={btnStyle('outline')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.8)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
          >
            View Cart →
          </button>
          <button type="button" onClick={() => navigate('/current-single')} style={btnStyle('ghost')}
            onMouseEnter={e => e.currentTarget.style.color = ACCENT}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            Listen to Thankyou →
          </button>
        </div>
      </div>

      {/* ── IMMERSIVE BOUTIQUE STAGE ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px 16px' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(212,175,55,0.18)',
          boxShadow: `0 0 80px rgba(212,175,55,0.08), 0 40px 80px rgba(0,0,0,0.7)`,
        }}>
          {/* Boutique visual */}
          {BOUTIQUE_HERO_IMAGE ? (
            <img
              src={BOUTIQUE_HERO_IMAGE}
              alt="Gannon Waye Boutique Store — enter to explore merch"
              style={{ width: '100%', height: 'auto', display: 'block', minHeight: '400px', objectFit: 'cover' }}
            />
          ) : (
            <BoutiqueScene />
          )}

          {/* Hotspot overlay */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
            {STORE_PRODUCTS.map(product => (
              <StoreWorldHotspot
                key={product.id}
                product={product}
                onOpenModal={setActiveModal}
              />
            ))}
          </div>

          {/* Bottom scrim */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '100px',
            background: 'linear-gradient(transparent, rgba(10,10,10,0.95))',
            zIndex: 9, pointerEvents: 'none',
          }} />
        </div>

        {/* Instructions */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(212,175,55,0.4)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          margin: '16px 0 44px',
        }}>
          Hover or tap zones to explore · Click to quick-view & shop
        </p>

        {/* ── MOBILE PRODUCT CARD GRID ── */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '10px',
          letterSpacing: '0.28em',
          color: '#444',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: '20px',
        }}>
          Shop All Products
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '14px',
          marginBottom: '48px',
        }}>
          {STORE_PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              navigate={navigate}
              onOpenModal={setActiveModal}
            />
          ))}
        </div>

        {/* View full store */}
        <div style={{ textAlign: 'center', paddingBottom: '56px' }}>
          <button
            type="button"
            onClick={() => navigate('/store')}
            style={btnStyle('outline')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.8)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
          >
            View Full Store & Checkout →
          </button>
        </div>
      </div>

      {/* ── QUICK-VIEW MODAL ── */}
      {activeModal && (
        <ProductQuickViewModal
          productId={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}

      <style>{`
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 28px rgba(212,175,55,0.55)) drop-shadow(0 0 56px rgba(212,175,55,0.25)); }
          50%       { filter: drop-shadow(0 0 48px rgba(212,175,55,0.85)) drop-shadow(0 0 96px rgba(212,175,55,0.45)); }
        }
      `}</style>
    </div>
  );
}

// ── Product card (mobile + desktop grid) ────────────────────────────────────
function ProductCard({ product, navigate, onOpenModal }) {
  const isSoldOut = product.status === 'sold_out';
  const isMemorial = product.status === 'memorial';

  const handleClick = () => {
    if (isMemorial) { navigate(product.link); return; }
    onOpenModal(product.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: isMemorial
          ? 'linear-gradient(135deg, rgba(255,210,160,0.06), rgba(255,180,120,0.02))'
          : 'linear-gradient(135deg, rgba(212,175,55,0.05), rgba(212,175,55,0.01))',
        border: `1px solid ${isMemorial ? 'rgba(255,210,160,0.18)' : 'rgba(212,175,55,0.18)'}`,
        borderRadius: '10px',
        padding: '18px 16px',
        cursor: 'pointer',
        opacity: isSoldOut ? 0.7 : 1,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = isMemorial ? 'rgba(255,210,160,0.45)' : 'rgba(212,175,55,0.5)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isMemorial ? '0 8px 24px rgba(255,210,160,0.08)' : '0 8px 24px rgba(212,175,55,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isMemorial ? 'rgba(255,210,160,0.18)' : 'rgba(212,175,55,0.18)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {product.badge && (
        <span style={{
          position: 'absolute', top: '10px', right: '10px',
          fontSize: '8px', fontWeight: 800, letterSpacing: '0.07em',
          padding: '2px 6px', borderRadius: '3px',
          background: isSoldOut ? 'rgba(120,0,0,0.9)' : isMemorial ? 'rgba(255,210,160,0.12)' : 'rgba(212,175,55,0.88)',
          color: isSoldOut ? '#fff' : isMemorial ? '#ffd6a5' : '#111',
          textTransform: 'uppercase',
        }}>
          {product.badge}
        </span>
      )}

      <div style={{ fontSize: '20px', marginBottom: '10px' }}>{isMemorial ? '♡' : '🛍️'}</div>

      <div style={{ color: isMemorial ? '#ffd6a5' : '#D4AF37', fontSize: '12px', fontWeight: 700, lineHeight: 1.35, marginBottom: '5px' }}>
        {product.name}
      </div>

      <div style={{ color: '#555', fontSize: '10px', marginBottom: '12px', lineHeight: 1.4 }}>
        {product.tooltip}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span style={{ color: isSoldOut ? '#e05555' : isMemorial ? '#ffd6a5' : '#f0f0f0', fontSize: '14px', fontWeight: 700 }}>
            {isSoldOut ? 'Sold Out' : isMemorial ? 'Tribute' : product.price}
          </span>
          {product.priceNote && !isSoldOut && !isMemorial && (
            <span style={{ color: '#555', fontSize: '10px', marginLeft: '4px' }}>{product.priceNote}</span>
          )}
        </div>
        <span style={{ color: isMemorial ? 'rgba(255,210,160,0.4)' : 'rgba(212,175,55,0.4)', fontSize: '11px' }}>
          {isSoldOut ? 'Waitlist →' : isMemorial ? 'Visit →' : 'Quick View →'}
        </span>
      </div>
    </button>
  );
}

// ── Button styles ─────────────────────────────────────────────────────────
function btnStyle(variant) {
  const base = {
    padding: '11px 26px', borderRadius: '6px',
    fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
    fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', border: 'none',
  };
  if (variant === 'primary') return { ...base, background: 'linear-gradient(135deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37, #B8860B)', color: '#111', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' };
  if (variant === 'outline') return { ...base, background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', color: '#D4AF37' };
  if (variant === 'ghost') return { ...base, background: 'transparent', border: 'none', color: '#888', padding: '11px 16px' };
  return base;
}