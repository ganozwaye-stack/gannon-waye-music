import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Music, ShoppingBag, Package, Users, Settings, Globe, LogOut,
  Video, Mail, Palette, Heart, Camera, Tag, TrendingUp, Sparkles, Star, Gift,
  MessageCircle, DollarSign, Image, Activity, Calendar, Search, Command,
  ChevronRight, Menu, X, Zap, Book, Brain, Shield, Lock, Eye, Megaphone,
  Lightbulb, CreditCard, Database, BookOpen, Bell, ExternalLink, FileText,
  GraduationCap, Building2, Play, AlertTriangle, ShoppingCart, Calculator, BarChart3, Terminal, Radio, Upload,
  Film, MessageSquare
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import GlobalSearch from '@/components/global/GlobalSearch';
import CommandPalette from '@/components/global/CommandPalette';
import NotificationBell from '@/components/admin/NotificationBell';

// ─── Simplified Admin Navigation Hubs ───────────────────────────────────────
const NAV_SECTIONS = [
  {
    title: 'Owner Dashboard',
    items: [
      { label: 'Daily Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Attention Centre', path: '/admin/business-attention-centre', icon: Bell },
    ]
  },
  {
    title: 'Music and Releases',
    items: [
      { label: 'Music and Fan Hub', path: '/admin/music-fan', icon: Music },
      { label: 'Releases', path: '/admin/releases', icon: Star },
      { label: 'Videos', path: '/admin/videos', icon: Video },
      { label: 'Lyrics Archive', path: '/admin/lyrics-archive', icon: FileText },
      { label: 'Press Kit', path: '/admin/press-kit', icon: Megaphone },
    ]
  },
  {
    title: 'Store and Orders',
    items: [
      { label: 'Store and Orders Hub', path: '/admin/store-orders', icon: ShoppingBag },
      { label: 'Merch Management', path: '/admin/merch', icon: Package },
      { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
      { label: 'Promo Codes', path: '/admin/promo-codes', icon: Tag },
      { label: 'Shipping Rates', path: '/admin/shipping-rates', icon: Calculator },
    ]
  },
  {
    title: 'Content and Social',
    items: [
      { label: 'Launch and Content Hub', path: '/admin/launch-content', icon: Megaphone },
      { label: 'Content Studio', path: '/admin/content-studio', icon: Film },
      { label: 'ManyChat Drafts', path: '/admin/manychat-drafts', icon: MessageSquare },
      { label: 'Social Monitor', path: '/admin/social-monitor', icon: Activity },
      { label: 'Daily Post Engine', path: '/admin/daily-post-engine', icon: Zap },
      { label: 'Approval Queue', path: '/admin/approval-queue', icon: Shield },
    ]
  },
  {
    title: 'Automations and Agents',
    items: [
      { label: 'Automation and Agents Hub', path: '/admin/automation-agents', icon: Brain },
      { label: 'Agent Registry', path: '/admin/agent-registry', icon: Eye },
      { label: 'Agent Task Log', path: '/admin/agent-task-log', icon: Terminal },
      { label: 'Agent Workbench', path: '/admin/agent-workbench', icon: Terminal },
    ]
  },
  {
    title: 'Business and Finance',
    items: [
      { label: 'Owner Business Hub', path: '/admin/owner-business', icon: Lock, ownerOnly: true },
      { label: 'Financial Dashboard', path: '/admin/financials', icon: DollarSign },
      { label: 'Revenue Command', path: '/admin/revenue-command', icon: DollarSign },
      { label: 'Stripe Command', path: '/admin/stripe-command-centre', icon: CreditCard },
    ]
  },
  {
    title: 'Coaching and Private Work',
    items: [
      { label: 'Coaching Hub', path: '/admin/coaching-hub', icon: GraduationCap },
      { label: 'Coaching Leads', path: '/admin/coaching-leads', icon: Mail },
      { label: 'Coaching Clients', path: '/admin/coaching-clients', icon: Users },
      { label: "Mum's Garden", path: '/admin/mums-garden', icon: Heart },
      { label: 'Mum Tribute', path: '/admin/mum', icon: Heart },
      { label: 'Memorial', path: '/admin/memorial', icon: Heart },
    ]
  },
  {
    title: 'System Health',
    items: [
      { label: 'Systems and QA Hub', path: '/admin/systems-qa', icon: Activity },
      { label: 'Site Health', path: '/admin/site-health', icon: Heart },
      { label: 'Site Settings', path: '/admin/settings', icon: Settings },
      { label: 'API Setup', path: '/admin/api-setup', icon: Zap },
      { label: 'Security Centre', path: '/admin/security-centre', icon: Shield },
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

  const isAdmin = user?.role === 'admin';

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
            <NotificationBell />
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
              <NotificationBell />
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