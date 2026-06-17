import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, RefreshCw, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── All human-required actions in one place ──────────────────────────────────
const ACTIONS = [
  // CRITICAL
  {
    id: 'poster-artwork',
    priority: 'critical',
    category: 'Product',
    title: 'Upload real poster artwork for "Respect Is Earned" Lyric Wall Poster',
    detail: 'Current product falls back to emoji placeholder. Cannot promote publicly without real mockup/artwork images. Upload via /admin/merch → Poster product → Change Images.',
    link: '/admin/merch',
    linkLabel: 'Go to Merch Manager',
    status: 'open',
    blocker: true,
  },
  {
    id: 'gmail-connect',
    priority: 'critical',
    category: 'Integration',
    title: 'Connect Gmail for order receipt and welcome emails',
    detail: 'Gmail is not connected. Order confirmation emails and welcome emails cannot be sent. Go to /admin/api-setup and connect Gmail via OAuth.',
    link: '/admin/api-setup',
    linkLabel: 'Open API Setup',
    status: 'open',
    blocker: true,
  },
  {
    id: 'stripe-live',
    priority: 'critical',
    category: 'Payments',
    title: 'Confirm Stripe is in LIVE mode (not test mode)',
    detail: 'Verify in Stripe Dashboard → Developers → toggle to Live mode. Also confirm support email in Stripe Settings → Business is NOT ganozwaye@gmail.com.',
    link: '/admin/stripe-command-centre',
    linkLabel: 'Stripe Command Centre',
    status: 'open',
    blocker: true,
  },
  // HIGH
  {
    id: 'print-samples',
    priority: 'high',
    category: 'Fulfilment',
    title: 'Order sample prints from Printful and Gelato',
    detail: 'Order A3 framed and unframed poster samples to verify colour accuracy, paper quality, and frame fit before activating live fulfilment.',
    link: '/admin/print-fulfilment',
    linkLabel: 'Print Fulfilment',
    status: 'open',
    blocker: false,
  },
  {
    id: 'business-email',
    priority: 'high',
    category: 'Settings',
    title: 'Set public business contact email in Business Profile Settings',
    detail: 'Confirm or set the public support email address. Must NOT be ganozwaye@gmail.com.',
    link: '/admin/settings/business-details',
    linkLabel: 'Business Details',
    status: 'open',
    blocker: false,
  },
  {
    id: 'slack-connect',
    priority: 'high',
    category: 'Integration',
    title: 'Connect Slack for weekly order summary notifications',
    detail: 'Slack is not connected. Weekly order digest and critical alert notifications cannot be delivered.',
    link: '/admin/api-setup',
    linkLabel: 'Open API Setup',
    status: 'open',
    blocker: false,
  },
  {
    id: 'journal-image',
    priority: 'high',
    category: 'Product',
    title: 'Upload corrected Journal Bundle product image',
    detail: 'The Journal, Pen & Thermos bundle needs an image showing all three items together. Currently using placeholder.',
    link: '/admin/merch',
    linkLabel: 'Go to Merch Manager',
    status: 'open',
    blocker: false,
  },
  // MEDIUM
  {
    id: 'github-push',
    priority: 'medium',
    category: 'Engineering',
    title: 'Push codebase to GitHub and verify Playwright CI pipeline',
    detail: 'Playwright tests require GitHub Actions CI to run. Export the codebase and push to a GitHub repo, then verify the .github/workflows/playwright.yml triggers on push.',
    link: '/admin/base44-exit-plan',
    linkLabel: 'Exit Plan',
    status: 'open',
    blocker: false,
  },
  {
    id: 'provider-approve',
    priority: 'medium',
    category: 'Fulfilment',
    title: 'Approve print provider after sample review',
    detail: 'Once samples arrive, choose primary provider (Gelato recommended for AUS speed). Return to /admin/print-fulfilment and mark provider active.',
    link: '/admin/print-fulfilment',
    linkLabel: 'Print Fulfilment',
    status: 'open',
    blocker: false,
  },
  {
    id: 'metricool-approve',
    priority: 'medium',
    category: 'Social',
    title: 'Review and approve pending Metricool social posts',
    detail: 'Posts in the Social Schedule Queue require your approval before they are published. No auto-posting is active.',
    link: '/admin/social-schedule-queue',
    linkLabel: 'Social Schedule Queue',
    status: 'open',
    blocker: false,
  },
  {
    id: 'campaign-images',
    priority: 'medium',
    category: 'Marketing',
    title: 'Approve heading copy for campaign images in Campaign Image Approval',
    detail: '11 campaign images are pending heading approval before they can be used in social posts and merch pages.',
    link: '/admin/campaign-image-approval',
    linkLabel: 'Campaign Image Approval',
    status: 'open',
    blocker: false,
  },
  // Content approvals — added by cross-platform dispatch
  {
    id: 'approve-merch-ad',
    priority: 'high',
    category: 'Content',
    title: '✅ Approve: THANKYOU Merch Collection Advertisement',
    detail: 'The full merch collection ad (9:16 / 1:1 / 16:9) has been briefed. Canva/Adobe Express visual instructions are ready. Review brief at /admin/merch-content-briefs then approve in /admin/approval-queue before Canva work begins.',
    link: '/admin/merch-content-briefs',
    linkLabel: 'View Brief',
    status: 'open',
    blocker: false,
  },
  {
    id: 'approve-reel-1',
    priority: 'high',
    category: 'Content',
    title: '✅ Approve: Reel 1 — "Who are you saying THANKYOU to?"',
    detail: 'Emotional/community reel. Hook, CapCut scene list, caption, hashtags, and first comment are drafted. Approve brief before CapCut production begins. Full brief at /admin/merch-content-briefs.',
    link: '/admin/merch-content-briefs',
    linkLabel: 'View Brief',
    status: 'open',
    blocker: false,
  },
  {
    id: 'approve-reel-2',
    priority: 'high',
    category: 'Content',
    title: '✅ Approve: Reel 2 — "Respect is earned. Not a game you make me play."',
    detail: 'Identity/lyric reel. Hoodie, mug, tote, gold signature, cinematic glow. CapCut scene list, caption, and first comment drafted. Approve before CapCut production.',
    link: '/admin/merch-content-briefs',
    linkLabel: 'View Brief',
    status: 'open',
    blocker: false,
  },
  {
    id: 'approve-reel-3',
    priority: 'high',
    category: 'Content',
    title: '✅ Approve: Reel 3 — Winter Writing & Comfort Bundle $129',
    detail: 'Product bundle reel. Hoodie, journal, pen, thermos. $129 — no further discounts messaging included and required. Approve brief before CapCut production.',
    link: '/admin/merch-content-briefs',
    linkLabel: 'View Brief',
    status: 'open',
    blocker: false,
  },
  {
    id: 'capcut-assets',
    priority: 'high',
    category: 'Content',
    title: 'Provide product photo assets for CapCut reel production',
    detail: 'CapCut reel production requires actual product photo files: hoodie front/back, mug, tote, journal, pen, thermos flask, and lifestyle shots. Upload to /admin/quick-upload → Merchandise folder.',
    link: '/admin/quick-upload',
    linkLabel: 'Quick Upload',
    status: 'open',
    blocker: false,
  },
  {
    id: 'metricool-connect-before-schedule',
    priority: 'medium',
    category: 'Social',
    title: 'Connect Metricool before any scheduling — no scheduling until Gannon approves final content',
    detail: 'All 4 content pieces (merch ad + 3 reels) are DRAFT/NEEDS_REVIEW. Do not schedule in Metricool until: (1) brief approved in /admin/approval-queue, (2) Canva/CapCut assets created, (3) Gannon gives final visual approval. Then and only then schedule via Metricool.',
    link: '/admin/metricool-command',
    linkLabel: 'Metricool',
    status: 'open',
    blocker: false,
  },
  // LOW
  {
    id: 'framed-decision',
    priority: 'low',
    category: 'Product',
    title: 'Decide framed vs unframed poster offering at launch',
    detail: 'Framed posters add premium positioning but increase fulfilment complexity. Decide before activating any provider.',
    link: '/admin/print-fulfilment',
    linkLabel: 'Print Fulfilment',
    status: 'open',
    blocker: false,
  },
  {
    id: 'google-sheets',
    priority: 'low',
    category: 'Integration',
    title: 'Verify Google Sheets sales tracking spreadsheet is connected and syncing',
    detail: 'Google Sheets connector is authorised but spreadsheet ID must be confirmed. Check /admin/api-setup.',
    link: '/admin/api-setup',
    linkLabel: 'API Setup',
    status: 'open',
    blocker: false,
  },
];

const PRIORITY_STYLES = {
  critical: { border: 'border-red-500/40', bg: 'bg-red-500/5', badge: 'bg-red-500/20 text-red-400', label: '🔴 Critical' },
  high:     { border: 'border-primary/40', bg: 'bg-primary/5', badge: 'bg-primary/20 text-primary', label: '🟡 High' },
  medium:   { border: 'border-blue-500/30', bg: 'bg-blue-500/5', badge: 'bg-blue-500/20 text-blue-400', label: '🔵 Medium' },
  low:      { border: 'border-border/40', bg: 'bg-secondary/20', badge: 'bg-secondary text-muted-foreground', label: '⚪ Low' },
};

export default function HumanActionRequired() {
  const [filter, setFilter] = useState('all');
  const [resolved, setResolved] = useState([]);

  const categories = ['all', ...Array.from(new Set(ACTIONS.map(a => a.category)))];
  const visible = ACTIONS.filter(a =>
    !resolved.includes(a.id) &&
    (filter === 'all' || a.category === filter)
  );
  const criticalCount = ACTIONS.filter(a => a.priority === 'critical' && !resolved.includes(a.id)).length;
  const blockers = ACTIONS.filter(a => a.blocker && !resolved.includes(a.id)).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin OS</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Human Action Required</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Centralised inbox — items that require Gannon's personal attention before the system can proceed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-center px-3 py-2 rounded-xl border border-red-500/40 bg-red-500/5">
            <p className="font-display text-2xl text-red-400">{criticalCount}</p>
            <p className="text-[10px] text-muted-foreground">Critical</p>
          </div>
          <div className="text-center px-3 py-2 rounded-xl border border-primary/30 bg-primary/5">
            <p className="font-display text-2xl text-primary">{blockers}</p>
            <p className="text-[10px] text-muted-foreground">Blockers</p>
          </div>
          <div className="text-center px-3 py-2 rounded-xl border border-border/40">
            <p className="font-display text-2xl text-foreground">{visible.length}</p>
            <p className="text-[10px] text-muted-foreground">Open</p>
          </div>
        </div>
      </div>

      {/* Safety banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/40 bg-amber-500/5">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-muted-foreground">
          <strong className="text-amber-400">Safe Build Mode Active.</strong> No emails, payments, fulfilment, social posts, or Stripe changes will be triggered automatically. Every action on this list requires your personal approval.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all capitalize ${filter === c ? 'bg-primary text-primary-foreground' : 'border border-border/40 text-muted-foreground hover:border-primary/40'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Action list */}
      {visible.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="font-display text-lg text-foreground">All items resolved</p>
          <p className="font-body text-sm text-muted-foreground">Great work — nothing pending in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {['critical', 'high', 'medium', 'low'].map(priority => {
            const items = visible.filter(a => a.priority === priority);
            if (!items.length) return null;
            const s = PRIORITY_STYLES[priority];
            return (
              <div key={priority}>
                <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{s.label}</p>
                <div className="space-y-2">
                  {items.map(a => (
                    <div key={a.id} className={`p-4 rounded-xl border ${s.border} ${s.bg}`}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge className={`text-[9px] border-0 ${s.badge}`}>{a.category}</Badge>
                            {a.blocker && <Badge className="text-[9px] border-0 bg-red-500/20 text-red-400">Blocker</Badge>}
                            <p className="font-body text-sm font-semibold text-foreground">{a.title}</p>
                          </div>
                          <p className="font-body text-xs text-muted-foreground leading-relaxed">{a.detail}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {a.link && (
                            <Link to={a.link}>
                              <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1">
                                <ExternalLink className="w-3 h-3" /> {a.linkLabel}
                              </Button>
                            </Link>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-green-400 hover:text-green-300"
                            onClick={() => setResolved(r => [...r, a.id])}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Done
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setResolved([])}
            className="font-body text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            <RefreshCw className="w-3 h-3 inline mr-1" /> Reset resolved items
          </button>
          <p className="font-body text-[10px] text-muted-foreground/50 mt-1">Note: resolved state is session-only. Items reappear on refresh until DB tracking is added.</p>
        </div>
      )}
    </div>
  );
}