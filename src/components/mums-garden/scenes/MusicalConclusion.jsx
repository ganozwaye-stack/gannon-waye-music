import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Headphones } from 'lucide-react';
import GardenScene from './GardenScene';
import { APPLE_MUSIC_ARTIST_URL } from '@/config/artistLinks';

const FINALE_BG = 'radial-gradient(ellipse 130% 100% at 50% 30%, hsl(46 30% 14%) 0%, hsl(156 40% 5%) 55%, hsl(156 48% 3%) 100%)';

/**
 * Scene 8 — Musical Conclusion
 * Respectful connection to "Without You Here". No hard sell.
 */
export default function MusicalConclusion() {
  return (
    <GardenScene id="conclusion" background={FINALE_BG} minHeight="100vh">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 20%, hsl(46 63% 72% / 0.12), transparent 50%)' }}
      />

      <div className="relative z-10 px-6 text-center max-w-xl py-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8 }}
          className="font-body text-[11px] uppercase tracking-[0.45em] text-[hsl(var(--garden-cream))]/35 mb-6"
        >
          The garden becomes a song
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.2 }}
          className="font-cormorant text-4xl md:text-6xl text-[hsl(var(--garden-cream))]/90"
        >
          Without You Here
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.4 }}
          className="mt-6 font-cormorant italic text-lg text-[hsl(var(--garden-cream))]/55"
        >
          If you would like to hear it, the choice is yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/music"
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 gradient-gold-button"
          >
            <Headphones className="w-4 h-4" />
            <span className="font-body text-xs uppercase tracking-[0.35em]">Listen on the Music page</span>
          </Link>
          <a
            href={APPLE_MUSIC_ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--garden-gold))]/40 px-7 py-3.5 text-[hsl(var(--garden-cream))] hover:border-[hsl(var(--garden-gold))] transition-colors"
          >
            <span className="font-body text-xs uppercase tracking-[0.35em]">Apple Music</span>
            <ExternalLink className="w-3.5 h-3.5 text-[hsl(var(--garden-gold))]" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 1 }}
          className="mt-16 font-cormorant italic text-xl text-[hsl(var(--garden-cream))]/50"
        >
          &ldquo;She is the garden now.&rdquo;
        </motion.p>
        <p className="mt-8 font-body text-[10px] uppercase tracking-[0.4em] text-[hsl(var(--garden-cream))]/30">
          Forever in our hearts
        </p>
      </div>
    </GardenScene>
  );
}