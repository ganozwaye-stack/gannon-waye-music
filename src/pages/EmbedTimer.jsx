import { useState } from 'react';
import CountdownTimer from '@/components/public/CountdownTimer';

const ARTWORK_REVEAL_DATE = '2026-05-10T00:00:00';

export default function EmbedTimer() {
  const [isCopied, setIsCopied] = useState(false);

  const embedCode = `<iframe
  src="${window.location.origin}/embed-timer"
  width="100%"
  height="300"
  frameborder="0"
  style="border: none; border-radius: 16px; background: linear-gradient(180deg, rgba(30, 25, 15, 0.95) 0%, rgba(20, 15, 5, 0.95) 100%); padding: 40px 20px; box-sizing: border-box;"
></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Check if we're in embed mode
  const isEmbed = window.self !== window.top;

  if (isEmbed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 bg-gradient-to-b from-background/95 to-background/80 min-h-screen">
        <div className="text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
            Artwork & Release Reveal
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground italic mb-8">
            Thank You
          </h2>
          <CountdownTimer targetDate={ARTWORK_REVEAL_DATE} />
          <p className="font-body text-xs text-muted-foreground mt-6 tracking-wider uppercase">
            Single Artwork & Release Date
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-4xl text-foreground mb-4">Embed Timer</h1>
          <p className="font-body text-muted-foreground mb-8">
            Use this code to embed the countdown timer on your website, TikTok, Instagram, or CapCut edits.
          </p>
        </div>

        {/* Preview */}
        <div className="bg-card border border-border/40 rounded-2xl p-8 mb-8">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-4">Preview</p>
          <div className="rounded-xl overflow-hidden bg-gradient-to-b from-background/95 to-background/80 p-8 text-center">
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
              Artwork & Release Reveal
            </p>
            <h2 className="font-display text-3xl text-foreground italic mb-6">
              Thank You
            </h2>
            <CountdownTimer targetDate={ARTWORK_REVEAL_DATE} />
            <p className="font-body text-xs text-muted-foreground mt-4 tracking-wider uppercase">
              Single Artwork & Release Date
            </p>
          </div>
        </div>

        {/* Embed Code */}
        <div className="mb-8">
          <div className="bg-card border border-border/40 rounded-2xl p-6">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-4">Embed Code</p>
            <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono">
              {embedCode}
            </pre>
            <button
              onClick={copyToClipboard}
              className="w-full px-6 py-2 rounded-full bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors"
            >
              {isCopied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <div className="bg-secondary/50 border border-border/40 rounded-2xl p-6">
            <h3 className="font-display text-lg text-foreground mb-2">For CapCut</h3>
            <ol className="font-body text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Use a browser source (like OBS or similar screen recording)</li>
              <li>Navigate to this page and record the timer preview</li>
              <li>Or embed the iframe in a web editor and capture as video overlay</li>
            </ol>
          </div>

          <div className="bg-secondary/50 border border-border/40 rounded-2xl p-6">
            <h3 className="font-display text-lg text-foreground mb-2">For Website</h3>
            <p className="font-body text-sm text-muted-foreground mb-3">
              Paste the embed code into your HTML where you want the timer to appear.
            </p>
          </div>

          <div className="bg-secondary/50 border border-border/40 rounded-2xl p-6">
            <h3 className="font-display text-lg text-foreground mb-2">Direct Link</h3>
            <p className="font-body text-sm text-muted-foreground mb-3">
              Share this link directly on socials:
            </p>
            <input
              type="text"
              value={window.location.href}
              readOnly
              className="w-full bg-background border border-border/40 rounded-lg px-4 py-2 font-mono text-xs text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}