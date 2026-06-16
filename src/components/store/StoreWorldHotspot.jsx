import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StoreWorldHotspot({ product, onOpenModal }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const isSoldOut = product.status === 'sold_out';
  const isMemorial = product.status === 'memorial';

  const handleClick = () => {
    if (isMemorial) {
      navigate(product.link);
      return;
    }
    // Open quick-view modal for all purchasable / sold-out products
    onOpenModal(product.id);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const glowColor = isMemorial
    ? 'rgba(255,220,180,0.4)'
    : isSoldOut
    ? 'rgba(180,60,60,0.3)'
    : 'rgba(212,175,55,0.6)';

  const outlineColor = isMemorial
    ? 'rgba(255,210,160,0.7)'
    : isSoldOut
    ? 'rgba(180,60,60,0.5)'
    : 'rgba(212,175,55,0.85)';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={[
        product.name,
        product.price ? `— ${product.price}` : '',
        isSoldOut ? '(Sold Out)' : '',
        isMemorial ? '(Memorial — opens tribute page)' : '',
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${product.hotspot.x}%`,
        top: `${product.hotspot.y}%`,
        width: `${product.hotspot.width}%`,
        height: `${product.hotspot.height}%`,
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'all 0.22s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hovered ? `0 0 32px 10px ${glowColor}` : 'none',
        outline: hovered ? `2px solid ${outlineColor}` : '2px solid transparent',
        background: hovered ? (isMemorial ? 'rgba(255,210,160,0.06)' : 'rgba(212,175,55,0.06)') : 'transparent',
        zIndex: hovered ? 30 : 10,
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div style={{
          position: 'absolute',
          top: '-9px',
          right: '-4px',
          background: isSoldOut
            ? 'rgba(120,0,0,0.92)'
            : isMemorial
            ? 'rgba(255,210,160,0.15)'
            : 'rgba(212,175,55,0.92)',
          color: isSoldOut ? '#fff' : isMemorial ? '#ffd6a5' : '#111',
          fontSize: '8px',
          fontWeight: 800,
          letterSpacing: '0.07em',
          padding: '2px 6px',
          borderRadius: '4px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}>
          {product.badge}
        </div>
      )}

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(8,8,8,0.97)',
          border: `1px solid ${outlineColor}`,
          borderRadius: '8px',
          padding: '10px 16px',
          minWidth: '190px',
          maxWidth: '240px',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 60,
          boxShadow: `0 6px 24px rgba(0,0,0,0.6), 0 0 20px ${glowColor}`,
          whiteSpace: 'normal',
        }}>
          <div style={{
            color: isMemorial ? '#ffd6a5' : '#D4AF37',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '5px',
          }}>
            {isMemorial ? '♡ Tribute' : isSoldOut ? 'SOLD OUT' : 'VIEW PRODUCT'}
          </div>

          <div style={{ color: '#f0f0f0', fontSize: '12px', fontWeight: 600, lineHeight: 1.35, marginBottom: '5px' }}>
            {product.name}
          </div>

          {product.price && (
            <div style={{ color: '#D4AF37', fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>
              {product.price}
              {product.priceNote && (
                <span style={{ color: '#777', fontSize: '10px', fontWeight: 400, marginLeft: '4px' }}>
                  {product.priceNote}
                </span>
              )}
            </div>
          )}

          <div style={{
            color: isSoldOut ? '#ff6b6b' : isMemorial ? '#ffd6a5' : '#888',
            fontSize: '10px',
            marginTop: '4px',
          }}>
            {isSoldOut
              ? 'Sold Out · Join Waitlist →'
              : isMemorial
              ? 'A tribute — always in our hearts'
              : 'Click to quick-view →'}
          </div>

          {/* Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            width: '10px',
            height: '10px',
            background: 'rgba(8,8,8,0.97)',
            border: `1px solid ${outlineColor}`,
            borderTop: 'none',
            borderLeft: 'none',
            transform: 'translateX(-50%) rotate(45deg)',
          }} />
        </div>
      )}
    </div>
  );
}