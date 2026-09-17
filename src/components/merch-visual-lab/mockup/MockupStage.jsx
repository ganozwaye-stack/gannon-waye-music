import { forwardRef, useRef } from 'react';

// The live mockup: blank template underneath, design on top. Drag the design to
// move it. Placement is stored in percentages so the export matches the preview.
const MockupStage = forwardRef(function MockupStage({ blankUrl, designUrl, placement, onPlacementChange }, ref) {
  const dragRef = useRef(null);

  const onPointerDown = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    dragRef.current = { rect, startX: e.clientX, startY: e.clientY, x: placement.x, y: placement.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    onPlacementChange({
      ...placement,
      x: d.x + ((e.clientX - d.startX) / d.rect.width) * 100,
      y: d.y + ((e.clientY - d.startY) / d.rect.height) * 100,
    });
  };
  const onPointerUp = () => { dragRef.current = null; };

  return (
    <div ref={ref} className="relative aspect-square w-full overflow-hidden rounded-xl bg-black select-none">
      {blankUrl ? (
        <img src={blankUrl} alt="" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Pick a blank template</div>
      )}
      {designUrl && (
        <img
          src={designUrl} alt="" crossOrigin="anonymous" draggable={false}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
          className="absolute cursor-move touch-none"
          style={{
            left: `${placement.x}%`, top: `${placement.y}%`, width: `${placement.w}%`,
            transform: `translate(-50%, -50%) rotate(${placement.rot || 0}deg)`,
            opacity: placement.opacity ?? 0.96, mixBlendMode: placement.blend ? 'multiply' : 'normal',
          }}
        />
      )}
    </div>
  );
});

export default MockupStage;