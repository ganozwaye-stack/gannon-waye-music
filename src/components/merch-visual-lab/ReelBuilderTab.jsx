import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DEFAULT_SCRIPT = [
  { time: '0–3s', visual: 'Dark cinematic background. Soft gold light appears.', text: 'This is not just merch.' },
  { time: '3–6s', visual: 'First product floats forward.', text: 'It is part of a story of survival.' },
  { time: '6–10s', visual: 'Artwork, lyric, fabric texture, mug detail.', text: 'Respect is earned.' },
  { time: '10–14s', visual: 'Products rotate slowly in a 3D gallery.', text: 'Not a game you make me play.' },
  { time: '14–18s', visual: 'Hoodie, mug, shirt, poster together.', text: 'Wear the message. Carry the story.' },
  { time: '18–22s', visual: 'Warm burgundy and gold glow.', text: 'For anyone rebuilding after pain, doubt, control, or silence.' },
  { time: '22–26s', visual: 'Store / product / add-to-cart visual.', text: '10% of proceeds donated to 1800RESPECT.' },
  { time: '26–30s', visual: 'All products together.', text: 'Shop the official Thank You merch release.\ngannonwaye.com/store' },
];

export default function ReelBuilderTab() {
  const [title, setTitle] = useState('Official Thank You Merch Release');
  const [scenes, setScenes] = useState(DEFAULT_SCRIPT);
  const [copied, setCopied] = useState(false);

  const updateScene = (i, field, value) => {
    setScenes(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const exportScript = () => {
    const out = `REEL SCRIPT: ${title}\nFormat: 9:16 | Duration: 30s\n\n` +
      scenes.map(s => `[${s.time}]\nVisual: ${s.visual}\nText: "${s.text}"`).join('\n\n');
    navigator.clipboard.writeText(out);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Reel Storyboard Builder</h2>
        <p className="text-sm text-muted-foreground">9:16 format · 30 second default · Thank You merch campaign</p>
      </div>

      <div className="flex items-center gap-3">
        <Input value={title} onChange={e => setTitle(e.target.value)} className="max-w-sm" placeholder="Reel title" />
        <Button variant="outline" onClick={exportScript}>{copied ? '✓ Copied!' : 'Copy Script'}</Button>
        <Button variant="outline" onClick={() => setScenes(DEFAULT_SCRIPT)}>Reset to Default</Button>
      </div>

      {/* Storyboard frames */}
      <div className="space-y-3">
        {scenes.map((scene, i) => (
          <div key={i} className="border border-border rounded-xl p-4 bg-card grid grid-cols-12 gap-4 items-start">
            {/* Mini frame preview */}
            <div className="col-span-2">
              <div className="rounded-lg overflow-hidden border border-border/50"
                style={{ background: 'linear-gradient(145deg,#0a0a0a,#1a1200)', aspectRatio: '9/16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-[8px] text-primary/60 text-center px-1 font-display italic leading-snug">
                  {scene.text.split('\n')[0]}
                </p>
              </div>
            </div>

            <div className="col-span-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary/70 w-16 flex-shrink-0">{scene.time}</span>
                <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Scene {i + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Visual direction</label>
                  <textarea
                    className="w-full text-xs bg-secondary border-0 rounded p-2 text-foreground/80 resize-none"
                    rows={2}
                    value={scene.visual}
                    onChange={e => updateScene(i, 'visual', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">On-screen text</label>
                  <textarea
                    className="w-full text-xs bg-secondary border-0 rounded p-2 text-foreground/80 resize-none"
                    rows={2}
                    value={scene.text}
                    onChange={e => updateScene(i, 'text', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs text-muted-foreground">
          <strong className="text-primary">Reel Production Notes:</strong> Use CapCut, Premiere Pro, or DaVinci Resolve.
          Export at 1080×1920, H.264, 60fps. Add gold particle overlay in post.
          Do NOT auto-post — all reels require Gannon approval before publishing.
        </p>
      </div>
    </div>
  );
}