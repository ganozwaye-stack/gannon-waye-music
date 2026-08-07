import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Headphones, Disc, Zap, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    name: 'Standard Mix',
    price: 150,
    turnaround: '5–7 days',
    features: [
      'Professional stereo mix',
      'EQ, compression & spatial processing',
      '2 rounds of revisions',
      'Final mix delivered as WAV + MP3',
      'Loudness target for streaming platforms',
    ],
    icon: Sliders,
    highlight: false,
  },
  {
    name: 'Stem Mix & Master',
    price: 350,
    turnaround: '7–10 days',
    features: [
      'Full stem-based mixing (up to 32 stems)',
      'Professional mastering included',
      'Detailed vocal processing & tuning',
      'Unlimited revisions within 14 days',
      'WAV, MP3, and DDP delivery',
      'Loudness optimised for Spotify, Apple Music & YouTube',
    ],
    icon: Disc,
    highlight: true,
  },
  {
    name: 'Full Production',
    price: 2000,
    suffix: '+ GST',
    turnaround: '2–3 weeks',
    features: [
      'Mixing + mastering + production polish',
      'Instrumental arrangement & additional production',
      'Vocal comping, tuning & timing',
      'Unlimited revisions',
      'All delivery formats included',
      'Direct consultation throughout',
    ],
    icon: Zap,
    highlight: false,
  },
];

const PROCESS = [
  { step: '01', title: 'Upload Your Stems', desc: 'Send your raw stems, reference tracks, and a brief description of your vision.' },
  { step: '02', title: 'Initial Mix', desc: 'I craft the first mix, focusing on clarity, punch, and emotional impact.' },
  { step: '03', title: 'Revisions', desc: 'You provide feedback. I refine until it feels exactly right.' },
  { step: '04', title: 'Final Delivery', desc: 'Receive your final mix and master in all formats, ready for release.' },
];

export default function MixingServices() {
  const [selectedTier, setSelectedTier] = useState(null);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Professional Audio Services</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Mixing & Mastering</h1>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Radio-ready mixes and masters for independent artists. Whether you've recorded in a studio or your bedroom, your song deserves to sound its best on every platform.
          </p>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card border rounded-2xl p-8 flex flex-col ${
                  tier.highlight ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border/40'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-gold-button border-0 font-body text-[10px] tracking-widest uppercase px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center border border-primary/20 mb-6">
                  <Icon className="w-5 h-5 text-primary/70" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-3xl text-primary">${tier.price.toLocaleString()}</span>
                  <span className="font-body text-xs text-muted-foreground">{tier.suffix || 'AUD'}</span>
                </div>
                <p className="font-body text-xs text-muted-foreground mb-6">Turnaround: {tier.turnaround}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                      <span className="font-body text-sm text-foreground/70 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={selectedTier === tier.name ? 'default' : 'outline'}
                  className={`rounded-full font-body text-xs tracking-wider uppercase w-full ${selectedTier === tier.name ? 'gradient-gold-button border-0' : 'border-primary/30 text-primary hover:bg-primary/10'}`}
                  onClick={() => setSelectedTier(tier.name)}
                >
                  {selectedTier === tier.name ? 'Selected ✓' : 'Choose This Tier'}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Process */}
        <div className="mb-20">
          <h2 className="font-display text-3xl text-foreground text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-3xl gradient-gold-text mb-3">{p.step}</p>
                <h3 className="font-display text-lg text-foreground mb-2">{p.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-card border border-border/40 rounded-2xl p-10 text-center">
          <Headphones className="w-10 h-10 text-primary/50 mx-auto mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-3">Ready to Make Your Song Shine?</h2>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
            Get in touch to discuss your project. Send your stems and references, and let's make something that sounds incredible.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button className="rounded-full font-body text-xs tracking-wider uppercase gradient-gold-button border-0 gap-1.5">
                Start Your Project <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
            <Link to="/music">
              <Button variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
                Hear My Work
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}