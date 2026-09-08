import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Featured merchandise display artwork and animation supplied by Gannon, September 2026.
const MERCH_DISPLAY_IMAGE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0f1c74e9a_tyk_thankyou_3d_hero.png';
const MERCH_DISPLAY_VIDEO = 'https://media.base44.com/videos/public/69eb7905ca6eb4180010f794/900001d86_tyk_thankyou_3d_hero_animated.mp4';

export default function FeaturedMerchShowcase() {
  return (
    <section aria-label="Featured merchandise" className="py-10 md:py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Featured Merchandise</p>
          <Link to="/store" aria-label="Shop the Thank You collection">
            <h2 className="font-body text-3xl md:text-5xl gradient-gold-text hover:opacity-90 transition-opacity">The Thank You Collection</h2>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border border-primary/30"
          style={{ boxShadow: '0 0 60px rgba(212,175,55,0.15), 0 24px 60px rgba(0,0,0,0.5)' }}>
          <video
            src={MERCH_DISPLAY_VIDEO}
            poster={MERCH_DISPLAY_IMAGE}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
            className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] object-cover" />

          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,14,0.92) 0%, rgba(8,8,14,0.30) 48%, rgba(8,8,14,0.05) 100%)' }} />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-center">
            <p className="font-body text-sm md:text-base text-foreground/85 max-w-xl mx-auto leading-relaxed mb-5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.65)' }}>
              The hoodie, the journals, the winter bundle. Every piece carries the message, and every order supports independent, heart-first art.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/store">
                <Button className="rounded-full px-7 py-4 font-body text-xs tracking-wider uppercase gradient-gold-button border-0">
                  Shop the Collection <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
              <a href="#upcoming-merch">
                <Button variant="outline" className="rounded-full px-7 py-4 font-body text-xs tracking-wider uppercase border-primary/40 text-primary hover:bg-primary/10">
                  Vote on what's next <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}