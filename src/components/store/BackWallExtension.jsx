import { useState } from 'react';

const ACCENT = '#D4AF37';
// The boutique back wall — the world image extended backwards so new arrivals
// have a home before they hit the front racks. Artwork matches the locked
// boutique world's mood; products always come from the live store data.
const BACK_WALL_IMAGE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5d3dc14c9_generated_image.png';

export default function BackWallExtension({ products = [], onOpenProduct }) {
  const [imageErrors, setImageErrors] = useState({});

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <section
      data-testid="back-wall-extension"
      aria-label="Boutique back wall — new arrivals"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: '#0a0a0a',
        borderTop: '1px solid rgba(212,175,55,0.18)',
        borderBottom: '1px solid rgba(212,175,55,0.18)',
      }}
    >
      <img
        src={BACK_WALL_IMAGE}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.42,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,14,0.52), rgba(8,8,14,0.78) 62%, rgba(8,8,14,0.96))',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.15), transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '1180px', margin: '0 auto', padding: '46px clamp(14px,3vw,30px) 52px' }}>
        <p style={{ color: 'rgba(212,175,55,0.75)', fontSize: '10px', letterSpacing: '0.34em', textTransform: 'uppercase', margin: 0, textAlign: 'center' }}>
          Deeper into the boutique
        </p>
        <h2 style={{ color: '#f0e8d8', fontSize: 'clamp(22px, 4vw, 36px)', margin: '10px 0 0', fontWeight: 700, textAlign: 'center' }}>
          The back wall
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.56)', fontSize: '12px', margin: '8px auto 0', maxWidth: '560px', lineHeight: 1.6, textAlign: 'center' }}>
          We've extended the boutique back — this is where new arrivals land first, straight off the rail.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(16px, 2.6vw, 28px)',
            marginTop: '30px',
          }}
        >
          {products.map(product => {
            const images = Array.isArray(product.images_array) && product.images_array.filter(Boolean).length > 0
              ? product.images_array.filter(Boolean)
              : (product.image_url ? [product.image_url] : []);
            const image = imageErrors[product.id] ? null : images[0];
            const price = Number(product.sale_price || 0);
            const stock = Number(product.stock_quantity || 0);

            return (
              <button
                key={product.id}
                type="button"
                data-testid="back-wall-card"
                data-product-id={product.id}
                onClick={() => onOpenProduct?.(product)}
                style={{
                  width: 'clamp(160px, 21vw, 210px)',
                  padding: 0,
                  cursor: stock > 0 ? 'pointer' : 'default',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '13px',
                  overflow: 'hidden',
                  background: 'rgba(12,12,14,0.9)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(212,175,55,0.18)';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#111', overflow: 'hidden' }}>
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      onError={() => setImageErrors(current => ({ ...current, [product.id]: true }))}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(212,175,55,0.8)', fontSize: '2.4rem' }}>
                      ✦
                    </div>
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      fontSize: '8px',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      background: stock > 0 ? 'rgba(212,175,55,0.94)' : 'rgba(239,68,68,0.92)',
                      color: stock > 0 ? '#111' : '#fff',
                    }}
                  >
                    {stock > 0 ? 'New in' : 'Sold out'}
                  </span>
                </div>

                <div style={{ padding: '12px 13px 14px', textAlign: 'left' }}>
                  <div style={{ color: '#f0e8d8', fontSize: '12.5px', fontWeight: 700, lineHeight: 1.35, marginBottom: '4px' }}>
                    {product.name}
                  </div>
                  <span style={{ color: ACCENT, fontSize: '14px', fontWeight: 800 }}>
                    ${price.toFixed(2)} AUD
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}