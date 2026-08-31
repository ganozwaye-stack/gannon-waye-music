import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Sparkles, Flower2 } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-20 md:pt-36 md:pb-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, rgba(212,175,55,0.10), transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-body text-xs tracking-[0.34em] uppercase gradient-gold-glow mb-6"
          >
            About the Brand
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-5xl md:text-7xl text-foreground leading-[1.05] mb-5"
          >
            Thanking You Kindly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="font-body text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            <span className="gradient-gold-glow font-medium">Carry the Message.</span>{' '}
            A care-led gifting brand built to keep one person's kindness moving forward.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-10 h-px w-40 origin-center"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)',
            }}
          />
        </div>
      </section>

      {/* Story */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto space-y-12">
          <StoryBlock
            kicker="Why this exists"
            icon={<Heart className="w-4 h-4" />}
          >
            Thanking You Kindly began with a simple habit: a mother who never let a
            kindness pass without acknowledgement. She thanked people plainly, warmly,
            and often — the bus driver, the nurse, the friend who checked in. When she
            was gone, the only honest way to keep that habit alive was to build
            something that carries it forward. This is that something.
          </StoryBlock>

          <StoryBlock
            kicker="What we make"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Care-led products and gifts. A mug someone reaches for each morning. A
            hoodie that says what needed saying. A card that arrives on the right day.
            Each one is designed to do a single job — help you thank someone, honestly,
            without the awkwardness.
          </StoryBlock>

          <StoryBlock
            kicker="How we honour her"
            icon={<Flower2 className="w-4 h-4" />}
          >
            We don't trade on her story. We don't sell grief. We choose warmth over
            noise, generosity over spectacle, and real things for real people over
            sentiment for its own sake. The most honouring thing we can do is make
            kindness a little easier — and then pass it on.
          </StoryBlock>

          <StoryBlock kicker="Carry the Message" icon={<ArrowRight className="w-4 h-4" />}>
            Every product carries the message. Every order sends it a little further.
            That's the whole point. If one person feels seen because of something made
            here, the brand has done its job.
          </StoryBlock>
        </div>
      </section>

      {/* CTA cards */}
      <section className="px-4 pb-28">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-4">
          <CtaCard
            to="/mums-garden"
            title="Visit Mum's Garden"
            body="A quiet place to sit with her memory."
          />
          <CtaCard
            to="/carry-the-message"
            title="Carry the Message"
            body="What the brand is really for."
          />
          <CtaCard
            to="/store"
            title="Shop the Collection"
            body="Gifts that do the thanking for you."
          />
        </div>
      </section>
    </div>
  );
}

function StoryBlock({ kicker, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">{icon}</span>
        <p className="font-body text-[11px] tracking-[0.28em] uppercase text-primary/80">
          {kicker}
        </p>
      </div>
      <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed">
        {children}
      </p>
    </motion.div>
  );
}

function CtaCard({ to, title, body }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border/40 bg-card/40 p-5 transition-all duration-300 hover:border-primary/40 hover:bg-card/60"
    >
      <p className="font-display text-lg text-foreground mb-1.5">{title}</p>
      <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">{body}</p>
      <span className="inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.18em] uppercase text-primary">
        Enter
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}