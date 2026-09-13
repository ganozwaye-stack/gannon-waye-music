import { useEffect, useRef, useState } from 'react';
import HeroElementRender, { HeroElementInner } from '@/components/public/HeroElementRender';

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

// The interactive design surface. Every element can be selected, dragged,
// resized and rotated right on the canvas, CapCut style. The cursor turns
// into a grab tool over anything movable. Locked elements and the
// background stay put but can still be selected and styled.
export default function HeroCanvas({ elements, selectedId, onSelect, onChange }) {
  const containerRef = useRef(null);
  const [canvasW, setCanvasW] = useState(900);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => setCanvasW(entry.contentRect.width || 900));
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  // A size stored for a 1440px design width becomes the right number of
  // pixels for this canvas, so the editor and the public site match.
  const scale = (s) => `${(s * canvasW) / 1440}px`;

  const sorted = [...(elements || [])].sort((a, b) => (a.z || 0) - (b.z || 0));

  const begin = (e, el, mode) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(el.id);
    if (mode === 'select' || el.locked || el.type === 'background') return;
    const rect = containerRef.current.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const start = {
      x: el.x_pct, y: el.y_pct, w: el.width_pct,
      rot: el.rotation_deg || 0, fs: el.font_size || 14,
    };
    const cx = rect.left + (rect.width * (el.x_pct / 100));
    const cy = rect.top + (rect.height * (el.y_pct / 100));
    const angle0 = Math.atan2(sy - cy, sx - cx);

    const move = (ev) => {
      const dx = ((ev.clientX - sx) / rect.width) * 100;
      const dy = ((ev.clientY - sy) / rect.height) * 100;
      if (mode === 'drag') {
        onChange(el.id, { x_pct: clamp(start.x + dx, -30, 130), y_pct: clamp(start.y + dy, -30, 130) });
      } else if (mode === 'resize') {
        if (el.type === 'button') {
          onChange(el.id, { font_size: clamp(Math.round(start.fs + dx / 3), 8, 200) });
        } else {
          onChange(el.id, { width_pct: clamp(start.w + dx, 2, 400) });
        }
      } else if (mode === 'rotate') {
        const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx);
        onChange(el.id, { rotation_deg: Math.round(start.rot + ((angle - angle0) * 180) / Math.PI) });
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={() => onSelect(null)}
      className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
      style={{ background: '#0a0a0e' }}
    >
      {sorted.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-center px-6 font-body text-xs text-white/40">
          Empty canvas. Use Uploads, Text or Add on the left, or press Insert standard hero layout.
        </p>
      )}
      {sorted.map((el) => {
        const isSel = el.id === selectedId;
        const still = el.locked || el.type === 'background' || el.type === 'atmosphere';
        const fullBleed = el.type === 'background' || el.type === 'atmosphere';
        const wrapperStyle = fullBleed
          ? { position: 'absolute', inset: 0, zIndex: el.z || 0 }
          : {
              position: 'absolute',
              left: `${el.x_pct}%`,
              top: `${el.y_pct}%`,
              width: ['text', 'image', 'ring'].includes(el.type) ? `${el.width_pct}%` : 'auto',
              transform: `translate(-50%, -50%) rotate(${el.rotation_deg || 0}deg)`,
              zIndex: el.z || 0,
            };
        return (
          <div
            key={el.id}
            style={wrapperStyle}
            onPointerDown={(e) => begin(e, el, still ? 'select' : 'drag')}
            className={
              still
                ? 'cursor-pointer'
                : el.locked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
            }
          >
            {fullBleed ? <HeroElementRender el={el} scale={scale} /> : <HeroElementInner el={el} scale={scale} />}
            {isSel && (
              <div className="absolute inset-0 pointer-events-none rounded-sm outline outline-1 outline-primary" />
            )}
            {isSel && !still && !el.locked && (
              <>
                <div
                  onPointerDown={(e) => begin(e, el, 'resize')}
                  className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-primary border border-white"
                  style={{ cursor: 'nwse-resize' }}
                  title="Drag to resize"
                />
                <div
                  onPointerDown={(e) => begin(e, el, 'rotate')}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary"
                  style={{ cursor: 'grab' }}
                  title="Drag to rotate"
                />
              </>
            )}
          </div>
        );
      })}
      <div className="absolute bottom-2 right-3 font-body text-[10px] text-white/25 pointer-events-none">
        Drag to move · corner dot to resize · top dot to rotate · Delete key removes
      </div>
    </div>
  );
}