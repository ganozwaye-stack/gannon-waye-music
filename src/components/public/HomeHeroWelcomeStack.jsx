import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import HeroGlassPanel, { HERO_BTN_OUTLINE } from '@/components/public/setfree-hero/HeroGlassPanel';
import HomeEmailSignup from '@/components/public/HomeEmailSignup';
import HomeSocialLinks from '@/components/public/HomeSocialLinks';
import { DOUBLE_OPT_IN_ENABLED } from '@/config/emailSignup';

export default function HomeHeroWelcomeStack({ settings = {} }) {
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
      <div className="home-welcome-connections">
        <p>If you’d like to stay in touch, please subscribe.</p>
        <details className="home-website-signup">
          <summary><Mail className="h-4 w-4" /> Subscribe for email updates <span aria-hidden="true">+</span></summary>
          <HomeEmailSignup compact />
        </details>
        {!DOUBLE_OPT_IN_ENABLED && <p className="home-signup-state">Website email signup is currently paused.</p>}
        <HomeSocialLinks settings={settings} />
      </div>
    </HeroGlassPanel>
  );
}

