import { Link } from 'react-router-dom';

export default function GannonWayeGroupFeature() {
  return (
    <section aria-labelledby="gannon-waye-group-heading" data-testid="gannon-waye-group-feature" className="relative px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl border-y border-primary/30 py-8 md:grid md:grid-cols-[1.2fr_1fr] md:gap-12">
        <div className="min-w-0">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-foreground/60">Music · Coaching · Journals</p>
          <h2 id="gannon-waye-group-heading" className="mt-3 font-body text-3xl font-medium gradient-gold-text md:text-5xl">Gannon Waye Group</h2>
          <h3 className="mt-4 font-body text-xl text-foreground">Life coaching and mindset mentorship</h3>
          <p className="mt-4 max-w-xl font-body leading-relaxed text-foreground/75">Explore one-on-one coaching with Gannon, reflective journals, and the music that shares his story. Coaching offers space to reflect on your goals, self-worth and next steps.</p>
        </div>
        <nav aria-label="Explore Gannon Waye Group" className="mt-7 flex min-w-0 flex-col gap-3 md:mt-0 md:justify-center">
          <Link to="/coaching?view=coaching" data-testid="group-coaching-link" className="rounded-lg border border-primary/60 bg-primary/10 px-5 py-4 font-body text-foreground transition-colors hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Explore one-on-one coaching <span className="mt-1 block text-sm text-foreground/70">A$99 · 45-minute initial consultation</span></Link>
          <Link to="/coaching?view=journals" data-testid="group-journals-link" className="rounded-lg border border-primary/30 px-5 py-3 font-body text-foreground transition-colors hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Explore journal previews</Link>
          <Link to="/music" data-testid="group-music-link" className="px-5 py-2 font-body text-primary underline underline-offset-4">Discover Gannon's music</Link>
        </nav>
      </div>
    </section>
  );
}
