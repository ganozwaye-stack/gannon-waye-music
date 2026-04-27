import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function SafeSpaceBanner() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden p-10 md:p-14 text-center"
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-48 bg-primary/8 blur-3xl rounded-full" />
          </div>

          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-4 h-4 text-primary" />
            </div>

            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-text mb-4">A Safe Space</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">You Are Not Alone</h2>

            <p className="font-body text-foreground/60 leading-relaxed max-w-xl mx-auto mb-4 text-sm">
              This space was built for anyone who has ever felt unseen, misunderstood, or too much for the world around them.
              Whether you're here for the music, for the message, or because something in a lyric hit a little too close to home, you belong here.
            </p>
            <p className="font-body text-foreground/60 leading-relaxed max-w-xl mx-auto mb-8 text-sm">
              No judgement. No noise. Just connection.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/community">
                <Button className="rounded-full gap-2 font-body text-sm tracking-wider uppercase px-8 py-5 gradient-gold-button border-0">
                  Join the Community <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Crisis line */}
            <div className="mt-10 pt-8 border-t border-border/30">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">If you need support right now</p>
              <p className="font-body text-xs text-foreground/50">
                Australia · Lifeline{' '}
                <a href="tel:131114" className="text-primary hover:underline">13 11 14</a>
                {' '}· 1800RESPECT{' '}
                <a href="tel:1800737732" className="text-primary hover:underline">1800 737 732</a>
                {' '}· Beyond Blue{' '}
                <a href="tel:1300224636" className="text-primary hover:underline">1300 22 4636</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}