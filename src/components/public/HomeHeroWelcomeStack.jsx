import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroGlassPanel, { HERO_BTN_OUTLINE } from '@/components/public/setfree-hero/HeroGlassPanel';

export default function HomeHeroWelcomeStack() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <HeroGlassPanel>
      <div className="home-welcome-copy">
        <p className="home-welcome-eyebrow">{greeting}, welcome.</p>
        <h1 className="font-poppins font-bold gradient-gold-text">I'm Gannon Waye</h1>
        <p>I'm a singer songwriter from Melbourne, Australia. Thank you for being here. I'm really excited you're visiting, and I hope you enjoy spending a little time with my music and the stories behind it.</p>
        <p>Have a good look around, enjoy your time here and make yourself at home.</p>
        <Link to="/biography" className={HERO_BTN_OUTLINE}>My story <ArrowRight className="h-3 w-3" /></Link>
      </div>

    </HeroGlassPanel>
  );
}

