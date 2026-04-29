import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, ArrowRight, Music } from 'lucide-react';

// Corner ribbon decoration
function CornerRibbon() {
  return (
    <>
      <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden pointer-events-none z-20">
        <div
          className="absolute bg-primary text-primary-foreground font-body text-[8px] tracking-[0.15em] uppercase font-semibold text-center shadow-md"
          style={{ width: '130px', top: '20px', left: '-28px', transform: 'rotate(-45deg)', padding: '4px 0' }}
        >
          Coming Soon
        </div>
      </div>
      <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-none z-20">
        <div
          className="absolute bg-primary/70 text-primary-foreground font-body text-[8px] tracking-[0.15em] uppercase font-semibold text-center shadow-md"
          style={{ width: '130px', top: '20px', right: '-28px', transform: 'rotate(45deg)', padding: '4px 0' }}
        >
          New Single
        </div>
      </div>
    </>
  );
}
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';

const ARTWORK_REVEAL_DATE = '2026-05-10T00:00:00';
const RELEASE_DATE = '2026-05-10T02:00:00Z'; // 12 noon AEST = 02:00 UTC

export default function ThankYouSingle() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const artworkRevealed = now >= new Date(ARTWORK_REVEAL_DATE);
  const released = now >= new Date(RELEASE_DATE);

  return (
    <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">Debut Single</p>
          <h2 className="font-display text-5xl md:text-7xl text-foreground italic mb-1">Thank You</h2>
          <p className="font-body text-sm text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            The debut single from Gannon Waye. A powerful expression of gratitude born from tragic heartbreak—where the rose-colored glasses fell away and the hard truths became clear. A song about healing, growth, and the lessons learned through breaking open.
          </p>
          <p className="font-body text-sm gradient-gold-glow font-medium tracking-wider">Release date revealed May 10</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Artwork panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-2xl overflow-hidden border border-border/40 bg-secondary/60"
          >
            {!artworkRevealed && <CornerRibbon />}
            {artworkRevealed ? (
              /* Once artwork is revealed, show the actual artwork image */
              <div className="w-full h-full flex items-center justify-center bg-secondary/80">
                <p className="font-body text-xs tracking-widest uppercase gradient-gold-glow">Artwork Revealed</p>
              </div>
            ) : (
              /* Hidden — gift wrapped until May 10 */
              <div className="relative w-full h-full">
                <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/bd4d2cad9_generated_image.png" alt="Gift wrapped — revealed May 10" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 p-6">
                  <Gift className="w-8 h-8 text-primary" />
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase gradient-gold-glow">Revealed May 10</p>
                  <CountdownTimer targetDate={ARTWORK_REVEAL_DATE} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-3">Artwork & Release Date Reveal</p>
              <div className="mb-6">
                <CountdownTimer targetDate={ARTWORK_REVEAL_DATE} />
              </div>
              <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-2">About the single</p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm">
                "Thank You" is a deeply personal anthem born from tragic heartbreak and devastating loss. Written from lived experience, it chronicles the journey from shattering truth to unexpected gratitude—what happens when the rose-colored glasses fall away and you finally see clearly.
              </p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm mt-3">
                At its core, this song is about resilience. Finding strength in the wreckage. Learning that some of life's greatest gifts come wrapped in heartbreak.
              </p>
            </div>

            {/* Release countdown or release date */}
            <div className="border-t border-border/30 pt-6">
              {released ? (
                <div className="space-y-4">
                  <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow">Out Now</p>
                  <Link to="/music">
                    <Button className="rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7 gradient-gold-button border-0">
                      Listen Now <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : artworkRevealed ? (
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-2">
                      Release countdown
                    </p>
                    <CountdownTimer targetDate={RELEASE_DATE} />
                </div>
              ) : (
               <div className="space-y-4">
                 <a href="https://open.spotify.com/search/Gannon%20Waye%20Thank%20You" target="_blank" rel="noopener noreferrer">
                   <Button className="w-full rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7 gradient-gold-button border-0 hover:shadow-lg">
                     <Music className="w-4 h-4" /> Listen on Spotify
                   </Button>
                 </a>
                 <div className="flex items-center gap-3 pt-2">
                   <Heart className="w-4 h-4 text-primary/60 flex-shrink-0" />
                   <p className="font-body text-sm gradient-gold-glow italic">
                     Artwork & release date reveal on May 10th — out same day.
                   </p>
                 </div>
               </div>
              )}
            </div>

            {/* Pre-save / notify */}
            {!released && (
              <div className="border-t border-border/30 pt-6">
                <p className="font-body text-xs gradient-gold-glow mb-3">Be the first to know when it drops</p>
                <Link to="/community">
                   <Button className="rounded-full gap-2 font-body text-xs tracking-wider uppercase gradient-gold-button border-0 hover:shadow-lg">
                     Join the Community <ArrowRight className="w-3 h-3" />
                   </Button>
                 </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}