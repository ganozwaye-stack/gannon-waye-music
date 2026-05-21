import React, { useState } from 'react';
import { ExternalLink, ShoppingCart, TrendingUp, DollarSign, Package, Zap, RefreshCw, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">GanozMix Direct</h1>
          <p className="text-muted-foreground text-sm mt-1">Your dropship money machine — AI ecommerce operating system</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">eBay Connected</Badge>
          <Button
            onClick={() => window.open('https://ganozmixdirect.base44.app', '_blank')}
            className="gradient-gold-button gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Full App
          </Button>
        </div>
      </div>

      {/* Money Actions — primary CTAs */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">💸 Make Money Now</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MONEY_ACTIONS.map(action => (
            <a
              key={action.label}
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 p-4 rounded-xl border border-border/40 bg-card hover:border-primary/40 hover:bg-secondary/30 transition-all group cursor-pointer"
            >
              <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{action.label}</span>
              <span className="text-xs text-muted-foreground">{action.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Nav Links */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">⚡ Quick Navigation</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/40 bg-card hover:border-primary/30 hover:bg-secondary/30 transition-all"
              >
                <Icon className={`w-4 h-4 ${link.color}`} />
                <span className="text-xs font-medium text-foreground">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Live Embedded App */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">📺 Live View</p>
          <Button variant="outline" size="sm" onClick={() => setIframeKey(k => k + 1)} className="gap-1 text-xs">
            <RefreshCw className="w-3 h-3" /> Refresh
          </Button>
        </div>
        <div className="rounded-xl border border-border/40 overflow-hidden bg-card" style={{ height: '700px' }}>
          <iframe
            key={iframeKey}
            src="https://ganozmixdirect.base44.app"
            className="w-full h-full"
            title="GanozMix Direct"
            allow="fullscreen"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Viewing ganozmixdirect.base44.app — <a href="https://ganozmixdirect.base44.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">open in new tab ↗</a>
        </p>
      </div>
    </div>
  );
}