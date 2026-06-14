import React from 'react';
import { motion } from 'framer-motion';
import { Layout, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminEditButton from '@/components/store/AdminEditButton';

const INCLUDES = [
  'Parallax scroll sections & particle effects',
  'Cinematic hero with video/image backgrounds',
  'Animated section reveals on scroll',
  'Mobile-first responsive design',
  'Product showcases & release pages',
  'Premium typography & spacing system',
  'Conversion-focused CTA placement',
  'Admin edit controls for all content',
  'Speed-optimised build',
  'Deployment-ready on Vercel/Netlify',
];

const WHO_FOR = [
  'Artists & musicians launching a brand',
  'Coaches & consultants needing authority presence',
  'Ecommerce brands wanting premium feel',
  'Creators who need a standalone portfolio',
  'Small businesses tired of template sites',
];

export default function CinematicWebsites() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-14">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <Link to="/systems-manager" className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Systems Manager
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Layout className="w-6 h-6 text-amber-400" />
            </div>
            <AdminEditButton href="/admin/services/cinematic-websites" label="Edit This Page" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">Cinematic Websites</h1>
          <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">
            Premium websites that do not look like templates. Cinematic landing pages, scroll-based storytelling, animated sections, product showcases, release pages, and mobile-first experiences built to make visitors believe in the brand before they buy.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/systems-manager#build-form">
              <Button className="gradient-gold-button border-0 rounded-full gap-2">Book a Systems Audit <ArrowRight className="w-4 h-4" /></Button>
            </a>
            <Link to="/systems/case-studies/gannon-waye-music-os">
              <Button variant="outline" className="rounded-full gap-2 border-border/50">View Live Example <ExternalLink className="w-4 h-4" /></Button>
            </Link>
          </div>
        </motion.div>

        {/* Who it's for */}
        <div className="bg-card border border-border/40 rounded-2xl p-7 space-y-5">
          <h2 className="font-display text-xl text-foreground">Who This Is For</h2>
          <ul className="space-y-2.5">
            {WHO_FOR.map(item => (
              <li key={item} className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What it solves */}
        <div className="space-y-4">
          <h2 className="font-display text-xl text-foreground">What It Solves</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Most businesses lose potential customers the moment their site loads — because it looks generic, loads slowly, or fails to communicate the brand's value in the first 5 seconds. A cinematic website changes that. Every scroll trigger, every animation, every section is designed to build trust and guide visitors toward action.
          </p>
        </div>

        {/* What's included */}
        <div className="bg-card border border-border/40 rounded-2xl p-7 space-y-5">
          <h2 className="font-display text-xl text-foreground">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INCLUDES.map(item => (
              <div key={item} className="flex items-start gap-2.5 font-body text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Proof */}
        <div className="bg-gradient-to-br from-amber-500/5 to-card border border-amber-500/20 rounded-2xl p-7 space-y-3">
          <h2 className="font-display text-xl text-foreground">Proof</h2>
          <p className="font-body text-sm text-muted-foreground">
            The Gannon Waye Music OS is a live example — parallax hero, animated sections, cinematic memorial tribute page, full merch store, lyrics page, and community wall.
          </p>
          <Link to="/systems/case-studies/gannon-waye-music-os">
            <Button variant="outline" size="sm" className="rounded-full gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 mt-2">
              View Case Study <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-6">
          <p className="font-display text-2xl text-foreground">Starting from <span className="gradient-gold-text">$1,500 AUD</span></p>
          <a href="/systems-manager#build-form">
            <Button className="gradient-gold-button border-0 rounded-full px-8 py-5 text-sm gap-2">
              Book Your Systems Audit <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}