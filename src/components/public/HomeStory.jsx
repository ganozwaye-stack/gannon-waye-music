import SocialLinks from '@/components/public/SocialLinks';

export default function HomeStory({ settings }) {
  return (
    <section className="home-story home-section" aria-labelledby="home-story-heading">
      <header className="home-section-heading text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">About</p>
        <h2 id="home-story-heading" className="font-body text-3xl md:text-5xl gradient-gold-text">The Story</h2>
      </header>
      <div className="home-story-newspaper">
        <div className="home-story-column home-story-left">
          <span className="home-story-exclusion" aria-hidden="true" />
          <p>I was born and raised in Adelaide and now call Melbourne home. We did not have the money for formal music lessons, no matter how often I asked, cried or begged, but that never weakened the drive. I learned by taking every chance available: leading school choirs, singing in church and eventually serving as a worship minister.</p>
          <p>I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.</p>
          <p className="italic">I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.</p>
        </div>
        <blockquote className="home-story-quote font-display gradient-gold-glow">
          <p>I didn't truly love myself</p>
          <p>until I was 33.</p>
          <p>Before that, I woke up</p>
          <p>every day wishing</p>
          <p>I could be someone else.</p>
          <p>That fear of abandonment</p>
          <p>ran my life.</p>
          <p>Then something shifted</p>
          <p>and for the first time,</p>
          <p>I didn't want to be</p>
          <p>anyone else.</p>
          <cite className="mt-3 block text-primary/60 not-italic tracking-widest uppercase text-[10px]">Gannon Waye</cite>
        </blockquote>
        <div className="home-story-column home-story-right">
          <span className="home-story-exclusion" aria-hidden="true" />
          <p>My journey has not been simple. Childhood was shaped by family violence, an abusive father and a mother who struggled to regulate overwhelming emotion. In adulthood I survived abusive relationships, coercive control, addiction, PTSD and the loss of Mum. Each time life knocked me down, music gave me a way to stand again.</p>
          <p>The stages kept coming: I twice reached the grand final of Adelaide's Search for a Star, reached the Top 100 of Australian Idol, performed as a drag artist and opened Feast Festival in 2012. But the purpose is not trophies or fame. It is finding the voice I was denied and using it to reach someone else.</p>
          <p>I'm Still Here brings that purpose together. It is for the person searching for a song that can say what they cannot yet say, and for anyone who needs proof that being knocked down is not the end of the story.</p>
        </div>
      </div>
      <SocialLinks settings={settings} className="justify-center mt-6" />
    </section>
  );
}
