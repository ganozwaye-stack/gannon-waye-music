import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';
import { useSiteReveal } from '@/hooks/useSiteReveal';



export default function ThankYouSingle() {
  const { artworkRevealed, released, releaseDateIso, releaseDateText } = useSiteReveal();

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
            "Thank You" — Gannon Waye. Written at a turning point, when staying any longer would have meant abandoning himself all over again. This song is not about the pain. It is about the line being drawn. The moment of choosing self respect over repetition.
          </p>
          <p className="font-body text-sm gradient-gold-glow font-medium tracking-wider">
            Out Now · {releaseDateText}
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
            <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a6aefb394_2.jpg" alt="Thank You — Gannon Waye single cover" className="w-full h-full object-cover" />
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
              <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-3">Out Now · Debut Single</p>
              <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow mb-2">About the single</p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm">
                "Thank You" was written at a turning point, when staying any longer would have meant abandoning himself all over again. The dynamic mirrored something already fought hard to outgrow — and in recognising that, the decision became simple.
              </p>
              <p className="font-body text-foreground/70 leading-relaxed text-sm mt-3">
                This is what it sounds like when you break a cycle and refuse to return to it. "Thank You" — Gannon Waye.
              </p>
            </div>

            {/* Release countdown or release date */}
            <div className="border-t border-border/30 pt-6 space-y-4">
              {released ? (
                <Link to="/music">
                  <Button className="w-full rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7 gradient-gold-button border-0">
                    Listen Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow">Release countdown — {releaseDateText}</p>
                  <CountdownTimer targetDate={releaseDateIso} />
                  <a href="https://open.spotify.com/search/Gannon%20Waye%20Thank%20You" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full rounded-full gap-2 font-body text-sm tracking-wider uppercase px-7 gradient-gold-button border-0 hover:shadow-lg">
                      <Music className="w-4 h-4" /> Listen on Spotify
                    </Button>
                  </a>
                </>
              )}
            </div>

            <div className="border-t border-border/30 pt-6">
              <Link to="/community">
                <Button variant="outline" className="rounded-full gap-2 font-body text-xs tracking-wider uppercase border-foreground/20">
                  Join the Community <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}