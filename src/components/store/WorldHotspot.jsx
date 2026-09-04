import { useState } from 'react';

const ACCENT = '#D4AF37';

/**
 * One tappable zone pinned over a product in the locked boutique world artwork.
 * Shows a resting gold dot so touch users can find it; hover/focus reveals the label.
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
        border: `1px solid ${hovered ? 'rgba(212,175,55,0.85)' : 'transparent'}`,
        background: hovered ? 'rgba(212,175,55,0.08)' : 'transparent',
        borderRadius: '14px',
        cursor: 'pointer',
        zIndex: 20,
        transition: 'border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease',
        boxShadow: hovered ? '0 0 28px rgba(212,175,55,0.35)' : 'none',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '6%',
          transform: 'translateX(-50%)',
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
          bottom: 'calc(6% + 16px)',
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