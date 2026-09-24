import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroWelcomeBanner from '@/components/public/HeroWelcomeBanner';

// The welcome write-up and previous release, moved beneath the Set Free hero
// on release day. Copy unchanged.
export default function HomeWelcomeSection({ previousRelease, previousLink }) {
  return (
    <section className="px-4 md:px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start"
      >
        <div className="rounded-2xl border border-border/30 px-6 py-5 bg-card/40">
          <p className="font-body uppercase gradient-gold-text text-base tracking-[0.45em] my-2">Welcome</p>
          <p className="font-body text-sm md:text-[15px] text-foreground/85 leading-relaxed">
            I'm an Adelaide-born singer-songwriter now based in Melbourne. I grew up without access to formal music lessons, so I found my voice through school choirs, church, worship ministry, drag performance and every stage that would have me. After family violence, abusive relationships, addiction, PTSD and losing Mum, I returned to music with a purpose. I'm Still Here is not a search for fame. It is for anyone who needs a song to say what they cannot yet say. This is independent, heart-first art. You are not alone here.
          </p>
        </div>
        <div>
          <p className="font-body text-[10px] tracking-[0.35em] uppercase gradient-gold-glow mb-3 text-center md:text-left">Previous Release</p>
          <HeroWelcomeBanner release={previousRelease} releaseLink={previousLink} badgeLabel="Previous release" />
          {previousRelease?.title === 'Without You Here' && (
            <div className="-mt-3 text-center md:text-left">
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