import HeroDesignEditor from '@/components/admin/hero-design/HeroDesignEditor';

// Dedicated owner-only section for the hero artwork: galaxy framing, orbit
// ring, sparks, heart size and labels. Nothing here touches any other part
// of the site, and nothing goes live until Save is pressed.
export default function HeroDesignStudio() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Owner Only</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Hero Design Studio</h1>
        <p className="font-body text-sm text-muted-foreground mt-1 max-w-2xl">
          Full control over the home hero. Move the sliders, watch the live preview, then save to lock
          it in. The galaxy over-scan guarantees no screen edge can ever show, and release day needs
          nothing from anyone but you.
        </p>
      </div>
      <HeroDesignEditor />
    </div>
  );
}