import React, { useMemo } from 'react';

// Lightweight CSS-only gold shard atmosphere — no canvas, no heavy deps
// Respects prefers-reduced-motion, pointer-events: none, z-index behind content

const SHARD_COUNT = 18;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function GoldShards({ className = '' }) {
  const shards = useMemo(() => {
    return Array.from({ length: SHARD_COUNT }, (_, i) => ({
      id: i,
      left: `${randomBetween(2, 98)}%`,
      top: `${randomBetween(0, 100)}%`,
      width: randomBetween(1, 3.5),
      height: randomBetween(8, 28),
      rotate: randomBetween(-60, 60),
      opacity: randomBetween(0.04, 0.18),
      duration: randomBetween(6, 18),
      delay: randomBetween(0, 12),
      drift: randomBetween(-18, 18),
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ zIndex: 0 }}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .gw-shard { animation: none !important; }
        }
        @keyframes gw-shard-float {
          0%   { transform: translateY(0px) translateX(0px) rotate(var(--r)); opacity: var(--o); }
          40%  { opacity: calc(var(--o) * 1.6); }
          100% { transform: translateY(-60px) translateX(var(--dx)) rotate(calc(var(--r) + 8deg)); opacity: 0; }
        }
      `}</style>
      {shards.map(s => (
        <div
          key={s.id}
          className="gw-shard absolute"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.width}px`,
            height: `${s.height}px`,
            '--r': `${s.rotate}deg`,
            '--o': s.opacity,
            '--dx': `${s.drift}px`,
            transform: `rotate(${s.rotate}deg)`,
            opacity: s.opacity,
            background: 'linear-gradient(180deg, #f5d06e 0%, #c9a84c 50%, transparent 100%)',
            borderRadius: '1px',
            animation: `gw-shard-float ${s.duration}s ${s.delay}s ease-in infinite`,
          }}
        />
      ))}
    </div>
  );
}