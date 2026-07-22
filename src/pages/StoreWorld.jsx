import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { STORE_PRODUCTS, BOUTIQUE_HERO_IMAGE } from '@/config/storeWorldConfig';
import StoreWorldHotspot from '@/components/store/StoreWorldHotspot';
import ProductQuickViewModal from '@/components/store/ProductQuickViewModal';
import MerchGallery from '@/components/store/MerchGallery';
import EditorialProductGrid from '@/components/store/EditorialProductGrid';
import { ShoppingCart, Grid, Music } from 'lucide-react';

const ACCENT = '#D4AF37';

const FEATURED_IDS = [
  '6a2d595ef7bb7ff53258cdfd',
  '69f11d1fc43e13c61fe6b9d7',
  '69fbd261b760426cede1b7a3',
];

export default function StoreWorld() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  const publicProducts = STORE_PRODUCTS.filter(product => product.status !== 'memorial');

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <main style={{ maxWidth: '1680px', margin: '0 auto', padding: '8px 18px 24px' }}>
        <StoreNav />

        <section style={{
          position: 'relative',
          width: '100%',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(212,175,55,0.18)',
          boxShadow: '0 0 80px rgba(212,175,55,0.08), 0 40px 80px rgba(0,0,0,0.7)',
        }}>
          {imgFailed ? (
            <div style={{ width: '100%', minHeight: '520px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#444' }}>Store scene unavailable</p>
            </div>
          ) : (
            <img
              src={BOUTIQUE_HERO_IMAGE}
              alt="Gannon Waye Merch Store"
              onError={() => setImgFailed(true)}
              style={{
                width: '100%',
                height: 'clamp(390px, 50vw, 760px)',
                display: 'block',
                objectFit: 'cover',
                objectPosition: 'center 34%',
              }}
            />
          )}

          {!imgFailed && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
              {STORE_PRODUCTS.map(product => (
                <StoreWorldHotspot key={product.id} product={product} onOpenModal={setActiveModal} />
              ))}
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '92px', background: 'linear-gradient(transparent, rgba(10,10,10,0.95))', zIndex: 9, pointerEvents: 'none' }} />
        </section>

        <p style={{ textAlign: 'center', color: 'rgba(212,175,55,0.42)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '10px 0 20px' }}>
          Hover or tap zones to explore. Click to quick-view and shop.
        </p>

        <FeaturedGear products={publicProducts} onOpenModal={setActiveModal} />

        <section style={{ margin: '24px 0 18px', display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '18px', borderTop: '1px solid rgba(212,175,55,0.12)', paddingTop: '18px' }}>
          <div>
            <p style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.52)', textTransform: 'uppercase', fontWeight: 800, margin: '0 0 8px' }}>
              Full Collection
            </p>
            <h2 style={{ color: '#f0e8d8', fontSize: 'clamp(1.7rem, 3vw, 3.5rem)', margin: 0, lineHeight: 1 }}>
              Base44 Store Products
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/store/all')}
            style={btnStyle('outline')}
          >
            Product Grid
          </button>
        </section>

        <EditorialProductGrid products={publicProducts} onOpenModal={setActiveModal} />

        <MerchGallery />

        <div style={{ textAlign: 'center', paddingBottom: '56px' }}>
          <button type="button" onClick={() => navigate('/store/all')} style={btnStyle('primary')}>
            View Checkout Grid
          </button>
        </div>
      </main>

      {activeModal && (
        <ProductQuickViewModal productId={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

function StoreNav() {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 16px 12px', flexWrap: 'wrap' }}>
      <StoreNavLink to="/store/all" icon={<Grid size={12} />} label="All Products" accent />
      <StoreNavLink to="/music" icon={<Music size={12} />} label="Listen" />
      <StoreNavLink to="/store/cart" icon={<ShoppingCart size={12} />} label="Cart" />
    </nav>
  );
}

function StoreNavLink({ to, icon, label, accent = false }) {
  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 14px',
        borderRadius: '999px',
        border: `1px solid ${accent ? 'rgba(212,175,55,0.42)' : 'rgba(255,255,255,0.12)'}`,
        color: accent ? ACCENT : 'rgba(255,255,255,0.58)',
        fontSize: '11px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontWeight: 700,
        textDecoration: 'none',
        background: accent ? 'rgba(212,175,55,0.06)' : 'transparent',
      }}
    >
      {icon} {label}
    </Link>
  );
}

function ImageSwiper({ images, name, aspectRatio = '16 / 10' }) {
  const [idx, setIdx] = useState(0);
  const [imgErr, setImgErr] = useState({});
  const validImages = (images || []).filter((_, i) => !imgErr[i]);
  const currentSrc = validImages[idx] || null;

  const prev = (event) => {
    event.stopPropagation();
    setIdx(i => (i - 1 + validImages.length) % validImages.length);
  };

  const next = (event) => {
    event.stopPropagation();
    setIdx(i => (i + 1) % validImages.length);
  };

  return (
    <div style={{ width: '100%', aspectRatio, background: '#111', overflow: 'hidden', position: 'relative' }}>
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={name}
          onError={() => setImgErr(state => ({ ...state, [idx]: true }))}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.2s' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(212,175,55,0.35)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Image Pending
        </div>
      )}

      {validImages.length > 1 && (
        <>
          <button type="button" onClick={prev} style={swiperButtonStyle('left')}>‹</button>
          <button type="button" onClick={next} style={swiperButtonStyle('right')}>›</button>
          <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', zIndex: 5 }}>
            {validImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={event => {
                  event.stopPropagation();
                  setIdx(i);
                }}
                style={{ width: i === idx ? '16px' : '5px', height: '5px', borderRadius: '999px', background: i === idx ? ACCENT : 'rgba(212,175,55,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FeaturedCard({ product, isHero, onOpenModal }) {
  return (
    <button
      type="button"
      onClick={() => onOpenModal(product.id)}
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        textAlign: 'left',
        padding: 0,
        border: 'none',
        cursor: 'pointer',
        background: isHero ? 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(255,255,255,0.02))' : 'rgba(255,255,255,0.025)',
        outline: `1px solid ${isHero ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.15)'}`,
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <ImageSwiper images={product.images} name={product.name} aspectRatio={isHero ? '16 / 9' : '16 / 10'} />
      <div style={{ padding: isHero ? '18px 20px' : '14px 16px' }}>
        <div style={{ color: '#f0e8d8', fontSize: isHero ? '15px' : '13px', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 }}>
          {product.shortName || product.name}
        </div>
        {isHero && product.description && (
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', lineHeight: 1.6, margin: '4px 0 12px' }}>
            {product.description.slice(0, 110)}...
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ color: ACCENT, fontSize: isHero ? '17px' : '14px', fontWeight: 800 }}>{product.price}</span>
          <span style={{ color: 'rgba(212,175,55,0.55)', fontSize: '10px', letterSpacing: '0.1em' }}>VIEW</span>
        </div>
      </div>
    </button>
  );
}

function FeaturedGear({ products, onOpenModal }) {
  const featured = FEATURED_IDS.map(id => products.find(product => product.id === id)).filter(Boolean);

  return (
    <section style={{ marginBottom: '28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '18px', alignItems: 'end', marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '9px', letterSpacing: '0.32em', color: 'rgba(212,175,55,0.52)', textTransform: 'uppercase', fontWeight: 800, margin: '0 0 6px' }}>Most Popular</p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)', fontWeight: 700, color: '#f0e8d8', margin: 0 }}>Featured Gear</h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '12px', margin: 0 }}>
          Pulled from the Base44 store list.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '18px' }}>
        {featured.map((product, i) => (
          <FeaturedCard key={product.id} product={product} isHero={i === 0} onOpenModal={onOpenModal} />
        ))}
      </div>
    </section>
  );
}

function swiperButtonStyle(side) {
  return {
    position: 'absolute',
    [side]: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.65)',
    border: '1px solid rgba(212,175,55,0.4)',
    color: ACCENT,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    fontSize: '12px',
    cursor: 'pointer',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

function btnStyle(variant) {
  const base = {
    padding: '11px 26px',
    borderRadius: '6px',
    fontSize: '11px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  };
  if (variant === 'primary') {
    return { ...base, background: 'linear-gradient(135deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37, #B8860B)', color: '#111', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' };
  }
  if (variant === 'outline') {
    return { ...base, background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', color: ACCENT };
  }
  return base;
}
