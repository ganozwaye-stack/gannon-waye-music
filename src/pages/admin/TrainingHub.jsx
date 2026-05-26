import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen, Search, ExternalLink, Music, ShoppingBag, Users, DollarSign,
  Heart, Shield, Zap, Brain, Video, AlertTriangle, CheckCircle2,
  Play, Settings, TrendingUp, Eye, Star, Mail, ChevronRight
} from 'lucide-react';

const MODULES = [
  {
    id: 'getting-started',
    category: '🚀 Getting Started',
    color: 'border-primary/30',
    items: [
      { label: 'Main Dashboard', path: '/admin', desc: 'Your command centre — orders, revenue, alerts, system health', icon: Zap, level: 'essential' },
      { label: 'Business Attention Centre', path: '/admin/notifications', desc: 'Every notification, alert, action item — tabbed by category', icon: AlertTriangle, level: 'essential' },
      { label: 'Approval Queue', path: '/admin/approval-queue', desc: 'All agent proposals awaiting your decision — nothing publishes without you', icon: Shield, level: 'essential' },
      { label: "Today's Money Moves", path: '/admin/todays-money-moves', desc: 'AI-prioritised daily revenue actions', icon: Star, level: 'essential' },
      { label: 'Orchestrator Chat', path: '/admin/orchestrator-chat', desc: 'Talk to your AI Orchestrator — brief it, direct it, ask anything', icon: Brain, level: 'essential' },
    ],
  },
  {
    id: 'music',
    category: '🎵 Music Management',
    color: 'border-blue-500/30',
    items: [
      { label: 'Releases', path: '/admin/releases', desc: 'Add/edit songs, albums, EPs. Control lyrics, artwork, streaming links, is_published.', icon: Music, level: 'essential' },
      { label: 'Current Single', path: '/current-single', desc: 'Public page for Thankyou — artwork, YouTube embed, streaming links, story', icon: Music, level: 'essential' },
      { label: 'Release Countdown', path: '/admin/release-countdown', desc: 'Set release date, trigger countdowns, toggle reveals', icon: Music, level: 'standard' },
      { label: 'Music Command Centre', path: '/admin/music-command', desc: 'Master view — releases, sync licensing, streaming, distribution', icon: Music, level: 'standard' },
      { label: 'Release Sprint', path: '/admin/release-sprint', desc: '11-day social content sprint — June 5 Thankyou campaign', icon: Play, level: 'standard' },
      { label: 'Distributors', path: '/admin/distributors', desc: 'TuneCore, DistroKid, other distributor connections', icon: ExternalLink, level: 'advanced' },
      { label: 'Sync Licensing Command', path: '/admin/sync-licensing-command', desc: 'Music supervisor pitching, publishing deals, catalogue readiness', icon: DollarSign, level: 'advanced' },
    ],
  },
  {
    id: 'store',
    category: '🛒 Store & Commerce',
    color: 'border-green-500/30',
    items: [
      { label: 'Orders', path: '/admin/orders', desc: 'Fulfil orders, check status, send receipts, manage cancellations', icon: ShoppingBag, level: 'essential' },
      { label: 'Products', path: '/admin/merch', desc: 'Add/edit products, multi-image gallery, pricing, stock', icon: ShoppingBag, level: 'essential' },
      { label: 'Promo Codes', path: '/admin/promo-codes', desc: 'Create and audit discount codes — includes safety audit tool', icon: DollarSign, level: 'standard' },
      { label: 'Merch Financials', path: '/admin/merch-financials', desc: 'Profit margins, cost per unit, total profit analysis', icon: DollarSign, level: 'standard' },
      { label: 'Shipping Rates', path: '/admin/shipping-rates', desc: 'Australia vs International rates, free shipping thresholds', icon: ShoppingBag, level: 'standard' },
      { label: 'Order Profit Intelligence', path: '/admin/order-profit-intelligence', desc: 'P&L breakdown per order, profit/loss tracking', icon: TrendingUp, level: 'advanced' },
      { label: 'Bundle Proposal Studio', path: '/admin/bundle-proposal-studio', desc: 'AI-generated bundle offers — approval-gated before going live', icon: Star, level: 'advanced' },
      { label: 'Offer Engine', path: '/admin/offer-engine', desc: 'Active bundle offers, limited-time campaigns', icon: Zap, level: 'advanced' },
      { label: 'Stripe Command Centre', path: '/admin/stripe-command-centre', desc: 'Stripe events, webhook health, payment diagnostics, sales history', icon: DollarSign, level: 'advanced' },
      { label: 'Payment Diagnostics', path: '/admin/payment-diagnostics', desc: 'Failed payments, disputes, refunds, reconciliation issues', icon: AlertTriangle, level: 'advanced' },
    ],
  },
  {
    id: 'social',
    category: '📱 Social Media',
    color: 'border-purple-500/30',
    items: [
      { label: 'Social Asset Library', path: '/admin/social-asset-library', desc: 'All video/image assets for release sprint — upload, tag, track', icon: Video, level: 'essential' },
      { label: 'Content Quality Review', path: '/admin/content-quality-review', desc: 'AI quality scoring for each post — hook, authenticity, timing', icon: Eye, level: 'essential' },
      { label: 'Social Schedule Queue', path: '/admin/social-schedule-queue', desc: 'Posts approved and queued for Metricool scheduling', icon: Play, level: 'essential' },
      { label: 'Metricool Command', path: '/admin/metricool-command', desc: 'Social scheduling HQ — API connected, human-in-the-loop', icon: TrendingUp, level: 'standard' },
      { label: 'Social Post Factory', path: '/admin/social-post-factory', desc: 'AI-generate post copy, captions, hashtags for each platform', icon: Zap, level: 'standard' },
      { label: 'TikTok Recording Studio', path: '/admin/tiktok-recording-studio', desc: 'Screen recording guide for TikTok developer review demo', icon: Video, level: 'standard' },
      { label: 'TikTok Platform Review (Admin)', path: '/admin/tiktok-review', desc: 'OAuth connection, review submission readiness, draft upload status', icon: Video, level: 'advanced' },
      { label: 'Social Analytics Command', path: '/admin/social-analytics-command', desc: 'Track social metrics across TikTok, Instagram, YouTube', icon: TrendingUp, level: 'advanced' },
    ],
  },
  {
    id: 'fans',
    category: '❤️ Community & Fans',
    color: 'border-pink-500/30',
    items: [
      { label: 'Subscribers', path: '/admin/subscribers', desc: 'Email list management — supporters, VIPs, all segments', icon: Mail, level: 'essential' },
      { label: 'Fan Management', path: '/admin/fans', desc: 'Moderate community posts, approve/reject fan content', icon: Users, level: 'essential' },
      { label: 'Newsletter', path: '/admin/newsletter', desc: 'Send emails to subscribers — release alerts, special offers', icon: Mail, level: 'essential' },
      { label: 'Birthday Discounts', path: '/admin/birthdays', desc: 'Automated birthday campaigns — 10% off for fans on their birthday', icon: Heart, level: 'standard' },
      { label: 'Gift Claims', path: '/admin/gift-claims', desc: 'Family hoodie gift claims — verification and fulfilment', icon: Heart, level: 'standard' },
      { label: 'Fan Media', path: '/admin/fan-media', desc: 'Fan-uploaded photos/videos — review and approve for community', icon: Video, level: 'standard' },
      { label: 'Thank You Cards', path: '/admin/thank-you-cards', desc: 'Add personal thank-you cards to orders', icon: Heart, level: 'standard' },
      { label: 'Merch Feedback Admin', path: '/admin/merch-feedback', desc: 'Customer feedback on merch quality, sizing, design', icon: Eye, level: 'advanced' },
    ],
  },
  {
    id: 'finance',
    category: '💰 Finance & Business',
    color: 'border-yellow-500/30',
    items: [
      { label: 'Financial Dashboard', path: '/admin/financials', desc: 'Revenue, profit, GST, monthly totals', icon: DollarSign, level: 'essential' },
      { label: 'Weekly Money Report', path: '/admin/weekly-money-report', desc: 'Auto-generated weekly income/expense summary with AI recommendations', icon: DollarSign, level: 'essential' },
      { label: 'Charity Tracking', path: '/admin/charity-tracking', desc: 'Track 10% donations to 1800RESPECT — monthly records', icon: Heart, level: 'standard' },
      { label: 'Business Worth Command', path: '/admin/business-worth-command', desc: 'Estimated business value, asset valuation, growth trajectory', icon: TrendingUp, level: 'advanced' },
      { label: 'Intelligence to Income', path: '/admin/intelligence-to-income', desc: 'AI income opportunities — ranked by profit potential', icon: Brain, level: 'advanced' },
      { label: 'Supporters', path: '/admin/supporters', desc: 'View all supporters, contribution history, VIP status', icon: Users, level: 'advanced' },
    ],
  },
  {
    id: 'agents',
    category: '🤖 AI Agents',
    color: 'border-cyan-500/30',
    items: [
      { label: 'Agent Registry', path: '/admin/agent-registry', desc: '15+ AI agents — what each does, risk level, how to activate, readiness checklist', icon: Brain, level: 'essential' },
      { label: 'Agent Capability Matrix', path: '/admin/agent-capability-matrix', desc: 'Complete capability map — what each agent can and cannot do', icon: Brain, level: 'standard' },
      { label: 'Agent Task Log', path: '/admin/agent-task-log', desc: 'All agent actions — what ran, when, outcome', icon: Eye, level: 'standard' },
      { label: 'Agent Intelligence', path: '/admin/agent-intelligence', desc: 'Agent IQ scores, learning records, improvement tracking', icon: Brain, level: 'advanced' },
      { label: 'Agent Learning', path: '/admin/agent-learning', desc: 'What the agents learned, what worked, what failed', icon: BookOpen, level: 'advanced' },
      { label: 'Autonomous Ops', path: '/admin/autonomous-ops', desc: 'Automation loops, scheduled agent tasks, self-healing status', icon: Zap, level: 'advanced' },
      { label: 'Knowledge Vault', path: '/admin/knowledge-vault', desc: 'Agent memory store — insights, intelligence, stored context', icon: BookOpen, level: 'advanced' },
      { label: 'Revenue Actions', path: '/admin/revenue-actions', desc: 'Agent revenue proposals — review and approve income-generating actions', icon: DollarSign, level: 'essential' },
    ],
  },
  {
    id: 'systems',
    category: '⚙️ System & Security',
    color: 'border-red-500/30',
    items: [
      { label: 'Site Health Dashboard', path: '/admin/site-health', desc: 'Overall system health — integrations, functions, data status', icon: Shield, level: 'essential' },
      { label: 'Webhook Health', path: '/admin/webhook-health', desc: 'Stripe webhook status, failed events, signature errors', icon: AlertTriangle, level: 'standard' },
      { label: 'Integration Completion Centre', path: '/admin/integration-completion-centre', desc: 'All integrations — what is connected, what is missing', icon: Settings, level: 'standard' },
      { label: 'API Setup', path: '/admin/api-setup', desc: 'External API configuration — Metricool, TikTok, Stripe, Gmail', icon: Settings, level: 'standard' },
      { label: 'Security Centre', path: '/admin/security-centre', desc: 'Secrets status, access logs, risk monitoring', icon: Shield, level: 'standard' },
      { label: 'Go-Live Checklist', path: '/admin/go-live', desc: 'Pre-launch verification across all systems — launch readiness %', icon: CheckCircle2, level: 'essential' },
      { label: 'Risk Alerts', path: '/admin/risk-alerts', desc: 'Open risk items — financial, legal, reputation, data', icon: AlertTriangle, level: 'standard' },
      { label: 'System Blueprint', path: '/admin/system-blueprint', desc: 'Full system map — all routes, functions, integrations, entities', icon: BookOpen, level: 'advanced' },
    ],
  },
  {
    id: 'qa',
    category: '🧪 QA & Developer',
    color: 'border-orange-500/30',
    items: [
      { label: 'QA Command Centre', path: '/admin/qa-command-centre', desc: 'Route catalogue, test results, Playwright test pack', icon: Eye, level: 'advanced' },
      { label: 'Developer Handoff', path: '/admin/developer-handoff', desc: 'Full docs, Cursor/Codex/Claude task packs, known blockers', icon: BookOpen, level: 'advanced' },
      { label: 'Playwright Test Centre', path: '/admin/playwright-test-centre', desc: 'Download browser test suite — run against gannonwaye.com', icon: Play, level: 'advanced' },
      { label: 'Site Function Audit', path: '/admin/site-function-audit', desc: 'Audit all admin functions — clickability, data, dead-ends', icon: Eye, level: 'advanced' },
    ],
  },
];

const LEVEL_CONFIG = {
  essential: { label: 'Essential', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  standard: { label: 'Standard', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  advanced: { label: 'Advanced', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

const SECURITY_ALERTS = [
  { label: '🔴 ROTATE Stripe webhook secret', desc: 'Was exposed in AI output 26 May 2026. Go to dashboard.stripe.com/webhooks → roll signing secret → paste NEW value into Base44 Secrets only.', link: 'https://dashboard.stripe.com/webhooks', urgent: true },
  { label: '⚠ Check TikTok client_key for leading space', desc: 'TIKTOK_CLIENT_KEY may have a leading space causing OAuth failures. Re-enter in Base44 Secrets without spaces.', link: '/admin/api-setup', urgent: false },
  { label: '⚠ Rotate TIKTOK_CLIENT_SECRET', desc: 'May have been visible in prior sessions. Rotate in TikTok developer portal and re-enter in Base44 Secrets.', link: 'https://developers.tiktok.com', urgent: false },
];

export default function TrainingHub() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [expandedCat, setExpandedCat] = useState({});
  const [dismissedAlerts, setDismissedAlerts] = useState({});

  const toggleCat = (id) => setExpandedCat(p => ({ ...p, [id]: !p[id] }));

  const filtered = MODULES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => {
      const matchesSearch = !search ||
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter === 'all' || item.level === levelFilter;
      return matchesSearch && matchesLevel;
    }),
  })).filter(cat => cat.items.length > 0);

  const totalItems = MODULES.reduce((a, c) => a + c.items.length, 0);
  const essentialCount = MODULES.reduce((a, c) => a + c.items.filter(i => i.level === 'essential').length, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Training Hub</h1>
        <p className="text-muted-foreground text-sm mt-1">{totalItems} modules across {MODULES.length} categories · Start with {essentialCount} Essential items</p>
      </div>

      {/* Security Alerts */}
      <div className="space-y-2">
        {SECURITY_ALERTS.filter((_, i) => !dismissedAlerts[i]).map((alert, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${alert.urgent ? 'border-red-500/40 bg-red-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${alert.urgent ? 'text-red-400' : 'text-yellow-400'}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${alert.urgent ? 'text-red-300' : 'text-yellow-300'}`}>{alert.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
              <a href={alert.link.startsWith('/') ? undefined : alert.link} href={alert.link} target={alert.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="mt-2 text-xs gap-1">
                  <ExternalLink className="w-3 h-3" />Take Action
                </Button>
              </a>
            </div>
            <button onClick={() => setDismissedAlerts(p => ({ ...p, [i]: true }))} className="text-xs text-muted-foreground hover:text-foreground shrink-0">✕</button>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Dashboard', path: '/admin', icon: Zap, color: 'text-primary' },
          { label: 'Notifications', path: '/admin/notifications', icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Approval Queue', path: '/admin/approval-queue', icon: Shield, color: 'text-yellow-400' },
          { label: 'Orchestrator Chat', path: '/admin/orchestrator-chat', icon: Brain, color: 'text-cyan-400' },
        ].map(link => {
          const Icon = link.icon;
          return (
            <Link key={link.path} to={link.path}>
              <Button variant="outline" className="w-full gap-2 h-12 rounded-xl">
                <Icon className={`w-4 h-4 ${link.color}`} />
                <span className="text-sm">{link.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search modules... (e.g. 'TikTok', 'orders', 'agent')"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'essential', 'standard', 'advanced'].map(l => (
            <Button key={l} size="sm" variant={levelFilter === l ? 'default' : 'outline'} onClick={() => setLevelFilter(l)} className="capitalize">
              {l === 'all' ? 'All Levels' : LEVEL_CONFIG[l]?.label || l}
            </Button>
          ))}
        </div>
      </div>

      {/* Module Categories */}
      <div className="space-y-3">
        {filtered.map(cat => {
          const isExpanded = expandedCat[cat.id] !== false; // default open
          return (
            <Card key={cat.id} className={`border ${cat.color}`}>
              <CardHeader
                className="pb-3 cursor-pointer"
                onClick={() => toggleCat(cat.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{cat.category}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{cat.items.length} modules</Badge>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {cat.items.map(item => {
                      const Icon = item.icon;
                      const lvl = LEVEL_CONFIG[item.level];
                      return (
                        <Link key={item.path} to={item.path}>
                          <div className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/20 transition-all h-full">
                            <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <p className="text-sm font-medium group-hover:text-primary transition-colors">{item.label}</p>
                                <Badge className={`text-[10px] border ${lvl.color}`}>{lvl.label}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Coaching private notice */}
      <Card className="border-purple-500/20 bg-purple-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-purple-300 text-sm">Coaching System — Private</p>
            <p className="text-xs text-muted-foreground mt-1">
              Coaching is intentionally private (COACHING_PUBLIC_LAUNCH_ENABLED = false). Access the admin-only view at{' '}
              <Link to="/admin/coaching-command" className="text-primary underline">/admin/coaching-command</Link>.{' '}
              Do not make coaching public without completing the 9-gate legal checklist.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}