import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Featured merchandise display artwork and animation supplied by Gannon, September 2026.
const MERCH_DISPLAY_IMAGE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0f1c74e9a_tyk_thankyou_3d_hero.png';
const MERCH_DISPLAY_VIDEO = 'https://media.base44.com/videos/public/69eb7905ca6eb4180010f794/900001d86_tyk_thankyou_3d_hero_animated.mp4';

export default function FeaturedMerchShowcase() {
  return (
    <section aria-label="Featured merchandise" className="home-thankyou-feature">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">The Thank You Project</p>
          <Link to="/store" aria-label="Explore the Thank You collection">
            <h2 className="font-body text-3xl md:text-5xl gradient-gold-text hover:opacity-90 transition-opacity">The Thank You Collection</h2>
          </Link>
          <p className="font-body text-sm text-foreground/80 leading-relaxed mt-3 max-w-xl mx-auto">For all of your support. It’s been such an honour to gift you with this music.</p>
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
            className="w-full h-auto max-h-[360px] object-contain bg-black/30" />


          <div className="p-5 text-center border-t border-primary/20">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/store">
                <Button className="rounded-full px-7 py-4 font-body text-xs tracking-wider uppercase gradient-gold-button border-0">
                  Explore the Collection <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}