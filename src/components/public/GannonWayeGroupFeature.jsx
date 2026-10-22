import { Link } from 'react-router-dom';
import HeroGlassPanel from '@/components/public/setfree-hero/HeroGlassPanel';

export default function GannonWayeGroupFeature() {
  return (
    <section aria-labelledby="resilience-wellbeing-heading" data-testid="gannon-waye-group-feature" className="h-full min-w-0">
      <HeroGlassPanel>
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/60">Music · Coaching · Journals</p>
        <h2 id="resilience-wellbeing-heading" className="mt-2 font-poppins font-bold text-2xl gradient-gold-text md:text-3xl">Resilience Wellbeing</h2>
        <h3 className="mt-2 font-body text-base text-foreground">Life Coaching and Mindset Mentorship</h3>
        <p className="mt-3 font-body text-sm leading-relaxed text-foreground/75">Explore one-on-one coaching with Gannon, reflective journals, and the music that shares his story. Coaching offers space to reflect on your goals, self-worth and next steps.</p>
        <nav aria-label="Explore Resilience Wellbeing" className="mt-auto flex min-w-0 flex-col gap-2 pt-4">
          <Link to="/coaching?view=journals" data-testid="group-journals-link" className="rounded-lg border border-primary/60 bg-primary/10 px-4 py-3 font-body text-sm text-foreground transition-colors hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Explore journal previews</Link>
          <Link to="/coaching?view=coaching" data-testid="group-coaching-link" className="rounded-lg border border-primary/30 px-4 py-2 font-body text-sm text-foreground transition-colors hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Explore one-on-one coaching <span className="mt-1 block text-xs text-foreground/70">A$99 · 45-minute initial consultation</span></Link>
          <Link to="/music" data-testid="group-music-link" className="font-body text-xs text-primary underline underline-offset-4">Discover Gannon's music</Link>
        </nav>
      </HeroGlassPanel>
    </section>
  );
}
