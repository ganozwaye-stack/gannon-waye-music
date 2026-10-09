import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import JournalShelf from '@/components/coaching/JournalShelf';
import CoachingGiftSet from '@/components/coaching/CoachingGiftSet';

// Reuse the portrait already approved and displayed in the site's public navigation.
// Never include journal interiors, PDF URLs or unverified sample questions here.
const PORTRAIT_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/637f52efd_image.png';

export default function Coaching() {
  return (
    <div className="min-h-screen pb-20" data-testid="coaching-page">
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-primary mb-4">Coaching with Gannon Waye</p>
          <h1 className="font-display text-4xl md:text-6xl mb-6">Start with what matters to you.</h1>
          <p className="font-body text-lg text-foreground/80 leading-relaxed mb-8">A place to find words, explore what you are facing and take a step towards the confidence and clarity you want to build.</p>
          <Actions />
        </div>
        <img src={PORTRAIT_URL} alt="Gannon Waye" className="w-full max-w-md mx-auto rounded-3xl object-cover object-top border border-primary/30" />
      </section>

      <article className="max-w-3xl mx-auto px-5 space-y-7 font-body text-base md:text-lg leading-relaxed text-foreground/80">
        <h2 className="font-display text-3xl text-foreground">Why this work matters to me</h2>
        <p>I have always been drawn to helping people find clarity, understand the challenges in front of them and develop confidence in themselves. I care about the moment someone begins to see a possibility they could not see before, and about supporting them as they work towards it.</p>
        <p>That was one of the parts I loved most about personal training. My clients achieved goals they had set themselves, and sometimes did things they had not thought possible. The work was physical, but so much of what I was supporting was confidence, belief and wellbeing.</p>
        <p>I think of that experience as “40% muscle and 60% mental”. That is my personal reflection on the work, rather than a scientific statistic. It describes how much it mattered to help someone trust themselves, recognise their progress and keep going when things felt difficult.</p>
        <p>Over the past seven years, I have invested in education and personal development, including psychology. I wanted to understand more about people, the challenges we face and the ways we can support ourselves and each other.</p>
        <p>Even with that knowledge, I found myself in an abusive relationship. Knowing about something does not make you immune to it. Being abused does not mean you are unintelligent or weak. I want to say that plainly, because shame can make it harder to find words for what has happened.</p>
        <p>My own recovery is ongoing. I am not sharing this from a place where everything is finished or fixed. Music and writing helped me find words when I struggled to explain what I was carrying. They helped me find strength, and gave me somewhere to begin.</p>
        <p>The journals grew out of that writing and reflection. They share concepts and leave space for you to reflect, notice what matters to you and find your own words. You can take your time with them and make that space your own.</p>
        <p>My one-on-one coaching builds on my personal training experience, education and lived experience. It is a chance for us to talk about the challenges you are facing, what you would like to work towards and the confidence you want to develop. We begin with you and what matters in your life.</p>
        <p>I want to pay forward the gifts I’ve been given. To bless more people with this gift that I have. For me, that means making something useful available to others, whether it’s a journal that helps you find a clearer question or a conversation where we work on skills and goals that matter to you. You can bring your own beliefs, experiences and way of seeing the world.</p>
        <p className="text-sm text-muted-foreground">I am not a psychologist or registered clinician. Coaching is personal support and reflection, and does not replace mental health care.</p>
      </article>

      <section id="journals" aria-labelledby="journals-title" className="max-w-6xl mx-auto px-5 py-16 scroll-mt-24">
        <div className="rounded-3xl bg-card/60 border border-primary/25 p-7 md:p-10">
          <h2 id="journals-title" className="font-display text-3xl mb-4">Explore the Journals</h2>
          <p className="font-body text-base text-foreground/80 leading-relaxed mb-4">The six journals are A$9.90 each, or A$49 for the six-book bundle. You do not need a coaching call, registration for coaching or approval from me to purchase or read a journal. One-on-one coaching is optional and separate.</p>
          <JournalShelf />
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-5">Writing together is still in development and is not included in the six-book bundle.</p>
        </div>
      </section>

      <CoachingGiftSet />

      <section id="one-on-one" aria-labelledby="coaching-enquiry-title" className="max-w-3xl mx-auto px-5 pb-16">
        <h2 id="coaching-enquiry-title" className="font-display text-3xl mb-4">One-on-one coaching</h2>
        <p className="font-body text-base text-foreground/80 leading-relaxed mb-4">If you would like to work together, get in touch about what you would like to work towards. Sessions are A$99 for 45 minutes. The initial consultation is a paid, two-way conversation to understand your enquiry, your goals and whether we are the right fit. You can ask me questions too. Online appointment booking is being prepared; availability will be confirmed before you are asked to pay.</p>
        <p className="font-body text-base text-foreground/80 leading-relaxed mb-6">There is no obligation after the consultation. If we both choose to continue, you pay for session two and session three is complimentary. The consultation counts as the first paid session. This is a one-time introductory offer; normal full pricing applies from session four onwards. The first three appointments total A$198. A ten-session package is A$850 for ten total 45-minute appointments, including the introductory third-session benefit; it does not add an eleventh appointment.</p>
        <p className="font-body text-base text-foreground/80 leading-relaxed mb-6">If you would like support that includes clearly scoped work between sessions, we can discuss a tailored package and agree the scope and fee upfront.</p>
        <Link to="/contact"><Button variant="outline" className="rounded-full">Enquire about Coaching</Button></Link>
      </section>

      <section className="max-w-3xl mx-auto px-5 text-center">
        <p className="font-body text-lg leading-relaxed text-foreground/80 mb-8">Wherever you are in your journey, you’re welcome to start here. Explore the journals and choose one that speaks to you, or get in touch about one-on-one coaching so we can talk about what you’d like to work towards. You don’t need to have it all figured out. Let’s start with what matters to you.</p>
        <Actions />
      </section>
    </div>
  );
}

function Actions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a href="#journals"><Button className="gradient-gold-button border-0 rounded-full">Explore the Journals</Button></a>
      <Link to="/contact"><Button variant="outline" className="rounded-full">Enquire about Coaching</Button></Link>
    </div>
  );
}
