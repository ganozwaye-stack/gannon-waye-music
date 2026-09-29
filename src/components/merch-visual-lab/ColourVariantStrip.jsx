import { Check } from 'lucide-react';

// Branding applied in every colourway: each supplier colour renders the
// product's branded image tinted to that colour so the owner can see how the
// design reads on each option, with a one-tap approve toggle per colour that
// signs off the final storefront colour set. The tint is a live blend of the
// colour over the existing branded photo, so the design itself stays visible.
export default function ColourVariantStrip({ image, name, colors, onToggleApproved, saving }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {colors.map((c, i) => (
        <div key={`${c.name}-${i}`} className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="relative aspect-square">
            {image ? (
              <>
                <img src={image} alt={`${name} branding in ${c.name}`} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: c.hex || '#888888', mixBlendMode: 'color' }}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: c.hex || '#888888' }}>
                <span className="font-body text-[10px] uppercase tracking-wider text-foreground/70">No design image yet</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-1.5 px-2 py-1.5">
            <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-foreground/85 min-w-0" title={c.name}>
              <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ background: c.hex || '#888888' }} />
              <span className="truncate">{c.name}</span>
            </span>
            {c.approved ? (
              <button
                type="button"
                onClick={() => onToggleApproved(i)}
                disabled={saving}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full gradient-gold-button font-body text-[10px] uppercase tracking-wider shrink-0"
              >
                <Check className="w-3 h-3" /> Approved
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onToggleApproved(i)}
                disabled={saving}
                className="inline-flex items-center px-2 py-1 rounded-full border border-primary/40 text-primary font-body text-[10px] uppercase tracking-wider hover:bg-primary/10 shrink-0"
              >
                Approve
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}