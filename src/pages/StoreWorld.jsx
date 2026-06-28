import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { STORE_PRODUCTS, BOUTIQUE_HERO_IMAGE } from '@/config/storeWorldConfig';
import StoreWorldHotspot from '@/components/store/StoreWorldHotspot';
import ProductQuickViewModal from '@/components/store/ProductQuickViewModal';
import MerchGallery from '@/components/store/MerchGallery';
import EditorialProductGrid from '@/components/store/EditorialProductGrid';
import { ShoppingCart, Grid, Music } from 'lucide-react';

const ACCENT = '#D4AF37';

const PRODUCT_EMOJI = {
  'front-hoodie': '🖤', 'back-hoodie': '🖤', 'winter-writing-comfort-bundle': '❄️',
  'journal-pen-thermos-bundle': '📓', 'mug': '☕', 'wall-poster': '🖼️',
  'cd': '💿', 'tote-bag': '👜', 'mums-garden': '🌸'
};

export default function StoreWorld() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO HEADER ── */}
      











































      

      {/* ── IMMERSIVE STORE STAGE ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px 16px' }}>

        {/* Store nav tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px 16px 16px', flexWrap: 'wrap' }}>
          <Link
            to="/store/all"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(212,175,55,0.35)', color: '#D4AF37', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', background: 'transparent', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
          >
            <Grid size={12} /> All Products
          </Link>
          <Link
            to="/music"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', background: 'transparent', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <Music size={12} /> Listen
          </Link>
          <Link
            to="/store/cart"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.55)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', background: 'transparent', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <ShoppingCart size={12} /> Cart
          </Link>
        </div>

        <div style={{
          position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(212,175,55,0.18)',
          boxShadow: `0 0 80px rgba(212,175,55,0.08), 0 40px 80px rgba(0,0,0,0.7)`
        }}>
          {imgFailed ? (
            <div style={{ width: '100%', minHeight: '500px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#444' }}>Store scene unavailable</p>
            </div>
          ) : (
            <img
              src={BOUTIQUE_HERO_IMAGE}
              alt="Gannon Waye Merch Store"
              onError={() => setImgFailed(true)}
              style={{ width: '100%', height: 'auto', display: 'block', minHeight: '400px', objectFit: 'cover', objectPosition: 'center bottom' }}
            />
          )}

          {/* Hotspot overlay */}
          {!imgFailed &&
          <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
            {STORE_PRODUCTS.map((product) =>
              <StoreWorldHotspot key={product.id} product={product} onOpenModal={setActiveModal} />
            )}
          </div>
          }

          {/* Bottom scrim */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(transparent, rgba(10,10,10,0.95))', zIndex: 9, pointerEvents: 'none' }} />
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(212,175,55,0.4)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '16px 0 44px' }}>
          Hover or tap zones to explore · Click to quick-view & shop
        </p>

        {/* ── FEATURED GEAR ── */}
        <FeaturedGear onOpenModal={setActiveModal} />

        {/* ── PRODUCT CARD GRID ── */}
        <h2 style={{ textAlign: 'center', fontSize: '10px', letterSpacing: '0.28em', color: '#444', textTransform: 'uppercase', fontWeight: 600, marginBottom: '20px' }}>
          Gannon Waye Merch Store — Full Collection
        </h2>

        <EditorialProductGrid products={STORE_PRODUCTS} onOpenModal={setActiveModal} />

        {/* ── MERCH GALLERY ── */}
        <MerchGallery />

        <div style={{ textAlign: 'center', paddingBottom: '56px' }}>
          <button
            type="button"
            onClick={() => navigate('/store/all')}
            style={btnStyle('outline')}
            onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(212,175,55,0.1)';e.currentTarget.style.borderColor = 'rgba(212,175,55,0.8)';}}
            onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)';}}>
            
            View Full Product Grid & Checkout →
          </button>
        </div>
      </div>

      {/* ── QUICK-VIEW MODAL ── */}
      {activeModal &&
      <ProductQuickViewModal productId={activeModal} onClose={() => setActiveModal(null)} />
      }

      <style>{`
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 28px rgba(212,175,55,0.55)) drop-shadow(0 0 56px rgba(212,175,55,0.25)); }
          50%       { filter: drop-shadow(0 0 48px rgba(212,175,55,0.85)) drop-shadow(0 0 96px rgba(212,175,55,0.45)); }
        }
      `}</style>
    </div>);

}

function ImageSwiper({ images, name, emoji, aspectRatio = '1' }) {
  const [idx, setIdx] = useState(0);
  const [imgErr, setImgErr] = useState({});
  const validImages = (images || []).filter((_, i) => !imgErr[i]);

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + validImages.length) % validImages.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % validImages.length); };

  const currentSrc = validImages[idx] || null;

  return (
    <div style={{ width: '100%', aspectRatio, background: '#111', overflow: 'hidden', position: 'relative' }}>
      {currentSrc
        ? <img src={currentSrc} alt={name} onError={() => setImgErr(e => ({...e, [idx]: true}))} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.2s' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem' }}>{emoji}</div>
      }
      {validImages.length > 1 && (
        <>
          <button type="button" onClick={prev} style={{ position: 'absolute', left: '4px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', width: '22px', height: '22px', borderRadius: '50%', fontSize: '10px', cursor: 'pointer', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button type="button" onClick={next} style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', width: '22px', height: '22px', borderRadius: '50%', fontSize: '10px', cursor: 'pointer', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '3px', zIndex: 5 }}>
            {validImages.map((_, i) => (
              <button key={i} type="button" onClick={e => { e.stopPropagation(); setIdx(i); }}
                style={{ width: i === idx ? '14px' : '5px', height: '5px', borderRadius: '999px', background: i === idx ? '#D4AF37' : 'rgba(212,175,55,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProductCard({ product, onOpenModal }) {
  const isSoldOut = product.status === 'sold_out';
  const isMemorial = product.status === 'memorial';
  const emoji = PRODUCT_EMOJI[product.id] || '🛍️';

  const navigate = useNavigate();
  const handleClick = () => {
    if (isMemorial) { navigate(product.link); return; }
    onOpenModal(product.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        background: isMemorial ? 'linear-gradient(135deg, rgba(255,210,160,0.06), rgba(255,180,120,0.02))' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isMemorial ? 'rgba(255,210,160,0.18)' : 'rgba(212,175,55,0.18)'}`,
        borderRadius: '10px', padding: 0, cursor: 'pointer', opacity: isSoldOut ? 0.72 : 1,
        overflow: 'hidden', transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = isMemorial ? 'rgba(255,210,160,0.5)' : 'rgba(212,175,55,0.55)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,175,55,0.12)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = isMemorial ? 'rgba(255,210,160,0.18)' : 'rgba(212,175,55,0.18)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'relative' }}>
        <ImageSwiper images={product.images} name={product.name} emoji={emoji} aspectRatio="1" />
        {product.badge && (
          <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '8px', fontWeight: 800, letterSpacing: '0.07em', padding: '2px 6px', borderRadius: '3px', background: isSoldOut ? 'rgba(239,68,68,0.9)' : isMemorial ? 'rgba(255,210,160,0.15)' : 'rgba(212,175,55,0.9)', color: isSoldOut ? '#fff' : isMemorial ? '#ffd6a5' : '#111', textTransform: 'uppercase', zIndex: 10, pointerEvents: 'none' }}>
            {product.badge}
          </span>
        )}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ color: isMemorial ? '#ffd6a5' : '#e8e8e8', fontSize: '12px', fontWeight: 600, lineHeight: 1.35, marginBottom: '4px' }}>
          {product.shortName || product.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: isSoldOut ? '#e05555' : isMemorial ? '#ffd6a5' : ACCENT, fontSize: '13px', fontWeight: 700 }}>
            {isMemorial ? 'Tribute' : product.price || 'Sold Out'}
          </span>
          <span style={{ color: 'rgba(212,175,55,0.4)', fontSize: '10px' }}>
            {isSoldOut ? 'Waitlist →' : isMemorial ? 'Visit →' : 'View →'}
          </span>
        </div>
      </div>
    </button>
  );
}

const FEATURED_IDS = ['winter-writing-comfort-bundle', 'front-hoodie', 'journal-pen-thermos-bundle'];

function FeaturedCard({ product, isHero, onOpenModal }) {
  const emoji = PRODUCT_EMOJI[product.id] || '🛍️';
  return (
    <button
      type="button"
      onClick={() => onOpenModal(product.id)}
      style={{
        display: 'block', textAlign: 'left', padding: 0, border: 'none', cursor: 'pointer',
        background: isHero ? 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))' : 'rgba(255,255,255,0.03)',
        outline: `1px solid ${isHero ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.15)'}`,
        borderRadius: '14px', overflow: 'hidden', transition: 'all 0.22s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.outline = '1px solid rgba(212,175,55,0.6)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(212,175,55,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.outline = `1px solid ${isHero ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.15)'}`; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'relative' }}>
        <ImageSwiper images={product.images} name={product.name} emoji={emoji} aspectRatio={isHero ? '4/3' : '3/2'} />
        {isHero && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: '4px', background: 'rgba(212,175,55,0.92)', color: '#111', textTransform: 'uppercase', zIndex: 10, pointerEvents: 'none' }}>
            ★ Best Seller
          </div>
        )}
        {product.badge && !isHero && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '8px', fontWeight: 800, letterSpacing: '0.07em', padding: '2px 6px', borderRadius: '3px', background: 'rgba(212,175,55,0.9)', color: '#111', textTransform: 'uppercase', zIndex: 10, pointerEvents: 'none' }}>
            {product.badge}
          </div>
        )}
      </div>
      <div style={{ padding: isHero ? '18px 20px' : '14px 16px' }}>
        <div style={{ color: '#f0e8d8', fontSize: isHero ? '15px' : '13px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.3 }}>{product.shortName || product.name}</div>
        {isHero && product.description && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', lineHeight: 1.6, margin: '4px 0 10px' }}>
            {product.description.slice(0, 90)}…
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ color: ACCENT, fontSize: isHero ? '17px' : '14px', fontWeight: 800 }}>{product.price}</span>
          <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: '10px', letterSpacing: '0.1em' }}>SHOP NOW →</span>
        </div>
      </div>
    </button>
  );
}

function FeaturedGear({ onOpenModal }) {
  const featured = STORE_PRODUCTS.filter(p => FEATURED_IDS.includes(p.id));

  return (
    <div style={{ marginBottom: '56px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <p style={{ fontSize: '9px', letterSpacing: '0.32em', color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Most Popular</p>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f0e8d8', letterSpacing: '0.04em', margin: 0 }}>Featured Gear</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {featured.map((product, i) => (
          <FeaturedCard key={product.id} product={product} isHero={i === 0} onOpenModal={onOpenModal} />
        ))}
      </div>
    </div>
  );
}

function btnStyle(variant) {
  const base = { padding: '11px 26px', borderRadius: '6px', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', border: 'none' };
  if (variant === 'primary') return { ...base, background: 'linear-gradient(135deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37, #B8860B)', color: '#111', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' };
  if (variant === 'outline') return { ...base, background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', color: '#D4AF37' };
  if (variant === 'ghost') return { ...base, background: 'transparent', border: 'none', color: '#888', padding: '11px 16px' };
  return base;
}