import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe, Zap, Bot, Link2, Shield,
  ChevronRight, ShoppingBag, Users, BarChart2,
  Package, ExternalLink, CheckCircle2, AlertTriangle
} from 'lucide-react';

const PUBLIC_ROUTES = [
  { path: '/', name: 'Home', description: 'Landing page — hero, merch teaser, countdown, fan activity' },
  { path: '/music', name: 'Music', description: 'Releases, lyrics, streaming links' },
  { path: '/store', name: 'Store', description: 'Merch products, cart, checkout' },
  { path: '/community', name: 'Community', description: 'Fan posts, replies, likes' },
  { path: '/videos', name: 'Videos', description: 'Music videos, YouTube embeds' },
  { path: '/current-single', name: 'Current Single', description: '"Thank You" — behind story, lyrics, links' },
  { path: '/back-this', name: 'Back This', description: 'Fan support / subscription page' },
  { path: '/bookings', name: 'Bookings', description: 'Booking enquiry form' },
  { path: '/about', name: 'About', description: 'Artist profile page' },
  { path: '/this-is-my-life', name: 'This Is My Life', description: 'Artist story page' },
  { path: '/lyrics', name: 'Lyrics', description: 'All lyrics browser' },
  { path: '/faq', name: 'FAQ', description: 'Common questions' },
  { path: '/impact', name: 'Impact', description: 'Community impact / charity' },
  { path: '/contact', name: 'Contact', description: 'Contact form' },
  { path: '/privacy-policy', name: 'Privacy Policy', description: 'Legal — privacy' },
  { path: '/terms-of-service', name: 'Terms of Service', description: 'Legal — ToS' },
  { path: '/order-status', name: 'Order Status', description: 'Fan order lookup' },
  { path: '/mastering', name: 'Mastering', description: 'Mastering services page' },
  { path: '/email-preferences', name: 'Email Preferences', description: 'Unsubscribe / manage comms' },
  { path: '/tiktok-callback', name: 'TikTok Callback', description: 'OAuth return route — admin only use' },
  { path: '/tiktok-platform-review', name: 'TikTok Platform Review', description: 'TikTok submission documentation' },
];

const ADMIN_SECTIONS = [
  {
    section: 'Executive',
    routes: [
      { path: '/admin', name: 'Dashboard' },
      { path: '/admin/notifications', name: 'Notifications' },
      { path: '/admin/approval-queue', name: 'Approval Queue' },
      { path: '/admin/executive-feed', name: 'Executive Feed' },
      { path: '/admin/audit-log', name: 'Audit Log' },
      { path: '/admin/command-centre', name: 'Command Centre' },
      { path: '/admin/go-live', name: 'Go-Live Checklist' },
      { path: '/admin/growth-engine', name: 'Growth Engine' },
      { path: '/admin/risk-alerts', name: 'Risk Alerts' },
      { path: '/admin/site-health', name: 'Site Health' },
      { path: '/admin/todays-money-moves', name: "Today's Money Moves" },
      { path: '/admin/orchestrator-chat', name: 'Orchestrator AI' },
    ],
  },
  {
    section: 'Commerce',
    routes: [
      { path: '/admin/orders', name: 'Orders' },
      { path: '/admin/order-profit-intelligence', name: 'Order Profit Intelligence' },
      { path: '/admin/merch', name: 'Products' },
      { path: '/admin/promo-codes', name: 'Promo Codes' },
      { path: '/admin/promo-code-audit', name: 'Promo Code Audit' },
      { path: '/admin/bundle-proposal-studio', name: 'Bundle Proposal Studio' },
      { path: '/admin/content-to-cash', name: 'Content to Cash' },
      { path: '/admin/ecommerce-command', name: 'Ecommerce Command' },
      { path: '/admin/fan-conversion-engine', name: 'Fan Conversion Engine' },
      { path: '/admin/merch-financials', name: 'Merch Financials' },
      { path: '/admin/offer-engine', name: 'Offer Engine' },
      { path: '/admin/product-insights', name: 'Product Insights' },
      { path: '/admin/revenue-actions', name: 'Revenue Actions' },
      { path: '/admin/revenue-command', name: 'Revenue Command' },
      { path: '/admin/shipping-rates', name: 'Shipping Rates' },
      { path: '/admin/stripe-live-report', name: 'Stripe Live Report' },
      { path: '/admin/stripe-command-centre', name: 'Stripe Command Centre' },
      { path: '/admin/webhook-health', name: 'Webhook Health' },
      { path: '/admin/payment-diagnostics', name: 'Payment Diagnostics' },
      { path: '/admin/weekly-money-report', name: 'Weekly Money Report' },
    ],
  },
  {
    section: 'Social & Content',
    routes: [
      { path: '/admin/metricool-command', name: 'Metricool Command' },
      { path: '/admin/metricool-api-setup', name: 'Metricool API Setup' },
      { path: '/admin/metricool-media-pipeline', name: 'Metricool Media Pipeline' },
      { path: '/admin/metricool-scheduler-queue', name: 'Metricool Scheduler Queue' },
      { path: '/admin/metricool-performance-intelligence', name: 'Metricool Performance Intel' },
      { path: '/admin/social-asset-library', name: 'Social Asset Library' },
      { path: '/admin/social-post-factory', name: 'Social Post Factory' },
      { path: '/admin/content-quality-review', name: 'Content Quality Review' },
      { path: '/admin/social-schedule-queue', name: 'Social Schedule Queue' },
      { path: '/admin/content-performance', name: 'Content Performance' },
      { path: '/admin/social-content', name: 'Social Content Generator' },
      { path: '/admin/release-sprint', name: 'Release Sprint' },
      { path: '/admin/release-promo-command', name: 'Release Promo Command' },
      { path: '/admin/tiktok-review', name: 'TikTok App Review' },
      { path: '/admin/tiktok-recording-studio', name: 'TikTok Recording Studio' },
      { path: '/admin/social-analytics-command', name: 'Social Analytics' },
      { path: '/admin/social-intelligence', name: 'Social Intelligence' },
      { path: '/admin/trend-monitor', name: 'Trend Monitor' },
    ],
  },
  {
    section: 'Intelligence & Agents',
    routes: [
      { path: '/admin/agent-intelligence', name: 'Agent Intelligence' },
      { path: '/admin/agent-capability-matrix', name: 'Agent Capability Matrix' },
      { path: '/admin/agent-registry', name: 'Agent Registry' },
      { path: '/admin/agent-task-log', name: 'Agent Task Log' },
      { path: '/admin/agent-learning', name: 'Agent Learning' },
      { path: '/admin/knowledge-vault', name: 'Knowledge Vault' },
      { path: '/admin/research-grid', name: 'Research Grid' },
      { path: '/admin/research-hub', name: 'Research Hub' },
      { path: '/admin/memory-graph', name: 'Memory Graph' },
      { path: '/admin/ideas-engine', name: 'Ideas Engine' },
      { path: '/admin/autonomous-ops', name: 'Autonomous Ops' },
      { path: '/admin/az-index', name: 'A-Z Index' },
      { path: '/admin/agent-tool-registry', name: 'Agent Tool Registry' },
    ],
  },
  {
    section: 'Operations & Music',
    routes: [
      { path: '/admin/releases', name: 'Releases' },
      { path: '/admin/music-command', name: 'Music Command' },
      { path: '/admin/release-countdown', name: 'Release Countdown' },
      { path: '/admin/videos', name: 'Video Management' },
      { path: '/admin/mastering', name: 'Mastering Admin' },
      { path: '/admin/sync-licensing-command', name: 'Sync Licensing' },
      { path: '/admin/distributors', name: 'Distributors' },
      { path: '/admin/tunecore', name: 'Tunecore' },
      { path: '/admin/bookings', name: 'Bookings' },
      { path: '/admin/operational-status', name: 'Operational Status' },
      { path: '/admin/self-healing', name: 'Self Healing' },
      { path: '/admin/api-setup', name: 'API Setup' },
    ],
  },
  {
    section: 'Community & Fans',
    routes: [
      { path: '/admin/fans', name: 'Fan Management' },
      { path: '/admin/subscribers', name: 'Subscribers' },
      { path: '/admin/newsletter', name: 'Subscriber Newsletter' },
      { path: '/admin/fan-media', name: 'Fan Media' },
      { path: '/admin/gift-claims', name: 'Gift Claims' },
      { path: '/admin/gift-progress', name: 'Gift Progress' },
      { path: '/admin/gift-verification', name: 'Gift Verification' },
      { path: '/admin/merch-feedback', name: 'Merch Feedback' },
      { path: '/admin/birthdays', name: 'Birthday Discounts' },
      { path: '/admin/supporters', name: 'Supporters' },
      { path: '/admin/thank-you-cards', name: 'Thank You Cards' },
    ],
  },
  {
    section: 'Finance & Business',
    routes: [
      { path: '/admin/financials', name: 'Financial Dashboard' },
      { path: '/admin/business-worth-command', name: 'Business Worth' },
      { path: '/admin/wealth-dashboard', name: 'Wealth Dashboard' },
      { path: '/admin/artist-business-setup', name: 'Artist Business Setup' },
      { path: '/admin/intelligence-to-income', name: 'Intelligence to Income' },
      { path: '/admin/report', name: 'Back of House Report' },
      { path: '/admin/coaching-command', name: 'Coaching Command (Private)' },
      { path: '/admin/legal-dashboard', name: 'Legal Dashboard' },
      { path: '/admin/security-centre', name: 'Security Centre' },
    ],
  },
  {
    section: 'QA & Developer',
    routes: [
      { path: '/admin/qa-command-centre', name: 'QA Command Centre' },
      { path: '/admin/playwright-test-centre', name: 'Playwright Tests' },
      { path: '/admin/developer-handoff', name: 'Developer Handoff' },
      { path: '/admin/site-function-audit', name: 'Site Function Audit' },
      { path: '/admin/operation-registry', name: 'Operation Registry' },
      { path: '/admin/code-audit-export', name: 'Code Audit Export' },
      { path: '/admin/chatgpt-code-review-export', name: 'ChatGPT Code Review Export' },
      { path: '/admin/qa-failure-report', name: 'QA Failure Report' },
      { path: '/admin/voice-input-test', name: 'Voice Input Test' },
      { path: '/admin/ai-cost-control', name: 'AI Cost Control' },
    ],
  },
];

const BACKEND_FUNCTIONS = [
  { name: 'stripeWebhook', category: 'payment', desc: 'Processes all incoming Stripe events' },
  { name: 'stripeIntelligenceRouter', category: 'payment', desc: 'Routes Stripe events to appropriate handlers' },
  { name: 'createCheckoutSession', category: 'payment', desc: 'Creates Stripe checkout for merch orders' },
  { name: 'validatePromoCode', category: 'payment', desc: 'Validates promo codes at checkout' },
  { name: 'calculateShippingRate', category: 'payment', desc: 'Calculates shipping cost by region/product' },
  { name: 'onNewOrderAutomation', category: 'order', desc: 'Creates order record + triggers receipt + notifications' },
  { name: 'sendOrderReceipt', category: 'order', desc: 'Sends receipt email to customer via Gmail' },
  { name: 'notifyAdminNewOrder', category: 'order', desc: 'Notifies admin of new order' },
  { name: 'metricoolSchedulePost', category: 'social', desc: 'Sends approved post to Metricool scheduler API' },
  { name: 'metricoolNormalizeMedia', category: 'social', desc: 'Normalizes media URL → Metricool mediaId' },
  { name: 'metricoolImportMetrics', category: 'social', desc: 'Imports performance data from Metricool' },
  { name: 'validateMetricoolConfig', category: 'social', desc: 'Tests Metricool API connection' },
  { name: 'generateReleaseSprint', category: 'social', desc: 'AI-generates 11-day release content calendar' },
  { name: 'tiktokOAuth', category: 'social', desc: 'Manages TikTok OAuth flow + token storage' },
  { name: 'tiktokUploadDraft', category: 'social', desc: 'Uploads video draft to TikTok (no auto-publish)' },
  { name: 'agentIntelligenceLoop', category: 'agent', desc: 'Main agent reasoning and task loop' },
  { name: 'agentProposalScanner', category: 'agent', desc: 'Scans for opportunities → creates proposals' },
  { name: 'agentSelfImprovement', category: 'agent', desc: 'Agent learns from approvals/rejections' },
  { name: 'openaiAgent', category: 'agent', desc: 'GPT-backed agent for general reasoning tasks' },
  { name: 'runSiteHealthCheck', category: 'system', desc: 'Runs automated site health tests' },
  { name: 'automatedSiteTests', category: 'system', desc: 'Suite of automated frontend/backend tests' },
  { name: 'executiveMorningBrief', category: 'system', desc: 'Daily AI briefing — revenue, alerts, actions' },
  { name: 'welcomeNewSubscriber', category: 'email', desc: 'Welcome email on new subscriber signup' },
  { name: 'sendSlackAlert', category: 'email', desc: 'Sends critical alerts to Slack' },
];

const INTEGRATIONS = [
  { name: 'Stripe', status: 'live', type: 'payment', secrets: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'] },
  { name: 'Metricool', status: 'live', type: 'social', secrets: ['METRICOOL_API_TOKEN', 'METRICOOL_USER_ID', 'METRICOOL_BLOG_ID'] },
  { name: 'Gmail', status: 'live', type: 'email', secrets: ['OAuth connector'] },
  { name: 'Google Sheets', status: 'live', type: 'productivity', secrets: ['GOOGLE_SHEET_ID', 'OAuth connector'] },
  { name: 'Google Calendar', status: 'live', type: 'productivity', secrets: ['OAuth connector'] },
  { name: 'Google Drive', status: 'live', type: 'productivity', secrets: ['OAuth connector'] },
  { name: 'Slack', status: 'live', type: 'comms', secrets: ['OAuth connector'] },
  { name: 'Notion', status: 'live', type: 'productivity', secrets: ['OAuth connector'] },
  { name: 'PostHog', status: 'needs_credentials', type: 'analytics', secrets: ['POSTHOG_KEY — not yet set'] },
  { name: 'TikTok', status: 'needs_action', type: 'social', secrets: ['TIKTOK_CLIENT_KEY ✓', 'TIKTOK_CLIENT_SECRET ✓', 'OAuth not yet completed'] },
  { name: 'Airtable', status: 'live', type: 'productivity', secrets: ['OAuth connector'] },
];

function SectionBlock({ title, icon: Icon, color, children }) {
  const [open, setOpen] = useState(true);
  return (
    <Card>
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} /> {title}
          <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform ${open ? 'rotate-90' : ''}`} />
        </CardTitle>
      </CardHeader>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

export default function SystemBlueprint() {
  const { data: orders = [] } = useQuery({ queryKey: ['bp-orders'], queryFn: () => base44.entities.MerchOrder.list() });
  const { data: products = [] } = useQuery({ queryKey: ['bp-products'], queryFn: () => base44.entities.MerchProduct.list() });
  const { data: subscribers = [] } = useQuery({ queryKey: ['bp-subs'], queryFn: () => base44.entities.EmailSubscriber.list() });
  const { data: approvals = [] } = useQuery({ queryKey: ['bp-approvals'], queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 100) });
  const { data: agents = [] } = useQuery({ queryKey: ['bp-agents'], queryFn: () => base44.entities.AgentRegistry.list() });
  const { data: calPosts = [] } = useQuery({ queryKey: ['bp-calposts'], queryFn: () => base44.entities.ContentCalendarPost.list('-created_date', 500) });

  const totalAdminRoutes = ADMIN_SECTIONS.reduce((s, sec) => s + sec.routes.length, 0);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">System Architecture</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">System Blueprint</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Complete map of every page, entity, function, agent, and integration in the Gannon Waye OS
        </p>
      </div>

      {/* Stat overview — all clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Public Routes', value: PUBLIC_ROUTES.length, icon: Globe, color: 'text-blue-400', to: null },
          { label: 'Admin Pages', value: totalAdminRoutes, icon: Shield, color: 'text-primary', to: null },
          { label: 'Backend Functions', value: BACKEND_FUNCTIONS.length, icon: Zap, color: 'text-amber-400', to: null },
          { label: 'Integrations', value: INTEGRATIONS.length, icon: Link2, color: 'text-chart-2', to: null },
          { label: 'Active Orders', value: orders.filter(o => !['cancelled','refunded'].includes(o.status)).length, icon: Package, color: 'text-primary', to: '/admin/orders' },
          { label: 'Products', value: products.length, icon: ShoppingBag, color: 'text-foreground', to: '/admin/merch' },
          { label: 'Subscribers', value: subscribers.length, icon: Users, color: 'text-chart-2', to: '/admin/subscribers' },
          { label: 'Pending Approvals', value: approvals.length, icon: CheckCircle2, color: approvals.length > 0 ? 'text-amber-400' : 'text-muted-foreground', to: '/admin/approval-queue' },
          { label: 'Agents', value: agents.length, icon: Bot, color: 'text-purple-400', to: '/admin/agent-registry' },
          { label: 'Content Posts', value: calPosts.length, icon: BarChart2, color: 'text-cyan-400', to: '/admin/social-schedule-queue' },
          { label: 'Live Integrations', value: INTEGRATIONS.filter(i => i.status === 'live').length, icon: CheckCircle2, color: 'text-green-400', to: '/admin/api-setup' },
          { label: 'Needs Action', value: INTEGRATIONS.filter(i => i.status !== 'live').length, icon: AlertTriangle, color: 'text-amber-400', to: '/admin/api-setup' },
        ].map(s => {
          const Icon = s.icon;
          const inner = (
            <Card className={`${s.to ? 'hover:border-primary/40 cursor-pointer' : ''} transition-all`}>
              <CardContent className="p-4">
                <Icon className={`w-4 h-4 ${s.color} mb-1`} />
                <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          );
          return s.to ? <Link key={s.label} to={s.to}>{inner}</Link> : <div key={s.label}>{inner}</div>;
        })}
      </div>

      {/* Public routes */}
      <SectionBlock title={`Public Website — ${PUBLIC_ROUTES.length} routes`} icon={Globe} color="text-blue-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {PUBLIC_ROUTES.map(r => (
            <a key={r.path} href={r.path} target="_blank" rel="noopener noreferrer">
              <div className="flex items-start gap-2 p-2 rounded hover:bg-secondary/30 transition-colors">
                <code className="text-xs text-primary font-mono shrink-0 mt-0.5">{r.path}</code>
                <div className="min-w-0">
                  <span className="font-body text-xs text-foreground font-medium">{r.name}</span>
                  <p className="font-body text-[10px] text-muted-foreground truncate">{r.description}</p>
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
              </div>
            </a>
          ))}
        </div>
      </SectionBlock>

      {/* Admin sections */}
      {ADMIN_SECTIONS.map(sec => (
        <SectionBlock key={sec.section} title={`${sec.section} — ${sec.routes.length} pages`} icon={Shield} color="text-primary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {sec.routes.map(r => (
              <Link key={r.path} to={r.path}>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-secondary/30 transition-colors">
                  <code className="text-[10px] text-primary font-mono truncate flex-1">{r.path}</code>
                  <span className="font-body text-xs text-foreground shrink-0">{r.name}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </SectionBlock>
      ))}

      {/* Backend functions */}
      <SectionBlock title={`Backend Functions — ${BACKEND_FUNCTIONS.length} total`} icon={Zap} color="text-amber-400">
        <div className="space-y-1">
          {['payment','order','social','agent','system','email'].map(cat => {
            const fns = BACKEND_FUNCTIONS.filter(f => f.category === cat);
            return (
              <div key={cat} className="mb-3">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-1.5">{cat}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {fns.map(f => (
                    <div key={f.name} className="flex items-start gap-2 p-2 rounded bg-secondary/20">
                      <code className="font-mono text-xs text-primary shrink-0">{f.name}</code>
                      <span className="font-body text-[10px] text-muted-foreground">{f.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionBlock>

      {/* Integrations */}
      <SectionBlock title={`Integrations — ${INTEGRATIONS.length} total`} icon={Link2} color="text-chart-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {INTEGRATIONS.map(i => (
            <Link key={i.name} to="/admin/api-setup">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:border-primary/40 transition-colors">
                <Badge className={`text-xs shrink-0 border ${
                  i.status === 'live' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  i.status === 'needs_action' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-slate-500/10 text-slate-400 border-slate-500/30'
                }`}>
                  {i.status === 'live' ? '✓' : '⚠'} {i.status.replace('_', ' ')}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-foreground font-medium">{i.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {i.secrets.map(s => (
                      <code key={s} className="text-[9px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{s}</code>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionBlock>

      {/* Secrets status */}
      <SectionBlock title="Secrets / Credentials Status" icon={Shield} color="text-red-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { name: 'STRIPE_SECRET_KEY', set: true, note: 'Live key confirmed' },
            { name: 'STRIPE_PUBLISHABLE_KEY', set: true, note: 'Live key confirmed' },
            { name: 'STRIPE_WEBHOOK_SECRET', set: true, note: 'Webhook registered' },
            { name: 'METRICOOL_API_TOKEN', set: true, note: '✓ Tested — 2 brands connected' },
            { name: 'METRICOOL_USER_ID', set: true, note: '✓ Confirmed' },
            { name: 'METRICOOL_BLOG_ID', set: true, note: '✓ Confirmed' },
            { name: 'TIKTOK_CLIENT_KEY', set: true, note: 'Set — OAuth not yet completed' },
            { name: 'TIKTOK_CLIENT_SECRET', set: true, note: 'Set — OAuth not yet completed' },
            { name: 'GOOGLE_SHEET_ID', set: true, note: 'Order sync sheet' },
            { name: 'POSTHOG_KEY', set: false, note: 'Not yet set — analytics degraded' },
          ].map(s => (
            <div key={s.name} className="flex items-center gap-2 p-2 rounded bg-secondary/20">
              {s.set ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              <code className="font-mono text-xs text-primary flex-1">{s.name}</code>
              <span className="font-body text-[10px] text-muted-foreground">{s.note}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Source chain explanation */}
      <Card className="border-border/30">
        <CardContent className="p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-2">Master Source Chain</p>
          <div className="flex flex-wrap gap-1.5 items-center">
            {[
              'Fan/Customer Action',
              '→ Store / Form',
              '→ Backend Function',
              '→ Entity Record Created',
              '→ Automation Triggered',
              '→ Agent Analyses',
              '→ Proposal → ApprovalQueue',
              '→ Admin Approves',
              '→ Action Executed',
              '→ Notification / Receipt Sent',
              '→ AdminNotification',
              '→ AuditLog',
            ].map((step, i) => (
              <span key={i} className="font-body text-xs text-muted-foreground">{step}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
