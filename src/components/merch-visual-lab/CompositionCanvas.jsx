
// Pre-defined layer positions for "organised mess" look
const LAYER_CONFIGS = [
  { rotate: -8, scale: 1.2, x: '5%', y: '10%', z: 1, blur: 0 },
  { rotate: 6, scale: 0.85, x: '55%', y: '5%', z: 3, blur: 0 },
  { rotate: -3, scale: 0.7, x: '70%', y: '45%', z: 2, blur: 0 },
  { rotate: 10, scale: 0.6, x: '10%', y: '55%', z: 4, blur: 1 },
  { rotate: -15, scale: 0.5, x: '50%', y: '60%', z: 1, blur: 2 },
];

export default function CompositionCanvas({ layout, bgStyle, assets, textOverlay, cta }) {
  const isPortrait = layout && layout.h > layout.w;
  const previewH = isPortrait ? 420 : 240;
  const previewW = layout ? Math.round(previewH * (layout.w / layout.h)) : 240;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Live Preview — {layout?.w}×{layout?.h}</p>
        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">CSS preview only</span>
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-border mx-auto"
        style={{
          width: previewW,
          height: previewH,
          background: bgStyle?.css || 'linear-gradient(145deg,#0a0a0a,#161616)',
        }}
      >
        {/* Gold rim light top */}
        <div className="absolute top-0 left-0 right-0 h-1/3 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.4) 0%, transparent 70%)' }} />

        {/* Product layers */}
        {assets.map((asset, i) => {
          const cfg = LAYER_CONFIGS[i % LAYER_CONFIGS.length];
          return (
            <div key={asset.id}
              className="absolute"
              style={{
                left: cfg.x,
                top: cfg.y,
                zIndex: cfg.z,
                transform: `rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
                filter: cfg.blur ? `blur(${cfg.blur}px) drop-shadow(0 8px 24px rgba(0,0,0,0.8))` : 'drop-shadow(0 8px 24px rgba(0,0,0,0.8)) drop-shadow(0 0 8px rgba(212,175,55,0.15))',
                transformOrigin: 'center center',
              }}
            >
              <img
                src={asset.transparent_png_url || asset.original_image_url}
                style={{ width: 80, height: 80, objectFit: 'contain' }}
                alt={asset.title}
              />
            </div>
          );
        })}

        {/* Text overlay */}
        {textOverlay && (
          <div className="absolute bottom-16 left-0 right-0 text-center z-10 px-3">
            <p className="font-display text-sm italic text-white/90 leading-snug drop-shadow-lg">{textOverlay}</p>
          </div>
        )}

        {/* CTA */}
        {cta && (
          <div className="absolute bottom-4 left-0 right-0 text-center z-10">
            <p className="font-body text-[9px] tracking-widest uppercase text-primary/80">{cta}</p>
          </div>
        )}

        {/* Campaign note */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[8px] bg-black/50 text-primary/70 px-2 py-1 rounded-full">Support independent music</span>
        </div>

        {assets.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-xs text-center px-4">
            Select transparent assets to see the layered composition preview
          </div>
        )}
      </div>
    </div>
  );
}