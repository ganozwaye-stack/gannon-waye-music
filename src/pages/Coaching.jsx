import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OriginalJournalFan from '@/components/coaching/OriginalJournalFan';
import JournalShelf from '@/components/coaching/JournalShelf';
import CoachingGiftSet from '@/components/coaching/CoachingGiftSet';
import CoachingIntakeForm from '@/components/coaching/CoachingIntakeForm';

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
      <section className="relative isolate overflow-hidden py-10 md:py-14" data-testid="coaching-editorial-intro">
        {/* Thankyou ReleaseDetail uses an atmospheric portrait, directional mask
            and dark vignette. Keep this selected photo static and naturally framed. */}
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <img src={PORTRAIT_URL} alt="" data-testid="coaching-hero-wallpaper" className="absolute right-0 top-0 w-[55%] h-[42rem] md:h-full object-cover object-top" />
          <div data-testid="coaching-hero-overlay" className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(8,8,14,0.9) 0%, rgba(8,8,14,0.78) 45%, rgba(8,8,14,0.62) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,14,0.12) 0%, rgba(8,8,14,0.38) 28rem, hsl(var(--background)) 42rem)' }} />
        </div>
        <div className="max-w-6xl mx-auto px-5">
        <header className="flex flex-col items-center text-center mb-8" data-testid="coaching-hero-title">
          <div className="max-w-4xl w-full mx-auto">
            <div className="w-16 h-1 gradient-gold-button mx-auto mb-5" aria-hidden="true" data-testid="coaching-top-rule" />
            {/* Reuse the exact gradient shared by Navbar's Gannon Waye brand and FanChatWidget. */}
            <h1 className="font-body font-medium text-4xl md:text-5xl gradient-gold-text leading-tight tracking-tight text-center">
              <span className="block">START WITH WHAT MATTERS TO YOU</span>
              <span className="block font-normal text-xl md:text-2xl text-foreground mt-3 tracking-normal">Coaching with Gannon Waye</span>
            </h1>
            <div className="w-16 h-1 gradient-gold-button mx-auto mt-5 mb-5" aria-hidden="true" data-testid="coaching-bottom-rule" />
            <Actions onExplore={() => choose('journals')} onEnquire={() => choose('coaching')} />
          </div>
        </header>
        <OriginalJournalFan />
        {/* Preserve the approved story and editorial columns. */}
        <div className="md:columns-2 md:gap-8 md:[column-rule:1px_solid_hsl(var(--primary)/0.2)]">
          <p className="font-body text-lg text-foreground leading-relaxed mb-5 break-inside-avoid text-left border-l-2 border-[#F5D06E] pl-4" data-testid="coaching-approved-intro">If there’s one thing my life has shown me, it’s my sheer determination and drive to succeed.</p>
          <p className="font-body text-lg text-foreground/95 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-training">I know what it’s like to need support, and I know what it’s like to not find it. And I still had to survive. At 28, I used drugs for the first time. I rang Mum straight away and asked for help. Over the next two years, I went to rehab twice before finding recovery. I returned to church, attended Narcotics Anonymous and took on roles helping others. My healing isn’t complete, but I’m determined to keep going.</p>
          <p className="font-body text-lg text-foreground/95 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-story">It wasn’t until I became a personal trainer that I realised how much the work went beyond fitness. Exercise could offer clarity and a sense of healing, but often our conversations reached beyond the gym. I found myself encouraging clients, lifting them up and helping them build confidence to take on challenges in their everyday lives. It was motivation for life, and supporting that growth brought me so much joy.</p>
          <p className="font-body text-lg text-foreground/95 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-recovery">I studied mental health at TAFE, completed my Diploma of Counselling in 2020 and began university in 2021. I now hold a Bachelor of Psychological Studies. Along the way, I earned high distinctions and was invited to join Golden Key. Seven years of education and personal development, including further learning in mental health, have deepened what I bring to supporting others.</p>
          <figure className="flex items-center gap-3 mb-5 break-inside-avoid border border-[#F5D06E]/25 bg-background/50 rounded-xl p-3" data-testid="coaching-golden-key-membership">
            <img src="/images/golden-key/GKlogo.png" alt="Golden Key International Honour Society logo" className="w-12 h-12 shrink-0" width="48" height="48" />
            <figcaption className="font-body text-sm text-foreground/80 max-w-xs">Lifetime Member, Golden Key International Honour Society</figcaption>
          </figure>
          <p className="font-body text-lg text-foreground/95 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-support">My coaching brings together that education and lived experience. Through life coaching and mindset mentorship, I listen, help you recognise your strengths and work with you on practical steps towards what matters to you. Honesty, integrity and transparency guide how I work. Shame has no place in healing.</p>
          <p className="font-body text-lg text-foreground/95 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-purpose">I find purpose and joy in helping others move towards their future. I share my journey because I want it to benefit others, beyond my own life. I believe God can use it for something greater than myself.</p>
          <p className="font-body text-lg text-foreground/95 leading-relaxed mb-4 break-inside-avoid text-left" data-testid="coaching-approved-ending">If you’re looking for support, explore my journals or learn more about coaching.</p>
        </div>
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
        <div className="border-t border-[#F5D06E]/30 pt-6"><h3 className="font-body text-2xl font-bold text-[#F5D06E] mb-4">Register your interest</h3><CoachingIntakeForm /></div>
      </section>}
      </div>}
    </div>);

}

function Actions({ onExplore, onEnquire }) {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3">
      <Button onClick={onExplore} className="gradient-gold-button text-primary-foreground border-0 rounded-full min-h-12 px-7 font-semibold shadow-lg shadow-black/20">Explore the Journals</Button>
      <Button onClick={onEnquire} variant="outline" className="rounded-full min-h-12 px-7 font-semibold border-primary/70 text-primary bg-background/60 hover:bg-primary/10 hover:text-primary">Enquire about Coaching</Button>
    </div>);

}