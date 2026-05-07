import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Music, ShoppingBag, Package, Users, Settings, Globe, LogOut, Printer, Video, Mail, Palette, Heart, Camera, Tag, TrendingUp, Sparkles, Star, Gift, MessageCircle, DollarSign, Image, Activity, Calendar } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const NAV_SECTIONS = [
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
    title: 'Monitoring',
    items: [
      { label: 'Site Health', path: '/admin/site-health', icon: Activity },
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
          <Link to="/" className="font-body text-xs text-primary">View Site</Link>
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {NAV_SECTIONS.flatMap(s => s.items).map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full font-body text-xs ${
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground bg-secondary/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-24 lg:pt-0 overflow-y-auto">
        <div className="min-h-screen p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}