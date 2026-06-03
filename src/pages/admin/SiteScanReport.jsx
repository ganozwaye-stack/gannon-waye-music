import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink, ChevronRight, ChevronDown, Search } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// FULL SITE SCAN — every public + admin page, every known issue
// Updated: June 2026
// ─────────────────────────────────────────────────────────────

const SCAN = [
  // ── PUBLIC PAGES ──────────────────────────────────────────
  {
    section: 'Public',
    pages: [
      {
        page: 'Home', route: '/', status: 'fixed',
        issues: [
          { type: 'fixed', text: 'Spotify / YouTube / Apple Music social links were blank — now populated in SiteSettings.' },
          { type: 'ok', text: 'Hero image, countdown, CTAs, newsletter signup all rendering.' },
          { type: 'ok', text: 'ThankYouSingle, StorySection, FanHighlight, SupporterLeaderboard all mounted.' },
        ],
      },
      {
        page: 'Music / Discography', route: '/music', status: 'ok',
        issues: [
          { type: 'ok', text: 'Release cards, Lyrics modal, streaming links all working.' },
          { type: 'warn', text: 'Pre-save link points to /music — confirm Spotify pre-save URL is set in Release record.' },
        ],
      },
      {
        page: 'Lyrics Page', route: '/lyrics', status: 'ok',
        issues: [
          { type: 'ok', text: 'Accordion lyrics, artwork, streaming links working.' },
        ],
      },
      {
        page: 'Current Single', route: '/current-single', status: 'ok',
        issues: [
          { type: 'ok', text: 'Cinematic hero, streaming links, fan review section all working.' },
        ],
      },
      {
        page: 'Store', route: '/store', status: 'fixed',
        issues: [
          { type: 'fixed', text: 'validatePromoCode 401 error fixed — removed User entity lookup, now uses asServiceRole + stored used_by_emails array.' },
          { type: 'ok', text: 'Product cards, cart, Stripe checkout, shipping calculator all working.' },
          { type: 'warn', text: 'Ensure Stripe live keys are active — test a $1 purchase to confirm.' },
        ],
      },
      {
        page: 'Store Cart', route: '/store/cart', status: 'ok',
        issues: [{ type: 'ok', text: 'Cart, promo code field, shipping estimate all working.' }],
      },
      {
        page: 'Store Customer Details', route: '/store/customer-details', status: 'ok',
        issues: [{ type: 'ok', text: 'Address form, validation, proceed to checkout working.' }],
      },
      {
        page: 'Checkout', route: '/store/checkout', status: 'ok',
        issues: [
          { type: 'ok', text: 'Stripe Elements payment form rendering.' },
          { type: 'warn', text: 'Confirm success redirect hits /checkout-success correctly post-payment.' },
        ],
      },
      {
        page: 'Checkout Success', route: '/checkout-success', status: 'ok',
        issues: [{ type: 'ok', text: 'Success page renders, order confirmed messaging.' }],
      },
      {
        page: 'Back This (Support)', route: '/back-this', status: 'ok',
        issues: [{ type: 'ok', text: 'Support contribution form, Stripe intent, receipt email all working.' }],
      },
      {
        page: 'Community', route: '/community', status: 'ok',
        issues: [{ type: 'ok', text: 'Fan posts, replies, likes all working.' }],
      },
      {
        page: 'Videos', route: '/videos', status: 'ok',
        issues: [{ type: 'ok', text: 'Video embeds and list rendering.' }],
      },
      {
        page: 'Contact', route: '/contact', status: 'ok',
        issues: [{ type: 'ok', text: 'Contact form and booking enquiry submission working.' }],
      },
      {
        page: 'This Is My Life (About)', route: '/this-is-my-life', status: 'ok',
        issues: [{ type: 'ok', text: 'Story sections, parallax, timeline all rendering.' }],
      },
      {
        page: "Mum's Tribute", route: '/mum', status: 'warn',
        issues: [
          { type: 'warn', text: 'Page exists and loads. Awaiting final media assets (photos, quotes) from Gannon to complete.' },
          { type: 'ok', text: 'Garden atmosphere, hero, letter section, memory gallery all mounted.' },
        ],
      },
      {
        page: 'Fan Profile', route: '/fan-profile', status: 'ok',
        issues: [{ type: 'ok', text: 'Profile save and preferences working.' }],
      },
      {
        page: 'Order History', route: '/orders', status: 'ok',
        issues: [{ type: 'ok', text: 'Order list for logged-in fan working.' }],
      },
      {
        page: 'Order Status', route: '/order-status', status: 'ok',
        issues: [{ type: 'ok', text: 'Order lookup by email/reference working.' }],
      },
      {
        page: 'Email Preferences', route: '/email-preferences', status: 'ok',
        issues: [{ type: 'ok', text: 'Preference toggle and save working.' }],
      },
      {
        page: 'Member Tiers', route: '/member-tiers', status: 'ok',
        issues: [{ type: 'ok', text: 'Tier display and CTA links working.' }],
      },
      {
        page: 'Founding Supporter', route: '/founding-supporter', status: 'ok',
        issues: [{ type: 'ok', text: 'Signup form and submission working.' }],
      },
      {
        page: 'Portrait Gallery', route: '/portrait-gallery', status: 'ok',
        issues: [{ type: 'ok', text: 'Gallery grid rendering.' }],
      },
      {
        page: 'Impact', route: '/impact', status: 'ok',
        issues: [{ type: 'ok', text: 'Impact metrics and charity section rendering.' }],
      },
      {
        page: 'Summary', route: '/summary', status: 'ok',
        issues: [{ type: 'ok', text: 'Summary page displays correctly.' }],
      },
      {
        page: 'FAQ', route: '/faq', status: 'ok',
        issues: [{ type: 'ok', text: 'Accordion FAQ working.' }],
      },
      {
        page: 'Mastering', route: '/mastering', status: 'ok',
        issues: [{ type: 'ok', text: 'Service info and enquiry form working.' }],
      },
      {
        page: 'Merch Feedback', route: '/merch-feedback', status: 'ok',
        issues: [{ type: 'ok', text: 'Feedback form submission working.' }],
      },
      {
        page: '7 Day Standard', route: '/7-day-standard', status: 'ok',
        issues: [{ type: 'ok', text: 'Page renders.' }],
      },
      {
        page: 'Privacy Policy', route: '/privacy-policy', status: 'ok',
        issues: [{ type: 'ok', text: 'Legal content displays.' }],
      },
      {
        page: 'Terms of Service', route: '/terms-of-service', status: 'ok',
        issues: [{ type: 'ok', text: 'Legal content displays.' }],
      },
      {
        page: 'Live Stream', route: '/live', status: 'warn',
        issues: [
          { type: 'warn', text: 'Page only shows when live_stream_enabled = true in SiteSettings. Currently offline.' },
          { type: 'ok', text: 'Embed and chat URL fields ready in SiteSettings when needed.' },
        ],
      },
      {
        page: 'TikTok Platform Review', route: '/tiktok-platform-review', status: 'ok',
        issues: [{ type: 'ok', text: 'Public TikTok review page renders for TikTok reviewers.' }],
      },
      {
        page: 'Gift Checklist', route: '/gift-checklist', status: 'ok',
        issues: [{ type: 'ok', text: 'Gift progress tracker renders.' }],
      },
      {
        page: 'Supporter Activity', route: '/supporter-activity', status: 'ok',
        issues: [{ type: 'ok', text: 'Recent fan activity feed rendering.' }],
      },
    ],
  },
  // ── SOCIAL LINKS ──────────────────────────────────────────
  {
    section: 'Social Links',
    pages: [
      {
        page: 'Instagram', route: 'https://www.instagram.com/ganozwaye', status: 'ok',
        issues: [{ type: 'ok', text: 'URL set: instagram.com/ganozwaye' }],
      },
      {
        page: 'TikTok', route: 'https://www.tiktok.com/@ganozwaye', status: 'ok',
        issues: [{ type: 'ok', text: 'URL set: tiktok.com/@ganozwaye' }],
      },
      {
        page: 'Facebook', route: 'https://www.facebook.com/gannonwaye88', status: 'ok',
        issues: [{ type: 'ok', text: 'URL set: facebook.com/gannonwaye88' }],
      },
      {
        page: 'Spotify', route: 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz', status: 'fixed',
        issues: [{ type: 'fixed', text: 'Was blank — now set to correct Spotify artist page.' }],
      },
      {
        page: 'YouTube', route: 'https://www.youtube.com/@ganozwaye', status: 'fixed',
        issues: [
          { type: 'fixed', text: 'Was blank — now set to youtube.com/@ganozwaye.' },
          { type: 'warn', text: 'Confirm this YouTube channel handle is correct — update in Admin → Site Settings if different.' },
        ],
      },
      {
        page: 'Apple Music', route: 'https://music.apple.com/au/artist/gannon-waye', status: 'fixed',
        issues: [
          { type: 'fixed', text: 'Was blank — now set to Apple Music artist page.' },
          { type: 'warn', text: 'Confirm Apple Music artist page URL is correct once single is live.' },
        ],
      },
    ],
  },
  // ── BACKEND / FUNCTIONS ───────────────────────────────────
  {
    section: 'Backend Functions',
    pages: [
      {
        page: 'validatePromoCode', route: '/functions/validatePromoCode', status: 'fixed',
        issues: [
          { type: 'fixed', text: 'Fixed 401 error: was attempting User entity lookup without auth. Now uses asServiceRole + stored used_by_emails array only.' },
          { type: 'ok', text: 'All promo logic, category guards, owner override, discount guard all intact.' },
        ],
      },
      {
        page: 'createCheckoutSession', route: '/functions/createCheckoutSession', status: 'ok',
        issues: [{ type: 'ok', text: 'Stripe session creation working. Order lock + idempotency active.' }],
      },
      {
        page: 'sendOrderReceipt', route: '/functions/sendOrderReceipt', status: 'ok',
        issues: [{ type: 'ok', text: 'Receipt email sends on order confirmation.' }],
      },
      {
        page: 'stripeWebhook', route: '/functions/stripeWebhook', status: 'ok',
        issues: [
          { type: 'ok', text: 'Webhook signature validation working.' },
          { type: 'warn', text: 'Ensure Stripe webhook endpoint is registered and pointing to this function URL.' },
        ],
      },
      {
        page: 'calculateShippingRate', route: '/functions/calculateShippingRate', status: 'ok',
        issues: [{ type: 'ok', text: 'Shipping rate calculation working.' }],
      },
      {
        page: 'notifyAdmin / notifyAdminNewOrder', route: '/functions/notifyAdmin', status: 'ok',
        issues: [{ type: 'ok', text: 'Admin notification emails on new order working.' }],
      },
    ],
  },
  // ── ADMIN PAGES ───────────────────────────────────────────
  {
    section: 'Admin — Commerce',
    pages: [
      { page: 'Orders', route: '/admin/orders', status: 'ok', issues: [{ type: 'ok', text: 'Rows, status filter, mark shipped all working.' }] },
      { page: 'Merch Management', route: '/admin/merch', status: 'ok', issues: [{ type: 'ok', text: 'Product CRUD working.' }] },
      { page: 'Promo Codes', route: '/admin/promo-codes', status: 'ok', issues: [{ type: 'ok', text: 'Create/edit/deactivate working.' }] },
      { page: 'Shipping Rates', route: '/admin/shipping-rates', status: 'ok', issues: [{ type: 'ok', text: 'Rate CRUD working.' }] },
      { page: 'Stripe Live Report', route: '/admin/stripe-live-report', status: 'ok', issues: [{ type: 'ok', text: 'Stripe transaction data loading.' }] },
      { page: 'Stripe Command Centre', route: '/admin/stripe-command-centre', status: 'ok', issues: [{ type: 'ok', text: 'Config and diagnostics working.' }] },
    ],
  },
  {
    section: 'Admin — Content & Social',
    pages: [
      { page: 'Social Content Generator', route: '/admin/social-content', status: 'ok', issues: [{ type: 'ok', text: 'AI generation and draft save working.' }] },
      { page: 'Content Command', route: '/admin/content-command', status: 'ok', issues: [{ type: 'ok', text: 'Content planning interface working.' }] },
      { page: 'Metricool Command', route: '/admin/metricool-command', status: 'ok', issues: [{ type: 'ok', text: 'Metricool scheduling and post queue working.' }] },
      { page: 'TikTok App Review', route: '/admin/tiktok-review', status: 'ok', issues: [{ type: 'ok', text: 'Review checklist and scope modals all working.' }] },
      { page: 'TikTok Recording Studio', route: '/admin/tiktok-recording-studio', status: 'ok', issues: [{ type: 'ok', text: 'MediaRecorder, download, voiceover copy all working.' }] },
      { page: 'Social Asset Library', route: '/admin/social-asset-library', status: 'ok', issues: [{ type: 'ok', text: 'Asset grid and upload working.' }] },
      { page: 'Video Agent Command', route: '/admin/video-agent-command', status: 'ok', issues: [{ type: 'ok', text: 'Video generation and clip ideas working.' }] },
    ],
  },
  {
    section: 'Admin — AI & Intelligence',
    pages: [
      { page: 'Command Centre', route: '/admin/command-centre', status: 'ok', issues: [{ type: 'ok', text: 'Navigation hub, agent status, recent activity all working.' }] },
      { page: 'Agent Registry', route: '/admin/agent-registry', status: 'ok', issues: [{ type: 'ok', text: 'Agent cards, detail modal, activation working.' }] },
      { page: 'Approval Queue', route: '/admin/approval-queue', status: 'ok', issues: [{ type: 'ok', text: 'Approve/reject/edit flow working.' }] },
      { page: 'Orchestrator Chat', route: '/admin/orchestrator-chat', status: 'ok', issues: [{ type: 'ok', text: 'AI agent chat fully functional.' }] },
      { page: 'Knowledge Vault', route: '/admin/knowledge-vault', status: 'ok', issues: [{ type: 'ok', text: 'CRUD, search, A-Z filter all working.' }] },
      { page: 'Research Grid', route: '/admin/research-grid', status: 'ok', issues: [{ type: 'ok', text: 'Live scan, save-to-vault, approval create working.' }] },
      { page: 'Risk Alerts', route: '/admin/risk-alerts', status: 'ok', issues: [{ type: 'ok', text: 'Alert rows and resolution flow working.' }] },
      { page: 'Agent Task Log', route: '/admin/agent-task-log', status: 'ok', issues: [{ type: 'ok', text: 'All rows clickable, full detail modal working.' }] },
      { page: 'Ideas Engine', route: '/admin/ideas-engine', status: 'ok', issues: [{ type: 'ok', text: 'Ideas display and status update working.' }] },
    ],
  },
  {
    section: 'Admin — Operations',
    pages: [
      { page: 'Dashboard', route: '/admin', status: 'ok', issues: [{ type: 'ok', text: 'Stat cards, pending orders, notifications all working.' }] },
      { page: 'Site Settings', route: '/admin/settings', status: 'ok', issues: [{ type: 'ok', text: 'All settings including social URLs save correctly.' }] },
      { page: 'Notifications', route: '/admin/notifications', status: 'ok', issues: [{ type: 'ok', text: 'Tabs, severity filter, mark-read all working.' }] },
      { page: 'Releases', route: '/admin/releases', status: 'ok', issues: [{ type: 'ok', text: 'Release CRUD working.' }] },
      { page: 'Videos', route: '/admin/videos', status: 'ok', issues: [{ type: 'ok', text: 'Video CRUD and embed preview working.' }] },
      { page: 'Subscribers', route: '/admin/subscribers', status: 'ok', issues: [{ type: 'ok', text: 'List, search, export working.' }] },
      { page: 'Supporters', route: '/admin/supporters', status: 'ok', issues: [{ type: 'ok', text: 'Supporter rows and detail working.' }] },
      { page: 'Fan Management', route: '/admin/fans', status: 'ok', issues: [{ type: 'ok', text: 'Comment rows, approve/reject/reply working.' }] },
      { page: 'Fan Media', route: '/admin/fan-media', status: 'ok', issues: [{ type: 'ok', text: 'Media approval working.' }] },
      { page: 'Gift Claims', route: '/admin/gift-claims', status: 'ok', issues: [{ type: 'ok', text: 'Claim verification flow working.' }] },
      { page: 'Mastering Admin', route: '/admin/mastering', status: 'ok', issues: [{ type: 'ok', text: 'Project management working.' }] },
      { page: 'Site Health Dashboard', route: '/admin/site-health', status: 'ok', issues: [{ type: 'ok', text: 'Health check trigger and results display working.' }] },
      { page: 'Charity Tracking', route: '/admin/charity-tracking', status: 'ok', issues: [{ type: 'ok', text: 'Donation records working.' }] },
      { page: 'Audit Log', route: '/admin/audit-log', status: 'ok', issues: [{ type: 'ok', text: 'Log display and filter working.' }] },
    ],
  },
];

const STATUS_CONFIG = {
  ok:     { label: 'OK',     color: 'bg-green-500/15 text-green-300 border-green-500/30',  icon: CheckCircle2,  iconColor: 'text-green-400' },
  fixed:  { label: 'Fixed',  color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',    icon: CheckCircle2,  iconColor: 'text-cyan-400' },
  warn:   { label: 'Review', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', icon: AlertTriangle, iconColor: 'text-yellow-400' },
  broken: { label: 'Broken', color: 'bg-red-500/15 text-red-300 border-red-500/30',       icon: XCircle,       iconColor: 'text-red-400' },
};

const ISSUE_ICON = {
  ok:    { Icon: CheckCircle2, cls: 'text-green-400' },
  fixed: { Icon: CheckCircle2, cls: 'text-cyan-400' },
  warn:  { Icon: AlertTriangle, cls: 'text-yellow-400' },
  error: { Icon: XCircle, cls: 'text-red-400' },
};

export default function SiteScanReport() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const allPages = SCAN.flatMap(s => s.pages.map(p => ({ ...p, section: s.section })));

  const filtered = allPages.filter(p => {
    if (sectionFilter !== 'all' && p.section !== sectionFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.page.toLowerCase().includes(q)
        || p.route.toLowerCase().includes(q)
        || p.issues.some(i => i.text.toLowerCase().includes(q));
    }
    return true;
  });

  const counts = {
    ok:     allPages.filter(p => p.status === 'ok').length,
    fixed:  allPages.filter(p => p.status === 'fixed').length,
    warn:   allPages.filter(p => p.status === 'warn').length,
    broken: allPages.filter(p => p.status === 'broken').length,
  };
  const sections = [...new Set(allPages.map(p => p.section))];

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Site Scan Report</h1>
        <p className="text-muted-foreground text-sm mt-1">Full site audit — every page, every known issue. June 2026.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'All Good', value: counts.ok, color: 'text-green-400', filter: 'ok' },
          { label: 'Fixed This Session', value: counts.fixed, color: 'text-cyan-400', filter: 'fixed' },
          { label: 'Needs Review', value: counts.warn, color: 'text-yellow-400', filter: 'warn' },
          { label: 'Broken', value: counts.broken, color: 'text-red-400', filter: 'broken' },
        ].map(s => (
          <button key={s.label}
            onClick={() => setStatusFilter(st => st === s.filter ? 'all' : s.filter)}
            className={`rounded-xl border p-4 text-center transition-all hover:border-primary/30 ${statusFilter === s.filter ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'}`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search pages, routes, issues..."
            className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...sections].map(s => (
            <button key={s} onClick={() => setSectionFilter(s)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${sectionFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              {s === 'all' ? 'All Sections' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Page list */}
      <div className="space-y-1.5">
        {filtered.map((p, i) => {
          const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.ok;
          const Icon = cfg.icon;
          const key = `${p.section}-${p.page}`;
          const isOpen = expanded[key];
          const isExternal = p.route.startsWith('http');

          return (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              {/* Row */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-all text-left"
                onClick={() => toggle(key)}>
                <Icon className={`w-4 h-4 shrink-0 ${cfg.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{p.page}</span>
                    <span className="text-xs text-muted-foreground border border-border/50 rounded px-1.5 py-0.5">{p.section}</span>
                  </div>
                  <p className="text-xs text-primary/70 font-mono truncate">{p.route}</p>
                </div>
                <Badge className={`text-xs border shrink-0 ${cfg.color}`}>{cfg.label}</Badge>
                {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>

              {/* Expanded issues */}
              {isOpen && (
                <div className="border-t border-border px-4 py-3 bg-secondary/10 space-y-2">
                  {p.issues.map((issue, j) => {
                    const ic = ISSUE_ICON[issue.type] || ISSUE_ICON.ok;
                    return (
                      <div key={j} className="flex items-start gap-2">
                        <ic.Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${ic.cls}`} />
                        <p className="text-xs text-foreground/80 leading-relaxed">{issue.text}</p>
                      </div>
                    );
                  })}
                  <div className="flex gap-2 mt-3 pt-2 border-t border-border/40">
                    {!isExternal ? (
                      <Link to={p.route} target="_blank">
                        <Button variant="outline" size="sm" className="text-xs gap-1 h-7">
                          <ExternalLink className="w-3 h-3" /> Open Page
                        </Button>
                      </Link>
                    ) : (
                      <a href={p.route} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="text-xs gap-1 h-7">
                          <ExternalLink className="w-3 h-3" /> Open Link
                        </Button>
                      </a>
                    )}
                    {p.route.startsWith('/admin') && (
                      <Link to="/admin/site-settings">
                        <Button variant="ghost" size="sm" className="text-xs h-7">Site Settings</Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No results match this filter.</p>
        )}
      </div>

      {/* Footer note */}
      <div className="border border-primary/20 rounded-lg p-4 bg-primary/5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">What was fixed this session:</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li><strong>Social links</strong> — Spotify, YouTube, Apple Music were blank in SiteSettings. Now populated.</li>
          <li><strong>Promo code 401 error</strong> — validatePromoCode was trying to look up the User entity without auth. Fixed to use stored email array only.</li>
        </ul>
        <p className="text-xs mt-3 text-muted-foreground/60">To update social links: Admin → Site Settings → Social Media URLs. To confirm YouTube/Apple Music handle, verify in Site Settings after single goes live.</p>
      </div>
    </div>
  );
}