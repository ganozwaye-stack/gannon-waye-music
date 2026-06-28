import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react';

const ALL_PAGES = [
  { label: 'A-Z Index', route: '/admin/az-index', category: 'Navigation' },
  { label: 'Agent Capability Matrix', route: '/admin/agent-capability-matrix', category: 'Intelligence' },
  { label: 'Agent Intelligence', route: '/admin/agent-intelligence', category: 'Intelligence' },
  { label: 'Agent Learning', route: '/admin/agent-learning', category: 'Intelligence' },
  { label: 'Agent Registry', route: '/admin/agent-registry', category: 'Intelligence' },
  { label: 'Agent Task Log', route: '/admin/agent-task-log', category: 'Intelligence' },
  { label: 'API Setup', route: '/admin/api-setup', category: 'Settings' },
  { label: 'Approval Queue', route: '/admin/approval-queue', category: 'Executive' },
  { label: 'Artist Business Setup', route: '/admin/artist-business-setup', category: 'Finance' },
  { label: 'Audit Log', route: '/admin/audit-log', category: 'Executive' },
  { label: 'Autonomous Ops', route: '/admin/autonomous-ops', category: 'Intelligence' },
  { label: 'Back of House Report', route: '/admin/report', category: 'Finance' },
  { label: 'Birthday Discounts', route: '/admin/birthdays', category: 'Community' },
  { label: 'Blueprint', route: '/admin/blueprint', category: 'Settings' },
  { label: 'Blueprint Builder', route: '/admin/blueprint-builder', category: 'Settings' },
  { label: 'Bookings / Mastering', route: '/admin/mastering', category: 'Operations' },
  { label: 'Bundle Proposal Studio', route: '/admin/bundle-proposal-studio', category: 'Commerce' },
  { label: 'Business Attention Centre', route: '/admin/notifications', category: 'Executive' },
  { label: 'Business Worth Command', route: '/admin/business-worth-command', category: 'Finance' },
  { label: 'Charity Tracking', route: '/admin/charity-tracking', category: 'Operations' },
  { label: 'Client Installs', route: '/admin/client-installs', category: 'Settings' },
  { label: 'Client Onboarding', route: '/admin/client-onboarding', category: 'Settings' },
  { label: 'Coaching Command', route: '/admin/coaching-command', category: 'Finance' },
  { label: 'Command Centre', route: '/admin/command-centre', category: 'Executive' },
  { label: 'Content Automate', route: '/admin/content-automate', category: 'Social' },
  { label: 'Content Dashboard', route: '/admin/content-dashboard', category: 'Social' },
  { label: 'Content to Cash Engine', route: '/admin/content-to-cash', category: 'Commerce' },
  { label: 'Creative Studio', route: '/admin/creative-studio', category: 'Social' },
  { label: 'Creator Insights', route: '/admin/creator-insights', category: 'Social' },
  { label: 'Dashboard (Admin)', route: '/admin', category: 'Executive' },
  { label: 'Distributors', route: '/admin/distributors', category: 'Operations' },
  { label: 'Ecommerce Command', route: '/admin/ecommerce-command', category: 'Commerce' },
  { label: 'Ecommerce Intelligence', route: '/admin/ecommerce-intelligence', category: 'Commerce' },
  { label: 'Executive Feed', route: '/admin/executive-feed', category: 'Executive' },
  { label: 'Fan Conversion Engine', route: '/admin/fan-conversion-engine', category: 'Commerce' },
  { label: 'Fan Management', route: '/admin/fans', category: 'Community' },
  { label: 'Fan Media', route: '/admin/fan-media', category: 'Community' },
  { label: 'Financial Dashboard', route: '/admin/financials', category: 'Finance' },
  { label: 'GanozMix Bridge', route: '/admin/ganozmix', category: 'Operations' },
  { label: 'Gift Claims', route: '/admin/gift-claims', category: 'Community' },
  { label: 'Gift Progress', route: '/admin/gift-progress', category: 'Community' },
  { label: 'Gift Verification', route: '/admin/gift-verification', category: 'Community' },
  { label: 'Go-Live Checklist', route: '/admin/go-live', category: 'Executive' },
  { label: 'Growth Engine', route: '/admin/growth-engine', category: 'Executive' },
  { label: 'Ideas Engine', route: '/admin/ideas-engine', category: 'Intelligence' },
  { label: 'Image Editor', route: '/admin/image-editor', category: 'Operations' },
  { label: 'Intelligence to Income', route: '/admin/intelligence-to-income', category: 'Commerce' },
  { label: 'Integration Completion Centre', route: '/admin/integration-completion-centre', category: 'Operations' },
  { label: 'Knowledge Vault', route: '/admin/knowledge-vault', category: 'Intelligence' },
  { label: 'Legal Dashboard', route: '/admin/legal-dashboard', category: 'Finance' },
  { label: 'Marketing Centre', route: '/admin/marketing-centre', category: 'Social' },
  { label: 'Mastering Admin', route: '/admin/mastering', category: 'Operations' },
  { label: 'Memory Graph', route: '/admin/memory-graph', category: 'Intelligence' },
  { label: 'Merch Designs', route: '/admin/merch-designs', category: 'Settings' },
  { label: 'Merch Feedback', route: '/admin/merch-feedback', category: 'Community' },
  { label: 'Merch Financials', route: '/admin/merch-financials', category: 'Commerce' },
  { label: 'Merch Management', route: '/admin/merch', category: 'Commerce' },
  { label: 'Merch Platforms', route: '/admin/merch-platforms', category: 'Settings' },
  { label: 'Monthly Monitoring', route: '/admin/monthly-monitoring', category: 'Settings' },
  { label: 'Music Command', route: '/admin/music-command', category: 'Operations' },
  { label: 'Newsletter', route: '/admin/newsletter', category: 'Community' },
  { label: 'Notifications / BAC', route: '/admin/notifications', category: 'Executive' },
  { label: 'Offer Engine', route: '/admin/offer-engine', category: 'Commerce' },
  { label: 'Operation Registry', route: '/admin/operation-registry', category: 'Intelligence' },
  { label: 'Operational Status', route: '/admin/operational-status', category: 'Operations' },
  { label: 'Orchestrator Chat', route: '/admin/orchestrator-chat', category: 'Executive' },
  { label: 'Order Profit Intelligence', route: '/admin/order-profit-intelligence', category: 'Commerce' },
  { label: 'Orders', route: '/admin/orders', category: 'Commerce' },
  { label: 'Payment Diagnostics', route: '/admin/payment-diagnostics', category: 'Finance' },
  { label: 'Premium UX Audit', route: '/admin/premium-ux', category: 'Settings' },
  { label: 'Product Insights', route: '/admin/product-insights', category: 'Commerce' },
  { label: 'Products (Merch)', route: '/admin/merch', category: 'Commerce' },
  { label: 'Promo Codes', route: '/admin/promo-codes', category: 'Commerce' },
  { label: 'Release Countdown', route: '/admin/release-countdown', category: 'Operations' },
  { label: 'Releases', route: '/admin/releases', category: 'Operations' },
  { label: 'Research Grid', route: '/admin/research-grid', category: 'Intelligence' },
  { label: 'Research Hub', route: '/admin/research-hub', category: 'Intelligence' },
  { label: 'Revenue Actions', route: '/admin/revenue-actions', category: 'Commerce' },
  { label: 'Revenue Command', route: '/admin/revenue-command', category: 'Operations' },
  { label: 'Reveal Newsletter', route: '/admin/reveal-newsletter', category: 'Community' },
  { label: 'Risk Alerts', route: '/admin/risk-alerts', category: 'Executive' },
  { label: 'Sales Training', route: '/admin/sales-training', category: 'Settings' },
  { label: 'Security Centre', route: '/admin/security-centre', category: 'Finance' },
  { label: 'Self Healing', route: '/admin/self-healing', category: 'Intelligence' },
  { label: 'Shipping Rates', route: '/admin/shipping-rates', category: 'Commerce' },
  { label: 'Site Function Audit', route: '/admin/site-function-audit', category: 'Intelligence' },
  { label: 'Site Health', route: '/admin/site-health', category: 'Executive' },
  { label: 'Site Settings', route: '/admin/settings', category: 'Settings' },
  { label: 'Social Command', route: '/admin/social-command', category: 'Social' },
  { label: 'Social Content Generator', route: '/admin/social-content', category: 'Social' },
  { label: 'Social Distribution Readiness', route: '/admin/social-distribution-readiness', category: 'Social' },
  { label: 'Social Intelligence', route: '/admin/social-intelligence', category: 'Social' },
  { label: 'Social Monitor', route: '/admin/social-monitor', category: 'Social' },
  { label: 'Stripe Command Centre', route: '/admin/stripe-command-centre', category: 'Finance' },
  { label: 'Stripe Live Report', route: '/admin/stripe-live-report', category: 'Commerce' },
  { label: 'Subscribers', route: '/admin/subscribers', category: 'Community' },
  { label: 'Supporters', route: '/admin/supporters', category: 'Commerce' },
  { label: 'Sync Licensing Command', route: '/admin/sync-licensing-command', category: 'Finance' },
  { label: 'Thank You Cards', route: '/admin/thank-you-cards', category: 'Community' },
  { label: 'TikTok App Review (Admin)', route: '/admin/tiktok-review', category: 'Social' },
  { label: 'TikTok Platform Review', route: '/tiktok-platform-review', category: 'Social' },
  { label: 'TikTok Recording Studio', route: '/admin/tiktok-recording-studio', category: 'Social' },
  { label: 'TikTok Screen Guide', route: '/admin/tiktok-screen-guide', category: 'Social' },
  { label: "Today's Money Moves", route: '/admin/todays-money-moves', category: 'Commerce' },
  { label: 'Training Hub', route: '/admin/training', category: 'Operations' },
  { label: 'Trend Monitor', route: '/admin/trend-monitor', category: 'Social' },
  { label: 'Tunecore Integration', route: '/admin/tunecore', category: 'Operations' },
  { label: 'Videos', route: '/admin/videos', category: 'Operations' },
  { label: 'Wealth Dashboard', route: '/admin/wealth-dashboard', category: 'Finance' },
  { label: 'Website Evolution Engine', route: '/admin/website-evolution', category: 'Commerce' },
  { label: 'Website Ops', route: '/admin/website-ops', category: 'Operations' },
  { label: 'Webhook Health', route: '/admin/webhook-health', category: 'Finance' },
  { label: 'Weekly Money Report', route: '/admin/weekly-money-report', category: 'Commerce' },
].sort((a, b) => a.label.localeCompare(b.label));

// Pinned daily operating items — shown at top before alphabetical listing
const PINNED_PAGES = [
  { label: 'Daily Dashboard', route: '/admin/dashboard', category: 'Executive' },
  { label: 'Command Center', route: '/admin/command-centre', category: 'Executive' },
  { label: "Today's Top Priorities", route: '/admin/dashboard', category: 'Executive' },
  { label: 'Daily Admin Checklist', route: '/admin/dashboard', category: 'Executive' },
  { label: 'Daily To-Dos', route: '/admin/dashboard', category: 'Executive' },
  { label: 'Approval Queue', route: '/admin/approval-queue', category: 'Executive' },
  { label: 'Blocked Items', route: '/admin/dashboard', category: 'Executive' },
  { label: 'Website Overhaul', route: '/admin/site-upgrade-audit', category: 'Executive' },
  { label: 'Content Studio', route: '/admin/content-studio', category: 'Social' },
  { label: 'Release Prep', route: '/admin/release-sprint', category: 'Operations' },
];

const CATEGORY_COLOR = {
  Executive: 'bg-purple-500/20 text-purple-400',
  Commerce: 'bg-green-500/20 text-green-400',
  Social: 'bg-pink-500/20 text-pink-400',
  Community: 'bg-yellow-500/20 text-yellow-400',
  Intelligence: 'bg-blue-500/20 text-blue-400',
  Operations: 'bg-cyan-500/20 text-cyan-400',
  Finance: 'bg-orange-500/20 text-orange-400',
  Settings: 'bg-slate-500/20 text-slate-400',
  Navigation: 'bg-primary/20 text-primary',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AtoZIndex() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...Object.keys(CATEGORY_COLOR)];

  const filtered = ALL_PAGES.filter(p => {
    const matchSearch = !search || p.label.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  // Group by first letter
  const grouped = {};
  filtered.forEach(p => {
    const letter = p.label[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(p);
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">A-Z Index</h1>
          <p className="text-muted-foreground text-sm">{ALL_PAGES.length} pages — find anything instantly</p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pages..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${categoryFilter === cat ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              {cat === 'all' ? `All (${ALL_PAGES.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned daily operating */}
      {!search && categoryFilter === 'all' && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">📌 Daily Operating</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {PINNED_PAGES.map(page => (
              <Link key={page.route + page.label} to={page.route}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors group">
                  <span className="font-body text-sm flex-1 group-hover:text-primary transition-colors">{page.label}</span>
                  <Badge className={`text-xs shrink-0 ${CATEGORY_COLOR[page.category] || 'bg-secondary text-secondary-foreground'}`}>{page.category}</Badge>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Alphabet quick-jump */}
      {!search && (
        <div className="flex flex-wrap gap-1">
          {ALPHABET.map(l => (
            <a key={l} href={`#letter-${l}`} className="text-xs text-muted-foreground hover:text-primary transition-colors px-1.5 py-0.5 rounded hover:bg-secondary/40">
              {l}
            </a>
          ))}
        </div>
      )}

      {/* Grouped listing */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([letter, pages]) => (
          <div key={letter} id={`letter-${letter}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-display font-bold text-primary/30">{letter}</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div className="space-y-1">
              {pages.map(page => (
                <Link key={page.route + page.label} to={page.route}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors group">
                    <span className="font-body text-sm flex-1 group-hover:text-primary transition-colors">{page.label}</span>
                    <Badge className={`text-xs shrink-0 ${CATEGORY_COLOR[page.category] || 'bg-secondary text-secondary-foreground'}`}>{page.category}</Badge>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Search className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No pages match "{search}"</p>
        </div>
      )}
    </div>
  );
}