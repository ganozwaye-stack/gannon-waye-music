import { Plus } from 'lucide-react';

// Left rail: every zone as a small entry, one click selects it on the canvas.
// Draw new zone toggles the canvas into zone-drawing mode.
export default function HotspotZoneList({ zones, selectedId, onSelect, onToggleDraw, drawMode }) {
  return (
    <div className="space-y-3">
      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        Zones on the locked photo
      </p>
      {zones.length === 0 && (
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          No zones yet. Press Draw zone below, then drag a box over anything in the picture you want fans to tap.
        </p>
      )}
      <div className="space-y-1.5">
        {zones.map((z) => {
          const v = z.values;
          const sel = z.id === selectedId;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onSelect(z.id)}
              className={`w-full text-left rounded-lg border p-2 transition-colors ${
                sel
                  ? 'border-primary bg-primary/15'
                  : 'border-border hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${v.active === false ? 'bg-muted-foreground/40' : 'bg-primary'}`}
                  aria-hidden
                />
                <span className="font-body text-xs text-foreground truncate">{v.zone_key || 'untitled zone'}</span>
              </span>
              <span className="block font-body text-[10px] text-muted-foreground mt-1 truncate">
                {v.hotspot_mode === 'interest'
                  ? (v.interest_item_name || 'Express interest item')
                  : (z.productLabel || 'No product linked yet')}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onToggleDraw}
        className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 font-body text-xs tracking-wider uppercase border transition-colors ${
          drawMode
            ? 'border-primary bg-primary/20 text-primary'
            : 'border-primary/40 text-primary hover:bg-primary/10'
        }`}
      >
        <Plus className="w-3.5 h-3.5" />
        {drawMode ? 'Drawing on. Drag on the picture' : 'Draw new zone'}
      </button>
    </div>
  );
}