import { Mail } from 'lucide-react';
import HeroGlassPanel from '@/components/public/setfree-hero/HeroGlassPanel';
import HomeEmailSignup from '@/components/public/HomeEmailSignup';
import HomeSocialLinks from '@/components/public/HomeSocialLinks';
import { DOUBLE_OPT_IN_ENABLED } from '@/config/emailSignup';

export default function HomeWelcomeConnections({ settings = {} }) {
  return <HeroGlassPanel>
      <div className="home-welcome-connections">
        <p>If you’d like to stay in touch, please subscribe.</p>
        <details className="home-website-signup">
          <summary><Mail className="h-4 w-4" /> Subscribe for email updates <span aria-hidden="true">+</span></summary>
          <HomeEmailSignup compact />
        </details>
        {!DOUBLE_OPT_IN_ENABLED && <p className="home-signup-state">Website email signup is currently paused.</p>}
        <HomeSocialLinks settings={settings} />
      </div>
  </HeroGlassPanel>;
}
