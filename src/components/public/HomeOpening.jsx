import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import LumaAlphaFilter from '@/components/public/setfree-hero/LumaAlphaFilter';
import { isPublicRelease } from '@/lib/publicRelease';
import { GalaxyDepthBackdrop, GalaxyDepthPlanet } from './GalaxyDepthPreview';

const GWM_LOGO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4a733b567_GWMGannonWayemusic.jpg';
const PRIMARY = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-sm gradient-gold-button';
const OUTLINE = 'inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 px-6 py-3 font-body text-sm text-foreground hover:bg-primary/10 transition-colors';
function publicHttps(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
}

export default function HomeOpening({ release, option = 1, depthPreview = false }) {
  const centred = option === 2;
  const magazine = option === 3;
  const bold = option === 4;
  const welcomeFirst = option === 5;
  const names = ['Gold editorial', 'The record sleeve', 'The story magazine', 'The stage', 'A personal welcome'];
  const featured = isPublicRelease(release) ? release : null;
  const links = featured ? [
    { label: 'Listen on Spotify', url: publicHttps(featured.spotify_link) },
    { label: 'Apple Music', url: publicHttps(featured.apple_music_link) },
    { label: 'All platforms', url: publicHttps(featured.other_links?.find(link => link.platform === 'All platforms')?.url) },
  ].filter(link => link.url) : [];
  return (
    <div data-testid="home-opening" data-option={option} className={welcomeFirst ? 'flex flex-col' : magazine ? 'grid md:grid-cols-2' : ''}>
      <p className="px-5 pt-6 font-body text-xs uppercase tracking-[.2em] text-primary md:col-span-2">{depthPreview ? 'Galaxy depth study · Evolution of concept 1 · Preview for review' : 'Homepage concept '+option+' · '+names[option-1]}</p>
      <LumaAlphaFilter />
      <section aria-labelledby="home-release-title" className={'relative overflow-hidden border-b border-primary/20 px-5 py-12 md:px-8 md:py-20 md:col-span-2 '+(welcomeFirst ? 'order-2' : '')} style={{background:bold ? 'linear-gradient(135deg,#351b24,#0f0d16)' :'radial-gradient(ellipse at 85% 20%,rgba(177,128,44,.16),transparent 60%),hsl(var(--background))'}}>
        {depthPreview && <GalaxyDepthBackdrop />}
        <div className="mx-auto max-w-6xl relative z-10">
          <img src={GWM_LOGO} alt="Gannon Waye Music" className={'mb-10 h-auto w-52 max-w-full md:w-64 '+(centred ? 'mx-auto' : '')} style={{filter:'url(#gw-luma-alpha)'}} />
          <div className={centred ? 'flex flex-col items-center text-center gap-8' : bold ? 'grid items-center gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16' : magazine ? 'grid items-center gap-10 md:grid-cols-[1.4fr_1fr] md:gap-10' : 'grid items-center gap-10 md:grid-cols-2 md:gap-16'}>
            <div className={'min-w-0 '+(centred ? 'max-w-2xl order-2' : bold ? 'md:order-2' : '')}>
              <p className="font-body text-xs uppercase tracking-[.3em] text-primary mb-5">{featured ? 'The latest single · Out now' : 'Music by Gannon Waye'}</p>
              <h1 id="home-release-title" className={'font-display leading-none mb-6 '+(bold ? 'text-7xl md:text-9xl uppercase' : 'text-6xl md:text-8xl')}>{featured?.title || 'Find your next song.'}</h1>
              {featured?.release_date && <p className="font-body text-sm text-muted-foreground mb-6">Gannon Waye · Released {new Date(featured.release_date+'T12:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}</p>}
              <p className="font-body text-lg leading-relaxed text-foreground/80 mb-8">{featured?.current_single_hero_copy || featured?.description || 'Explore the music, the stories behind it, and what comes next.'}</p>
              <div className={'flex flex-wrap gap-3 '+(centred ? 'justify-center' : '')}>
                {links.map((link,index)=><a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className={index===0 ? PRIMARY : OUTLINE}>{link.label}<ExternalLink className="h-4 w-4" /></a>)}
                <Link to={featured ? '/release/'+featured.id : '/music'} className={OUTLINE}>{featured ? 'Behind the song' : 'Explore the music'}<ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
            {depthPreview && featured ? <GalaxyDepthPlanet /> : featured?.artwork_url && <img data-testid="home-release-cover" src={featured.artwork_url} alt={featured.title+' cover artwork'} fetchPriority="high" className={'w-full mx-auto border border-primary/30 shadow-2xl '+(centred ? 'max-w-sm order-1 rounded-lg' : bold ? 'max-w-lg md:order-1 rounded-none' : magazine ? 'max-w-lg rounded-none' : 'max-w-lg rounded-3xl')} />}
          </div>
        </div>
      </section>

      <section aria-labelledby="home-welcome-title" className={'w-full max-w-6xl mx-auto px-5 py-14 md:py-20 '+(welcomeFirst ? 'order-1 bg-primary/5' : magazine ? 'border-r border-primary/20 md:pl-10' : centred ? 'text-center' : '')}>
        <p className="font-body text-xs uppercase tracking-[.3em] text-primary mb-4">Welcome to my world</p>
        <h2 id="home-welcome-title" className="font-display text-4xl md:text-5xl mb-6">I’m Gannon Waye. I’m glad you’re here.</h2>
        <div className={'max-w-3xl '+(centred ? 'mx-auto' : '')}>
          <p className="font-body text-lg leading-relaxed text-foreground/80 mb-4">I write music to express feelings I couldn’t always explain, and to find strength when I need it. This is a place to hear those songs, discover the stories behind them, and explore what speaks to you.</p>
          <p className="font-body text-lg leading-relaxed text-foreground/80 mb-6">Stay a while. Listen, read, or leave me a message. Wherever you are in your journey, you’re welcome to start here.</p>
          <div className="flex flex-wrap gap-3"><Link to="/biography" className={OUTLINE}>My story<ArrowRight className="h-4 w-4" /></Link><Link to="/contact" className={OUTLINE}>Get in touch<ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section aria-labelledby="home-coaching-title" className={'w-full max-w-6xl mx-auto px-5 pb-16 md:pb-20 '+(welcomeFirst ? 'order-3' : magazine ? 'pt-14 md:pt-20 md:pr-10' : '')}>
        <div className={magazine ? 'p-2 grid gap-8' : bold ? 'border-t-2 border-primary p-7 md:p-10 grid gap-8 md:grid-cols-[1.4fr_1fr]' : 'rounded-3xl border border-primary/30 bg-card/60 p-7 md:p-10 grid gap-8 md:grid-cols-[1.4fr_1fr]'}>
          <div>
            <p className="font-body text-xs uppercase tracking-[.3em] text-primary mb-4">Coaching & journals</p>
            <h2 id="home-coaching-title" className="font-display text-3xl md:text-4xl mb-5">Start with what matters to you.</h2>
            <p className="font-body text-base leading-relaxed text-foreground/80 mb-4">My practical experience, education and lived experience shape the coaching I offer. We start with your goals and work from there.</p>
            <p className="font-body text-base leading-relaxed text-foreground/80">The journals offer space to find your own words and reflect privately, at your own pace. If you’d like more personal support, you can get in touch about one-on-one coaching.</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-3">
            <Link to="/coaching" className={PRIMARY}>Meet my coaching approach<ArrowRight className="h-4 w-4" /></Link>
            <Link to="/coaching?view=journals" className={OUTLINE}>Explore the Journals<ArrowRight className="h-4 w-4" /></Link>
            <Link to="/coaching?view=coaching" className={OUTLINE}>Enquire about Coaching<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
