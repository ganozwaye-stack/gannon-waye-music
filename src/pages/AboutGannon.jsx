import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GannonSignature from '@/components/global/GannonSignature';
import ShareButtons from '@/components/public/ShareButtons';

const STORY_PARAGRAPHS = [
  "I was born and raised in Adelaide and now call Melbourne home.",
  "We lived in low socioeconomic conditions and formal music lessons were never possible. I asked, cried and begged, but they did not come. I sang anyway, leading school choirs, singing in church and eventually serving as a worship minister.",
  "Home was shaped by an abusive father, family violence and a mother who struggled to regulate overwhelming emotions. Music became the place I could escape to and the language I used for things I could not safely say.",
  "I later performed as a drag artist, opened Feast Festival in 2012, twice reached the grand final of Adelaide's Search for a Star and reached the Top 100 of Australian Idol. Every stage was something I fought to find.",
  "As an adult I survived abusive relationships, coercive control, addiction and PTSD. Losing Mum, my best friend and greatest believer, knocked me down again.",
  "I'm Still Here is what happened next. It is not a search for fame as the purpose. It is music for the person who needs a voice or a song for what they cannot yet say.",
];

export default function AboutGannon() {
  return (
    <div className="min-h-screen">

      {/* Cinematic hero — full-bleed split */}
      <section className="relative w-full min-h-[60vh] md:min-h-[75vh] flex items-center overflow-hidden">
        {/* Image side */}
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/74a4ae1c3_0.jpg"
            alt="Gannon Waye"
            className="w-full h-full object-cover object-[center_20%]"
          />
          {/* Dark gradient left-to-right so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
          {/* Subtle gold overlay */}
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
        </div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-xl px-8 md:px-16 py-20"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">The Story Behind the Music</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6 leading-tight">About</h1>
          <p className="font-body text-base md:text-lg text-foreground/70 leading-relaxed max-w-md">
            I was born in Adelaide and now call Melbourne home. Everything I create comes from struggle, determination and the decision to keep standing after the moments that nearly broke me.
          </p>
        </motion.div>
      </section>

      {/* Story body */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">

        <div className="space-y-6">
          {STORY_PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="font-body text-foreground/75 leading-relaxed text-base md:text-lg"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Loss paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <p className="font-body text-foreground/75 leading-relaxed text-base md:text-lg">
            Losing Mum, Sonia, only twenty days after her diagnosis changed the centre of my world. She was my best friend and biggest believer. The grief did not arrive alone. It landed after childhood family violence, abusive adult relationships, addiction and PTSD. I have been knocked down more than once, but I am still here, building music and coaching work around one purpose: helping someone else believe their story can continue too.
          </p>
        </motion.div>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 border-l-2 border-primary pl-6 py-2"
        >
          <p className="font-display text-xl md:text-2xl gradient-gold-glow italic leading-relaxed">
            "For them, it was about appearance. For me, I was breaking inside."
          </p>
          <p className="font-body text-xs text-muted-foreground mt-3 tracking-widest uppercase">Gannon Waye</p>
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-end mt-6 pr-4 md:pr-12"
        >
          <GannonSignature />
        </motion.div>

        {/* Share */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <ShareButtons url="https://gannonwaye.com/about" text="Gannon Waye — a story worth knowing." />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/music">
            <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0 w-full sm:w-auto">
              Hear the Music <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20 hover:bg-foreground/5 w-full sm:w-auto">
              <Users className="w-4 h-4 mr-2" /> Community
            </Button>
          </Link>
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto">
              <Heart className="w-4 h-4 mr-2" /> Support the Project 🤍
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}