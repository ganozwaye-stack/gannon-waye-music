// ─── Hero layer system ──────────────────────────────────────────────────────
// The original hero was 19 fixed fields describing one composition: a galaxy,
// a heart, an orbit ring and two sparks. Nothing could be added to it.
//
// Layers sit ON TOP of that, so the existing design is untouched. A hero with
// no layers renders exactly as it always has. Add a layer and you can put any
// image, any text or any shape anywhere over the hero, at any size, angle,
// opacity and blend mode, with an optional animation.
//
// Everything is stored in the HeroDesignSettings.layers array, which means it
// still goes through Save Draft and Go Live. Nothing reaches the public site
// until Go Live is pressed.

export const LAYER_TYPES = [
  { value: 'image', label: 'Image' },
  { value: 'text', label: 'Text' },
  { value: 'shape', label: 'Shape' },
];

export const BLEND_MODES = [
  'normal', 'screen', 'overlay', 'multiply', 'soft-light',
  'hard-light', 'color-dodge', 'lighten', 'darken', 'difference',
];

export const ANIMATIONS = [
  { value: 'none', label: 'None' },
  { value: 'float', label: 'Float up and down' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'spin', label: 'Slow spin' },
  { value: 'drift', label: 'Drift sideways' },
  { value: 'glow', label: 'Glow' },
];

export const FONT_STACKS = [
  { value: 'body', label: 'Body' },
  { value: 'display', label: 'Display' },
  { value: 'mono', label: 'Mono' },
];

// Every layer carries every key, so the editor never has to guess and an old
// saved layer never renders with an undefined value.
export const LAYER_DEFAULTS = {
  id: '',
  type: 'image',
  name: 'New layer',
  visible: true,
  locked: false,

  // Placement. All values are a percentage of the hero box, so a layer sits
  // in the same relative spot on a phone and on a desktop.
  x: 50,            // horizontal centre, 0 left to 100 right
  y: 50,            // vertical centre, 0 top to 100 bottom
  width: 20,        // width as a percentage of the hero width
  rotation: 0,      // degrees
  opacity: 100,     // 0 to 100
  blend: 'normal',
  z: 10,            // stacking order. The heart sits at about 5.

  // Image layers
  src: '',
  fit: 'contain',   // contain or cover
  radius: 0,        // corner rounding in percent, 50 makes a circle

  // Text layers
  text: 'Your text',
  fontSize: 4,      // percentage of hero width, so it scales with the hero
  letterSpacing: 0.1,
  weight: 400,
  color: '#f5d06e',
  font: 'body',
  align: 'center',
  uppercase: false,
  shadow: true,

  // Shape layers
  shape: 'rect',    // rect or circle
  fill: '#d4af37',
  height: 10,       // shapes need their own height, in percent of hero height

  // Motion
  animation: 'none',
  animDuration: 8,  // seconds
};

let seq = 0;
export function newLayer(type = 'image', overrides = {}) {
  seq += 1;
  const base = {
    ...LAYER_DEFAULTS,
    id: `l_${Date.now().toString(36)}_${seq}`,
    type,
    name: type === 'text' ? 'Text layer' : type === 'shape' ? 'Shape layer' : 'Image layer',
  };
  if (type === 'text') base.width = 40;
  if (type === 'shape') { base.width = 20; base.height = 20; }
  return { ...base, ...overrides };
}

// Old records may hold partial layers, or none at all. Always read through
// this so the renderer can rely on every key being present.
export function normaliseLayers(layers) {
  if (!Array.isArray(layers)) return [];
  return layers
    .filter(Boolean)
    .map((l, i) => ({ ...LAYER_DEFAULTS, ...l, id: l.id || `l_legacy_${i}` }))
    .sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
}

export function clamp(n, min, max) {
  const v = Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

// Turns one layer into the inline style the renderer applies. Kept here so the
// admin preview and the public hero can never drift apart.
export function layerStyle(layer) {
  const l = { ...LAYER_DEFAULTS, ...layer };
  const style = {
    position: 'absolute',
    left: `${l.x}%`,
    top: `${l.y}%`,
    width: `${l.width}%`,
    transform: `translate(-50%, -50%) rotate(${l.rotation}deg)`,
    opacity: clamp(l.opacity, 0, 100) / 100,
    mixBlendMode: l.blend === 'normal' ? undefined : l.blend,
    zIndex: l.z,
    pointerEvents: 'none',
  };
  if (l.type === 'shape') style.height = `${l.height}%`;
  if (l.animation && l.animation !== 'none') {
    style.animation = `heroLayer_${l.animation} ${l.animDuration}s ease-in-out infinite`;
  }
  return style;
}

// One stylesheet for every layer animation, injected once by HeroLayers.
export const LAYER_KEYFRAMES = `
@keyframes heroLayer_float {
  0%, 100% { transform: translate(-50%, -50%) rotate(var(--hl-rot, 0deg)) translateY(0); }
  50%      { transform: translate(-50%, -50%) rotate(var(--hl-rot, 0deg)) translateY(-4%); }
}
@keyframes heroLayer_pulse {
  0%, 100% { transform: translate(-50%, -50%) rotate(var(--hl-rot, 0deg)) scale(1); }
  50%      { transform: translate(-50%, -50%) rotate(var(--hl-rot, 0deg)) scale(1.06); }
}
@keyframes heroLayer_spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes heroLayer_drift {
  0%, 100% { transform: translate(-50%, -50%) rotate(var(--hl-rot, 0deg)) translateX(0); }
  50%      { transform: translate(-50%, -50%) rotate(var(--hl-rot, 0deg)) translateX(3%); }
}
@keyframes heroLayer_glow {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(212,175,55,0.35)); }
  50%      { filter: drop-shadow(0 0 22px rgba(212,175,55,0.75)); }
}
@media (prefers-reduced-motion: reduce) {
  [data-hero-layer] { animation: none !important; }
}
`;
