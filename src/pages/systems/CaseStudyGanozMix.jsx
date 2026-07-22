import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminEditButton from '@/components/store/AdminEditButton';
import { useAuth } from '@/lib/AuthContext';

const MODULES = [
  { label: 'Product Review Queue', desc: 'Structured pipeline for sorting product ideas before supplier or marketplace action.' },
  { label: 'Supplier Checks', desc: 'Supplier URLs, stock, variants, landed cost, shipping speed, returns, and image-rights review.' },
  { label: 'Margin Drafting', desc: 'Unit cost, delivery, merchant fees, competition, and AUD margin assumptions before approval.' },
  { label: 'Listing Drafts', desc: 'Marketplace copy and SEO previews remain locked until every launch gate is cleared.' },
  { label: 'Image Lab', desc: 'Background removal workflow, transparent PNG generation, edge cleanup, and manual approval.' },
  { label: 'Approval Queue', desc: 'Products, suppliers, pricing, content, and publishing decisions stay human-gated.' },
  { label: 'Social Content Drafts', desc: 'AI-assisted captions, hooks, and visual prompts for approved product tests.' },
  { label: 'Launch Gates', desc: 'Pre-launch checks covering OAuth, copy, pricing, compliance, fulfilment, and platform status.' },
];

const CURRENT_STATE = [
  'Old Base44 app audited as source archive',
  '45 source products need cleanup',
  '5 opportunities identified for triage',
  '2 old eBay listings require manual verification',
  '0 orders found in the source audit',
  'Publishing and payment actions remain locked'
];

const ADMIN_LINKS = [
  { label: 'GanozMix Admin', href: '/admin/ganozmix' },
  { label: 'Procurement', href: '/admin/procurement-command' },
  { label: 'Stock Flow', href: '/admin/stock-flow-dashboard' },
  { label: 'Landed Cost', href: '/admin/landed-cost-calculator' },
];

export default function CaseStudyGanozMix() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <Link to="/systems-manager" className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-primary transition-colors">
            &lt;- Systems Manager
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary">Case Study</span>
            </div>
            <AdminEditButton href="/admin/ganozmix" label="View GanozMix Admin" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">GanozMix Direct</h1>
          <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">
            A dropshipping and ecommerce command system rebuilt around review-first product sourcing. The goal is to connect product research, supplier comparison, listing drafts, margin checks, image readiness, social drafts, and approval gates without carrying over the messy automation state from the old build.
          </p>
        </motion.div>

        <div className="bg-card border border-primary/20 rounded-2xl p-6 space-y-4">
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-primary">Current Stage</p>
            <h2 className="font-display text-2xl text-foreground mt-2">Approval-First Rebuild</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CURRENT_STATE.map(item => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-border/30 bg-background/35 px-3 py-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="font-display text-2xl text-foreground">System Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/30 rounded-xl p-5 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <p className="font-display text-sm text-foreground">{m.label}</p>
                </div>
                <p className="font-body text-xs text-muted-foreground leading-relaxed pl-6">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
            <p className="font-body text-xs text-primary tracking-wider uppercase">Admin - Quick Access</p>
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

        <div className="text-center space-y-4 py-6 border-t border-border/20">
          <p className="font-body text-sm text-muted-foreground">Want a product review command system built for your operation?</p>
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
