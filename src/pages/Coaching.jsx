import { useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import JournalShelf from '@/components/coaching/JournalShelf';
import CoachingGiftSet from '@/components/coaching/CoachingGiftSet';

// Reuse the portrait already approved and displayed in the site's public navigation.
// Never include journal interiors, PDF URLs or unverified sample questions here.
const PORTRAIT_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/637f52efd_image.png';

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
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-primary mb-4">Coaching with Gannon Waye</p>
          <h1 className="font-display text-4xl md:text-6xl mb-6">Start with what matters to you.</h1>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6" data-testid="coaching-approved-intro">I’ve always felt drawn to helping people find clarity, understand the challenges they’re facing, and build the confidence to move forward. </p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6" data-testid="coaching-approved-story">Coaching has a lot in common with that: listening, recognising someone’s strengths, helping them take steps towards what matters. I’ve invested seven years in education and my own development, including studying psychology. And even with that knowledge, I became caught in an abusive relationship. That’s part of why I speak openly about manipulation, control, and domestic abuse. Understanding these things doesn’t make you immune to experiencing them. If you’ve ever wondered how you ended up there, it doesn’t mean you’re unintelligent or weak.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6" data-testid="coaching-approved-recovery">My own recovery is still unfolding. Writing music has helped me express feelings I couldn’t always explain, and find strength when I needed it. These journals grew out of that journey. They offer space for you to find your own words, reflect on what matters to you, and explore what you need next. You don’t need to have everything figured out to begin.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6" data-testid="coaching-approved-support">You can simply buy the journals and write privately, at your own pace. If you’d like more personal support, I also offer one-on-one coaching, drawing on my practical experience, education and lived experience. We start with your goals and work from there. I’m currently preparing additional tools and resources to support your growth.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6" data-testid="coaching-approved-purpose">I want to pay forward what’s helped me, and use the gifts God has given me to bless others. My hope is that through my music, these journals, and the support I offer, you’ll find something that helps you see possibility in your own journey. Sometimes that begins with one small step.</p>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-8" data-testid="coaching-approved-ending">Wherever you are in your journey, you’re welcome to start here. Explore the journals and choose one that speaks to you, or get in touch about one-on-one coaching so we can talk about what you’d like to work towards. You don’t need to have it all figured out. Let’s start with what matters to you.</p>
          <Actions onExplore={() => choose('journals')} onEnquire={() => choose('coaching')} />
        </div>
        <img src={PORTRAIT_URL} alt="Gannon Waye" className="w-full max-w-md mx-auto rounded-3xl object-cover object-top border border-primary/30" />
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
      <Button onClick={onExplore} className="gradient-gold-button border-0 rounded-full">Explore the Journals</Button>
      <Button onClick={onEnquire} variant="outline" className="rounded-full">Enquire about Coaching</Button>
    </div>);

}