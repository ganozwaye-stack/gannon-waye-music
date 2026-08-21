import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Terminal, Shield, AlertTriangle, Globe, Film, Zap,
  Eye, Brain, Bell, DollarSign, Lock, CreditCard,
  Users, GraduationCap, Mail, Heart,
  Calendar, Music, Star, Video, FileText, Megaphone,
  Package, ShoppingCart, Tag, Calculator, ShoppingBag,
  Palette, MessageSquare, Activity,
  Settings, Search,
  Rocket
} from 'lucide-react';

// Every function Gannon needs, grouped. This is Deego's command launcher.
const GROUPS = [
  {
    title: 'Daily Operating',
    items: [
      { label: 'Daily Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Command Center', path: '/admin/command-centre', icon: Terminal },
      { label: 'Approval Queue', path: '/admin/approval-queue', icon: Shield },
      { label: 'Priorities', path: '/admin/priority-commander', icon: Zap },
      { label: 'Site Health', path: '/admin/site-health', icon: Globe },
      { label: 'Content Studio', path: '/admin/content-studio', icon: Film },
    ],
  },
  {
    title: 'Music & Releases',
    items: [
      { label: 'Releases', path: '/admin/releases', icon: Star },
      { label: 'Release Promo', path: '/admin/release-promo-command', icon: Megaphone },
      { label: 'Music Roadmap', path: '/admin/music-roadmap', icon: Calendar },
      { label: 'Production Tracker', path: '/admin/production-tracker', icon: Film },
      { label: 'Lyrics Archive', path: '/admin/lyrics-archive', icon: FileText },
      { label: 'Press Kit', path: '/admin/press-kit', icon: Megaphone },
      { label: 'Videos', path: '/admin/videos', icon: Video },
      { label: 'Music Command', path: '/admin/music-command', icon: Music },
    ],
  },
  {
    title: 'Store & Orders',
    items: [
      { label: 'Merch Approval Gate', path: '/admin/merch-approval', icon: Shield },
      { label: 'Merch Management', path: '/admin/merch', icon: Package },
      { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
      { label: 'Promo Codes', path: '/admin/promo-codes', icon: Tag },
      { label: 'Shipping Rates', path: '/admin/shipping-rates', icon: Calculator },
      { label: 'Print Fulfilment', path: '/admin/print-fulfilment', icon: Package },
      { label: 'Store Orders Hub', path: '/admin/store-orders', icon: ShoppingBag },
    ],
  },
  {
    title: 'Content & Social',
    items: [
      { label: 'Reel Factory', path: '/admin/reel-factory', icon: Film },
      { label: 'Daily Post Engine', path: '/admin/daily-post-engine', icon: Zap },
      { label: 'ManyChat Drafts', path: '/admin/manychat-drafts', icon: MessageSquare },
      { label: 'Social Monitor', path: '/admin/social-monitor', icon: Activity },
      { label: 'Brand Kit', path: '/admin/brand-kit', icon: Palette },
      { label: 'Launch Hub', path: '/admin/launch-content', icon: Rocket },
    ],
  },
  {
    title: 'Money & Business',
    items: [
      { label: 'Financials', path: '/admin/financials', icon: DollarSign },
      { label: 'Revenue Command', path: '/admin/revenue-command', icon: DollarSign },
      { label: 'Stripe Command', path: '/admin/stripe-command-centre', icon: CreditCard },
      { label: 'Owner Business Hub', path: '/admin/owner-business', icon: Lock },
      { label: 'Ideas Engine', path: '/admin/ideas-engine', icon: Eye },
    ],
  },
  {
    title: 'Fans & Coaching',
    items: [
      { label: 'Fans', path: '/admin/fans', icon: Users },
      { label: 'Subscribers', path: '/admin/subscribers', icon: Mail },
      { label: 'Coaching Hub', path: '/admin/coaching-hub', icon: GraduationCap },
      { label: 'Coaching Clients', path: '/admin/coaching-clients', icon: Users },
      { label: 'Supporters', path: '/admin/supporters', icon: Heart },
    ],
  },
  {
    title: 'System & Agents',
    items: [
      { label: 'Agent Registry', path: '/admin/agent-registry', icon: Eye },
      { label: 'Agent Workbench', path: '/admin/agent-workbench', icon: Brain },
      { label: 'Attention Centre', path: '/admin/business-attention-centre', icon: Bell },
      { label: 'API Setup', path: '/admin/api-setup', icon: Zap },
      { label: 'Security Centre', path: '/admin/security-centre', icon: Shield },
      { label: 'Site Settings', path: '/admin/settings', icon: Settings },
      { label: 'Risk Alerts', path: '/admin/risk-alerts', icon: AlertTriangle },
    ],
  },
];

export default function FunctionLauncher() {
  const [query, setQuery] = useState('');

  const filtered = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg text-foreground">Function Launcher</h2>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search functions…"
            className="h-8 w-full sm:w-56 rounded-md border border-border/40 bg-secondary/30 pl-9 pr-3 text-sm font-body"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <div key={g.title}>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{g.title}</p>
            <div className="grid grid-cols-2 gap-2">
              {g.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path + item.label}
                    to={item.path}
                    className="flex items-center gap-2 rounded-lg bg-secondary/20 hover:bg-primary/10 hover:border-primary/30 border border-transparent px-3 py-2 transition-colors group"
                  >
                    <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                    <span className="font-body text-xs text-foreground/70 group-hover:text-foreground truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}