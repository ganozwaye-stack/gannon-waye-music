import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, ChevronRight } from 'lucide-react';

// Comprehensive site-wide function audit
// Every route in App.jsx catalogued with function status

const AUDIT_DATA = [
  // ── EXECUTIVE ────────────────────────────────────────────────────────────────
  {
    section: 'Executive',
    pages: [
      { page: 'Dashboard', route: '/admin', status: 'Working', issues: 1, notes: 'Stat cards link to source pages. Pending order rows clickable via link to /admin/orders.' },
      { page: 'Notifications / BAC', route: '/admin/notifications', status: 'Working', issues: 0, notes: 'Tabs, rows, summary cards, mark-read, source chain all working. Severity badge filter added.' },
      { page: 'Executive Feed', route: '/admin/executive-feed', status: 'Partial', issues: 2, notes: 'Trigger brief button works. Intelligence cards need source chain links.' },
      { page: 'Approval Queue', route: '/admin/approval-queue', status: 'Working', issues: 1, notes: 'Rows clickable, approve/reject work. Agent name badge filter pending.' },
      { page: 'Audit Log', route: '/admin/audit-log', status: 'Partial', issues: 1, notes: 'Filter and search work. Row detail view needs upgrade.' },
      { page: 'Command Centre', route: '/admin/command-centre', status: 'Working', issues: 0, notes: 'Navigation hub — links all work.' },
      { page: 'Go-Live Checklist', route: '/admin/go-live', status: 'Working', issues: 0, notes: 'Checklist items toggle correctly.' },
      { page: 'Growth Engine', route: '/admin/growth-engine', status: 'Partial', issues: 2, notes: 'Opportunity cards need detail modal. Status/platform badges need filter.' },
      { page: 'Orchestrator AI', route: '/admin/orchestrator-chat', status: 'Working', issues: 0, notes: 'Agent chat fully functional.' },
      { page: 'Risk Alerts', route: '/admin/risk-alerts', status: 'Partial', issues: 1, notes: 'Row detail view needs full source chain.' },
      { page: 'Site Health', route: '/admin/site-health', status: 'Partial', issues: 1, notes: 'Health check trigger works. Item detail needs upgrade.' },
    ],
  },
  // ── COMMERCE ─────────────────────────────────────────────────────────────────
  {
    section: 'Commerce',
    pages: [
      { page: 'Orders', route: '/admin/orders', status: 'Working', issues: 0, notes: 'Rows clickable, status filter works, mark shipped functional.' },
      { page: 'Products / Merch', route: '/admin/merch', status: 'Working', issues: 1, notes: 'Edit/delete work. Product card detail modal pending.' },
      { page: 'Promo Codes', route: '/admin/promo-codes', status: 'Partial', issues: 1, notes: 'Create/edit work. Usage count not yet linked to order filter.' },
      { page: 'Stripe Live Report', route: '/admin/stripe-live-report', status: 'Partial', issues: 1, notes: 'Data loads. Transaction row detail needs upgrade.' },
      { page: 'Revenue Actions', route: '/admin/revenue-actions', status: 'Working', issues: 0, notes: 'Proposal review and publish flow working.' },
      { page: 'Revenue Command Centre', route: '/admin/revenue-command', status: 'Working', issues: 1, notes: 'Rows and modals work. Revenue type badge filter pending.' },
      { page: 'Ecommerce Command', route: '/admin/ecommerce-command', status: 'Working', issues: 1, notes: 'Revenue card source chain pending.' },
      { page: 'Ecommerce Intelligence', route: '/admin/ecommerce-intelligence', status: 'Partial', issues: 2, notes: 'Insight cards need detail view and source chain.' },
      { page: 'Merch Financials', route: '/admin/merch-financials', status: 'Partial', issues: 1, notes: 'Financials display. Row drill-down needed.' },
      { page: 'Product Insights', route: '/admin/product-insights', status: 'Partial', issues: 1, notes: 'Charts load. Bar click source chain pending.' },
      { page: 'Shipping Rates', route: '/admin/shipping-rates', status: 'Working', issues: 0, notes: 'CRUD operations working.' },
      { page: 'Supporters', route: '/admin/supporters', status: 'Working', issues: 0, notes: 'Supporter rows clickable with detail.' },
      { page: 'Merch Feedback', route: '/admin/merch-feedback', status: 'Working', issues: 0, notes: 'Feedback rows and status filter working.' },
    ],
  },
  // ── SOCIAL ───────────────────────────────────────────────────────────────────
  {
    section: 'Social',
    pages: [
      { page: 'Social Content Generator', route: '/admin/social-content', status: 'Working', issues: 1, notes: 'Generation works. Draft detail row view pending.' },
      { page: 'TikTok App Review', route: '/admin/tiktok-review', status: 'Working', issues: 0, notes: 'All items clickable. Scope/product modals, checklist, copy buttons all working.' },
      { page: 'TikTok Screen Guide', route: '/admin/tiktok-screen-guide', status: 'Working', issues: 0, notes: 'Part 8 added. Voiceover copy button works. Related links work.' },
      { page: 'TikTok Recording Studio', route: '/admin/tiktok-recording-studio', status: 'Working', issues: 0, notes: 'MediaRecorder, step guide, download, voiceover copy, fallback all working.' },
      { page: 'Content Automate', route: '/admin/content-automate', status: 'Partial', issues: 1, notes: 'Automation items need row detail view.' },
      { page: 'Content Dashboard', route: '/admin/content-dashboard', status: 'Partial', issues: 1, notes: 'Content cards need source chain.' },
      { page: 'Creative Studio', route: '/admin/creative-studio', status: 'Working', issues: 0, notes: 'Generation and save flow working.' },
      { page: 'Creator Insights', route: '/admin/creator-insights', status: 'Partial', issues: 1, notes: 'Insight cards need detail view.' },
      { page: 'Marketing Centre', route: '/admin/marketing-centre', status: 'Working', issues: 0, notes: 'Campaign items clickable.' },
      { page: 'Social Command', route: '/admin/social-command', status: 'Working', issues: 0, notes: 'Platform links and actions working.' },
      { page: 'Social Intelligence', route: '/admin/social-intelligence', status: 'Partial', issues: 1, notes: 'Intelligence cards need detail modal.' },
      { page: 'Social Monitor', route: '/admin/social-monitor', status: 'Working', issues: 0, notes: 'Feed items display correctly.' },
      { page: 'Trend Monitor', route: '/admin/trend-monitor', status: 'Working', issues: 1, notes: 'Trend cards clickable. Viral probability badge filter pending.' },
    ],
  },
  // ── COMMUNITY ────────────────────────────────────────────────────────────────
  {
    section: 'Community',
    pages: [
      { page: 'Fan Messages', route: '/admin/fans', status: 'Working', issues: 0, notes: 'Comment rows, approve/reject/reply all working.' },
      { page: 'Subscribers', route: '/admin/subscribers', status: 'Working', issues: 1, notes: 'Search and export work. Subscriber profile detail pending.' },
      { page: 'Newsletter', route: '/admin/newsletter', status: 'Working', issues: 0, notes: 'Send newsletter and list display working.' },
      { page: 'Birthday Discounts', route: '/admin/birthdays', status: 'Working', issues: 0, notes: 'Birthday list and send discount working.' },
      { page: 'Fan Media', route: '/admin/fan-media', status: 'Working', issues: 0, notes: 'Media rows and approve/reject working.' },
      { page: 'Gift Claims', route: '/admin/gift-claims', status: 'Working', issues: 0, notes: 'Claim rows and verify flow working.' },
      { page: 'Gift Progress', route: '/admin/gift-progress', status: 'Working', issues: 0, notes: 'Progress tracking display working.' },
      { page: 'Gift Verification', route: '/admin/gift-verification', status: 'Working', issues: 0, notes: 'Verification flow working.' },
      { page: 'Thank You Cards', route: '/admin/thank-you-cards', status: 'Working', issues: 0, notes: 'Card generation and send working.' },
    ],
  },
  // ── INTELLIGENCE ─────────────────────────────────────────────────────────────
  {
    section: 'Intelligence',
    pages: [
      { page: 'Agent Intelligence', route: '/admin/agent-intelligence', status: 'Working', issues: 1, notes: 'Learning records and activity clickable. IQ score source chain pending.' },
      { page: 'Knowledge Vault', route: '/admin/knowledge-vault', status: 'Working', issues: 0, notes: 'Records clickable, CRUD, search, A-Z filter all working.' },
      { page: 'Research Grid', route: '/admin/research-grid', status: 'Working', issues: 0, notes: 'Cards clickable, live scan, save-to-vault, approval create all working.' },
      { page: 'Study Pals (Orchestrator)', route: '/admin/orchestrator-chat', status: 'Working', issues: 0, notes: 'Agent chat and selection working.' },
      { page: 'Agent Learning', route: '/admin/agent-learning', status: 'Partial', issues: 1, notes: 'Records display. Full detail modal needed.' },
      { page: 'Agent Registry', route: '/admin/agent-registry', status: 'Working', issues: 1, notes: 'Cards and detail modal working. Status/risk badge filter pending.' },
      { page: 'Agent Task Log', route: '/admin/agent-task-log', status: 'Fixed', issues: 0, notes: 'ALL items now clickable: tabs, rows, badges, dates, source labels. Full detail modal with source chain, back button, related record links.' },
      { page: 'Autonomous Ops', route: '/admin/autonomous-ops', status: 'Working', issues: 1, notes: 'Loop triggers and pending approvals work. Loop card source chain pending.' },
      { page: 'Ideas Engine', route: '/admin/ideas-engine', status: 'Partial', issues: 1, notes: 'Ideas display. Row detail modal needed.' },
      { page: 'Memory Graph', route: '/admin/memory-graph', status: 'Working', issues: 0, notes: 'Memory nodes display and link correctly.' },
      { page: 'Research Hub', route: '/admin/research-hub', status: 'Working', issues: 0, notes: 'Hub navigation links working.' },
      { page: 'Operation Registry', route: '/admin/operation-registry', status: 'Fixed', issues: 0, notes: 'Full page+operation catalogue. Every entry clickable with detail modal.' },
    ],
  },
  // ── OPERATIONS ───────────────────────────────────────────────────────────────
  {
    section: 'Operations',
    pages: [
      { page: 'Music Command', route: '/admin/music-command', status: 'Partial', issues: 1, notes: 'Release cards need detail view.' },
      { page: 'Revenue Command', route: '/admin/revenue-command', status: 'Working', issues: 1, notes: 'Rows and modals work. Revenue type badge filter pending.' },
      { page: 'Website Ops', route: '/admin/website-ops', status: 'Working', issues: 0, notes: 'Health checks and links working.' },
      { page: 'API Setup', route: '/admin/api-setup', status: 'Working', issues: 1, notes: 'Platform cards display. Detail view needed.' },
      { page: 'Bookings / Mastering', route: '/admin/mastering', status: 'Working', issues: 0, notes: 'Booking enquiry list and status update working.' },
      { page: 'Charity Tracking', route: '/admin/charity-tracking', status: 'Working', issues: 0, notes: 'Donation records and tracking working.' },
      { page: 'Distributors', route: '/admin/distributors', status: 'Working', issues: 0, notes: 'Distributor list and links working.' },
      { page: 'GanozMix Bridge', route: '/admin/ganozmix', status: 'Working', issues: 0, notes: 'Bridge connection working (owner only).' },
      { page: 'Image Editor', route: '/admin/image-editor', status: 'Working', issues: 0, notes: 'Upload, edit, export working.' },
      { page: 'Mastering Admin', route: '/admin/mastering', status: 'Working', issues: 0, notes: 'Project management working.' },
      { page: 'Operational Status', route: '/admin/operational-status', status: 'Working', issues: 0, notes: 'Status indicators all linked.' },
      { page: 'Release Countdown', route: '/admin/release-countdown', status: 'Working', issues: 0, notes: 'Countdown and reveal config working.' },
      { page: 'Releases', route: '/admin/releases', status: 'Working', issues: 1, notes: 'CRUD works. Release card detail view pending.' },
      { page: 'Self Healing', route: '/admin/self-healing', status: 'Working', issues: 0, notes: 'Health checks and auto-fix triggers working.' },
      { page: 'Training Hub', route: '/admin/training', status: 'Working', issues: 0, notes: 'Training content and navigation working.' },
      { page: 'Tunecore', route: '/admin/tunecore', status: 'Working', issues: 0, notes: 'Sync and status display working.' },
      { page: 'Videos', route: '/admin/videos', status: 'Working', issues: 0, notes: 'Video CRUD and preview working.' },
    ],
  },
  // ── FINANCE ──────────────────────────────────────────────────────────────────
  {
    section: 'Finance',
    pages: [
      { page: 'Financial Dashboard', route: '/admin/financials', status: 'Partial', issues: 2, notes: 'Revenue metrics display. Chart bar source chain and metric drill-down pending.' },
      { page: 'Wealth Dashboard', route: '/admin/wealth-dashboard', status: 'Partial', issues: 1, notes: 'Wealth tracking works. Row detail view needed.' },
      { page: 'Back of House Report', route: '/admin/report', status: 'Working', issues: 0, notes: 'Report generation and export working.' },
      { page: 'Legal Dashboard', route: '/admin/legal-dashboard', status: 'Working', issues: 0, notes: 'Legal documents and links working.' },
      { page: 'Security Centre', route: '/admin/security-centre', status: 'Working', issues: 0, notes: 'Security checks and alerts working.' },
    ],
  },
  // ── SETTINGS ─────────────────────────────────────────────────────────────────
  {
    section: 'Settings',
    pages: [
      { page: 'Site Settings', route: '/admin/settings', status: 'Working', issues: 0, notes: 'All settings save correctly.' },
      { page: 'Blueprint', route: '/admin/blueprint', status: 'Working', issues: 0, notes: 'Blueprint view and copy working.' },
      { page: 'Blueprint Builder', route: '/admin/blueprint-builder', status: 'Working', issues: 0, notes: 'Builder drag-and-drop working.' },
      { page: 'Client Installs', route: '/admin/client-installs', status: 'Working', issues: 0, notes: 'Install list and status working.' },
      { page: 'Client Onboarding', route: '/admin/client-onboarding', status: 'Working', issues: 0, notes: 'Onboarding flow working.' },
      { page: 'Merch Designs', route: '/admin/merch-designs', status: 'Working', issues: 0, notes: 'Design CRUD working.' },
      { page: 'Merch Platforms', route: '/admin/merch-platforms', status: 'Working', issues: 0, notes: 'Platform links and config working.' },
      { page: 'Monthly Monitoring', route: '/admin/monthly-monitoring', status: 'Working', issues: 0, notes: 'Monthly report display working.' },
      { page: 'Premium UX Audit', route: '/admin/premium-ux', status: 'Working', issues: 0, notes: 'Audit checklist working.' },
      { page: 'Sales Training', route: '/admin/sales-training', status: 'Working', issues: 0, notes: 'Training content working.' },
    ],
  },
  // ── PUBLIC ───────────────────────────────────────────────────────────────────
  {
    section: 'Public',
    pages: [
      { page: 'Home', route: '/', status: 'Working', issues: 0, notes: 'All CTAs, newsletter signup, social links working.' },
      { page: 'Music / Discography', route: '/music', status: 'Working', issues: 0, notes: 'Release cards, LyricsModal, streaming links working.' },
      { page: 'Lyrics Page', route: '/lyrics', status: 'Working', issues: 0, notes: 'Lyrics display and scroll working.' },
      { page: 'Current Single', route: '/current-single', status: 'Working', issues: 0, notes: 'Cinematic page, streaming links, fan review working.' },
      { page: 'Store', route: '/store', status: 'Working', issues: 0, notes: 'Product cards, checkout, promo codes, Stripe all working.' },
      { page: 'Community', route: '/community', status: 'Working', issues: 0, notes: 'Fan posts, replies, likes all working.' },
      { page: 'Videos', route: '/videos', status: 'Working', issues: 0, notes: 'Video list and embed working.' },
      { page: 'Contact', route: '/contact', status: 'Working', issues: 0, notes: 'Contact form and booking enquiry working.' },
      { page: 'Fan Profile', route: '/fan-profile', status: 'Working', issues: 0, notes: 'Profile save and preferences working.' },
      { page: 'Order History', route: '/orders', status: 'Working', issues: 0, notes: 'Order list for fan working.' },
      { page: 'Email Preferences', route: '/email-preferences', status: 'Working', issues: 0, notes: 'Preference updates working.' },
      { page: 'Back This', route: '/back-this', status: 'Working', issues: 0, notes: 'Support contribution flow working.' },
      { page: 'Summary', route: '/summary', status: 'Working', issues: 0, notes: 'Summary page displays correctly.' },
      { page: 'This Is My Life', route: '/this-is-my-life', status: 'Working', issues: 0, notes: 'About page working.' },
      { page: 'FAQ', route: '/faq', status: 'Working', issues: 0, notes: 'FAQ accordion working.' },
      { page: 'Supporter Activity', route: '/supporter-activity', status: 'Working', issues: 0, notes: 'Recent activity feed working.' },
      { page: 'Member Tiers', route: '/member-tiers', status: 'Working', issues: 0, notes: 'Tier display and CTA working.' },
      { page: 'Portrait Gallery', route: '/portrait-gallery', status: 'Working', issues: 0, notes: 'Gallery display working.' },
      { page: 'Impact', route: '/impact', status: 'Working', issues: 0, notes: 'Impact metrics display working.' },
      { page: 'Bookings', route: '/bookings', status: 'Working', issues: 0, notes: 'Booking form submission working.' },
      { page: 'Mastering', route: '/mastering', status: 'Working', issues: 0, notes: 'Mastering info and enquiry working.' },
      { page: 'Order Status', route: '/order-status', status: 'Working', issues: 0, notes: 'Order lookup working.' },
      { page: 'Merch Feedback', route: '/merch-feedback', status: 'Working', issues: 0, notes: 'Feedback form submission working.' },
      { page: 'Terms of Service', route: '/terms-of-service', status: 'Working', issues: 0, notes: 'Terms page displays correctly.' },
      { page: 'Privacy Policy', route: '/privacy-policy', status: 'Working', issues: 0, notes: 'Privacy policy displays correctly.' },
    ],
  },
];

const STATUS_STYLE = {
  'Working': 'bg-green-500/15 text-green-300 border-green-500/30',
  'Fixed': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'Partial': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'Broken': 'bg-red-500/15 text-red-300 border-red-500/30',
};

export default function SiteFunctionAudit() {
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const allPages = AUDIT_DATA.flatMap(s => s.pages.map(p => ({ ...p, section: s.section })));

  const filtered = allPages.filter(p => {
    if (sectionFilter !== 'all' && p.section !== sectionFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.page.toLowerCase().includes(q) || p.route.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q);
    }
    return true;
  });

  const total = allPages.length;
  const working = allPages.filter(p => p.status === 'Working' || p.status === 'Fixed').length;
  const partial = allPages.filter(p => p.status === 'Partial').length;
  const broken = allPages.filter(p => p.status === 'Broken').length;
  const totalIssues = allPages.reduce((s, p) => s + p.issues, 0);

  const sections = [...new Set(allPages.map(p => p.section))];

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Site Function Audit</h1>
        <p className="text-muted-foreground text-sm mt-1">{total} pages audited across all sections — click any row for detail</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Pages', value: total, color: 'text-primary', filter: 'all' },
          { label: 'Working / Fixed', value: working, color: 'text-green-400', filter: 'Working' },
          { label: 'Partial', value: partial, color: 'text-yellow-400', filter: 'Partial' },
          { label: 'Broken', value: broken, color: 'text-red-400', filter: 'Broken' },
          { label: 'Open Issues', value: totalIssues, color: 'text-orange-400', filter: 'all' },
        ].map(s => (
          <Card key={s.label} className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setStatusFilter(s.filter)}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pages, routes, notes..."
            className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...sections].map(s => (
            <button key={s} onClick={() => setSectionFilter(s)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${sectionFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              {s === 'all' ? 'All Sections' : s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'Working', 'Fixed', 'Partial', 'Broken'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2 py-0.5 rounded-full text-xs border transition-all ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Pages list */}
      <div className="space-y-1.5">
        {filtered.map((p, i) => (
          <div key={i}
            className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 cursor-pointer hover:border-primary/40 hover:bg-secondary/20 transition-all group"
            onClick={() => setSelected(p)}>
            <Badge className={`text-xs border shrink-0 ${STATUS_STYLE[p.status]}`}>{p.status}</Badge>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{p.page}</p>
                <Badge variant="outline" className="text-xs shrink-0">{p.section}</Badge>
              </div>
              <p className="text-xs text-primary font-mono">{p.route}</p>
            </div>
            {p.issues > 0 && (
              <Badge className="bg-yellow-500/15 text-yellow-300 text-xs shrink-0">{p.issues} issue{p.issues > 1 ? 's' : ''}</Badge>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No pages match this filter.</p>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-5 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{selected.section}</p>
                <h3 className="font-semibold text-lg">{selected.page}</h3>
                <p className="text-xs text-primary font-mono">{selected.route}</p>
              </div>
              <Badge className={`text-xs border ${STATUS_STYLE[selected.status]}`}>{selected.status}</Badge>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Audit Notes</p>
              <p className="text-sm">{selected.notes}</p>
            </div>
            {selected.issues > 0 && (
              <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3">
                <p className="text-xs text-yellow-400 mb-1">Open Issues: {selected.issues}</p>
                <p className="text-xs text-muted-foreground">See Operation Registry for specific operation-level fixes.</p>
              </div>
            )}
            <div className="flex gap-2">
              <Link to={selected.route} target="_blank">
                <Button variant="outline" size="sm" className="gap-1 text-xs"><ExternalLink className="w-3 h-3" /> Open Page</Button>
              </Link>
              <Link to="/admin/operation-registry">
                <Button variant="outline" size="sm" className="gap-1 text-xs">Operation Registry</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="text-xs">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}