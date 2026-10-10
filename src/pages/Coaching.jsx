import { useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import JournalShelf from '@/components/coaching/JournalShelf';
import CoachingGiftSet from '@/components/coaching/CoachingGiftSet';

// Reuse the existing window-light portrait selected by Gannon from
// Building Resilience and Healthy Boundaries; preserve the source pixels.
// Never include journal interiors, PDF URLs or unverified sample questions here.
const PORTRAIT_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/94d50ca39_77B69334-B27B-44A8-9C21-F7216216A118.png';

export default function Coaching() {
  const [params, setParams] = useSearchParams();
  const location = useLocation(),viewRef = useRef(null);
  const requested = params.get('view');
  const view = requested === 'journals' || requested === 'coaching' ? requested :
  params.has('journal') || location.hash === '#journals' ? 'journals' : null;
  const choose = (next) => setParams((previous) => {
    const query = new URLSearchParams(previous);
    query.delete('journal');
    if (next) query.set('view', next);else query.delete('view');
    return query;
  });
  useEffect(() => {if (view) viewRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });}, [view]);
  return (
    <div className="min-h-screen pb-20" data-testid="coaching-page">
      <section className="max-w-6xl mx-auto px-5 py-10 md:py-14" data-testid="coaching-editorial-intro">
        <header className="grid md:grid-cols-[1fr_360px] gap-6 items-center mb-6 border-b border-primary/30 pb-6">
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-primary mb-4">Coaching with Gannon Waye</p>
          <h1 className="font-display text-4xl md:text-5xl gradient-gold-text leading-tight">Start with what matters to you.</h1>
        </div>
        <img src={PORTRAIT_URL} alt="Gannon Waye" className="w-full h-64 md:h-80 object-contain border border-primary/30" />
        </header>
        {/* Follow Home’s Story treatment: gold rules, left-aligned prose and editorial columns.
            The exact fanned-journal advert remains pending accessible source bytes. */}
        <div className="md:columns-2 md:gap-8 md:[column-rule:1px_solid_hsl(var(--primary)/0.2)]">
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-intro">I’ve always felt drawn to helping people find clarity, understand the challenges they’re facing, and build the confidence to move forward. When I worked as a personal trainer, I realised how much that work went beyond fitness. For me, it felt like forty percent muscle and sixty percent mental. I saw clients grow in self-belief, reach their goals, and achieve things they hadn’t thought possible.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-story">Coaching has a lot in common with that: listening, recognising someone’s strengths, helping them take steps towards what matters. I’ve invested seven years in education and my own development, including studying psychology. And even with that knowledge, I became caught in an abusive relationship. That’s part of why I speak openly about manipulation, control, and domestic abuse. Understanding these things doesn’t make you immune to experiencing them. If you’ve ever wondered how you ended up there, it doesn’t mean you’re unintelligent or weak.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-recovery">My own recovery is still unfolding. Writing music has helped me express feelings I couldn’t always explain, and find strength when I needed it. These journals grew out of that journey. They offer space for you to find your own words, reflect on what matters to you, and explore what you need next. You don’t need to have everything figured out to begin.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-support">You can simply buy the journals and write privately, at your own pace. If you’d like more personal support, I also offer one-on-one coaching, drawing on my practical experience, education and lived experience. We start with your goals and work from there. I’m currently preparing additional tools and resources to support your growth.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-purpose">I want to pay forward what’s helped me, and use the gifts God has given me to bless others. My hope is that through my music, these journals, and the support I offer, you’ll find something that helps you see possibility in your own journey. Sometimes that begins with one small step.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-ending">Wherever you are in your journey, you’re welcome to start here. Explore the journals and choose one that speaks to you, or get in touch about one-on-one coaching so we can talk about what you’d like to work towards. You don’t need to have it all figured out. Let’s start with what matters to you.</p>
        </div>
        <div className="mt-4 pt-5 border-t border-primary/30">
          <Actions onExplore={() => choose('journals')} onEnquire={() => choose('coaching')} />
        </div>
      </section>

      {view && <div ref={viewRef} className="scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 mb-4">
          <Button variant="outline" onClick={() => choose(null)}>Back to the choices</Button>
        </div>
      {view === 'journals' && <>
      <section id="journals" aria-labelledby="journals-title" className="max-w-6xl mx-auto px-5 py-16 scroll-mt-24">
        <div className="rounded-3xl bg-card/60 border border-primary/25 p-7 md:p-10">
          <h2 id="journals-title" className="font-display text-3xl mb-4">Explore the Journals</h2>
          <p className="font-body text-base text-foreground/80 leading-relaxed mb-4">The six journals are A$9.90 each, or A$49 for the six-book bundle. You do not need a coaching call, registration for coaching or approval from me to purchase or read a journal. One-on-one coaching is optional and separate.</p>
          <JournalShelf />
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-5">Reflective writing together is still in development and is not included in the six-book bundle.</p>
        </div>
      </section>

      <CoachingGiftSet />
      </>}


      {view === 'coaching' && <section id="one-on-one" aria-labelledby="coaching-enquiry-title" className="max-w-3xl mx-auto px-5 pb-16">
        <h2 id="coaching-enquiry-title" className="font-display text-3xl mb-4">One-on-one coaching</h2>
        <p className="font-body text-base text-foreground/80 leading-relaxed mb-4">If you would like to work together, get in touch about what you would like to work towards. Sessions are A$99 for 45 minutes. The initial consultation is a paid, two-way conversation to understand your enquiry, your goals and whether we are the right fit. You can ask me questions too. Online appointment booking is being prepared; availability will be confirmed before you are asked to pay.</p>
        <p className="font-body text-base text-foreground/80 leading-relaxed mb-6">There is no obligation after the consultation. If we both choose to continue, you pay for session two and session three is complimentary. The consultation counts as the first paid session. This is a one-time introductory offer; normal full pricing applies from session four onwards. The first three appointments total A$198. A ten-session package is A$850 for ten total 45-minute appointments, including the introductory third-session benefit; it does not add an eleventh appointment.</p>
        <p className="font-body text-base text-foreground/80 leading-relaxed mb-6">If you would like support that includes clearly scoped work between sessions, we can discuss a tailored package and agree the scope and fee upfront.</p>
        <Link to="/contact"><Button variant="outline" className="rounded-full">Enquire about Coaching</Button></Link>
      </section>}
      </div>}
    </div>);

}

function Actions({ onExplore, onEnquire }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button onClick={onExplore} className="gradient-gold-button border-0 rounded-full min-h-11 px-6">Explore the Journals</Button>
      <Button onClick={onEnquire} variant="outline" className="rounded-full min-h-11 px-6">Enquire about Coaching</Button>
    </div>);

}