import { useState } from 'react';
import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';

const ACCENT = '#D4AF37';

function productImages(product) {
  if (Array.isArray(product?.images_array) && product.images_array.length > 0) {
    return product.images_array.filter(Boolean);
  }
  return product?.image_url ? [product.image_url] : [];
}

export default function StoreBoutiqueStage({ products = [], onOpenProduct }) {
  const [hovered, setHovered] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const display = Array.isArray(products)
    ? products.filter(product =>
        product &&
        product.is_active === true &&
        product.publication_status === 'live' &&
        product.is_stage_one_sale === true
      )
    : [];

  return (
    <section
      data-testid="locked-storefront-stage"
      data-storefront-lock-id={STOREFRONT_ART_LOCK.lockId}
      aria-label="Gannon Waye boutique world"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '430px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(212,175,55,0.22)',
        boxShadow: '0 0 80px rgba(212,175,55,0.08), 0 40px 80px rgba(0,0,0,0.7)',
        background: '#0a0a0a',
      }}
    >
      <img
        data-testid="locked-storefront-stage-image"
        data-storefront-lock-id={STOREFRONT_ART_LOCK.lockId}
        data-storefront-image-sha256={STOREFRONT_ART_LOCK.imageSha256}
        src={STOREFRONT_ART_LOCK.imageUrl}
        alt="Gannon Waye boutique interior"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.46,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,14,0.34), rgba(8,8,14,0.64) 58%, rgba(8,8,14,0.94))',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 38%, rgba(212,175,55,0.18), transparent 62%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center', padding: '34px 18px 8px' }}>
        <p style={{ color: 'rgba(212,175,55,0.72)', fontSize: '10px', letterSpacing: '0.34em', textTransform: 'uppercase', margin: 0 }}>
          Step inside the boutique
        </p>
        <h2 style={{ color: '#f0e8d8', fontSize: 'clamp(22px, 4vw, 38px)', margin: '10px 0 0', fontWeight: 700 }}>
          The Respect Is Earned collection
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.56)', fontSize: '12px', margin: '8px auto 0', maxWidth: '620px', lineHeight: 1.6 }}>
          Small-run pieces from Gannon Waye. Everything you see here is in stock and ships across Australia.
        </p>
      </div>

      <div style={{ position: 'relative', padding: '24px clamp(12px,3vw,30px) 58px' }}>
        {display.length > 0 ? (
          <div style={{ perspective: '1500px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'clamp(18px,3vw,34px)',
                transformStyle: 'preserve-3d',
              }}
            >
              {display.map((product, index) => {
                const images = productImages(product);
                const image = imageErrors[product.id] ? null : images[0];
                const tilt = index % 2 === 0 ? -9 : 9;
                const lift = index % 2 === 0 ? -8 : 8;
                const isHovered = hovered === product.id;
                const price = Number(product.sale_price || 0);
                const stock = Number(product.stock_quantity || 0);

                return (
                  <button
                    key={product.id}
                    type="button"
                    data-testid="world-product-card"
                    data-product-id={product.id}
                    onClick={() => onOpenProduct?.(product)}
                    onMouseEnter={() => setHovered(product.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      width: 'clamp(170px, 24vw, 250px)',
                      padding: 0,
                      cursor: stock > 0 ? 'pointer' : 'default',
                      border: 'none',
                      transform: `rotateY(${tilt}deg) translateY(${lift}px) ${isHovered ? 'translateZ(42px) scale(1.045)' : ''}`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.32s ease, box-shadow 0.32s ease, outline-color 0.32s ease',
                      outline: `1px solid ${isHovered ? 'rgba(212,175,55,0.78)' : 'rgba(212,175,55,0.26)'}`,
                      boxShadow: isHovered ? '0 18px 42px rgba(212,175,55,0.22)' : '0 12px 30px rgba(0,0,0,0.36)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      background: 'rgba(10,10,10,0.88)',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#111', overflow: 'hidden' }}>
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          onError={() => setImageErrors(current => ({ ...current, [product.id]: true }))}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                            transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                          }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(212,175,55,0.8)', fontSize: '2.6rem' }}>
                          ✦
                        </div>
                      )}
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          fontSize: '8px',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          padding: '3px 7px',
                          borderRadius: '999px',
                          textTransform: 'uppercase',
                          background: stock > 0 ? 'rgba(212,175,55,0.94)' : 'rgba(239,68,68,0.92)',
                          color: stock > 0 ? '#111' : '#fff',
                        }}
                      >
                        {stock > 0 ? 'Available' : 'Sold out'}
                      </span>
                      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 -55px 62px -28px rgba(0,0,0,0.8)', pointerEvents: 'none' }} />
                    </div>

                    <div style={{ padding: '14px 15px 16px', textAlign: 'left' }}>
                      <div style={{ color: '#f0e8d8', fontSize: '13px', fontWeight: 700, lineHeight: 1.35, marginBottom: '5px' }}>
                        {product.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}>
                        <span style={{ color: ACCENT, fontSize: '15px', fontWeight: 800 }}>${price.toFixed(2)} AUD</span>
                        <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: '10px' }}>{stock} in stock</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', textAlign: 'center', padding: '56px 20px 70px', color: 'rgba(255,255,255,0.58)' }}>
            New pieces are on their way. The boutique reopens as soon as the next drop is ready.
          </div>
        )}
      </div>
    </section>
  );
}