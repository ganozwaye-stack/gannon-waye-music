import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

// This is the PERMANENT presave link. It never changes — when a new release
// is approved, the page behind it switches to the next release automatically.
// Share it once everywhere (bio, stories, captions, QR codes); it stays valid
// for every future release.
const PERMANENT_PRESAVE_URL = 'https://gannonwaye.com/presave';

export default function PreSave() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(PERMANENT_PRESAVE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable (older browsers/permissions) — the URL is still
      // shown as selectable text so it can be copied manually.
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 flex items-center justify-center">
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-3xl border border-primary/20 bg-card/50 p-10 md:p-14 text-center"
      >
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
          One link. Every release.
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground mb-5">Pre-save</h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
          This presave link is permanent — it never changes. Each new release simply
          switches in behind it, so this same link carries fans to the next song, every time.
        </p>

        <div className="rounded-2xl border border-primary/30 bg-background/60 p-5 md:p-6">
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary/80 mb-2">
            Permanent presave link
          </p>
          <p className="font-body text-base md:text-lg gradient-gold-glow font-medium select-all break-all">
            {PERMANENT_PRESAVE_URL}
          </p>
          <Button
            type="button"
            onClick={copyLink}
            variant="outline"
            className="rounded-full mt-4 px-6 border-primary/40 text-primary hover:bg-primary/10"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" /> Copy link
              </>
            )}
          </Button>
        </div>

        <p className="font-body text-[11px] text-muted-foreground/70 mt-6">
          Distributor presave buttons for the current release appear here as soon as each
          link is verified — the permanent URL itself never needs updating.
        </p>

        <Link to="/music" className="inline-block mt-6">
          <Button className="rounded-full gradient-gold-button border-0 px-7">
            Visit the Music Page
          </Button>
        </Link>
      </motion.main>
    </div>
  );
}