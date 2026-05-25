import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Music, ShoppingBag, Package, Users, Settings, Globe, LogOut,
  Video, Mail, Palette, Heart, Camera, Tag, TrendingUp, Sparkles, Star, Gift,
  MessageCircle, DollarSign, Image, Activity, Calendar, Search, Command,
  ChevronRight, Menu, X, Zap, Book, Brain, Shield, Lock, Eye, Megaphone,
  Lightbulb, CreditCard, Database, BookOpen, Bell, ExternalLink, FileText,
  GraduationCap, Building2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import GlobalSearch from '@/components/global/GlobalSearch';
import CommandPalette from '@/components/global/CommandPalette';

// ─── 8 simplified top-level sections ───────────────────────────────────────
const NAV_SECTIONS = [
  {
    title: 'Executive',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      { label: 'Executive Feed', path: '/admin/executive-feed', icon: Star },
      { label: 'Approval Queue', path: '/admin/approval-queue', icon: Shield },
      // alphabetical below
      { label: 'Audit Log', path: '/admin/audit-log', icon: Activity },
      { label: 'Command Centre', path: '/admin/command-centre', icon: Brain },
      { label: 'Go-Live Checklist', path: '/admin/go-live', icon: Zap },
      { label: 'Growth Engine', path: '/admin/growth-engine', icon: TrendingUp },
      { label: 'Orchestrator AI', path: '/admin/orchestrator-chat', icon: Zap },
      { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: Eye },
      { label: 'Site Health', path: '/admin/site-health', icon: Activity },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { label: "Today's Money Moves", path: '/admin/todays-money-moves', icon: Zap },
      { label: 'Orders', path: '/admin/orders', icon: Package },
      { label: 'Order Profit Intelligence', path: '/admin/order-profit-intelligence', icon: DollarSign },
      { label: 'Products', path: '/admin/merch', icon: ShoppingBag },
      { label: 'Promo Codes', path: '/admin/promo-codes', icon: Tag },
      // alphabetical
      { label: 'Bundle Proposal Studio', path: '/admin/bundle-proposal-studio', icon: Package },
      { label: 'Content to Cash Engine', path: '/admin/content-to-cash', icon: Zap },
      { label: 'Ecommerce Command', path: '/admin/ecommerce-command', icon: ShoppingBag },
      { label: 'Ecommerce Intelligence', path: '/admin/ecommerce-intelligence', icon: Sparkles },
      { label: 'Fan Conversion Engine', path: '/admin/fan-conversion-engine', icon: Users },
      { label: 'Intelligence to Income', path: '/admin/intelligence-to-income', icon: Zap },
      { label: 'Merch Financials', path: '/admin/merch-financials', icon: DollarSign },
      { label: 'Offer Engine', path: '/admin/offer-engine', icon: Tag },
      { label: 'Product Insights', path: '/admin/product-insights', icon: TrendingUp },
      { label: 'Revenue Actions', path: '/admin/revenue-actions', icon: Zap },
      { label: 'Shipping Rates', path: '/admin/shipping-rates', icon: Package },
      { label: 'Stripe Live Report', path: '/admin/stripe-live-report', icon: CreditCard },
      { label: 'Supporters', path: '/admin/supporters', icon: Heart },
      { label: 'Website Evolution Engine', path: '/admin/website-evolution', icon: Globe },
      { label: 'Weekly Money Report', path: '/admin/weekly-money-report', icon: Activity },
    ],
  },
  {
    title: 'Social',
    items: [
      { label: 'TikTok Platform Review', path: '/tiktok-platform-review', icon: Zap },
      { label: 'TikTok App Review (Admin)', path: '/admin/tiktok-review', icon: Zap },
      { label: 'TikTok Screen Guide', path: '/admin/tiktok-screen-guide', icon: Video },
      { label: 'TikTok Recording Studio', path: '/admin/tiktok-recording-studio', icon: Video },
      { label: 'Social Content Gen', path: '/admin/social-content', icon: Megaphone },
      // alphabetical
      { label: 'Content Automate', path: '/admin/content-automate', icon: Zap },
      { label: 'Content Dashboard', path: '/admin/content-dashboard', icon: Sparkles },
      { label: 'Creative Studio', path: '/admin/creative-studio', icon: Palette },
      { label: 'Creator Insights', path: '/admin/creator-insights', icon: Eye },
      { label: 'Marketing Centre', path: '/admin/marketing-centre', icon: Megaphone },
      { label: 'Social Command', path: '/admin/social-command', icon: Users },
      { label: 'Social + Distribution Readiness', path: '/admin/social-distribution-readiness', icon: Globe },
      { label: 'Social Intelligence', path: '/admin/social-intelligence', icon: TrendingUp },
      { label: 'Social Monitor', path: '/admin/social-monitor', icon: MessageCircle },
      { label: 'Trend Monitor', path: '/admin/trend-monitor', icon: TrendingUp },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Fan Messages', path: '/admin/fans', icon: MessageCircle },
      { label: 'Subscribers', path: '/admin/subscribers', icon: Users },
      { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
      // alphabetical
      { label: 'Birthday Discounts', path: '/admin/birthdays', icon: Gift },
      { label: 'Fan Media', path: '/admin/fan-media', icon: Camera },
      { label: 'Gift Claims', path: '/admin/gift-claims', icon: Gift },
      { label: 'Gift Progress', path: '/admin/gift-progress', icon: Gift },
      { label: 'Gift Verification', path: '/admin/gift-verification', icon: Shield },
      { label: 'Merch Feedback', path: '/admin/merch-feedback', icon: MessageCircle },
      { label: 'Thank You Cards', path: '/admin/thank-you-cards', icon: Heart },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'Agent Intelligence', path: '/admin/agent-intelligence', icon: Brain },
      { label: 'Agent Capability Matrix', path: '/admin/agent-capability-matrix', icon: Brain },
      { label: 'Knowledge Vault', path: '/admin/knowledge-vault', icon: Database },
      { label: 'Research Grid', path: '/admin/research-grid', icon: TrendingUp },
      { label: 'Study Pals', path: '/admin/orchestrator-chat', icon: GraduationCap },
      // alphabetical
      { label: 'Agent Learning', path: '/admin/agent-learning', icon: BookOpen },
      { label: 'Agent Registry', path: '/admin/agent-registry', icon: Brain },
      { label: 'Agent Task Log', path: '/admin/agent-task-log', icon: Activity },
      { label: 'A-Z Index', path: '/admin/az-index', icon: BookOpen },
      { label: 'Operation Registry', path: '/admin/operation-registry', icon: Database },
      { label: 'Site Function Audit', path: '/admin/site-function-audit', icon: Activity },
      { label: 'Autonomous Ops', path: '/admin/autonomous-ops', icon: Activity },
      { label: 'Ideas Engine', path: '/admin/ideas-engine', icon: Lightbulb },
      { label: 'Memory Graph', path: '/admin/memory-graph', icon: Brain },
      { label: 'Research Hub', path: '/admin/research-hub', icon: Eye },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Music Command', path: '/admin/music-command', icon: Music },
      { label: 'Revenue Command', path: '/admin/revenue-command', icon: DollarSign },
      { label: 'Website Ops', path: '/admin/website-ops', icon: Globe },
      // alphabetical
      { label: 'API Setup', path: '/admin/api-setup', icon: Zap },
      { label: 'Bookings', path: '/admin/mastering', icon: Music },
      { label: 'Charity Tracking', path: '/admin/charity-tracking', icon: Heart },
      { label: 'Distributors', path: '/admin/distributors', icon: Music },
      { label: 'GanozMix Bridge', path: '/admin/ganozmix', icon: ExternalLink, ownerOnly: true },
      { label: 'Image Editor', path: '/admin/image-editor', icon: Image },
      { label: 'Mastering Admin', path: '/admin/mastering', icon: Music },
      { label: 'Operational Status', path: '/admin/operational-status', icon: Activity },
      { label: 'Release Countdown', path: '/admin/release-countdown', icon: Calendar },
      { label: 'Releases', path: '/admin/releases', icon: Music },
      { label: 'Self Healing', path: '/admin/self-healing', icon: Activity },
      { label: 'Training Hub', path: '/admin/training', icon: BookOpen },
      { label: 'Tunecore', path: '/admin/tunecore', icon: Music },
      { label: 'Videos', path: '/admin/videos', icon: Video },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Financial Dashboard', path: '/admin/financials', icon: DollarSign },
      { label: 'Business Worth Command', path: '/admin/business-worth-command', icon: Star },
      { label: 'Weekly Money Report', path: '/admin/weekly-money-report', icon: Activity },
      { label: 'Wealth Dashboard', path: '/admin/wealth-dashboard', icon: DollarSign },
      // alphabetical
      { label: 'Artist Business Setup', path: '/admin/artist-business-setup', icon: Building2 },
      { label: 'Back of House Report', path: '/admin/report', icon: FileText },
      { label: 'Coaching Command', path: '/admin/coaching-command', icon: Lock },
      { label: 'Legal Dashboard', path: '/admin/legal-dashboard', icon: Shield },
      { label: 'Payment Diagnostics', path: '/admin/payment-diagnostics', icon: CreditCard },
      { label: 'Security Centre', path: '/admin/security-centre', icon: Lock },
      { label: 'Stripe Command Centre', path: '/admin/stripe-command-centre', icon: CreditCard },
      { label: 'Sync Licensing', path: '/admin/sync-licensing-command', icon: Music },
      { label: 'Webhook Health', path: '/admin/webhook-health', icon: Activity },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Site Settings', path: '/admin/settings', icon: Settings },
      // alphabetical
      { label: 'Blueprint', path: '/admin/blueprint', icon: Book },
      { label: 'Blueprint Builder', path: '/admin/blueprint-builder', icon: Book },
      { label: 'Client Installs', path: '/admin/client-installs', icon: Users },
      { label: 'Client Onboarding', path: '/admin/client-onboarding', icon: Users },
      { label: 'Merch Designs', path: '/admin/merch-designs', icon: Palette },
      { label: 'Merch Platforms', path: '/admin/merch-platforms', icon: ShoppingBag },
      { label: 'Monthly Monitoring', path: '/admin/monthly-monitoring', icon: Calendar },
      { label: 'Premium UX Audit', path: '/admin/premium-ux', icon: Sparkles },
      { label: 'Sales Training', path: '/admin/sales-training', icon: DollarSign },
    ],
  },
];

const OWNER_EMAIL = 'ganozwaye@gmail.com';

export default function AdminLayout() {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = () => {
      base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 50)
        .then(items => setUnreadCount(items.length))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    base44.auth.me().then(user => setIsOwner(user?.email === OWNER_EMAIL)).catch(() => {});
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowCommand(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); setShowSearch(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSection = (title) => setCollapsed(prev => ({ ...prev, [title]: !prev[title] }));

  const filteredSections = NAV_SECTIONS.map(s => ({
    ...s,
    items: s.items.filter(item => !item.ownerOnly || isOwner),
  }));

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="w-60 bg-card border-r border-border/40 flex flex-col fixed inset-y-0 left-0 z-40 hidden lg:flex overflow-y-auto">
        <div className="p-5 border-b border-border/40 flex-shrink-0">
          <h2 className="font-display text-base text-foreground">Gannon Waye</h2>
          <p className="font-body text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">Admin OS</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredSections.map(section => {
            const isOpen = !collapsed[section.title];
            const hasActive = section.items.some(i => location.pathname === i.path);
            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[10px] font-semibold uppercase tracking-widest transition-colors ${hasActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {section.title}
                  <ChevronRight className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                  <div className="space-y-0.5 mb-1">
                    {section.items.map(item => {
                      const Icon = item.icon;
                      const active = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path + item.label}
                          to={item.path}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-xs transition-colors ${
                            active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border/40 space-y-0.5">
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors">
            <Globe className="w-3.5 h-3.5" /> View Site
          </Link>
          <button
            onClick={() => base44.auth.logout()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border/40 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm gradient-gold-text">GW Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/notifications" className="relative p-2 hover:bg-secondary/50 rounded-lg">
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            <button onClick={() => setShowCommand(true)} className="p-2 hover:bg-secondary/50 rounded-lg">
              <Command className="w-4 h-4 text-primary" />
            </button>
            <Link to="/" className="font-body text-xs text-primary">Site</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-secondary/50 rounded-lg">
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="mt-3 pb-2 max-h-[70vh] overflow-y-auto">
            {filteredSections.map(section => (
              <div key={section.title} className="mb-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 mb-1">{section.title}</p>
                {section.items.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path + item.label}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-lg font-body text-xs mb-0.5 ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 pt-16 lg:pt-0 overflow-y-auto">
        <div className="min-h-screen p-5 lg:p-7">
          {/* Top bar */}
          <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
              {location.pathname.split('/').filter(Boolean).slice(1).map((segment, i, arr) => {
                const path = `/admin/${arr.slice(0, i + 1).join('/')}`;
                const isLast = i === arr.length - 1;
                return (
                  <div key={path} className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    {isLast ? (
                      <span className="font-display text-foreground capitalize">{segment.replace(/-/g, ' ')}</span>
                    ) : (
                      <Link to={path} className="text-muted-foreground hover:text-foreground capitalize">{segment.replace(/-/g, ' ')}</Link>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/notifications" className="relative p-2 hover:bg-secondary/50 rounded-lg transition-colors" title="Business Attention Centre">
                <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setShowSearch(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 hover:border-primary/40 transition-colors">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-body text-xs text-muted-foreground hidden sm:inline">Search</span>
                <Badge variant="outline" className="text-[10px]">⌘F</Badge>
              </button>
              <button onClick={() => setShowCommand(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 hover:border-primary/40 transition-colors">
                <Command className="w-3.5 h-3.5 text-primary" />
                <span className="font-body text-xs text-muted-foreground hidden sm:inline">Commands</span>
                <Badge variant="outline" className="text-[10px]">⌘K</Badge>
              </button>
            </div>
          </div>
          <Outlet />
        </div>
      </main>

      {showSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] p-4" onClick={() => setShowSearch(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl">
            <GlobalSearch onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}
      <CommandPalette isOpen={showCommand} onClose={() => setShowCommand(false)} />
    </div>
  );
}