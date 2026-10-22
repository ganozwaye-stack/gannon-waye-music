import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroGlassPanel, { HERO_BTN_PRIMARY, HERO_BTN_OUTLINE } from '@/components/public/setfree-hero/HeroGlassPanel';

export default function HomeHeroWelcomeStack() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <HeroGlassPanel>
      <div className="home-welcome-copy">
        <p className="font-body text-[10px] uppercase tracking-[0.24em] text-primary/80">{greeting}, welcome.</p>
        <h2 className="mt-1 font-poppins font-bold text-xl md:text-2xl gradient-gold-text">I'm Gannon Waye</h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-foreground/90">I'm a singer songwriter from Melbourne, Australia. I'm really excited you're visiting. Have a look around, enjoy your time here, and make yourself at home.</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-foreground/80">If you'd like to stay in touch, subscribe on YouTube for music and updates.</p>
      </div>
      <div className="home-welcome-actions flex flex-wrap gap-2">
        <a href="https://www.youtube.com/@gannonwayeofficial" target="_blank" rel="noopener noreferrer" className={HERO_BTN_PRIMARY}>Subscribe on YouTube <ArrowRight className="h-3 w-3" /></a>
        <Link to="/biography" className={HERO_BTN_OUTLINE}>My Story</Link>
      </div>
    </HeroGlassPanel>
  );
}
