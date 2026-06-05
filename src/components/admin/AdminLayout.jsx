import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Music, ShoppingBag, Package, Users, Settings, Globe, LogOut,
  Video, Mail, Palette, Heart, Camera, Tag, TrendingUp, Sparkles, Star, Gift,
  MessageCircle, DollarSign, Image, Activity, Calendar, Search, Command,
  ChevronRight, Menu, X, Zap, Book, Brain, Shield, Lock, Eye, Megaphone,
  Lightbulb, CreditCard, Database, BookOpen, Bell, ExternalLink, FileText,
  GraduationCap, Building2, Play, AlertTriangle, ShoppingCart, Calculator, BarChart3, Terminal, Radio, Upload
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import GlobalSearch from '@/components/global/GlobalSearch';
import CommandPalette from '@/components/global/CommandPalette';

// ─── Consolidated Admin Navigation Hubs ───────────────────────────────────────
const NAV_SECTIONS = [
  {
    title: 'Executive',
    items: [
      // Top 3-5 Important
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { label: 'Mission Control', path: '/admin/mission-control', icon: Star },
      { label: 'Attention Centre', path: '/admin/business-attention-centre', icon: Bell },
      { label: 'Executive Feed', path: '/admin/executive-feed', icon: FileText },
      { label: 'Owner Business Hub', path: '/admin/owner-business', icon: Lock, ownerOnly: true },
      // Alphabetical Remaining
      { label: 'Business Worth Command', path: '/admin/business-worth-command', icon: BarChart3 },
      { label: 'Strategic Execution Plan', path: '/admin/strategic-execution-plan', icon: TrendingUp },
      { label: 'System Blueprint', path: '/admin/system-blueprint', icon: Building2 },
      { label: "Today's Money Moves", path: '/admin/todays-money-moves', icon: Zap }
    ]
  },
  {
    title: 'Commerce',
    items: [
      // Top 3-5 Important
      { label: 'Store & Orders Hub', path: '/admin/store-orders', icon: ShoppingBag },
      { label: 'Merch Management', path: '/admin/merch', icon: Package },
      { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
      { label: 'Promo Codes', path: '/admin/promo-codes', icon: Tag },
      { label: 'Offer Engine', path: '/admin/offer-engine', icon: Heart },
      // Alphabetical Remaining
      { label: 'Bundle Proposal Studio', path: '/admin/bundle-proposal-studio', icon: Tag },
      { label: 'Discount Guard', path: '/admin/discount-guard', icon: Shield },
      { label: 'Landed Cost Calculator', path: '/admin/landed-cost-calculator', icon: Calculator },
      { label: 'Merch Designs', path: '/admin/merch-designs', icon: Palette },
      { label: 'Merch Platforms', path: '/admin/merch-platforms', icon: Globe },
      { label: 'Procurement Command', path: '/admin/procurement-command', icon: Package },
      { label: 'Product Insights', path: '/admin/product-insights', icon: BarChart3 },
      { label: 'Shipping Rates', path: '/admin/shipping-rates', icon: Calculator }
    ]
  },
  {
    title: 'Social',
    items: [
      // Top 3-5 Important
      { label: 'Launch & Content Hub', path: '/admin/launch-content', icon: Megaphone },
      { label: 'Social Monitor', path: '/admin/social-monitor', icon: Activity },
      { label: 'Social Command', path: '/admin/social-command', icon: Radio },
      { label: 'Social Content Generator', path: '/admin/social-content', icon: Sparkles },
      { label: 'Daily Post Engine', path: '/admin/daily-post-engine', icon: Zap },
      // Alphabetical Remaining
      { label: 'Campaign Image Approval', path: '/admin/campaign-image-approval', icon: Image },
      { label: 'Content Performance', path: '/admin/content-performance', icon: TrendingUp },
      { label: 'Instagram Auto DM', path: '/admin/instagram-auto-dm-command', icon: MessageCircle },
      { label: 'Metricool Command', path: '/admin/metricool-command', icon: Database },
      { label: 'Social Agent OS', path: '/admin/social-agent-os', icon: Brain },
      { label: 'Social Asset Library', path: '/admin/social-asset-library', icon: Image },
      { label: 'Social Post Factory', path: '/admin/social-post-factory', icon: Package },
      { label: 'Social Schedule Queue', path: '/admin/social-schedule-queue', icon: Calendar },
      { label: 'TikTok App Review', path: '/admin/tiktok-review', icon: Video },
      { label: 'TikTok Recording Studio', path: '/admin/tiktok-recording-studio', icon: Camera }
    ]
  },
  {
    title: 'Community',
    items: [
      // Top 3-5 Important
      { label: 'Music & Fan Hub', path: '/admin/music-fan', icon: Users },
      { label: 'Subscribers', path: '/admin/subscribers', icon: Mail },
      { label: 'Fan Management', path: '/admin/fans', icon: Users },
      { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
      { label: 'Supporters', path: '/admin/supporters', icon: Heart },
      // Alphabetical Remaining
      { label: 'Birthday Discounts', path: '/admin/birthdays', icon: Tag },
      { label: 'Fan Media', path: '/admin/fan-media', icon: Video },
      { label: 'Gift Claims', path: '/admin/gift-claims', icon: Gift },
      { label: 'Gift Progress Admin', path: '/admin/gift-progress', icon: TrendingUp },
      { label: 'Gift Verification', path: '/admin/gift-verification', icon: Shield }
    ]
  },
  {
    title: 'Intelligence',
    items: [
      // Top 3-5 Important
      { label: 'Automation & Agents', path: '/admin/automation-agents', icon: Brain },
      { label: 'Agent Registry', path: '/admin/agent-registry', icon: Eye },
      { label: 'Agent Intelligence', path: '/admin/agent-intelligence', icon: Activity },
      { label: 'Agent Task Log', path: '/admin/agent-task-log', icon: Terminal },
      { label: 'Research Hub', path: '/admin/research-hub', icon: Search },
      // Alphabetical Remaining
      { label: 'Agent Learning', path: '/admin/agent-learning', icon: BookOpen },
      { label: 'Agent Message Bus', path: '/admin/agent-message-bus', icon: Database },
      { label: 'Agent Workbench', path: '/admin/agent-workbench', icon: Terminal },
      { label: 'Creator Insights', path: '/admin/creator-insights', icon: BarChart3 },
      { label: 'Knowledge Vault', path: '/admin/knowledge-vault', icon: Database },
      { label: 'Memory Graph', path: '/admin/memory-graph', icon: Activity },
      { label: 'OpenAI Command Centre', path: '/admin/openai-command', icon: Brain },
      { label: 'Research Grid', path: '/admin/research-grid', icon: Search },
      { label: 'Trend Monitor', path: '/admin/trend-monitor', icon: Activity }
    ]
  },
  {
    title: 'Operations',
    items: [
      // Top 3-5 Important
      { label: 'Systems & QA Hub', path: '/admin/systems-qa', icon: Activity },
      { label: 'Site Health', path: '/admin/site-health', icon: Heart },
      { label: 'Go Live Checklist', path: '/admin/go-live', icon: Zap },
      { label: 'Operational Status', path: '/admin/operational-status', icon: Activity },
      { label: 'QA Command Centre', path: '/admin/qa-command-centre', icon: Shield },
      // Alphabetical Remaining
      { label: 'Autonomous Ops', path: '/admin/autonomous-ops', icon: Zap },
      { label: 'Autonomous Repair Loop', path: '/admin/autonomous-repair-loop', icon: Activity },
      { label: 'Client Installs', path: '/admin/client-installs', icon: Terminal },
      { label: 'Code Audit Command', path: '/admin/code-audit', icon: FileText },
      { label: 'Developer Handoff', path: '/admin/developer-handoff', icon: ExternalLink },
      { label: 'Distributors', path: '/admin/distributors', icon: Building2 },
      { label: 'Integration Completion', path: '/admin/integration-completion-centre', icon: Zap },
      { label: 'Operation Registry', path: '/admin/operation-registry', icon: Database },
      { label: 'Playwright Test Centre', path: '/admin/playwright-test-centre', icon: Terminal },
      { label: 'Self Healing', path: '/admin/self-healing', icon: Zap }
    ]
  },
  {
    title: 'Finance',
    items: [
      // Top 3-5 Important
      { label: 'Financial Dashboard', path: '/admin/financials', icon: DollarSign },
      { label: 'Wealth Dashboard', path: '/admin/wealth-dashboard', icon: CreditCard },
      { label: 'Revenue Command Centre', path: '/admin/revenue-command', icon: DollarSign },
      { label: 'Stripe Command Centre', path: '/admin/stripe-command-centre', icon: CreditCard },
      { label: 'Stripe Live Report', path: '/admin/stripe-live-report', icon: Activity },
      // Alphabetical Remaining
      { label: 'Charity Tracking', path: '/admin/charity-tracking', icon: Heart },
      { label: 'Content to Cash', path: '/admin/content-to-cash', icon: DollarSign },
      { label: 'Merch Financials', path: '/admin/merch-financials', icon: DollarSign },
      { label: 'Revenue Actions', path: '/admin/revenue-actions', icon: Zap },
      { label: 'Webhook Health', path: '/admin/webhook-health', icon: Activity },
      { label: 'Weekly Money Report', path: '/admin/weekly-money-report', icon: FileText }
    ]
  },
  {
    title: 'Settings',
    items: [
      // Top 3-5 Important
      { label: 'Site Settings', path: '/admin/settings', icon: Settings },
      { label: 'API Setup', path: '/admin/api-setup', icon: Zap },
      { label: 'Business Details', path: '/admin/settings/business-details', icon: Settings },
      { label: 'Quick Upload', path: '/admin/quick-upload', icon: Upload },
      { label: 'Link Integrity Audit', path: '/admin/link-integrity-audit', icon: Activity },
      { label: 'Security Centre', path: '/admin/security-centre', icon: Shield },
      // Alphabetical Remaining
      { label: 'Audit Log', path: '/admin/audit-log', icon: FileText },
      { label: 'Client Onboarding', path: '/admin/client-onboarding', icon: Building2 },
      { label: 'Monthly Monitoring', path: '/admin/monthly-monitoring', icon: Activity },
      { label: 'Training Hub', path: '/admin/training', icon: BookOpen },
      { label: 'Sales Training', path: '/admin/sales-training', icon: GraduationCap }
    ]
  }
];

const OWNER_EMAIL = 'ganozwaye@gmail.com';

export default function AdminLayout() {
  const location = useLocation();
  const { user, isLoadingAuth, isLoadingPublicSettings, navigateToLogin } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    const fetchUnread = () => {
      base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 50)
        .then(items => setUnreadCount(items.length))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  useEffect(() => {
    if (user) setIsOwner(user.email === OWNER_EMAIL);
  }, [user]);

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

  // ─── ADMIN ROUTE GUARD ───────────────────────────────────────────────────
  if (isLoadingAuth || isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="font-body text-xs text-muted-foreground mt-4 tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigateToLogin();
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <Shield className="w-12 h-12 text-destructive mx-auto mb-4 opacity-60" />
          <h2 className="font-display text-xl text-foreground mb-2">Access Restricted</h2>
          <p className="font-body text-sm text-muted-foreground mb-6">You don't have admin access. Contact the site owner if you believe this is an error.</p>
          <a href="/" className="font-body text-sm text-primary underline">Return to site</a>
        </div>
      </div>
    );
  }
  // ─────────────────────────────────────────────────────────────────────────

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
              <Link to="/admin/business-attention-centre" className="relative p-2 hover:bg-secondary/50 rounded-lg transition-colors" title="Business Attention Centre">
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