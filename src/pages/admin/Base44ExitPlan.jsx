import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, AlertTriangle, ChevronDown, ExternalLink, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PHASES = [
  {
    id: 'phase1',
    title: 'Phase 1 — Stabilise Live Base44 System',
    status: 'in_progress',
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    items: [
      { done: true, text: 'AI Systems Manager sales page rebuilt' },
      { done: true, text: 'Service card routing fixed (intentRoutes.js)' },
      { done: true, text: 'Lyrics page updated — Thankyou added' },
      { done: true, text: 'Memorial page auth-locked (/mum, /without-you-here)' },
      { done: true, text: 'Bundle promo exclusion enforced' },
      { done: true, text: 'Low stock automation created' },
      { done: false, text: 'Admin inline edit buttons — service cards, product cards, lyrics' },
      { done: false, text: 'Poster product images fixed (remove hoodie images)' },
      { done: false, text: 'Poster size pricing variants built' },
      { done: false, text: 'Enter key behaviour audit' },
      { done: false, text: 'Master Blueprint updated' },
      { done: false, text: 'All display boxes linked to correct destination' },
    ],
  },
  {
    id: 'phase2',
    title: 'Phase 2 — Build Portable GitHub System',
    status: 'not_started',
    color: 'text-muted-foreground',
    border: 'border-border/30',
    items: [
      { done: false, text: 'Create new GitHub repo: gannonwaye-v2' },
      { done: false, text: 'Setup Vite + React + TypeScript scaffold' },
      { done: false, text: 'Configure Supabase project (auth, DB, storage)' },
      { done: false, text: 'Configure Stripe (reuse existing keys)' },
      { done: false, text: 'Deploy skeleton to Vercel' },
      { done: false, text: 'Build portable: public website' },
      { done: false, text: 'Build portable: store + product pages' },
      { done: false, text: 'Build portable: merch manager' },
      { done: false, text: 'Build portable: order manager' },
      { done: false, text: 'Build portable: lyrics manager' },
      { done: false, text: 'Build portable: service sales pages' },
      { done: false, text: 'Build portable: AI systems manager page' },
      { done: false, text: 'Build portable: admin dashboard' },
      { done: false, text: 'Configure GitHub Actions CI' },
      { done: false, text: 'Configure Cloudinary / R2 for media' },
      { done: false, text: 'Configure Resend / SendGrid for email' },
      { done: false, text: 'Configure Playwright tests' },
    ],
  },
  {
    id: 'phase3',
    title: 'Phase 3 — Data Export from Base44',
    status: 'not_started',
    color: 'text-muted-foreground',
    border: 'border-border/30',
    items: [
      { done: false, text: 'Export: MerchProduct records (all products)' },
      { done: false, text: 'Export: MerchOrder records (all orders)' },
      { done: false, text: 'Export: StoreCustomer records' },
      { done: false, text: 'Export: EmailSubscriber list' },
      { done: false, text: 'Export: Release records (songs, lyrics, artwork)' },
      { done: false, text: 'Export: PromoCode records' },
      { done: false, text: 'Export: ApprovalQueue records' },
      { done: false, text: 'Export: AdminNotification records' },
      { done: false, text: 'Export: SiteSettings' },
      { done: false, text: 'Export: AgentRegistry' },
      { done: false, text: 'Export: ContentCalendarPost records' },
      { done: false, text: 'Export: Asset URLs (images, media)' },
      { done: false, text: 'Verify no secrets in exported code' },
    ],
  },
  {
    id: 'phase4',
    title: 'Phase 4 — Parity Testing Before Cutover',
    status: 'not_started',
    color: 'text-muted-foreground',
    border: 'border-border/30',
    items: [
      { done: false, text: 'Public pages load correctly' },
      { done: false, text: 'Products display with correct pricing' },
      { done: false, text: 'Cart works end-to-end' },
      { done: false, text: 'Checkout completes via Stripe' },
      { done: false, text: 'Stripe webhooks fire correctly' },
      { done: false, text: 'Orders create exactly once (no duplicates)' },
      { done: false, text: 'Duplicate order protection works' },
      { done: false, text: 'Promo code rules enforced' },
      { done: false, text: 'Inventory tracking correct' },
      { done: false, text: 'Order confirmation emails send' },
      { done: false, text: 'Admin dashboard protected (auth required)' },
      { done: false, text: 'Lyrics editable from admin' },
      { done: false, text: 'Service pages route correctly' },
      { done: false, text: 'Mobile responsive verified' },
      { done: false, text: 'No secrets exposed in frontend code' },
      { done: false, text: 'Playwright test suite passes' },
      { done: false, text: 'Live test order completed successfully' },
    ],
  },
  {
    id: 'phase5',
    title: 'Phase 5 — Domain Cutover',
    status: 'not_started',
    color: 'text-muted-foreground',
    border: 'border-border/30',
    items: [
      { done: false, text: 'Freeze Base44 — no more changes to Base44 version' },
      { done: false, text: 'Final data export from Base44' },
      { done: false, text: 'Deploy GitHub-controlled replacement to Vercel' },
      { done: false, text: 'Run smoke test on replacement' },
      { done: false, text: 'Switch DNS: gannonwaye.com → Vercel' },
      { done: false, text: 'Monitor checkout and orders for 48 hours' },
      { done: false, text: 'Keep Base44 accessible as fallback URL temporarily' },
      { done: false, text: 'Retire Base44 subscription only after confirmed stable' },
    ],
  },
];

const TECH_STACK = [
  { label: 'Frontend', value: 'React + Vite + TypeScript' },
  { label: 'Backend/DB', value: 'Supabase (auth, DB, storage)' },
  { label: 'Payments', value: 'Stripe (existing keys)' },
  { label: 'Hosting', value: 'Vercel or Netlify' },
  { label: 'Testing', value: 'Playwright' },
  { label: 'CI/CD', value: 'GitHub Actions' },
  { label: 'Media', value: 'Cloudinary / Cloudflare R2' },
  { label: 'Email', value: 'Resend / SendGrid' },
  { label: 'Scheduling', value: 'Metricool (when approved)' },
  { label: 'Version Control', value: 'GitHub (existing GITHUB_TOKEN)' },
];

const STATUS_COLORS = {
  in_progress: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  not_started: 'bg-secondary text-muted-foreground border-border/30',
  complete: 'bg-green-500/15 text-green-400 border-green-500/30',
};

export default function Base44ExitPlan() {
  const [open, setOpen] = useState({ phase1: true });

  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));

  const totalDone = PHASES.flatMap(p => p.items).filter(i => i.done).length;
  const totalItems = PHASES.flatMap(p => p.items).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-3xl text-foreground">Base44 Exit Plan</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Migrate to a GitHub-controlled, portable architecture. Do not break the live site. Build parity first.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-card border border-border/40 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-sm text-foreground">Overall Progress</p>
          <p className="font-body text-sm text-primary">{totalDone} / {totalItems} tasks</p>
        </div>
        <div className="w-full h-2 bg-secondary/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalDone / totalItems) * 100}%` }}
            className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
          />
        </div>
        <p className="font-body text-xs text-muted-foreground mt-2">{Math.round((totalDone / totalItems) * 100)}% complete — Phase 1 in progress</p>
      </div>

      {/* Tech Stack */}
      <div className="bg-card border border-border/40 rounded-2xl p-5">
        <h2 className="font-display text-base text-foreground mb-4">Target Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TECH_STACK.map(t => (
            <div key={t.label} className="bg-secondary/20 rounded-xl p-3">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{t.label}</p>
              <p className="font-body text-xs text-foreground mt-0.5">{t.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alert */}
      <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/25 rounded-xl p-4">
        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-yellow-300 leading-relaxed">
          <strong>CRITICAL RULE:</strong> Do not attempt reckless overnight payment/order migration. Build replacement in parallel. Prove parity. Only switch DNS after all Playwright tests pass on the new system.
        </p>
      </div>

      {/* Phases */}
      {PHASES.map(phase => {
        const done = phase.items.filter(i => i.done).length;
        const isOpen = open[phase.id];
        return (
          <motion.div key={phase.id} layout className="bg-card border border-border/40 rounded-2xl overflow-hidden">
            <button onClick={() => toggle(phase.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/10 transition-colors">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display text-sm text-foreground">{phase.title}</p>
                    <span className={`font-body text-[9px] tracking-[0.12em] uppercase border rounded-full px-2 py-0.5 ${STATUS_COLORS[phase.status]}`}>
                      {phase.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{done}/{phase.items.length} tasks complete</p>
                </div>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-border/20">
                  <div className="px-5 py-4 space-y-2">
                    {phase.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        {item.done
                          ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          : <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" />}
                        <p className={`font-body text-xs leading-relaxed ${item.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Human actions required */}
      <div className="bg-card border border-red-500/25 rounded-2xl p-5 space-y-3">
        <h2 className="font-display text-base text-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" /> Human Actions Required from Gannon
        </h2>
        {[
          'Set up Supabase project and provide project URL + anon key',
          'Confirm email provider choice (Resend, SendGrid, or MailerLite)',
          'Confirm media storage choice (Cloudinary, R2, or S3)',
          'Confirm domain registrar access for DNS cutover',
          'Review and approve termination letter before sending (see /admin/legal-drafts)',
          'Confirm poster print-on-demand supplier (Gelato.com recommended)',
          'Manually revoke any external platform access for Victor de Mauro if applicable',
          'Confirm new GitHub repo name for portable system build',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="font-body text-xs text-red-400/70 shrink-0 mt-0.5">{i + 1}.</span>
            <p className="font-body text-xs text-foreground leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      <p className="text-center font-body text-xs text-muted-foreground/40 pb-8">
        Base44 Exit Plan — gannonwaye.com · Updated 14 Jun 2026
      </p>
    </div>
  );
}