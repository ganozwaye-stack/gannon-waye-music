import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroGlassPanel, { HERO_BTN_PRIMARY, HERO_BTN_OUTLINE } from '@/components/public/setfree-hero/HeroGlassPanel';

// The Gannon Waye welcome card. It shares its glass panel with the SET FREE
// card, so the two sit on the same top and bottom edges with their button
// rows level. Left aligned, never centred. House style: no em dashes.
export default function HomeHeroWelcomeStack() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <HeroGlassPanel>
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary/80 md:text-xs">{greeting}, and welcome</p>
      </div>
      <h2 className="mt-3 font-display text-2xl gradient-gold-text md:text-3xl">I'm Gannon Waye</h2>
      <p className="mt-1.5 font-body text-[10px] uppercase tracking-[0.28em] text-foreground/50">Singer · Songwriter · Melbourne</p>

      <p className="mt-4 font-body text-[13px] leading-relaxed text-foreground/90 md:text-sm">
        Independent, heart-first art made after everything life threw at it. I write the songs that say what you cannot say yet, and I built this space for anyone who still needs proof that being knocked down is not the end of the story. You are not alone here.
      </p>
      <p className="mt-3 font-body text-[13px] leading-relaxed text-foreground/90 md:text-sm">
        Stay a while, wander the boutique, leave me a message. Whatever brought you here, you are safe and you are welcome.
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link to="/music" className={HERO_BTN_PRIMARY}>
          Hear the Music <ArrowRight className="h-3 w-3" />
        </Link>
        <Link to="/biography" className={HERO_BTN_OUTLINE}>
          My Story
        </Link>
      </div>
    </HeroGlassPanel>
  );
}