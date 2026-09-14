import { useRef, useCallback } from 'react';
import { normaliseLayers, layerStyle, LAYER_KEYFRAMES, clamp } from '@/lib/heroLayers';

// Renders the hero's layer stack. Used by BOTH the public hero and the admin
// preview, so what you see in the studio is what the site shows. There is no
// second copy of this logic to drift out of step.
//
// With no layers, this renders nothing at all, so the original hero is
// completely unaffected.
//
// In the studio it is handed editable and onChange, which turns on click to
// select and drag to position. On the public site those are never passed, so
// the layers are inert and cannot be dragged by visitors.

function LayerContent({ layer }) {
  if (layer.type === 'image') {
    if (!layer.src) return null;
    return (
      <img
        src={layer.src}
        alt={layer.name || ''}
        draggable={false}
        className="w-full h-auto select-none"
        style={{
          objectFit: layer.fit || 'contain',
          borderRadius: `${layer.radius || 0}%`,
          display: 'block',
        }}
      />
    );
  }

  if (layer.type === 'text') {
    return (
      <p
        className={
          layer.font === 'display' ? 'font-display'
            : layer.font === 'mono' ? 'font-mono'
            : 'font-body'
        }
        style={{
          margin: 0,
          // Font size is a percentage of the hero width, carried in by the
          // wrapper as a container-query-free em base, so text scales with
          // the hero instead of jumping between phone and desktop.
          fontSize: '1em',
          lineHeight: 1.15,
          letterSpacing: `${layer.letterSpacing}em`,
          fontWeight: layer.weight,
          color: layer.color,
          textAlign: layer.align,
          textTransform: layer.uppercase ? 'uppercase' : 'none',
          textShadow: layer.shadow ? '0 2px 18px rgba(0,0,0,0.65)' : 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {layer.text}
      </p>
    );
  }

  if (layer.type === 'shape') {
    return (
      <div
        className="w-full h-full"
        style={{
          background: layer.fill,
          borderRadius: layer.shape === 'circle' ? '50%' : `${layer.radius || 0}%`,
        }}
      />
    );
  }

  return null;
}

export default function HeroLayers({
  layers,
  editable = false,
  selectedId = null,
  onSelect = null,
  onChange = null,
}) {
  const list = normaliseLayers(layers);
  const boxRef = useRef(null);
  const dragRef = useRef(null);

  const handlePointerDown = useCallback((e, layer) => {
    if (!editable || layer.locked) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(layer.id);
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    dragRef.current = {
      id: layer.id,
      boxW: box.width,
      boxH: box.height,
      startX: e.clientX,
      startY: e.clientY,
      originX: layer.x,
      originY: layer.y,
    };

    const move = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = ((ev.clientX - d.startX) / d.boxW) * 100;
      const dy = ((ev.clientY - d.startY) / d.boxH) * 100;
      onChange?.(d.id, {
        x: Math.round(clamp(d.originX + dx, -20, 120) * 10) / 10,
        y: Math.round(clamp(d.originY + dy, -20, 120) * 10) / 10,
      });
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, [editable, onSelect, onChange]);

  if (!list.length && !editable) return null;

  return (
    <div
      ref={boxRef}
      className="absolute inset-0"
      style={{ pointerEvents: editable ? 'auto' : 'none' }}
      aria-hidden={!editable}
    >
      <style>{LAYER_KEYFRAMES}</style>
      {list.map((layer) => {
        if (!layer.visible) return null;
        const style = layerStyle(layer);
        // Animations rewrite transform, so the rotation travels as a variable
        // the keyframes can read back.
        style['--hl-rot'] = `${layer.rotation}deg`;
        if (layer.type === 'text') style.fontSize = `${layer.fontSize}cqw`;
        if (editable) {
          style.pointerEvents = layer.locked ? 'none' : 'auto';
          style.cursor = layer.locked ? 'default' : 'grab';
          if (selectedId === layer.id) {
            style.outline = '2px solid rgba(245,208,110,0.9)';
            style.outlineOffset = '3px';
          }
        }
        return (
          <div
            key={layer.id}
            data-hero-layer={layer.id}
            style={style}
            onPointerDown={(e) => handlePointerDown(e, layer)}
            title={editable ? `${layer.name} (drag to move)` : undefined}
          >
            <LayerContent layer={layer} />
          </div>
        );
      })}
    </div>
  );
}
