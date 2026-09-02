import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, ShoppingBag, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThankYouProjectCTA({ variant = 'banner', context = '' }) {
  const message = context || 'Listen to the music, explore the current merchandise, and share the story with someone who may need it.';

  if (variant === 'compact') {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
        <p className="font-body text-xs text-foreground/70 mb-3">{message}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/store">
            <Button size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase gap-1.5">
              <ShoppingBag className="w-3 h-3" /> Visit Store
            </Button>
          </Link>
          <Link to="/music">
            <Button size="sm" variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase gap-1.5 border-primary/30 text-primary">
              <Music className="w-3 h-3" /> Listen
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl p-8 md:p-12"
      style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(245,208,110,0.04) 50%, rgba(212,175,55,0.08) 100%)',
        border: '1px solid rgba(212,175,55,0.2)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(245,208,110,0.08) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary/60" />
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary/60">The Thank You Project</p>
        </div>

        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">Be Part of the Story</h2>
        <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed mb-8">{message}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link to="/music" className="block">
            <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center hover:border-primary/30 transition-all">
              <Music className="w-5 h-5 text-primary/60 mx-auto mb-2" />
              <p className="font-body text-xs font-semibold text-foreground">Listen</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Official music</p>
            </div>
          </Link>
          <Link to="/store" className="block">
            <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center hover:border-primary/30 transition-all">
              <ShoppingBag className="w-5 h-5 text-primary/60 mx-auto mb-2" />
              <p className="font-body text-xs font-semibold text-foreground">Shop</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Current merchandise</p>
            </div>
          </Link>
          <a href="https://www.instagram.com/gann0nwaye" target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center hover:border-primary/30 transition-all">
              <Share2 className="w-5 h-5 text-primary/60 mx-auto mb-2" />
              <p className="font-body text-xs font-semibold text-foreground">Follow</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Creative updates</p>
            </div>
          </a>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/store">
            <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2 px-8">
              <ShoppingBag className="w-4 h-4" /> Visit the Store
            </Button>
          </Link>
          <Link to="/music">
            <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase gap-2 border-primary/30 text-primary">
              <Music className="w-4 h-4" /> Listen to Music
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
