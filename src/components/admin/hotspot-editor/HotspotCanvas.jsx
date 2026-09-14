import { useRef, useState } from 'react';
import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const round1 = (v) => Math.round(v * 10) / 10;

// The design surface for hotspot zones. Click a zone to select it, drag inside
// it to move it, drag its gold corner handle to resize it, or with Draw Zone
// on, drag across the empty picture to create a new zone. Everything works in
// percentages of the locked image, so zones stay exact on any screen and the
// artwork itself can never be replaced, cropped or hidden.
export default function HotspotCanvas({ zones, selectedId, drawMode, onSelect, onDraft, onCreate }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const [liveRect, setLiveRect] = useState(null);

  const pctFromEvent = (e) => {
    const rect = ref.current.getBoundingClientRect();
    return {
      x: clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100),
    };
  };

  const startResize = (e, z) => {
    e.stopPropagation();
    ref.current.setPointerCapture(e.pointerId);
    const p = pctFromEvent(e);
    drag.current = {
      mode: 'resize', id: z.id, startP: p,
      w: z.values.width_pct, h: z.values.height_pct,
      left: z.values.left_pct, top: z.values.top_pct,
    };
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    ref.current.setPointerCapture(e.pointerId);
    const p = pctFromEvent(e);
    const hit = [...zones].reverse().find((z) => (
      p.x >= z.values.left_pct
      && p.x <= Number(z.values.left_pct) + Number(z.values.width_pct)
      && p.y >= z.values.top_pct
      && p.y <= Number(z.values.top_pct) + Number(z.values.height_pct)
    ));
    if (hit) {
      onSelect(hit.id);
      drag.current = {
        mode: 'move', id: hit.id,
        offX: p.x - Number(hit.values.left_pct),
        offY: p.y - Number(hit.values.top_pct),
        w: Number(hit.values.width_pct), h: Number(hit.values.height_pct),
      };
      return;
    }
    onSelect(null);
    if (!drawMode) { drag.current = null; return; }
    drag.current = { mode: 'draw', startX: p.x, startY: p.y };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const p = pctFromEvent(e);
    if (d.mode === 'move') {
      onDraft(d.id, {
        left_pct: round1(clamp(p.x - d.offX, 0, 100 - d.w)),
        top_pct: round1(clamp(p.y - d.offY, 0, 100 - d.h)),
      });
    } else if (d.mode === 'resize') {
      onDraft(d.id, {
        width_pct: round1(clamp(d.w + (p.x - d.startP.x), 2, 100 - d.left)),
        height_pct: round1(clamp(d.h + (p.y - d.startP.y), 2, 100 - d.top)),
      });
    } else if (d.mode === 'draw') {
      setLiveRect({
        left_pct: Math.min(d.startX, p.x),
        top_pct: Math.min(d.startY, p.y),
        width_pct: Math.abs(p.x - d.startX),
        height_pct: Math.abs(p.y - d.startY),
      });
    }
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (d?.mode === 'draw' && liveRect && liveRect.width_pct >= 2 && liveRect.height_pct >= 2) {
      onCreate({
        left_pct: round1(liveRect.left_pct),
        top_pct: round1(liveRect.top_pct),
        width_pct: round1(liveRect.width_pct),
        height_pct: round1(liveRect.height_pct),
      });
    }
    drag.current = null;
    setLiveRect(null);
  };

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[900px] mx-auto select-none rounded-lg overflow-hidden"
      style={{ aspectRatio: '16 / 9', background: '#0a0a0a', touchAction: 'none', cursor: drawMode ? 'crosshair' : 'default' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <img
        src={STOREFRONT_ART_LOCK.imageUrl}
        alt="Locked boutique artwork, preview"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      {zones.map((z) => {
        const v = z.values;
        const sel = z.id === selectedId;
        return (
          <div
            key={z.id}
            style={{
              position: 'absolute',
              left: `${v.left_pct}%`,
              top: `${v.top_pct}%`,
              width: `${v.width_pct}%`,
              height: `${v.height_pct}%`,
              border: `2px ${sel ? 'solid' : 'dashed'} ${v.active === false ? 'rgba(255,255,255,0.35)' : '#D4AF37'}`,
              background: sel ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              cursor: drawMode ? 'crosshair' : 'move',
            }}
          >
            <span
              style={{
                fontSize: '9px', color: '#D4AF37', background: 'rgba(10,10,10,0.85)',
                padding: '2px 5px', borderRadius: '4px', marginBottom: '4px',
                whiteSpace: 'nowrap', maxWidth: '95%', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {v.zone_key || 'untitled'}
            </span>
            {sel && (
              <span
                title="Drag to resize"
                onPointerDown={(e) => startResize(e, z)}
                style={{
                  position: 'absolute', right: -7, bottom: -7, width: 14, height: 14,
                  borderRadius: 4, background: '#D4AF37', border: '2px solid #0a0a0a', cursor: 'nwse-resize',
                  touchAction: 'none',
                }}
              />
            )}
          </div>
        );
      })}
      {liveRect && (
        <div
          style={{
            position: 'absolute',
            left: `${liveRect.left_pct}%`,
            top: `${liveRect.top_pct}%`,
            width: `${liveRect.width_pct}%`,
            height: `${liveRect.height_pct}%`,
            border: '2px solid #f0e6c8',
            background: 'rgba(240,230,200,0.12)',
            borderRadius: '8px',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}