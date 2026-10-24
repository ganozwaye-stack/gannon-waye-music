import { BRAND_ICON_PATHS } from '@/config/officialLinks';

// Renders an official brand mark as a single-path SVG, tinted by currentColor.
// Paths come from Simple Icons (CC0) so nothing is hand-guessed.
export default function BrandIcon({ brand, className = 'w-4 h-4' }) {
  const path = BRAND_ICON_PATHS[brand];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <path d={path} />
    </svg>
  );
}