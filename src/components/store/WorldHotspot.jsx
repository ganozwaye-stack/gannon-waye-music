import { useState } from 'react';

const ACCENT = '#D4AF37';

/**
 * One tappable circular zone pinned over a product in the locked boutique world
 * artwork. The zone draws a circle around the product itself: a faint gold ring
 * at rest so shoppers can spot it, brightening into a glowing ring with the
 * product label on hover/focus. Touch users find the centre dot.
 */
export default function WorldHotspot({ zone, label, onClick, testId }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: zone.left,
        top: zone.top,
        width: zone.width,
        height: zone.height,
        padding: 0,
        border: `${hovered ? '2px' : '1.5px'} solid ${hovered ? 'rgba(212,175,55,0.95)' : 'rgba(212,175,55,0.32)'}`,
        background: hovered ? 'rgba(212,175,55,0.07)' : 'transparent',
        borderRadius: '999px',
        cursor: 'pointer',
        zIndex: 20,
        transition: 'border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease',
        boxShadow: hovered
          ? '0 0 28px rgba(212,175,55,0.4), inset 0 0 22px rgba(212,175,55,0.12)'
          : 'none',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '7px',
          height: '7px',
          borderRadius: '999px',
          background: ACCENT,
          opacity: hovered ? 1 : 0.7,
          boxShadow: '0 0 12px rgba(212,175,55,0.8)',
          pointerEvents: 'none',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% + 34px)',
          transform: 'translateX(-50%)',
          opacity: hovered ? 1 : 0,
          whiteSpace: 'nowrap',
          background: 'rgba(10,10,10,0.94)',
          border: '1px solid rgba(212,175,55,0.5)',
          color: ACCENT,
          padding: '7px 10px',
          borderRadius: '999px',
          fontSize: '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 700,
          boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        {label}
      </span>
    </button>
  );
}