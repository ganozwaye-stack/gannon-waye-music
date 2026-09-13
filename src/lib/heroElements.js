// Shared vocabulary for the Hero Canvas Studio: fonts, brand colours,
// element defaults and the standard hero layout seed. Used by the editor
// panels and the public renderer, so what the owner drags is exactly what
// fans see. House style: gold essence palette only, no em dashes.

export const FONT_OPTIONS = [
  { value: 'poppins', label: 'Poppins', css: "'Poppins', sans-serif" },
  { value: 'cormorant', label: 'Cormorant Garamond', css: "'Cormorant Garamond', serif" },
  { value: 'playfair', label: 'Playfair Display', css: "'Playfair Display', serif" },
  { value: 'inter', label: 'Inter', css: "'Inter', sans-serif" },
  { value: 'dancing', label: 'Dancing Script', css: "'Dancing Script', cursive" },
];

export const fontCss = (key) => (FONT_OPTIONS.find((f) => f.value === key) || FONT_OPTIONS[0]).css;

// Brand kit palette: the gold essence ramp. Every colour picker in the
// studio offers these first; a custom hex is still possible.
export const BRAND_COLOURS = [
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Champagne', hex: '#f0e6c8' },
  { name: 'Antique Gold', hex: '#a9842c' },
  { name: 'Ivory Glow', hex: '#fdf4e0' },
  { name: 'Warm White', hex: '#fffdf7' },
  { name: 'Deep Bronze', hex: '#6b5218' },
  { name: 'Garden Green', hex: '#2f5738' },
  { name: 'Night', hex: '#0a0a0e' },
];

export const uid = () => `el_${Math.random().toString(36).slice(2, 9)}`;

const TYPE_DEFAULTS = {
  background: {
    x_pct: 50, y_pct: 50, width_pct: 100,
    bg_pos_y: 34, bg_scan_pct: 12, bg_blur_px: 0, image_url: '',
  },
  text: {
    x_pct: 50, y_pct: 50, width_pct: 50,
    content: 'Your text', font: 'poppins', font_size: 32, font_weight: 600,
    letter_spacing_em: 0, uppercase: false, italic: false, align: 'center',
    color: '#f0e6c8', glow_color: '#d4af37', glow_strength: 0,
    shadow_color: 'rgba(0,0,0,0.6)', shadow_blur: 0, shadow_y: 0,
    rotation_deg: 0, opacity: 1,
  },
  image: {
    x_pct: 50, y_pct: 50, width_pct: 30, aspect: 1, mask: 'none', image_url: '',
    border_color: '#d4af37', border_width_px: 0,
    glow_color: '#d4af37', glow_strength: 0,
    shadow_color: 'rgba(0,0,0,0.6)', shadow_blur: 0, shadow_y: 0,
    rotation_deg: 0, opacity: 1,
  },
  ring: {
    x_pct: 50, y_pct: 52, width_pct: 70, rotation_deg: -14,
    ring_aspect: 3.4, ring_thickness_px: 2, ring_color: '#d4af37',
    spark_main_size: 8, spark_companion_size: 6, orbit_duration: 18,
    glow_color: '#f0e6c8', glow_strength: 10, opacity: 1,
  },
  atmosphere: {
    kind: 'embers', density: 1, opacity: 1,
  },
  button: {
    x_pct: 50, y_pct: 80, content: 'Pre-save', link: '/presave', kind: 'solid',
    font: 'poppins', font_size: 14, color: '#d4af37',
    glow_color: '#d4af37', glow_strength: 14,
    rotation_deg: 0, opacity: 1,
  },
};

export function makeElement(type, patch = {}) {
  return {
    id: uid(),
    type,
    hidden: false,
    locked: false,
    z: 0,
    ...TYPE_DEFAULTS[type],
    ...patch,
  };
}

// One press gives the owner the full current hero as editable elements:
// galaxy glow, rays, tilted orbit ring, heart artwork, embers, labels,
// story copy and both buttons. From there everything is theirs to move.
export function buildStandardHero(heartUrl) {
  return [
    makeElement('background', { z: 0 }),
    makeElement('atmosphere', { kind: 'rays', z: 1 }),
    makeElement('ring', { z: 2, x_pct: 50, y_pct: 52, width_pct: 72, rotation_deg: -14 }),
    makeElement('image', {
      z: 3, x_pct: 50, y_pct: 52, width_pct: 40, aspect: 1, mask: 'circle',
      image_url: heartUrl, border_width_px: 2,
      glow_strength: 60, shadow_blur: 60, shadow_y: 20,
    }),
    makeElement('atmosphere', { kind: 'embers', z: 4 }),
    makeElement('text', {
      z: 5, content: 'The New Single', y_pct: 24, font_size: 14, font_weight: 500,
      uppercase: true, letter_spacing_em: 0.5, color: '#d4af37', width_pct: 60,
    }),
    makeElement('text', {
      z: 6, content: 'SET FREE', y_pct: 34, font_size: 104, font_weight: 800,
      uppercase: true, letter_spacing_em: 0.14, color: '#f0e6c8',
      glow_strength: 18, glow_color: '#d4af37', width_pct: 90,
    }),
    makeElement('text', {
      z: 7, y_pct: 68, font_size: 18, font_weight: 300, italic: true,
      color: '#fdf4e0', width_pct: 44,
      content: 'The turning point. The sound of choosing peace, restoring boundaries and reclaiming your own direction.',
    }),
    makeElement('button', { z: 8, content: 'Pre-save', x_pct: 41, y_pct: 80, link: '/presave' }),
    makeElement('button', { z: 9, content: 'Hear the Music', x_pct: 60, y_pct: 80, kind: 'outline', color: '#d4af37', link: '/music' }),
  ];
}