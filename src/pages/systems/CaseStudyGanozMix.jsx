import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminEditButton from '@/components/store/AdminEditButton';
import { useAuth } from '@/lib/AuthContext';

const MODULES = [
  { label: 'Product Sourcing Queue', desc: 'Structured pipeline for identifying, evaluating, and staging new dropshipping products.' },
  { label: 'Supplier Manager', desc: 'Supplier profiles, contact records, MOQ tracking, lead times, and reorder points.' },
  { label: 'Margin Calculator', desc: 'Unit cost, landed cost, delivery, merchant fees, and profit margin calculator with AUD conversion.' },
  { label: 'Product Import Queue', desc: 'Staged product listings with status tracking from draft to published.' },
  { label: 'Image Lab', desc: 'Background removal workflow, transparent PNG generation, edge cleanup, and approval process.' },
  { label: 'Approval Queue', desc: 'All products, content, and supplier decisions go through a human approval gate before going live.' },
  { label: 'Social Content Drafts', desc: 'AI-assisted captions, hooks, and visual prompts for product launches.' },
  { label: 'Launch Checklist', desc: 'Pre-launch readiness checklist covering image, copy, pricing, compliance, and platform checks.' },
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
            ← Systems Manager
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary">Case Study</span>
            </div>
            <AdminEditButton href="/admin/ganozmix" label="View GanozMix Admin" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">GanozMix Direct</h1>
          <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">
            A dropshipping and ecommerce command system designed to connect product research, supplier comparison, product listings, margin checks, shipping risk, visual assets, social drafts, and publishing approvals into one operating dashboard.
          </p>
        </motion.div>

        <div className="space-y-5">
          <h2 className="font-display text-2xl text-foreground">System Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
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

        <div className="text-center space-y-4 py-6 border-t border-border/20">
          <p className="font-body text-sm text-muted-foreground">Want a dropshipping command system built for your operation?</p>
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