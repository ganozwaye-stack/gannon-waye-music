import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Music, ShoppingBag, Package, Users, Settings, Globe, LogOut, Printer } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Releases', path: '/admin/releases', icon: Music },
  { label: 'Merch Products', path: '/admin/merch', icon: ShoppingBag },
  { label: 'Orders', path: '/admin/orders', icon: Package },
  { label: 'Fan Community', path: '/admin/fans', icon: Users },
  { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  { label: 'Merch Platforms', path: '/admin/merch-platforms', icon: Printer },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border/40 flex flex-col fixed inset-y-0 left-0 z-40 hidden lg:flex">
        <div className="p-6 border-b border-border/40">
          <h2 className="font-display text-lg text-foreground">Gannon Waye</h2>
          <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => {
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
          <h2 className="font-display text-lg text-foreground">Admin</h2>
          <Link to="/" className="font-body text-xs text-primary">View Site</Link>
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {NAV_ITEMS.map(item => {
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
      <main className="flex-1 lg:ml-64 pt-24 lg:pt-0">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}