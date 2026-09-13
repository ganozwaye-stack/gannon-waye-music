import { FONT_OPTIONS, fontCss, makeElement } from '@/lib/heroElements';

const TEXT_PRESETS = [
  {
    label: 'Heading',
    patch: {
      content: 'SET FREE', font_size: 96, font_weight: 800, uppercase: true,
      letter_spacing_em: 0.14, color: '#f0e6c8', glow_strength: 16, width_pct: 90, y_pct: 40,
    },
  },
  {
    label: 'Eyebrow label',
    patch: {
      content: 'The New Single', font_size: 14, font_weight: 500, uppercase: true,
      letter_spacing_em: 0.5, color: '#d4af37', width_pct: 60,
    },
  },
  {
    label: 'Story copy',
    patch: {
      content: 'Write the story of the song here.', font_size: 18, font_weight: 300,
      italic: true, color: '#fdf4e0', width_pct: 44,
    },
  },
  {
    label: 'Serif quote',
    patch: {
      content: 'A lyric line goes here', font: 'cormorant', font_size: 30,
      italic: true, color: '#f0e6c8', width_pct: 50,
    },
  },
];

export default function TextPanel({ onAdd }) {
  return (
    <div className="space-y-3">
      <p className="font-body text-xs text-muted-foreground">
        Tap a style to drop it on the canvas, then drag it anywhere and restyle it on the right.
      </p>
      {TEXT_PRESETS.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onAdd(makeElement('text', p.patch))}
          className="w-full rounded-lg border border-border bg-card hover:border-primary/50 p-3 text-left transition-colors"
        >
          <span className="block font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
            {p.label}
          </span>
          <span
            style={{
              fontFamily: fontCss(p.patch.font),
              fontSize: Math.min(p.patch.font_size / 4, 22),
              fontWeight: p.patch.font_weight,
              fontStyle: p.patch.italic ? 'italic' : 'normal',
              color: p.patch.color,
            }}
            className="block truncate"
          >
            {p.patch.content}
          </span>
        </button>
      ))}
      <p className="font-body text-[10px] text-muted-foreground">
        Fonts available: {FONT_OPTIONS.map((f) => f.label).join(' · ')}
      </p>
    </div>
  );
}