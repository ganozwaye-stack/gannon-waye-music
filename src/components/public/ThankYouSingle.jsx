import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';

const ARTWORK_REVEAL_DATE = '2026-05-10T00:00:00';
const RELEASE_DATE = '2026-06-10T00:00:00';

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
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">New Single</p>
          <h2 className="font-display text-4xl md:text-6xl text-foreground italic">Thank You</h2>
          <p className="font-body text-sm text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            A song born from the hardest and most transformative moments of a life lived honestly.
          </p>
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
            {artworkRevealed ? (
              /* Once artwork is revealed, show the actual artwork image */
              <div className="w-full h-full flex items-center justify-center bg-secondary/80">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Artwork Revealed</p>
              </div>
            ) : (
              /* Hidden — not yet revealed */
              <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary/60" />
                </div>
                <div className="text-center">
                  <p className="font-display text-lg text-foreground italic mb-1">Artwork Incoming</p>
                  <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-6">Revealed in</p>
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
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">About the song</p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm">
                "Thank You" is a deeply personal release — a reflection on growth, gratitude, and the quiet strength
                it takes to keep moving forward. Written from lived experience, it explores the complexity of being
                thankful not just for the beautiful moments, but for the ones that broke you open and rebuilt you.
              </p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm mt-3">
                At its core, this song is about transformation. Turning pain into purpose. Experience into connection.
              </p>
            </div>

            {/* Release countdown or release date */}
            <div className="border-t border-border/30 pt-6">
              {released ? (
                <div className="space-y-4">
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-primary">Out Now</p>
                  <Link to="/music">
                    <Button className="rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7">
                      Listen Now <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : artworkRevealed ? (
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    Drops in
                  </p>
                  <CountdownTimer targetDate={RELEASE_DATE} />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-primary/60 flex-shrink-0" />
                  <p className="font-body text-sm text-muted-foreground italic">
                    Release date revealed with the artwork on May 10th.
                  </p>
                </div>
              )}
            </div>

            {/* Pre-save / notify */}
            {!released && (
              <div className="border-t border-border/30 pt-6">
                <p className="font-body text-xs text-muted-foreground mb-3">Be the first to know when it drops —</p>
                <Link to="/community">
                  <Button variant="outline" className="rounded-full gap-2 font-body text-xs tracking-wider uppercase border-foreground/20">
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