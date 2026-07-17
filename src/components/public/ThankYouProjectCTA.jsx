import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Music, ShoppingBag, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Thank You Project support CTA — drives donations, subscriptions, and community growth
export default function ThankYouProjectCTA({ variant = 'banner', context = '' }) {
  if (variant === 'compact') {
    return (
      <div className="bg-card/50 border border-border/40 rounded-xl p-5 text-left">
        <p className="font-body text-xs text-foreground/70 mb-3">
          {context || 'Support the Thank You Project — help fund more music and healing.'}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/back-this">
            <Button size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase gap-1.5">
              <Heart className="w-3 h-3" /> Donate
            </Button>
          </Link>
          <Link to="/community">
            <Button size="sm" variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase gap-1.5 border-foreground/20 text-foreground/80">
              <Users className="w-3 h-3" /> Join Community
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
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(245,208,110,0.08) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 text-left max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow">The Thank You Project</p>
        </div>

        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
          Be Part of the Story
        </h2>

        <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed mb-8">
          {context || 'Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT.'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Link to="/back-this" className="block">
            <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center hover:border-primary/30 transition-all">
              <Heart className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="font-body text-xs font-semibold text-foreground">Donate</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">From $5</p>
            </div>
          </Link>
          <Link to="/community" className="block">
            <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center hover:border-primary/30 transition-all">
              <Users className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="font-body text-xs font-semibold text-foreground">Join</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Free</p>
            </div>
          </Link>
          <Link to="/store" className="block">
            <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center hover:border-primary/30 transition-all">
              <ShoppingBag className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="font-body text-xs font-semibold text-foreground">Shop</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Merch</p>
            </div>
          </Link>
          <a href="https://www.instagram.com/gannonwaye" target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center hover:border-primary/30 transition-all">
              <Share2 className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="font-body text-xs font-semibold text-foreground">Follow</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Socials</p>
            </div>
          </a>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/back-this">
            <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2 px-8">
              <Heart className="w-4 h-4" /> Support the Project
            </Button>
          </Link>
          <Link to="/music">
            <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase gap-2 border-foreground/20 text-foreground/80">
              <Music className="w-4 h-4" /> Listen to Music
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
