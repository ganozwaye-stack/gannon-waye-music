import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Star, Crown, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIERS = [
  {
    name: 'Supporter',
    price: 5,
    icon: Heart,
    color: 'from-primary/20',
    accentColor: 'text-primary',
    description: 'Getting in early',
    perks: [
      'Exclusive welcome gift 🎁',
      'Early access to new music',
      'Private community access',
      'Direct inbox connection'
    ],
    cta: 'Join Now',
    ctaLink: '/back-this'
  },
  {
    name: 'Inner Circle',
    price: 25,
    icon: Star,
    color: 'from-yellow-500/20',
    accentColor: 'gradient-gold-glow',
    description: 'Being part of something real',
    perks: [
      'Everything in Supporter, plus:',
      'Behind-the-scenes content',
      'Signed merch drops',
      'Monthly live Q&A access',
      'Your name on supporter wall'
    ],
    featured: true,
    cta: 'Become a Supporter',
    ctaLink: '/back-this'
  },
  {
    name: 'Movement Leader',
    price: 50,
    icon: Crown,
    color: 'from-amber-600/20',
    accentColor: 'text-amber-400',
    description: 'Building the legacy',
    perks: [
      'Everything in Inner Circle, plus:',
      'Name in all music credits',
      'Exclusive video messages',
      'Private meetings (quarterly)',
      'VIP event access',
      'Custom gift package'
    ],
    cta: 'Invest in the Movement',
    ctaLink: '/back-this'
  }
];

export default function MemberTiers() {
  const [hoveredTier, setHoveredTier] = useState(null);

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Membership</p>
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-6">Choose Your Level</h1>
          <p className="font-body text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Every tier gets you closer to the inner circle. No gatekeeping. Just genuine connection and mutual respect.
          </p>
        </motion.div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const isFeatured = tier.featured;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                onHoverStart={() => setHoveredTier(tier.name)}
                onHoverEnd={() => setHoveredTier(null)}
                className={`relative rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isFeatured
                    ? 'border-primary/60 md:scale-105 md:shadow-2xl'
                    : hoveredTier === tier.name
                    ? 'border-primary/40'
                    : 'border-border/30'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} to-transparent pointer-events-none`} />

                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute top-0 left-0 right-0 bg-primary/20 border-b border-primary/30 px-4 py-2 text-center">
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-glow">Most Popular</p>
                  </div>
                )}

                {/* Content */}
                <div className={`relative p-8 ${isFeatured ? 'pt-16' : ''}`}>

                  {/* Icon and Title */}
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center mb-4 ${tier.accentColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-3xl text-foreground mb-1">{tier.name}</h3>
                    <p className="font-body text-sm text-muted-foreground italic">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 pb-8 border-b border-border/30">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl text-primary">${tier.price}</span>
                      <span className="font-body text-sm text-muted-foreground">/month</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground/60 mt-2">Or adjust your contribution amount</p>
                  </div>

                  {/* Perks */}
                  <div className="mb-8 space-y-3">
                    {tier.perks.map((perk, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="font-body text-sm text-foreground/70">{perk}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link to={tier.ctaLink} className="block">
                    <Button
                      className={`w-full rounded-full py-5 font-body text-sm tracking-wider uppercase transition-all ${
                        isFeatured
                          ? 'gradient-gold-button border-0'
                          : 'border border-primary/40 text-primary hover:bg-primary/10'
                      }`}
                    >
                      {tier.cta} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  {/* Info */}
                  <p className="font-body text-xs text-muted-foreground/60 text-center mt-4">
                    {tier.price === 5 && 'One-time or recurring'}
                    {tier.price !== 5 && 'Monthly recurring • Cancel anytime'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-border/30 rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <h3 className="font-display text-2xl text-foreground mb-6">Questions?</h3>
          <div className="space-y-4 font-body text-sm text-foreground/70">
            <p>
              <strong>Can I change tiers?</strong>
              <br />
              Yes. Update your contribution anytime from your profile.
            </p>
            <p>
              <strong>Is there a contract?</strong>
              <br />
              No. Cancel recurring support anytime by emailing hello@gannonwaye.com
            </p>
            <p>
              <strong>What if I want to support differently?</strong>
              <br />
              Check out the merch store, buy music, or request a custom contribution amount.
            </p>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="font-body text-foreground/60 mb-4">Not ready to commit? Start by following on social.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://www.tiktok.com/@gannonwaye" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/10">
                TikTok
              </Button>
            </a>
            <a href="https://www.instagram.com/gannonwaye" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/10">
                Instagram
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}