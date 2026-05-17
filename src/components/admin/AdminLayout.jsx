import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Music, ShoppingBag, Package, Users, Settings, Globe, LogOut, Printer, Video, Mail, Palette, Heart, Camera, Tag, TrendingUp, Sparkles, Star, Gift, MessageCircle, DollarSign, Image, Activity, Calendar, Search, Command, ChevronRight, Menu, X, Zap, Book, Brain, Shield, Lock, Eye, Megaphone, Lightbulb } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import GlobalSearch from '@/components/global/GlobalSearch';
import CommandPalette from '@/components/global/CommandPalette';

const NAV_SECTIONS = [
  {
    title: '⚡ AI Operating System',
    items: [
      { label: '🧠 Command Centre', path: '/admin/command-centre', icon: Brain },
      { label: '📋 Executive Feed', path: '/admin/executive-feed', icon: Star },
      { label: '💡 Ideas Engine', path: '/admin/ideas-engine', icon: Lightbulb },
      { label: '🧠 Memory Graph', path: '/admin/memory-graph', icon: Brain },
      { label: '🔬 Agent Learning', path: '/admin/agent-learning', icon: Activity },
      { label: '🩺 Self Healing', path: '/admin/self-healing', icon: Activity },
      { label: '🔌 API Setup', path: '/admin/api-setup', icon: Zap },
      { label: '✨ Premium UX', path: '/admin/premium-ux', icon: Sparkles },
      { label: '📡 Social Intel', path: '/admin/social-intelligence', icon: TrendingUp },
      { label: '🎯 Creator Insights', path: '/admin/creator-insights', icon: Eye },
      { label: 'Orchestrator AI', path: '/admin/orchestrator-chat', icon: Zap },
      { label: 'Agent Registry', path: '/admin/agent-registry', icon: Brain },
      { label: 'Approval Queue', path: '/admin/approval-queue', icon: Shield },
      { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: Eye },
      { label: 'Knowledge Vault', path: '/admin/knowledge-vault', icon: Lock },
      { label: 'Legal Dashboard', path: '/admin/legal-dashboard', icon: Shield },
      { label: 'Wealth Dashboard', path: '/admin/wealth-dashboard', icon: DollarSign },
      { label: 'Research Hub', path: '/admin/research-hub', icon: Eye },
      { label: 'Creative Studio', path: '/admin/creative-studio', icon: Sparkles },
      { label: 'Marketing Centre', path: '/admin/marketing-centre', icon: Megaphone },
      { label: 'Social Command', path: '/admin/social-command', icon: Users },
      { label: 'Social Monitor', path: '/admin/social-monitor', icon: MessageCircle },
      { label: 'Content Dashboard', path: '/admin/content-dashboard', icon: Sparkles },
      { label: 'Security Centre', path: '/admin/security-centre', icon: Lock },
      { label: 'Trend Monitor', path: '/admin/trend-monitor', icon: TrendingUp },
      { label: 'Website Ops', path: '/admin/website-ops', icon: Globe },
      { label: 'Agent Task Log', path: '/admin/agent-task-log', icon: Activity },
    ]
  },
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Music',
    items: [
      { label: 'My Releases', path: '/admin/releases', icon: Music },
    ]
  },
  {
    title: 'Merchandise',
    items: [
      { label: 'My Products', path: '/admin/merch', icon: ShoppingBag },
      { label: 'Product Financials', path: '/admin/merch-financials', icon: DollarSign },
      { label: 'Design & Source', path: '/admin/merch-platforms', icon: Printer },
      { label: 'My Designs', path: '/admin/merch-designs', icon: Palette },
      { label: 'Image Editor', path: '/admin/image-editor', icon: Image },
      { label: 'Orders & Shipping', path: '/admin/orders', icon: Package },
      { label: 'Thank You Cards', path: '/admin/thank-you-cards', icon: Heart },
      { label: 'Product Intelligence', path: '/admin/product-insights', icon: Sparkles },
    ]
  },
  {
    title: 'CRM & Community',
    items: [
      { label: 'Supporter Registry', path: '/admin/subscribers', icon: Users },
      { label: 'Community Messages', path: '/admin/fans', icon: MessageCircle },
      { label: 'Community Media Wall', path: '/admin/fan-media', icon: Camera },
      { label: 'Social Videos', path: '/admin/videos', icon: Video },
      { label: 'Subscriber Newsletter', path: '/admin/newsletter', icon: Mail },
      { label: 'Promo Codes', path: '/admin/promo-codes', icon: Tag },
      { label: 'Engagement Reports', path: '/admin/report', icon: TrendingUp },
      { label: 'Reveal Newsletter', path: '/admin/reveal-newsletter', icon: Mail },
    ]
  },
  {
    title: 'Finance',
    items: [
      { label: 'Financial Dashboard', path: '/admin/financials', icon: Sparkles },
    ]
  },
  {
    title: 'Campaigns',
    items: [
      { label: 'Hoodie Gift Offer', path: '/admin/hoodie-offer', icon: Gift },
      { label: 'Gift Verification', path: '/admin/gift-verification', icon: Gift },
      { label: 'Gift Progress', path: '/admin/gift-progress', icon: Gift },
      { label: 'Release Countdown', path: '/admin/release-countdown', icon: Calendar },
    ]
  },
  {
    title: 'Mastering',
    items: [
      { label: 'Ecommerce Intel', path: '/admin/ecommerce-intelligence', icon: ShoppingBag },
      { label: 'Blueprint Builder', path: '/admin/blueprint-builder', icon: Book },
      { label: 'Client Installs', path: '/admin/client-installs', icon: Users },
      { label: '🚀 Go-Live Checklist', path: '/admin/go-live', icon: Zap },
      { label: 'Distributors', path: '/admin/distributors', icon: Music },
      { label: 'Engineer Queue', path: '/admin/mastering', icon: Music },
      { label: 'Open Mastering Tool', path: '/mastering', icon: Zap },
    ]
  },
  {
    title: 'Monitoring',
    items: [
      { label: 'Site Health', path: '/admin/site-health', icon: Activity },
      { label: 'App Blueprint', path: '/admin/blueprint', icon: Book },
    ]
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Birthday Discounts', path: '/admin/birthdays', icon: Gift },
      { label: 'Social Content Generator', path: '/admin/social-content', icon: Sparkles },
    ]
  },
  {
    title: 'Settings',
    items: [
      { label: 'Site Settings', path: '/admin/settings', icon: Settings },
    ]
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K: Open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommand(true);
      }
      // Cmd/Ctrl + F: Open global search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border/40 flex flex-col fixed inset-y-0 left-0 z-40 hidden lg:flex overflow-y-auto">
        <div className="p-6 border-b border-border/40 flex-shrink-0">
          <h2 className="font-display text-lg text-foreground">Gannon Waye</h2>
          <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {NAV_SECTIONS.map(section => (
            <div key={section.title}>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground px-3 mb-2">{section.title}</p>
              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-border/40 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            <Globe className="w-4 h-4" /> View Site
          </Link>
          <button
            onClick={() => base44.auth.logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border/40 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-full border border-primary/60 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(255,224,138,0.08))' }}>
            <span className="font-display text-xs gradient-gold-text font-semibold tracking-wider">GW</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCommand(true)}
              className="p-2 hover:bg-secondary/50 rounded-lg"
            >
              <Command className="w-4 h-4 text-primary" />
            </button>
            <Link to="/" className="font-body text-xs text-primary">View Site</Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-secondary/50 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mt-3 space-y-1 pb-2">
            {NAV_SECTIONS.flatMap(s => s.items).map(item => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg font-body text-sm ${
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-24 lg:pt-0 overflow-y-auto">
        <div className="min-h-screen p-6 lg:p-8">
          {/* Breadcrumbs and Actions Bar */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
              {location.pathname.split('/').filter(Boolean).slice(1).map((segment, i, arr) => {
                const path = `/admin/${arr.slice(0, i + 1).join('/')}`;
                const isLast = i === arr.length - 1;
                return (
                   <div key={path} className="flex items-center gap-2">
                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
                     {isLast ? (
                       <span className="font-display text-foreground capitalize">{segment.replace(/-/g, ' ')}</span>
                     ) : (
                       <Link to={path} className="text-muted-foreground hover:text-foreground capitalize">
                         {segment.replace(/-/g, ' ')}
                       </Link>
                     )}
                   </div>
                 );
              })}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 hover:border-primary/40 transition-colors"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="font-body text-xs text-muted-foreground hidden sm:inline">Search</span>
                <Badge variant="outline" className="text-[10px]">⌘F</Badge>
              </button>
              <button
                onClick={() => setShowCommand(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 hover:border-primary/40 transition-colors"
              >
                <Command className="w-4 h-4 text-primary" />
                <span className="font-body text-xs text-muted-foreground hidden sm:inline">Commands</span>
                <Badge variant="outline" className="text-[10px]">⌘K</Badge>
              </button>
            </div>
          </div>
          
          <Outlet />
        </div>
      </main>

      {/* Global Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] p-4" onClick={() => setShowSearch(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl">
            <GlobalSearch onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette isOpen={showCommand} onClose={() => setShowCommand(false)} />
    </div>
  );
}