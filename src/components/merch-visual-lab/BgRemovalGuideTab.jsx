import React from 'react';

const TOOLS = [
  { name: 'Adobe Photoshop', desc: 'Remove Background tool or Select Subject + Refine Edge. Best quality.', url: 'https://photoshop.adobe.com', tier: 'Professional' },
  { name: 'Adobe Express', desc: 'One-click background removal for quick exports.', url: 'https://www.adobe.com/express/', tier: 'Free' },
  { name: 'Remove.bg', desc: 'Fastest AI cut-out. Great for solid objects.', url: 'https://www.remove.bg', tier: 'Free' },
  { name: 'Photoroom', desc: 'Product-focused. Adds studio backgrounds or keeps transparent.', url: 'https://www.photoroom.com', tier: 'Free' },
  { name: 'Clipdrop', desc: 'Clean cut-outs with refinement tools.', url: 'https://clipdrop.co', tier: 'Free' },
  { name: 'Pixlr', desc: 'Browser-based. Remove BG + manual touch-up.', url: 'https://pixlr.com', tier: 'Free' },
  { name: 'Erase.bg', desc: 'Simple background eraser for product images.', url: 'https://www.erase.bg', tier: 'Free' },
  { name: 'Canva', desc: 'Background Remover tool in Canva Pro.', url: 'https://www.canva.com', tier: 'Pro' },
  { name: 'Figma', desc: 'Manual masking and path editing for complex shapes.', url: 'https://www.figma.com', tier: 'Free/Pro' },
];

const STEPS = [
  'Export your product photo as PNG or high-quality JPEG.',
  'Upload to Remove.bg or Adobe Express for a first pass cut-out.',
  'Download the transparent PNG.',
  'Inspect edges — zoom in to 200% in any photo editor.',
  'Clean up fringing, white halos, or blurry edges.',
  'Save final file as PNG with transparency (not JPEG — JPEG kills transparency).',
  'Upload the transparent PNG here using the "PNG Uploads" tab.',
  'Mark status as background_removed.',
  'Admin reviews and approves for use in compositions.',
];

export default function BgRemovalGuideTab() {
  return (
    <div className="max-w-3xl space-y-8">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <h2 className="font-display text-xl text-primary mb-2">Why Transparent PNG Cut-outs?</h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Transparent PNG cut-outs allow products to overlap, float, rotate and stack without white boxes around the image.
          This creates the premium cinematic merch look — where hoodies, mugs, posters and shirts exist in the same 3D space,
          layered with gold rim light and dark backgrounds, exactly like luxury brand visuals.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Step-by-Step Workflow</h3>
        <ol className="space-y-2">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground/80">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Supported Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOOLS.map(tool => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-3 border border-border rounded-xl p-4 hover:border-primary/40 transition-colors bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{tool.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{tool.tier}</span>
                </div>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-2">Edge Cleanup Tips</h3>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
          <li>Use "Refine Edge" or "Smart Radius" in Photoshop for fabric textures</li>
          <li>Check for white fringing by placing the cut-out on a dark background</li>
          <li>For mugs, remove both the handle shadow and background</li>
          <li>For hoodies, keep the drawstring and hood shape intact</li>
          <li>Always export at 2x or 3x resolution for retina displays</li>
          <li>Save as PNG-24 with alpha channel, not PNG-8</li>
        </ul>
      </div>
    </div>
  );
}