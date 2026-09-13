import { Link } from 'react-router-dom';
import GoldenEmbers from '@/components/three/GoldenEmbers';
import { fontCss } from '@/lib/heroElements';

// Renders one hero design element. Used by both the owner's Canvas Studio
// (with a pixel scale tied to the editor canvas width) and the public hero
// (with a viewport-width scale), so what the owner drags is exactly what
// fans see. House style: gold essence palette only, no em dashes.

export function HeroElementInner({ el, scale }) {
  const glow = el.glow_strength
    ? `0 0 ${scale(el.glow_strength)} ${el.glow_color || '#d4af37'}`
    : '';
  const shadow = el.shadow_blur
    ? `0 ${scale(el.shadow_y || 0)} ${scale(el.shadow_blur)} ${el.shadow_color || 'rgba(0,0,0,0.6)'}`
    : '';
  const depth = [glow, shadow].filter(Boolean).join(', ');

  if (el.type === 'text') {
    return (
      <div
        style={{
          width: '100%',
          fontFamily: fontCss(el.font),
          fontSize: scale(el.font_size || 32),
          fontWeight: el.font_weight || 400,
          letterSpacing: `${el.letter_spacing_em || 0}em`,
          textTransform: el.uppercase ? 'uppercase' : 'none',
          fontStyle: el.italic ? 'italic' : 'normal',
          color: el.color || '#f0e6c8',
          textAlign: el.align || 'center',
          textShadow: depth || undefined,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.25,
        }}
      >
        {el.content}
      </div>
    );
  }

  if (el.type === 'image') {
    const radius = el.mask === 'circle' ? '9999px' : el.mask === 'rounded' ? scale(24) : `${el.radius_pct || 0}%`;
    return (
      <img
        src={el.image_url}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          aspectRatio: `${el.aspect || 1}`,
          objectFit: 'cover',
          borderRadius: radius,
          display: 'block',
          border: el.border_width_px
            ? `${scale(el.border_width_px)} solid ${el.border_color || '#d4af37'}`
            : undefined,
          boxShadow: depth || undefined,
        }}
      />
    );
  }

  if (el.type === 'ring') {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: `${el.ring_aspect || 3.4}`,
          border: `${scale(el.ring_thickness_px || 2)} solid ${el.ring_color || '#d4af37'}`,
          borderRadius: '50%',
          boxShadow: glow || undefined,
          position: 'relative',
        }}
      >
        {(el.spark_main_size || 0) > 0 && (
          <div style={{ position: 'absolute', inset: 0, animation: `heroOrbitSpin ${el.orbit_duration || 18}s linear infinite` }}>
            <div
              style={{
                position: 'absolute', left: '50%', top: 0, transform: 'translate(-50%, -50%)',
                width: scale(el.spark_main_size), height: scale(el.spark_main_size),
                borderRadius: '9999px', background: el.glow_color || '#f0e6c8',
                boxShadow: `0 0 ${scale(8)} ${el.ring_color || '#d4af37'}`,
              }}
            />
          </div>
        )}
        {(el.spark_companion_size || 0) > 0 && (
          <div style={{ position: 'absolute', inset: 0, animation: `heroOrbitSpin ${Math.max((el.orbit_duration || 18) * 0.7, 2)}s linear infinite reverse` }}>
            <div
              style={{
                position: 'absolute', left: '50%', top: 0, transform: 'translate(-50%, -50%)',
                width: scale(el.spark_companion_size), height: scale(el.spark_companion_size),
                borderRadius: '9999px', background: el.glow_color || '#f0e6c8',
                boxShadow: `0 0 ${scale(6)} ${el.ring_color || '#d4af37'}`,
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (el.type === 'button') {
    const solid = el.kind !== 'outline';
    return (
      <Link
        to={el.link || '/presave'}
        style={{
          display: 'inline-block',
          fontFamily: fontCss(el.font),
          fontSize: scale(el.font_size || 14),
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          color: solid ? '#0a0a0e' : (el.color || '#d4af37'),
          background: solid
            ? 'linear-gradient(90deg, #a9842c 0%, #d4af37 38%, #f0e6c8 50%, #d4af37 62%, #a9842c 100%)'
            : 'transparent',
          border: solid ? 'none' : `${scale(1)} solid rgba(212,175,55,0.5)`,
          padding: `${scale(12)} ${scale(26)}`,
          borderRadius: '9999px',
          boxShadow: glow
            ? `${glow}, 0 ${scale(4)} ${scale(14)} rgba(0,0,0,0.5)`
            : `0 ${scale(4)} ${scale(14)} rgba(0,0,0,0.5)`,
        }}
      >
        {el.content || 'Pre-save'}
      </Link>
    );
  }

  return null;
}

export default function HeroElementRender({ el, scale }) {
  if (!el || el.hidden) return null;
  const opacity = el.opacity ?? 1;

  if (el.type === 'background') {
    return (
      <div className="absolute pointer-events-none" style={{ inset: `-${el.bg_scan_pct ?? 12}%`, opacity, zIndex: el.z || 0 }}>
        <div
          className="absolute inset-0"
          style={el.image_url
            ? {
                backgroundImage: `url(${el.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: `50% ${el.bg_pos_y ?? 34}%`,
                filter: el.bg_blur_px ? `blur(${scale(el.bg_blur_px)})` : undefined,
              }
            : {
                background: `radial-gradient(90% 70% at 50% ${el.bg_pos_y ?? 34}%, rgba(212,175,55,0.09), rgba(10,10,14,0) 65%)`,
              }}
        />
      </div>
    );
  }

  if (el.type === 'atmosphere') {
    if (el.kind === 'rays') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity, zIndex: el.z || 0 }}>
          <div
            style={{
              position: 'absolute', left: '50%', top: '50%', width: '170%', aspectRatio: '1',
              transform: 'translate(-50%, -50%)',
              background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(212,175,55,0.18) 0deg 5deg, rgba(212,175,55,0) 5deg 17deg)',
              filter: `blur(${scale(26)})`,
            }}
          />
        </div>
      );
    }
    return (
      <div className="absolute inset-0 pointer-events-none" style={{ opacity, zIndex: el.z || 0 }}>
        <GoldenEmbers density={el.density || 1} />
      </div>
    );
  }

  const wrapper = {
    position: 'absolute',
    left: `${el.x_pct}%`,
    top: `${el.y_pct}%`,
    width: el.type === 'button' ? 'auto' : `${el.width_pct}%`,
    transform: `translate(-50%, -50%) rotate(${el.rotation_deg || 0}deg)`,
    opacity,
    zIndex: el.z || 0,
  };

  return (
    <div style={wrapper}>
      <HeroElementInner el={el} scale={scale} />
    </div>
  );
}