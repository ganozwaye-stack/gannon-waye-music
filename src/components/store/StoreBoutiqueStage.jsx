import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORE_PRODUCTS, BOUTIQUE_HERO_IMAGE } from '@/config/storeWorldConfig';

const ACCENT = '#D4AF37';
const PRODUCT_EMOJI = {
  'front-hoodie': '🖤', 'back-hoodie': '🖤', 'winter-writing-comfort-bundle': '❄️',
  'journal-pen-thermos-bundle': '📓', 'mug': '☕', 'wall-poster': '🖼️',
  'cd': '💿', 'tote-bag': '👜', 'mums-garden': '🌸'
};

// Angled, 3D-perspective merch display — every product tilted toward the viewer
// and staggered diagonally so nothing is hidden behind a flat shelf line.
export default function StoreBoutiqueStage({ onOpenModal }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [imgErr, setImgErr] = useState({});
  const display = STORE_PRODUCTS.filter((p) => p.images && p.images.length);

  const handleClick = (p) => {
    if (p.status === 'memorial' && p.link) {
      navigate(p.link);
      return;
    }
    onOpenModal(p.id);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(212,175,55,0.18)',
        boxShadow: '0 0 80px rgba(212,175,55,0.08), 0 40px 80px rgba(0,0,0,0.7)',
        background: '#0a0a0a'
      }}>
      
      {/* Preserved boutique storefront backdrop (neon name + interior), dimmed so merch reads */}
      <img
        src={BOUTIQUE_HERO_IMAGE}
        alt=""
        aria-hidden
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center', opacity: 0.28
        }} />
      
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,14,0.45), rgba(8,8,14,0.72) 60%, rgba(8,8,14,0.94))'
        }} />
      
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 38%, rgba(212,175,55,0.14), transparent 62%)'
        }} />
      

      {/* Neon storefront sign — preserved */}
      <div style={{ position: 'relative', textAlign: 'center', paddingTop: 'clamp(26px,4vw,44px)', paddingBottom: '4px' }}>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(22px,3.4vw,34px)',
            letterSpacing: '0.06em',
            margin: 0,
            color: ACCENT,
            textShadow: '0 0 18px rgba(212,175,55,0.65), 0 0 38px rgba(212,175,55,0.35)'
          }} className="hidden">
          
          Gannon Waye
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.55)',
            marginTop: '6px'
          }} className="hidden">
          
          Boutique · Step Inside
        </p>
      </div>

      {/* Angled diagonal merch display */}
      <div style={{ position: 'relative', padding: 'clamp(18px,3vw,32px) clamp(12px,3vw,28px) clamp(28px,4vw,52px)' }}>
        <div style={{ perspective: '1500px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'clamp(12px,1.8vw,24px)',
              transformStyle: 'preserve-3d'
            }}>
            
            {display.map((p, i) => {
              const tilt = i % 2 === 0 ? -11 : 11;
              const lift = (i % 4 - 1.5) * 14; // diagonal vertical stagger
              const isHover = hovered === p.id;
              const isSoldOut = p.status === 'sold_out';
              const isMemorial = p.status === 'memorial';
              const isComing = p.status === 'coming_soon';
              const emoji = PRODUCT_EMOJI[p.id] || '🛍️';
              const img = imgErr[p.id] || !p.images[0] ? null : p.images[0];

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleClick(p)}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: 'clamp(118px,15vw,180px)',
                    padding: 0,
                    cursor: 'pointer',
                    border: 'none',
                    transform: `rotateY(${tilt}deg) translateY(${lift}px) ${isHover ? 'translateZ(40px) scale(1.06)' : ''}`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.32s ease, box-shadow 0.32s ease',
                    outline: `1px solid ${isHover ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.18)'}`,
                    boxShadow: isHover ? '0 14px 36px rgba(212,175,55,0.18)' : 'none',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)'
                  }}>
                  
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#111', overflow: 'hidden' }}>
                    {img ?
                    <img
                      src={img}
                      alt={p.name}
                      onError={() => setImgErr((e) => ({ ...e, [p.id]: true }))}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        transform: isHover ? 'scale(1.08)' : 'scale(1)'
                      }} /> :


                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem' }}>
                        {emoji}
                      </div>
                    }
                    {p.badge &&
                    <span
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        fontSize: '8px', fontWeight: 800, letterSpacing: '0.07em',
                        padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase',
                        zIndex: 5, pointerEvents: 'none',
                        background: isSoldOut ? 'rgba(239,68,68,0.92)' : isComing ? 'rgba(255,255,255,0.85)' : isMemorial ? 'rgba(255,210,160,0.18)' : 'rgba(212,175,55,0.92)',
                        color: isSoldOut ? '#fff' : isComing ? '#111' : isMemorial ? '#ffd6a5' : '#111'
                      }}>
                      
                        {p.badge}
                      </span>
                    }
                    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 -40px 50px -20px rgba(0,0,0,0.7)', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ padding: '10px 12px 12px', textAlign: 'left' }}>
                    <div style={{ color: '#f0e8d8', fontSize: '11px', fontWeight: 700, lineHeight: 1.3, marginBottom: '4px' }}>
                      {p.shortName || p.name}
                    </div>
                    <div style={{ color: isSoldOut ? '#e05555' : isMemorial ? '#ffd6a5' : ACCENT, fontSize: '12px', fontWeight: 800 }}>
                      {p.price}
                    </div>
                  </div>
                </button>);

            })}
          </div>
        </div>
      </div>
    </div>);

}