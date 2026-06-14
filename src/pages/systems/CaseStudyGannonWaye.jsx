import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminEditButton from '@/components/store/AdminEditButton';
import { useAuth } from '@/lib/AuthContext';

const MODULES = [
  { label: 'Release Campaign System', desc: 'Launch pages, countdown timers, pre-save links, fan notification emails, and release sprints.' },
  { label: 'Fan CRM', desc: 'Supporter profiles, fan activity feed, community wall, email subscriber management.' },
  { label: 'Mailing List & Email System', desc: 'Subscriber capture, welcome emails, newsletter reveals, birthday discounts, charity tracking.' },
  { label: 'Stripe-Backed Merch Store', desc: 'Product pages, cart, checkout, Stripe webhook handling, order deduplication, promo codes.' },
  { label: 'Order Support', desc: 'Order tracking dashboard, admin notifications, shipping status emails, Google Sheets sync.' },
  { label: 'Promo Code Logic', desc: 'Multi-rule discount engine: category exclusions, bundle locking, one-use-per-email, approval gates.' },
  { label: 'Webhook Diagnostics', desc: 'Stripe event log, webhook health monitor, payment diagnostic dashboard, recovery tools.' },
  { label: 'Admin Notifications', desc: 'Real-time admin alerts for orders, community posts, fan activity, system health, low stock.' },
  { label: 'Lyrics & Music Pages', desc: 'Dynamic lyrics page, song detail view, release artwork, Spotify/Apple Music links.' },
  { label: 'Approval Workflows', desc: 'Content approval queue, agent proposal scanner, risk flagging, decision audit trail.' },
  { label: 'Site Health Checks', desc: 'Automated diagnostics, broken link detection, Playwright tests, self-healing engine.' },
  { label: 'Master Blueprint', desc: 'Central operating document mapping every system, route, agent, and integration.' },
];

const ADMIN_LINKS = [
  { label: 'Master Blueprint', href: '/admin/master-blueprint' },
  { label: 'Site Health', href: '/admin/site-health' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Content Command', href: '/admin/content-command' },
  { label: 'Approval Queue', href: '/admin/approval-queue' },
];

export default function CaseStudyGannonWaye() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <Link to="/systems-manager" className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Systems Manager
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary">Case Study</span>
            </div>
            <AdminEditButton href="/admin/master-blueprint" label="View Admin Blueprint" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">Gannon Waye Music OS</h1>
          <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">
            A complete artist platform built to handle releases, merch, mailing list growth, fan CRM, Stripe-backed store flows, promo code logic, admin notifications, lyrics pages, content approval workflows, and release campaign management.
          </p>
          <a href="https://gannonwaye.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-full gap-2 border-border/50">
              View Live Site <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </motion.div>

        {/* Modules grid */}
        <div className="space-y-5">
          <h2 className="font-display text-2xl text-foreground">System Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="bg-card border border-border/30 rounded-xl p-5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <p className="font-display text-sm text-foreground">{m.label}</p>
                </div>
                <p className="font-body text-xs text-muted-foreground leading-relaxed pl-6">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Admin quick-links — visible only to admin */}
        {isAdmin && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
            <p className="font-body text-xs text-primary tracking-wider uppercase">Admin — Quick Access</p>
            <div className="flex flex-wrap gap-2">
              {ADMIN_LINKS.map(l => (
                <Link key={l.href} to={l.href}>
                  <Button size="sm" variant="outline" className="rounded-full text-xs border-primary/30 hover:border-primary/60 gap-1.5">
                    {l.label} <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center space-y-4 py-6 border-t border-border/20">
          <p className="font-body text-sm text-muted-foreground">Want a system like this built for your artist brand?</p>
          <a href="/systems-manager#build-form">
            <Button className="gradient-gold-button border-0 rounded-full px-8 py-5 text-sm gap-2">
              Book a Systems Audit <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}