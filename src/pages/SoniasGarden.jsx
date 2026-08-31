import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flower2, ArrowRight, Heart } from 'lucide-react';
import MemoryFrame from '@/components/mums-garden/MemoryFrame';

const NAVY = 'hsl(156 35% 4%)';
const CREAM = 'hsl(47 100% 93%)';
const GOLD = 'hsl(46 63% 52%)';

// A peaceful, dedicated garden page for Sonia — the person the brand is named for.
// Photos are held in our 3D gold frames. Where an approved photo is not yet supplied,
// the frame shows a quiet placeholder rather than a stock or AI face (dignity gate).
export default function SoniasGarden() {
  return (
    <div className="relative w-full" style={{ background: NAVY, color: CREAM }}>
      {/* soft golden light wash — fixed, low opacity */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(65% 45% at 50% 0%, hsl(46 63% 52% / 0.12), transparent 70%)',
        }}
      />

      {/* ── Intro — peaceful, no large image at the top ── */}
      <section className="relative px-5 pt-28 pb-16 md:pt-36 md:pb-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-[10px] tracking-[0.4em] uppercase mb-6"
          style={{ color: GOLD }}
        >
          Sonia's Garden
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-5xl md:text-7xl leading-[1.05] mb-6"
          style={{ color: CREAM }}
        >
          A garden for Sonia
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="font-body text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          style={{ color: 'hsl(47 100% 93% / 0.7)' }}
        >
          The person the brand is named for. This is a quiet place to sit with who she
          was — and to carry a little of her forward.
        </motion.p>
        <div
          aria-hidden
          className="mx-auto mt-10 h-px w-36"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(46 63% 52% / 0.5), transparent)' }}
        />
      </section>

      {/* ── Story pair 1 — who she was ── */}
      <section className="relative max-w-5xl mx-auto px-5 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <MemoryFrame caption="Sonia · 1961 – 2022" placeholder="Awaiting approved photograph of Sonia" />
          <StoryBlock
            kicker="Who she was"
            icon={<Heart className="w-4 h-4" />}
          >
            A mother. A gardener. Someone who noticed people. She kept a real Australian
            garden — gum trees, native shrubs, a bench to sit on — and she kept people the
            same way: quietly, regularly, without fuss. This page exists because of the
            way she moved through the world.
          </StoryBlock>
        </div>
      </section>

      {/* ── Story pair 2 — the habit that became the brand ── */}
      <section className="relative max-w-5xl mx-auto px-5 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="md:order-2">
            <MemoryFrame caption="Thanking You Kindly" placeholder="Awaiting approved photograph" />
          </div>
          <div className="md:order-1">
            <StoryBlock
              kicker="Why the brand is named for her"
              icon={<Flower2 className="w-4 h-4" />}
            >
              She never let a kindness pass without a thank you — the bus driver, the
              nurse, the friend who checked in. Plain, warm, and often. When she was gone,
              the only honest way to keep that habit alive was to build something that
              carries it. We called it <em style={{ color: GOLD }}>Thanking You Kindly</em>.
              Every product is one of her thank-yous, sent forward.
            </StoryBlock>
          </div>
        </div>
      </section>

      {/* ── Large atmospheric panel — brought DOWN the page ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: '52vh', height: 'auto' }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 30%, hsl(150 33% 12% / 0.4), transparent 60%), linear-gradient(180deg, hsl(156 35% 4%), hsl(150 33% 9%) 50%, hsl(156 35% 4%))',
          }}
        />
        {/* golden light shafts */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 0%, transparent 0deg, hsl(46 63% 52% / 0.10) 30deg, transparent 60deg, hsl(46 63% 52% / 0.08) 90deg, transparent 120deg)',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 py-24 md:py-32 text-center">
          <p
            className="font-display italic text-2xl md:text-4xl leading-relaxed"
            style={{ color: CREAM, textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
          >
            “She taught us that a thank you, said plainly and often, is how love stays
            in the room after you've gone.”
          </p>
          <p
            className="font-body text-[10px] tracking-[0.35em] uppercase mt-8"
            style={{ color: 'hsl(46 63% 52% / 0.8)' }}
          >
            The heart of the brand
          </p>
        </div>
      </section>

      {/* ── Story pair 3 — her garden ── */}
      <section className="relative max-w-5xl mx-auto px-5 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <MemoryFrame caption="Her garden" placeholder="Awaiting approved photograph" />
          <StoryBlock
            kicker="Her garden, kept"
            icon={<Flower2 className="w-4 h-4" />}
          >
            She kept things alive — plants, friendships, the small rituals that hold a
            family together. We honour that by choosing warmth over noise, generosity over
            spectacle, and real things for real people. Nothing here is traded on her
            story. It's carried forward, the way she'd have done it: quietly, and with care.
          </StoryBlock>
        </div>
      </section>

      {/* ── Carry her forward ── */}
      <section className="relative max-w-3xl mx-auto px-5 pb-28 text-center">
        <p className="font-body text-[10px] tracking-[0.35em] uppercase mb-5" style={{ color: GOLD }}>
          Carry her forward
        </p>
        <h2 className="font-display text-3xl md:text-5xl mb-6" style={{ color: CREAM }}>
          The best way to honour her is to keep thanking people.
        </h2>
        <p className="font-body text-sm leading-relaxed max-w-xl mx-auto mb-10" style={{ color: 'hsl(47 100% 93% / 0.65)' }}>
          Visit the brand story, sit with the full memorial, or carry the message into
          something someone else can hold.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <GardenCta to="/about" label="The Brand Story" />
          <GardenCta to="/mums-garden" label="Mum's Garden" />
          <GardenCta to="/carry-the-message" label="Carry the Message" />
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
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="font-body text-[10px] tracking-[0.32em] uppercase" style={{ color: 'hsl(46 63% 52% / 0.85)' }}>
          {kicker}
        </p>
      </div>
      <p className="font-body text-base md:text-lg leading-relaxed" style={{ color: 'hsl(47 100% 93% / 0.82)' }}>
        {children}
      </p>
    </motion.div>
  );
}

function GardenCta({ to, label }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-[hsl(46_63%_52%/0.25)] bg-white/[0.02] p-5 transition-all duration-300 hover:border-[hsl(46_63%_52%/0.55)] hover:bg-white/[0.05]"
    >
      <span className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase" style={{ color: CREAM }}>
        {label}
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" style={{ color: GOLD }} />
      </span>
    </Link>
  );
}