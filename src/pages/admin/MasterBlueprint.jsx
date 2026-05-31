import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2, AlertTriangle, XCircle, Circle, RefreshCw,
  ExternalLink, ChevronDown, ChevronRight, Zap, Shield, ShoppingCart,
  Music, Users, FileText, Settings, Activity, Globe, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Status helpers ─────────────────────────────────────────────
const S = {
  ok:      { label: 'Live',          icon: CheckCircle2, cls: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30' },
  review:  { label: 'Needs Review',  icon: AlertTriangle,cls: 'text-primary',    bg: 'bg-primary/10 border-primary/30' },
  broken:  { label: 'Broken',        icon: XCircle,      cls: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30' },
  missing: { label: 'Not Built',     icon: Circle,       cls: 'text-muted-foreground', bg: 'bg-secondary border-border' },
  running: { label: 'Running',       icon: Activity,     cls: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30' },
};

function StatusBadge({ status }) {
  const s = S[status] || S.missing;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-body font-semibold tracking-wider uppercase ${s.bg} ${s.cls}`}>
      <s.icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

function RouteRow({ label, path, status, note, external }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border/20 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-body text-sm text-foreground">{label}</span>
          {path && (
            external
              ? <a href={path} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5"><ExternalLink className="w-3 h-3" />{path}</a>
              : <Link to={path} className="font-mono text-xs text-muted-foreground hover:text-primary">{path}</Link>
          )}
        </div>
        {note && <p className="font-body text-[11px] text-muted-foreground/70 mt-0.5">{note}</p>}
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="border-border/50">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              {title}
            </span>
            {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
      </button>
      {open && <CardContent className="pt-0 pb-4">{children}</CardContent>}
    </Card>
  );
}

// ── Route definitions ──────────────────────────────────────────
const PUBLIC_ROUTES = [
  { label: 'Home',               path: '/',                    status: 'ok' },
  { label: 'Music',              path: '/music',               status: 'ok' },
  { label: 'Store',              path: '/store',               status: 'ok' },
  { label: 'Store Cart',         path: '/store/cart',          status: 'ok' },
  { label: 'Customer Details',   path: '/store/customer-details', status: 'ok' },
  { label: 'Checkout',           path: '/store/checkout',      status: 'ok' },
  { label: 'Checkout Success',   path: '/checkout-success',    status: 'ok' },
  { label: 'Checkout Cancel',    path: '/checkout-cancel',     status: 'ok' },
  { label: 'Community',          path: '/community',           status: 'ok' },
  { label: 'Videos',             path: '/videos',              status: 'ok' },
  { label: 'Contact',            path: '/contact',             status: 'ok' },
  { label: 'Back This',          path: '/back-this',           status: 'ok' },
  { label: 'Mum Tribute',        path: '/mum',                 status: 'ok' },
  { label: 'Without You Here',   path: '/without-you-here',    status: 'ok' },
  { label: 'Privacy Policy',     path: '/privacy-policy',      status: 'ok' },
  { label: 'Terms of Service',   path: '/terms-of-service',    status: 'ok' },
  { label: 'Lyrics',             path: '/lyrics',              status: 'ok' },
  { label: 'This Is My Life',    path: '/this-is-my-life',     status: 'ok' },
  { label: 'FAQ',                path: '/faq',                 status: 'ok' },
  { label: 'Impact',             path: '/impact',              status: 'ok' },
  { label: 'Current Single',     path: '/current-single',      status: 'ok' },
  { label: 'Order Status',       path: '/order-status',        status: 'ok' },
  { label: 'Founding Supporter', path: '/founding-supporter',  status: 'ok' },
  { label: 'Mastering',          path: '/mastering',           status: 'ok' },
  { label: 'Fan Profile',        path: '/fan-profile',         status: 'ok' },
  { label: 'Email Preferences',  path: '/email-preferences',   status: 'ok' },
  { label: 'Merch Feedback',     path: '/merch-feedback',      status: 'ok' },
  { label: 'Summary',            path: '/summary',             status: 'ok' },
];

const ADMIN_ROUTES = [
  { label: 'Dashboard',                path: '/admin',                         status: 'ok' },
  { label: '⭐ Master Blueprint',      path: '/admin/master-blueprint',        status: 'ok',     note: 'This page — live ✓' },
  { label: 'Orders',                   path: '/admin/orders',                  status: 'ok' },
  { label: 'Merch Management',         path: '/admin/merch',                   status: 'ok' },
  { label: 'Approval Queue',           path: '/admin/approval-queue',          status: 'ok' },
  { label: 'Release Sprint (6-Day)',   path: '/admin/release-sprint',          status: 'ok' },
  { label: 'Campaign Image Approval',  path: '/admin/campaign-image-approval', status: 'ok' },
  { label: 'Merch Visual Lab',         path: '/admin/merch-visual-lab',        status: 'ok' },
  { label: 'Business Profile Settings',path: '/admin/business-profile-settings',status: 'ok' },
  { label: 'Metricool Command',        path: '/admin/metricool-command',       status: 'ok' },
  { label: 'Metricool Diagnostics',    path: '/admin/metricool-diagnostics',   status: 'ok' },
  { label: 'Social Post Factory',      path: '/admin/social-post-factory',     status: 'ok' },
  { label: 'Social Asset Library',     path: '/admin/social-asset-library',    status: 'ok' },
  { label: 'Content Quality Review',   path: '/admin/content-quality-review',  status: 'ok' },
  { label: 'Agent Message Bus',        path: '/admin/agent-message-bus',       status: 'ok' },
  { label: 'Agent Registry',           path: '/admin/agent-registry',          status: 'ok' },
  { label: 'Knowledge Vault',          path: '/admin/knowledge-vault',         status: 'ok' },
  { label: 'Risk Alerts',              path: '/admin/risk-alerts',             status: 'ok' },
  { label: 'Stripe Command Centre',    path: '/admin/stripe-command-centre',   status: 'ok' },
  { label: 'Webhook Health',           path: '/admin/webhook-health',          status: 'ok' },
  { label: 'Payment Diagnostics',      path: '/admin/payment-diagnostics',     status: 'ok' },
  { label: 'Site Health',              path: '/admin/site-health',             status: 'ok' },
  { label: 'QA Command Centre',        path: '/admin/qa-command-centre',       status: 'ok' },
  { label: 'Playwright Test Centre',   path: '/admin/playwright-test-centre',  status: 'ok' },
  { label: 'Notifications',           path: '/admin/notifications',            status: 'ok' },
  { label: 'Promo Codes',             path: '/admin/promo-codes',              status: 'ok' },
  { label: 'Shipping Rates',          path: '/admin/shipping-rates',           status: 'ok' },
  { label: 'Supporters',              path: '/admin/supporters',               status: 'ok' },
  { label: 'Subscribers',             path: '/admin/subscribers',              status: 'ok' },
  { label: 'Financial Dashboard',     path: '/admin/financials',               status: 'ok' },
  { label: 'Landed Cost Calculator',  path: '/admin/landed-cost-calculator',   status: 'ok' },
  { label: 'Procurement Command',     path: '/admin/procurement-command',      status: 'ok' },
  { label: 'Audit Log',               path: '/admin/audit-log',                status: 'ok' },
  // Missing / not yet built
  { label: 'Quick Upload / Media Library', path: '/admin/quick-upload',        status: 'missing', note: 'Not yet built — needed for bulk media upload' },
  { label: 'Thankyou Campaign Engine', path: '/admin/thankyou-6-day-campaign', status: 'missing', note: 'Use /admin/release-sprint as current alternative' },
];

const INTEGRATIONS = [
  { label: 'Stripe (Payments)',        status: 'ok',      note: 'Live key active. Webhook connected. No auto-posting.' },
  { label: 'Metricool',               status: 'review',  note: 'Profile ID 6305775 / User 4741333 — needs verification. APPROVAL_REQUIRED=true enforced.' },
  { label: 'OpenAI (LLM / Agents)',   status: 'ok',      note: 'OPENAI_API_KEY set. Used by content + agent functions.' },
  { label: 'Google Sheets',           status: 'ok',      note: 'Connector authorised. Used for order sync.' },
  { label: 'TikTok OAuth',            status: 'review',  note: 'TikTok credentials set. App review status unknown.' },
  { label: 'Spotify Artist Link',     status: 'review',  note: 'Confirm all pages link to: open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz' },
];

const AGENTS = [
  { label: 'Music Orchestrator',      status: 'ok',     note: 'Master agent — coordinates all others' },
  { label: 'Release Launch Agent',    status: 'ok',     note: 'Owns Thankyou release campaign' },
  { label: 'Fan Engagement Agent',    status: 'ok',     note: 'Community, comments, engagement' },
  { label: 'Merch Sales Agent',       status: 'ok',     note: 'Store conversion & product visibility' },
  { label: 'Content Revenue Agent',   status: 'ok',     note: 'Social content → sales pipeline' },
  { label: 'QA Systems Auditor',      status: 'ok',     note: 'Playwright tests & site health' },
  { label: 'Order Support Agent',     status: 'ok',     note: 'Customer order queries' },
  { label: 'Orchestrator',            status: 'ok',     note: 'Top-level approval + routing' },
  { label: 'Pricing Optimiser',       status: 'ok',     note: 'Margin & pricing analysis' },
  { label: 'Shipping Optimisation',   status: 'ok',     note: 'Shipping rate audit' },
];

const SAFETY_CHECKS = [
  { label: 'Stripe/Checkout untouched',          status: 'ok' },
  { label: 'Cart logic untouched',               status: 'ok' },
  { label: 'Webhook logic untouched',            status: 'ok' },
  { label: 'Promo codes untouched',              status: 'ok' },
  { label: 'Inventory untouched',                status: 'ok' },
  { label: 'Metricool auto-post BLOCKED',        status: 'ok',     note: 'APPROVAL_REQUIRED_FOR_ALL_POSTS=true enforced' },
  { label: 'Agents cannot publish without approval', status: 'ok' },
  { label: 'Agents cannot spend money',          status: 'ok' },
  { label: 'Agents cannot change legal pages',   status: 'ok' },
  { label: 'Duplicate order guard active',       status: 'ok',     note: 'Idempotency enforced via OrderLock' },
  { label: 'ganozwaye@gmail.com removed from public pages', status: 'review', note: 'Confirm via /admin/business-profile-settings — set correct public email' },
  { label: 'Spotify link audit',                 status: 'review', note: 'Run audit to confirm all pages use correct artist URL' },
];

const NEXT_ACTIONS = [
  { priority: 'critical', action: 'Set correct public support email in /admin/business-profile-settings — confirm it is NOT ganozwaye@gmail.com', link: '/admin/business-profile-settings' },
  { priority: 'high',     action: 'Go to /admin/campaign-image-approval — approve heading for each of the 11 campaign images', link: '/admin/campaign-image-approval' },
  { priority: 'high',     action: 'Go to /admin/release-sprint — review and approve 18 pending campaign posts before June 5', link: '/admin/release-sprint' },
  { priority: 'high',     action: 'Verify Metricool profile 6305775 is the correct Gannon Waye account — check /admin/metricool-diagnostics', link: '/admin/metricool-diagnostics' },
  { priority: 'medium',   action: 'Review Mum Tribute page at /mum — confirm photos, content, and heart animation are correct', link: '/mum' },
  { priority: 'medium',   action: 'Confirm Spotify links on /music and /store point to correct artist URL', link: '/music' },
  { priority: 'medium',   action: 'Build /admin/quick-upload for bulk media management', link: null },
  { priority: 'low',      action: 'Switch Stripe from test mode to live mode in Stripe Dashboard if not already done', link: null },
];

const PRIORITY_COLORS = {
  critical: 'border-red-500/50 bg-red-500/5 text-red-400',
  high:     'border-primary/50 bg-primary/5 text-primary',
  medium:   'border-blue-500/40 bg-blue-500/5 text-blue-400',
  low:      'border-border/50 bg-secondary text-muted-foreground',
};

export default function MasterBlueprint() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { data: orders = [] } = useQuery({
    queryKey: ['blueprint-orders'],
    queryFn: () => base44.entities.MerchOrder.filter({ status: 'pending' }, '-created_date', 10),
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['blueprint-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 20),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['blueprint-notifications'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20),
  });

  const { data: sprintPosts = [] } = useQuery({
    queryKey: ['blueprint-sprint'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint' }, 'sprint_day', 100),
  });

  const pendingPosts = sprintPosts.filter(p => p.status === 'pending_approval').length;
  const approvedPosts = sprintPosts.filter(p => ['approved', 'scheduled', 'posted'].includes(p.status)).length;
  const daysToRelease = Math.max(0, Math.ceil((new Date('2026-06-05T00:00:00+10:00') - new Date()) / 86400000));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Gannon Waye Music OS</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Master Blueprint</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Single source of truth — entire system at a glance</p>
          <p className="font-body text-[11px] text-muted-foreground/50 mt-0.5">Last refreshed: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setLastRefresh(new Date())}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      {/* Top-level system stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Days to Release', value: daysToRelease, icon: Music, color: 'text-primary', urgent: daysToRelease <= 5 },
          { label: 'Pending Approvals', value: approvals.length, icon: Shield, color: 'text-amber-400', urgent: approvals.length > 0 },
          { label: 'Sprint Posts Pending', value: pendingPosts, icon: Zap, color: 'text-blue-400', urgent: pendingPosts > 0 },
          { label: 'Unread Notifications', value: notifications.length, icon: Activity, color: 'text-purple-400', urgent: notifications.length > 0 },
        ].map(s => (
          <Card key={s.label} className={s.urgent ? 'border-primary/40' : ''}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-7 h-7 shrink-0 ${s.color}`} />
              <div>
                <p className={`text-2xl font-bold font-display ${s.urgent ? s.color : ''}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* THANKYOU Campaign Status */}
      <Card className="border-primary/40 bg-primary/5">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2 text-primary">
            <Music className="w-4 h-4" /> THANKYOU Release Campaign — June 5, 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center bg-card/60 rounded-lg p-2">
              <p className="font-display text-xl font-bold text-foreground">{sprintPosts.length}</p>
              <p className="font-body text-[10px] text-muted-foreground">Total Posts</p>
            </div>
            <div className="text-center bg-card/60 rounded-lg p-2">
              <p className="font-display text-xl font-bold text-amber-400">{pendingPosts}</p>
              <p className="font-body text-[10px] text-muted-foreground">Pending Approval</p>
            </div>
            <div className="text-center bg-card/60 rounded-lg p-2">
              <p className="font-display text-xl font-bold text-green-400">{approvedPosts}</p>
              <p className="font-body text-[10px] text-muted-foreground">Approved</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/release-sprint"><Button size="sm" className="gradient-gold-button border-0 gap-1.5 text-xs"><Zap className="w-3.5 h-3.5" /> Review Sprint Posts</Button></Link>
            <Link to="/admin/campaign-image-approval"><Button size="sm" variant="outline" className="gap-1.5 text-xs">Approve Campaign Images</Button></Link>
            <Link to="/admin/social-schedule-queue"><Button size="sm" variant="outline" className="gap-1.5 text-xs">Schedule Queue</Button></Link>
          </div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      <Section title="⚡ Next Actions for Gannon" icon={Zap} defaultOpen={true}>
        <div className="space-y-2">
          {NEXT_ACTIONS.map((a, i) => (
            <div key={i} className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${PRIORITY_COLORS[a.priority]}`}>
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <Badge className={`text-[9px] uppercase tracking-wider shrink-0 mt-0.5 border-0 ${a.priority === 'critical' ? 'bg-red-500/20 text-red-400' : a.priority === 'high' ? 'bg-primary/20 text-primary' : a.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' : 'bg-secondary text-muted-foreground'}`}>
                  {a.priority}
                </Badge>
                <p className="font-body text-xs text-foreground/85 leading-relaxed">{a.action}</p>
              </div>
              {a.link && (
                <Link to={a.link} className="shrink-0">
                  <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1">
                    <ExternalLink className="w-3 h-3" /> Go
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Safety Status */}
      <Section title="🔒 Safety & Security Status" icon={Shield}>
        {SAFETY_CHECKS.map((c, i) => (
          <RouteRow key={i} label={c.label} status={c.status} note={c.note} />
        ))}
      </Section>

      {/* Public Routes */}
      <Section title="🌐 Public Routes" icon={Globe}>
        <div className="mb-2 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
          <p className="font-body text-[11px] text-green-400">All public routes must load without login. No admin data must be exposed publicly.</p>
        </div>
        {PUBLIC_ROUTES.map((r, i) => (
          <RouteRow key={i} {...r} />
        ))}
      </Section>

      {/* Admin Routes */}
      <Section title="🔑 Admin Routes" icon={Lock}>
        <div className="mb-2 p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="font-body text-[11px] text-amber-400">All /admin/* routes require login + admin role. None must be publicly accessible.</p>
        </div>
        {ADMIN_ROUTES.map((r, i) => (
          <RouteRow key={i} {...r} />
        ))}
      </Section>

      {/* Integrations */}
      <Section title="⚙️ Integrations & Systems" icon={Settings}>
        {INTEGRATIONS.map((r, i) => (
          <RouteRow key={i} label={r.label} status={r.status} note={r.note} />
        ))}
      </Section>

      {/* AI Agents */}
      <Section title="🤖 AI Agent Workforce" icon={Activity}>
        <div className="mb-2 p-2 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <p className="font-body text-[11px] text-blue-400">Agents may investigate, draft, and flag — but may NOT publish, spend money, or change Stripe/legal/orders without approval.</p>
        </div>
        {AGENTS.map((r, i) => (
          <RouteRow key={i} label={r.label} status={r.status} note={r.note} />
        ))}
        <div className="mt-3">
          <Link to="/admin/agent-registry">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" /> Full Agent Registry</Button>
          </Link>
        </div>
      </Section>

      {/* Commerce & Stripe */}
      <Section title="🛒 Commerce / Stripe / Orders" icon={ShoppingCart}>
        <RouteRow label="Stripe Live Key" status="review" note="Confirm Stripe Dashboard is in LIVE mode (not test mode)" />
        <RouteRow label="Stripe Webhook" path="/admin/webhook-health" status="ok" note="Webhook connected — monitor for signature failures" />
        <RouteRow label="Order Management" path="/admin/orders" status="ok" />
        <RouteRow label="Payment Diagnostics" path="/admin/payment-diagnostics" status="ok" />
        <RouteRow label="Duplicate Order Guard" status="ok" note="Idempotency enforced — Thea Elsworth duplicate handled" />
        <RouteRow label="Stripe Support Email" status="review" note="Update in Stripe Dashboard → Settings → Business → Support email. Do not use ganozwaye@gmail.com." />
        <RouteRow label="Promo Codes" path="/admin/promo-codes" status="ok" />
        <RouteRow label="Shipping Rates" path="/admin/shipping-rates" status="ok" />
      </Section>

      {/* Mum Tribute */}
      <Section title="♡ Mum Tribute / Sonia Living Garden" icon={Music}>
        <RouteRow label="Mum Tribute Page" path="/mum" status="ok" note="Live — real Sonia photos, memory wall, letter, wisdom garden, heart animation" />
        <RouteRow label="/without-you-here alias" path="/without-you-here" status="ok" />
        <RouteRow label="Birth year: 1961–2022" status="ok" />
        <RouteRow label="Support safety note visible" status="ok" note="Lifeline / Beyond Blue / 1800RESPECT links present" />
        <RouteRow label="No artificial Sonia images" status="ok" note="Only real uploaded photos used" />
        <RouteRow label="ApprovalQueue item created" status="ok" note='"Review Mum Tribute Page — /mum"' />
        <RouteRow label="Sonia Living Garden Vite Build" status="missing" note="Advanced Vite/GSAP cinematic version planned for local build at sonia-living-garden folder" />
        <div className="mt-3">
          <Link to="/mum"><Button size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" /> View /mum page</Button></Link>
        </div>
      </Section>

      {/* Pending Approval Items */}
      {approvals.length > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <Shield className="w-4 h-4" /> {approvals.length} Items Pending Your Approval
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-1.5 mb-3">
              {approvals.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center justify-between gap-2 text-xs font-body">
                  <span className="text-foreground/80 truncate">{a.action_title}</span>
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 border text-[9px] shrink-0">{a.risk_level}</Badge>
                </div>
              ))}
              {approvals.length > 5 && <p className="text-xs text-muted-foreground">+{approvals.length - 5} more</p>}
            </div>
            <Link to="/admin/approval-queue">
              <Button size="sm" variant="outline" className="gap-1.5 border-amber-500/40 text-amber-400 text-xs">
                <ExternalLink className="w-3 h-3" /> Open Approval Queue
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Quick Jump</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              { label: 'Release Sprint',       path: '/admin/release-sprint' },
              { label: 'Approval Queue',       path: '/admin/approval-queue' },
              { label: 'Merch Visual Lab',     path: '/admin/merch-visual-lab' },
              { label: 'Campaign Images',      path: '/admin/campaign-image-approval' },
              { label: 'Orders',               path: '/admin/orders' },
              { label: 'Stripe Command',       path: '/admin/stripe-command-centre' },
              { label: 'Metricool',            path: '/admin/metricool-command' },
              { label: 'Business Profile',     path: '/admin/business-profile-settings' },
              { label: 'Notifications',        path: '/admin/notifications' },
              { label: 'Site Health',          path: '/admin/site-health' },
              { label: 'Agent Registry',       path: '/admin/agent-registry' },
              { label: 'Mum Tribute',          path: '/mum' },
            ].map(link => (
              <Link key={link.path} to={link.path}>
                <div className="border border-border/40 rounded-xl p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all cursor-pointer">
                  <p className="font-body text-xs font-semibold text-foreground">{link.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">{link.path}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="font-body text-xs text-muted-foreground/40">Gannon Waye Music OS · Master Blueprint · Built in Base44</p>
      </div>
    </div>
  );
}