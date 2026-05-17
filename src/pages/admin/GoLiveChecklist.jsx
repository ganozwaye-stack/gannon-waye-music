import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, AlertTriangle, ExternalLink, Zap, Shield, CreditCard, Mail, Globe, Database, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const CHECKLIST = [
  {
    category: 'Stripe & Payments',
    icon: CreditCard,
    color: 'text-green-400',
    items: [
      { id: 'stripe_live_keys', label: 'Stripe live keys set (sk_live / pk_live)', status: 'done', note: 'Updated 17 May 2026' },
      { id: 'stripe_test_charge', label: 'Test $1 charge created successfully via backend', status: 'done', note: 'pi_3TXuX7ClJA0hGwhH1Fx2DraS — verified' },
      { id: 'stripe_webhook', label: 'Stripe webhook endpoint registered', status: 'action', note: 'Register at dashboard.stripe.com/webhooks → onNewOrderAutomation', link: 'https://dashboard.stripe.com/webhooks' },
      { id: 'stripe_webhook_secret', label: 'STRIPE_WEBHOOK_SECRET added to environment', status: 'action', note: 'Get from Stripe after registering webhook' },
      { id: 'stripe_tax', label: 'Tax settings reviewed (GST for AU)', status: 'review', note: 'Check Stripe Tax settings or handle manually' },
      { id: 'promo_codes_tested', label: 'Promo code validation tested live', status: 'todo', note: 'Test LAUNCH15 on store' },
    ],
  },
  {
    category: 'Email & Comms',
    icon: Mail,
    color: 'text-blue-400',
    items: [
      { id: 'gmail_connected', label: 'Gmail connector authorized', status: 'done', note: 'gmail connector live' },
      { id: 'order_receipt', label: 'Order receipt email fires on purchase', status: 'todo', note: 'Place test order and verify email' },
      { id: 'admin_order_alert', label: 'Admin order alert email fires', status: 'todo', note: 'Check ganozwaye@gmail.com after test order' },
      { id: 'welcome_email', label: 'Welcome email fires on new subscriber', status: 'todo', note: 'Subscribe on /back-this and verify' },
      { id: 'unsubscribe_link', label: 'Unsubscribe link works in all emails', status: 'review', note: 'Links to /email-preferences' },
    ],
  },
  {
    category: 'Store & Checkout',
    icon: Zap,
    color: 'text-amber-400',
    items: [
      { id: 'products_active', label: 'All products marked is_active = true', status: 'todo', note: 'Review in Admin → Merch' },
      { id: 'stock_levels', label: 'Stock quantities set correctly', status: 'todo', note: 'Review in Admin → Merch' },
      { id: 'shipping_rates', label: 'Shipping rates configured', status: 'review', note: 'Check calculateShippingRate function' },
      { id: 'checkout_flow', label: 'Full checkout flow tested end-to-end', status: 'todo', note: 'Use real card on live store' },
      { id: 'order_sheet_sync', label: 'Orders sync to Google Sheet', status: 'todo', note: 'Check Google Sheet after test order' },
    ],
  },
  {
    category: 'Site & Domain',
    icon: Globe,
    color: 'text-purple-400',
    items: [
      { id: 'domain_live', label: 'gannonwaye.com pointing to live app', status: 'review', note: 'Verify DNS in Base44 dashboard' },
      { id: 'ssl_cert', label: 'SSL certificate active (HTTPS)', status: 'review', note: 'Check in Base44 → Custom Domains' },
      { id: 'meta_tags', label: 'OG / social share tags set in index.html', status: 'todo', note: 'Add title, description, og:image' },
      { id: 'privacy_terms', label: 'Privacy Policy and Terms pages complete', status: 'review', note: 'At /privacy-policy and /terms-of-service' },
      { id: 'site_health', label: 'Site health check passes all tests', status: 'todo', note: 'Run Admin → Site Health Check' },
    ],
  },
  {
    category: 'Data & Security',
    icon: Database,
    color: 'text-cyan-400',
    items: [
      { id: 'admin_rls', label: 'All admin entities locked to admin role', status: 'done', note: 'RLS configured on all entities' },
      { id: 'public_rls', label: 'Public entities have correct read rules', status: 'done', note: 'SiteSettings, SiteReveal, MerchProduct readable' },
      { id: 'idempotence', label: 'Idempotence log prevents duplicate orders', status: 'done', note: 'Implemented in onNewOrderAutomation' },
      { id: 'audit_log', label: 'Audit log capturing key actions', status: 'review', note: 'Check Admin → Audit Log' },
      { id: 'fan_moderation', label: 'Fan post moderation active', status: 'done', note: 'Posts require approval before display' },
    ],
  },
  {
    category: 'Risk & Compliance',
    icon: Shield,
    color: 'text-red-400',
    items: [
      { id: 'dnsl_rule', label: 'Do-Not-Spend-Or-Lose rule active on all agents', status: 'done', note: 'Enforced in orchestrator instructions' },
      { id: 'approval_queue', label: 'Approval queue reviewed before launch', status: 'todo', note: 'Check Admin → Approval Queue' },
      { id: 'risk_alerts', label: 'All open risk alerts reviewed', status: 'todo', note: 'Check Admin → Risk Alerts' },
      { id: 'legal_review', label: 'Fan community terms and policies reviewed', status: 'review', note: 'Check /terms-of-service' },
      { id: 'charity_tracking', label: 'Charity donation tracking verified', status: 'review', note: 'Check Admin → Charity Tracking' },
    ],
  },
];

const STATUS_CONFIG = {
  done: { label: 'Done', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2, iconColor: 'text-green-400' },
  todo: { label: 'To Do', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: Circle, iconColor: 'text-slate-400' },
  action: { label: 'Action Required', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: AlertTriangle, iconColor: 'text-red-400' },
  review: { label: 'Review', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: AlertTriangle, iconColor: 'text-yellow-400' },
};

export default function GoLiveChecklist() {
  const [overrides, setOverrides] = useState({});
  const [testing, setTesting] = useState(false);

  const toggle = (id, currentStatus) => {
    if (currentStatus === 'done' || overrides[id] === 'done') {
      setOverrides(prev => { const n = { ...prev }; delete n[id]; return n; });
    } else {
      setOverrides(prev => ({ ...prev, [id]: 'done' }));
    }
  };

  const runHealthCheck = async () => {
    setTesting(true);
    try {
      const res = await base44.functions.invoke('runSiteHealthCheck', {});
      toast.success(`Health check complete — ${res.data?.passed || 0} passed`);
    } catch {
      toast.error('Health check failed — check function logs');
    }
    setTesting(false);
  };

  const allItems = CHECKLIST.flatMap(c => c.items);
  const effectiveStatus = (item) => overrides[item.id] || item.status;
  const total = allItems.length;
  const done = allItems.filter(i => effectiveStatus(i) === 'done').length;
  const actions = allItems.filter(i => effectiveStatus(i) === 'action').length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Go-Live Checklist</h1>
          <p className="text-muted-foreground text-sm mt-1">Pre-launch verification across all systems</p>
        </div>
        <Button onClick={runHealthCheck} disabled={testing} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          Run Site Health Check
        </Button>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Launch Readiness</span>
            <span className="text-sm font-bold text-primary">{pct}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mb-3">
            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct >= 80 ? 'hsl(var(--primary))' : pct >= 50 ? '#f59e0b' : '#ef4444' }} />
          </div>
          <div className="flex gap-4 text-xs">
            <span className="text-green-400">✓ {done} done</span>
            <span className="text-red-400">⚠ {actions} action required</span>
            <span className="text-muted-foreground">{total - done - actions} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {CHECKLIST.map(cat => {
        const Icon = cat.icon;
        const catDone = cat.items.filter(i => effectiveStatus(i) === 'done').length;
        return (
          <Card key={cat.category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className={`w-4 h-4 ${cat.color}`} />
                {cat.category}
                <Badge variant="outline" className="ml-auto text-xs">{catDone}/{cat.items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {cat.items.map(item => {
                const st = effectiveStatus(item);
                const cfg = STATUS_CONFIG[st];
                const Ic = cfg.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors group">
                    <button onClick={() => toggle(item.id, st)} className="mt-0.5 shrink-0">
                      <Ic className={`w-4 h-4 ${cfg.iconColor} group-hover:opacity-80`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm ${st === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.label}</span>
                        <Badge className={`text-[10px] border ${cfg.color}`}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                    </div>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors" />
                      </a>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}