import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This Is Me: The Prelude. Series launched 17 September 2026. Owner-supplied artwork.
export const THIS_IS_ME_POSTERS = [
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/402f7bee7_F2917245-9524-4AD7-ADB8-10D7A8A10E56.png', alt: 'This Is Me, The Prelude. I kept showing up. I needed recovery too.' },
  { url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d59ff4434_FEB48EC5-02F5-44D3-9B6B-3CE91EE19B20.png', alt: 'This Is Me, The Prelude. The songs are only part of the story.' },
];

export default function ThisIsMeFeature({ compact = false }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={compact ? '' : 'py-10 md:py-14 px-4 md:px-6'}
    >
      <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden border border-primary/30"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(8,8,14,0.9))' }}>
        <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center p-6 md:p-10">
          <img src={THIS_IS_ME_POSTERS[0].url} alt={THIS_IS_ME_POSTERS[0].alt}
            className="hidden md:block w-[170px] lg:w-[190px] aspect-[9/16] object-cover rounded-xl border border-primary/25"
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }} />
          <div className="text-center">
            <p className="font-body text-[10px] tracking-[0.35em] uppercase gradient-gold-glow mb-2">New series · The Prelude</p>
            <h2 className="font-body text-3xl md:text-5xl uppercase tracking-[0.18em] gradient-gold-text mb-3">This Is Me</h2>
            <p className="font-body text-sm md:text-base text-foreground/75 leading-relaxed max-w-xl mx-auto">
              The songs are only part of the story. This Is Me is the video series behind the music: the years of showing up, the recovery that was needed too, and everything that led to Set Free.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <a href="https://www.youtube.com/@gannonwaye" target="_blank" rel="noopener noreferrer">
                <Button className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase">
                  Follow the series on YouTube <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </a>
              <Link to="/this-is-my-life">
                <Button variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/10 font-body text-xs tracking-wider uppercase">
                  Read the story
                </Button>
              </Link>
            </div>
          </div>
          {/* Right poster on desktop; on mobile both posters sit together beneath the text */}
          <img src={THIS_IS_ME_POSTERS[1].url} alt={THIS_IS_ME_POSTERS[1].alt}
            className="hidden md:block w-[170px] lg:w-[190px] aspect-[9/16] object-cover rounded-xl border border-primary/25"
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }} />
          <div className="flex md:hidden gap-3 justify-center">
            {THIS_IS_ME_POSTERS.map((p) => (
              <img key={p.url} src={p.url} alt={p.alt}
                className="w-[140px] sm:w-[170px] aspect-[9/16] object-cover rounded-xl border border-primary/25"
                style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}