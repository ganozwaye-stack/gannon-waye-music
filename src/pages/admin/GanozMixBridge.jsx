import { useState, useEffect } from 'react';
import { ExternalLink, ShoppingCart, TrendingUp, DollarSign, Package, Zap, RefreshCw, Globe, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

const OWNER_EMAIL = 'ganozwaye@gmail.com';

const QUICK_LINKS = [
  { label: 'Command Center', url: 'https://ganozmixdirect.base44.app/admin/command-center', icon: Zap, color: 'text-purple-400' },
  { label: 'Find Products', url: 'https://ganozmixdirect.base44.app/discover', icon: Package, color: 'text-blue-400' },
  { label: 'My Store', url: 'https://ganozmixdirect.base44.app/products', icon: ShoppingCart, color: 'text-green-400' },
  { label: 'Orders', url: 'https://ganozmixdirect.base44.app/orders', icon: Package, color: 'text-orange-400' },
  { label: 'Profit Dashboard', url: 'https://ganozmixdirect.base44.app/profit-dashboard', icon: DollarSign, color: 'text-primary' },
  { label: 'Product Rankings', url: 'https://ganozmixdirect.base44.app/admin/product-rankings', icon: TrendingUp, color: 'text-yellow-400' },
  { label: 'Price Protection', url: 'https://ganozmixdirect.base44.app/admin/price-protection', icon: Shield, color: 'text-red-400' },
  { label: 'Supplier Intel', url: 'https://ganozmixdirect.base44.app/admin/supplier-intelligence', icon: Globe, color: 'text-cyan-400' },
];

const MONEY_ACTIONS = [
  { label: '🔥 Import Winning Products', url: 'https://ganozmixdirect.base44.app/discover', desc: 'Find trending dropship products' },
  { label: '🚀 Launch to eBay', url: 'https://ganozmixdirect.base44.app/products', desc: 'Publish live with one click' },
  { label: '💰 Check Profit Report', url: 'https://ganozmixdirect.base44.app/profit-dashboard', desc: 'Real-time margin analysis' },
  { label: '📦 Bulk Upload Products', url: 'https://ganozmixdirect.base44.app/bulk-upload', desc: 'Scale fast with bulk ops' },
  { label: '🏆 View Top Opportunities', url: 'https://ganozmixdirect.base44.app/admin/product-rankings', desc: 'AI-scored products ready to sell' },
  { label: '🔒 Lock Best Prices', url: 'https://ganozmixdirect.base44.app/admin/price-protection', desc: 'Protect margins automatically' },
];

export default function GanozMixBridge() {
  const [iframeKey, setIframeKey] = useState(0);
  const [showLiveView, setShowLiveView] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    base44.auth.me().then(user => {
      setAllowed(user?.email === OWNER_EMAIL);
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  if (checking) return <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-[#050607] py-24 text-zinc-400 text-sm">Checking access...</div>;

  if (!allowed) return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-[#050607] py-32 gap-4 text-center">
      <Lock className="w-10 h-10 text-zinc-500" />
      <h2 className="font-display text-xl text-zinc-100">Access Restricted</h2>
      <p className="text-zinc-400 text-sm max-w-sm">This page is owner-only. If you see this while signed in, the active Base44 session is not recognised as the owner account or the session has expired.</p>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 rounded-xl border border-zinc-800 bg-[#050607] p-4 text-zinc-100 shadow-inner shadow-black/30 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">GanozMix Direct</h1>
          <p className="text-zinc-400 text-sm mt-1">Dark command bridge for sourced, scored and approval-controlled ecommerce work</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">Owner Controls</Badge>
          <Button
            onClick={() => window.open('https://ganozmixdirect.base44.app', '_blank')}
            className="gradient-gold-button gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Full App
          </Button>
        </div>
      </div>

      {/* Money Actions - primary CTAs */}
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Make Money Now</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MONEY_ACTIONS.map(action => (
            <a
              key={action.label}
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950/90 p-4 transition-all hover:border-amber-400/40 hover:bg-zinc-900 group cursor-pointer"
            >
              <span className="font-semibold text-sm text-zinc-100 group-hover:text-amber-300 transition-colors">{action.label}</span>
              <span className="text-xs text-zinc-500">{action.desc}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">Sourcing Rules</p>
            <h2 className="mt-1 text-base font-semibold text-zinc-100">No fake winners</h2>
          </div>
          <Badge className="border-cyan-500/20 bg-cyan-500/10 text-cyan-300">Evidence first</Badge>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-black/30 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Demand</p>
            <p className="mt-1 text-xs text-zinc-500">Google Trends, TikTok Creative Center, eBay sold data and marketplace category signals.</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-black/30 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Supply</p>
            <p className="mt-1 text-xs text-zinc-500">Supplier reliability, shipping time, landed cost, return risk, restricted-product risk and review evidence.</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-black/30 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Profit</p>
            <p className="mt-1 text-xs text-zinc-500">Sale price, fees, freight, ad allowance, projected profit per unit and approval status before listing.</p>
          </div>
        </div>
      </div>

      {/* Quick Nav Links */}
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Quick Navigation</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/90 px-3 py-2.5 transition-all hover:border-amber-400/30 hover:bg-zinc-900"
              >
                <Icon className={`w-4 h-4 ${link.color}`} />
                <span className="text-xs font-medium text-zinc-100">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Live Embedded App */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">Live View</p>
            <p className="mt-1 text-xs text-zinc-500">The linked app controls its own theme, so the bright iframe is hidden until needed.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowLiveView(v => !v)} className="gap-1 text-xs border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
              {showLiveView ? 'Hide' : 'Show'} Live App
            </Button>
            {showLiveView && (
              <Button variant="outline" size="sm" onClick={() => setIframeKey(k => k + 1)} className="gap-1 text-xs border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
                <RefreshCw className="w-3 h-3" /> Refresh
              </Button>
            )}
          </div>
        </div>
        {showLiveView ? (
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-black" style={{ height: '700px' }}>
            <iframe
              key={iframeKey}
              src="https://ganozmixdirect.base44.app"
              className="h-full w-full bg-black"
              title="GanozMix Direct"
              allow="fullscreen"
            />
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-black/30 p-6 text-center">
            <Package className="h-8 w-8 text-zinc-500" />
            <p className="mt-3 text-sm font-semibold text-zinc-100">Live app preview paused</p>
            <p className="mt-1 max-w-md text-xs text-zinc-500">Use the dark command cards above for daily work. Open the live external app only when you need its native tools.</p>
          </div>
        )}
        <p className="text-xs text-zinc-500 mt-2 text-center">
          Linked app: <a href="https://ganozmixdirect.base44.app" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline">ganozmixdirect.base44.app</a>
        </p>
      </div>
    </div>
  );
}