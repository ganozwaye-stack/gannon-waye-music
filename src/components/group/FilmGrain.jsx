import React from 'react';

/**
 * Film grain for the group landing page: a single inline SVG noise layer, no
 * image files. Purely decorative, so it is hidden from assistive technology.
 */
const GRAIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
  <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="220" height="220" filter="url(#g)" opacity="0.55"/>
</svg>`;

export default function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.07] mix-blend-soft-light group-grain"
      style={{ backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(GRAIN_SVG)}")`, backgroundSize: '220px 220px' }}
    />
  );
}