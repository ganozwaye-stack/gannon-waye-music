import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { GalaxyDepthBackdrop, GalaxyDepthPlanet } from './GalaxyDepthPreview';
import LumaAlphaFilter from './setfree-hero/LumaAlphaFilter';

const LOGO='https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4a733b567_GWMGannonWayemusic.jpg';
const PRIMARY='inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-sm gradient-gold-button';
const OUTLINE='inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 font-body text-sm hover:bg-primary/10 transition-colors';

export default function GoldEditorialDepth({featured,links}) {
 return <div data-testid="home-opening" data-option="1" data-testid-design="gold-editorial-depth">
  <LumaAlphaFilter />
  <section aria-labelledby="home-release-title" className="relative overflow-hidden border-b border-primary/25 px-5 pt-7 pb-8 md:pt-9 md:pb-10" data-testid="compact-galaxy-hero">
   <GalaxyDepthBackdrop />
   <div className="relative z-10 max-w-6xl mx-auto">
    <div className="text-center mb-5 md:mb-6">
     <img src={LOGO} alt="Gannon Waye Music" className="mx-auto w-40 md:w-48 h-auto" style={{filter:'url(#gw-luma-alpha)'}} />
     <p className="font-body text-[10px] uppercase tracking-[.2em] text-primary mt-2">Gold Editorial · Galaxy depth preview</p>
    </div>
    <div className="grid gap-6 items-center md:grid-cols-[1.05fr_.78fr_1.15fr] md:gap-6" data-testid="combined-home-composition">
     <div className="min-w-0">
      <p className="font-body text-xs uppercase tracking-[.2em] text-primary mb-3">{featured?'Set Free · Out now':'Music by Gannon Waye'}</p>
      <h1 id="home-release-title" className="font-display text-5xl lg:text-6xl leading-none mb-4">{featured?.title||'Find your next song.'}</h1>
      {featured?.release_date&&<p className="font-body text-xs text-foreground/70 mb-4">Gannon Waye · Released {new Date(featured.release_date+'T12:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}</p>}
      <p className="font-body text-base leading-relaxed text-foreground/85 mb-5">{featured?.current_single_hero_copy||featured?.description||'Explore the music and the stories behind it.'}</p>
      <div className="flex flex-wrap gap-2">
       {links.map((link,i)=><a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className={i===0?PRIMARY:OUTLINE}>{link.label}<ExternalLink className="h-3.5 w-3.5"/></a>)}
       <Link to={featured?'/release/'+featured.id:'/music'} className={OUTLINE}>{featured?'Behind the song':'Explore the music'}<ArrowRight className="h-3.5 w-3.5"/></Link>
      </div>
     </div>
     {featured?<div className="mx-auto w-full max-w-[260px] md:max-w-none" data-testid="compact-heart-planet"><GalaxyDepthPlanet /></div>:<div />}
     <div className="rounded-2xl border border-primary/30 bg-black/50 p-5 md:p-6" data-testid="compact-home-welcome">
      <p className="font-body text-[10px] uppercase tracking-[.2em] text-primary mb-3">Welcome to my world</p>
      <h2 className="font-display text-3xl lg:text-4xl leading-tight mb-4">I’m Gannon Waye. I’m glad you’re here.</h2>
      <p className="font-body text-sm leading-relaxed text-foreground/85 mb-3">I write music to express feelings I couldn’t always explain, and to find strength when I need it. This is a place to hear those songs, discover the stories behind them, and explore what speaks to you.</p>
      <p className="font-body text-sm leading-relaxed text-foreground/85 mb-4">Stay a while. Listen, read, or leave me a message. Wherever you are in your journey, you’re welcome to start here.</p>
      <div className="flex flex-wrap gap-2"><Link to="/biography" className={OUTLINE}>My story<ArrowRight className="h-3.5 w-3.5"/></Link><Link to="/contact" className={OUTLINE}>Get in touch<ArrowRight className="h-3.5 w-3.5"/></Link></div>
     </div>
    </div>
   </div>
  </section>
  <section aria-labelledby="home-coaching-title" className="max-w-6xl mx-auto px-5 py-6 md:py-7" data-testid="compact-home-coaching">
   <div className="rounded-2xl border border-primary/30 bg-card/70 p-5 md:p-6 grid gap-5 md:grid-cols-[1.6fr_1fr] items-center">
    <div>
     <p className="font-body text-[10px] uppercase tracking-[.2em] text-primary mb-2">Coaching & journals</p>
     <h2 id="home-coaching-title" className="font-display text-3xl md:text-4xl mb-3">Start with what matters to you.</h2>
     <p className="font-body text-sm leading-relaxed text-foreground/80 mb-2">My practical experience, education and lived experience shape the coaching I offer. We start with your goals and work from there.</p>
     <p className="font-body text-sm leading-relaxed text-foreground/80">The journals offer space to find your own words and reflect privately, at your own pace. If you’d like more personal support, you can get in touch about one-on-one coaching.</p>
    </div>
    <div className="flex flex-wrap gap-2"><Link to="/coaching" className={PRIMARY}>Meet my coaching approach<ArrowRight className="h-3.5 w-3.5"/></Link><Link to="/coaching?view=journals" className={OUTLINE}>Explore the Journals<ArrowRight className="h-3.5 w-3.5"/></Link><Link to="/coaching?view=coaching" className={OUTLINE}>Enquire about Coaching<ArrowRight className="h-3.5 w-3.5"/></Link></div>
   </div>
  </section>
 </div>;
}
