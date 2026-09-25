import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroWelcomeBanner from '@/components/public/HeroWelcomeBanner';
import SetFreeFeatureColumn from '@/components/public/SetFreeFeatureColumn';

// Beneath the Set Free hero: a living welcome message beside the Set Free
// feature column, then the previous release. Left aligned, never centred.
// The welcome card greets the visitor by time of day, breathes with a slow
// gold glow sweep and reveals its story line by line.
export default function HomeWelcomeSection({ previousRelease, previousLink, settings }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <section className="px-4 md:px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-start text-left"
      >
        <div className="relative rounded-2xl border border-primary/30 bg-card/50 px-6 py-6 md:px-8 md:py-8 overflow-hidden">
          {/* slow gold atmosphere sweeping across the card */}
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(115deg, rgba(212,175,55,0.16) 0%, transparent 45%, transparent 60%, rgba(212,175,55,0.12) 100%)' }}
            animate={{ opacity: [0.45, 1, 0.45], x: ['-2%', '2%', '-2%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-3">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <p className="font-body text-xs tracking-[0.25em] uppercase text-primary/80">{greeting}, and welcome</p>
            </div>

            <motion.h2
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-3xl md:text-4xl gradient-gold-text mb-1"
            >
              I'm Gannon Waye
            </motion.h2>
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5">Singer · Songwriter · Melbourne</p>

            <div className="space-y-4 font-body text-sm md:text-[15px] text-foreground/85 leading-relaxed">
              {[
                <>I'm an Adelaide-born singer-songwriter now based in Melbourne. I grew up without access to formal music lessons, so I found my voice through school choirs, church, worship ministry, drag performance and every stage that would have me.</>,
                <>After family violence, abusive relationships, addiction, PTSD and losing Mum, I returned to music with a purpose. <em className="text-foreground/95">I'm Still Here</em> is not a search for fame. It is for anyone who needs a song to say what they cannot yet say.</>,
                <>This is independent, heart-first art. You are not alone here.</>,
              ].map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.18 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 flex flex-wrap gap-2.5"
            >
              <Link
                to="/music"
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 font-body text-[10px] tracking-wider uppercase gradient-gold-button border-0"
              >
                Hear the Music <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                to="/biography"
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 font-body text-[10px] tracking-wider uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
              >
                My Story
              </Link>
            </motion.div>
          </div>
        </div>

        <SetFreeFeatureColumn settings={settings} />

        <div className="md:col-span-2 max-w-xl">
          <p className="font-body text-[10px] tracking-[0.35em] uppercase gradient-gold-glow mb-3 text-left">Previous Release</p>
          <HeroWelcomeBanner release={previousRelease} releaseLink={previousLink} badgeLabel="Previous release" />
          {previousRelease?.title === 'Without You Here' && (
            <div className="-mt-3 text-left">
              <Link to="/remember-mum" className="inline-flex items-center gap-1 font-body text-xs tracking-wider uppercase gradient-gold-text hover:opacity-80 transition-opacity">
                Read Mum's story <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}