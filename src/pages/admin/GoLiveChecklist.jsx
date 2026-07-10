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
      { id: 'stripe_live_keys', label: 'Stripe secrets configured (sk_live_ + pk_live_ + STRIPE_WEBHOOK_SECRET)', status: 'todo', note: 'Verify all three secrets are set and mode-matched in Base44 → Settings → Environment Variables.' },
      { id: 'stripe_webhook_signed', label: 'Webhook signing verified (STRIPE_WEBHOOK_SECRET matches endpoint)', status: 'todo', note: 'Stripe Dashboard → Webhooks → stripeWebhook → Recent deliveries shows no signature failures.' },
      { id: 'stripe_webhook_2xx', label: 'Webhook delivery returns 2xx in Stripe Dashboard', status: 'todo', note: 'Open Recent deliveries on the stripeWebhook endpoint — confirm HTTP 200 on recent events.' },
      { id: 'stripe_checkout_session', label: 'Checkout session creates successfully (createCheckoutSession)', status: 'todo', note: 'Complete a test checkout — Stripe Checkout page loads with correct line items and total.' },
      { id: 'stripe_merchorder_created', label: 'MerchOrder created on checkout.session.completed', status: 'todo', note: 'After test purchase, verify a MerchOrder appears in /admin/orders with status confirmed.' },
      { id: 'stripe_receipt_email', label: 'Order receipt email fires to customer', status: 'todo', note: 'Verify customer receives receipt email after test purchase (sendOrderReceipt).' },
      { id: 'stripe_admin_notification', label: 'Admin notification fires on new order', status: 'todo', note: 'Verify admin alert appears in /admin/notifications after test purchase.' },
      { id: 'stripe_inventory_profit', label: 'Inventory decremented + profit calculated automatically', status: 'todo', note: 'Verify MerchProduct.stock_quantity decreased and StripeEventLog shows profit margin after test purchase.' },
      { id: 'stripe_tax', label: 'Tax settings reviewed (GST for AU)', status: 'done', note: 'Exempt: Current revenue is below $75,000 AUD threshold. No GST registration required at this stage.' },
      { id: 'promo_codes_tested', label: 'Promo code validation tested live', status: 'done', note: 'LAUNCH15 (15% off) and THANKYOU10 (10% off) active and working ✓' },
    ],
  },
  {
    category: 'Email & Comms',
    icon: Mail,
    color: 'text-blue-400',
    items: [
      { id: 'gmail_connected', label: 'Gmail connector authorized', status: 'done', note: 'gmail connector active ✓' },
      { id: 'order_receipt', label: 'Order receipt email fires on purchase', status: 'done', note: 'Configured through welcome/receipt templates' },
      { id: 'admin_order_alert', label: 'Admin order alert email triggers', status: 'done', note: 'Alerts route to admin support inbox' },
      { id: 'welcome_email', label: 'Welcome email active for new subscribers', status: 'done', note: 'Automatic subscriber welcome email verified' },
      { id: 'unsubscribe_link', label: 'Unsubscribe preferences links active', status: 'done', note: 'Links route to /email-preferences' },
    ],
  },
  {
    category: 'Store & Checkout',
    icon: Zap,
    color: 'text-amber-400',
    items: [
      { id: 'products_active', label: 'All products marked is_active = true', status: 'done', note: 'Active in product catalogue' },
      { id: 'stock_levels', label: 'Stock quantities set correctly', status: 'done', note: 'Stock tracked on all items' },
      { id: 'shipping_rates', label: 'Shipping rates configured', status: 'done', note: 'calculateShippingRate function deployed and tested' },
      { id: 'checkout_flow', label: 'Full checkout flow tested', status: 'done', note: 'Sizes, quantities, and inclusive pricing flow verified' },
      { id: 'order_sheet_sync', label: 'Orders sync to Google Sheet', status: 'done', note: 'Sheets connector syncing order details' },
    ],
  },
  {
    category: 'Site & Domain',
    icon: Globe,
    color: 'text-purple-400',
    items: [
      { id: 'domain_live', label: 'gannonwaye.com pointing to live app', status: 'done', note: 'DNS configured and active' },
      { id: 'ssl_cert', label: 'SSL certificate active (HTTPS)', status: 'done', note: 'Secure HTTPS verified' },
      { id: 'meta_tags', label: 'OG / social share tags set in index.html', status: 'done', note: 'Title, description, and share tags complete' },
      { id: 'privacy_terms', label: 'Privacy Policy and Terms pages complete', status: 'done', note: 'Live at /privacy-policy and /terms-of-service' },
      { id: 'site_health', label: 'Site health check passes all tests', status: 'done', note: 'Site health verified' },
    ],
  },
  {
    category: 'Data & Security',
    icon: Database,
    color: 'text-cyan-400',
    items: [
      { id: 'admin_rls', label: 'All admin entities locked to admin role', status: 'done', note: 'RLS policies enforced' },
      { id: 'public_rls', label: 'Public entities have correct read rules', status: 'done', note: 'SiteSettings, SiteReveal, MerchProduct readable' },
      { id: 'idempotence', label: 'Idempotence log prevents duplicate orders', status: 'done', note: 'OrderLock system active' },
      { id: 'audit_log', label: 'Audit log capturing key actions', status: 'done', note: 'Capturing admin changes' },
      { id: 'fan_moderation', label: 'Fan post moderation active', status: 'done', note: 'Moderation queue active' },
    ],
  },
  {
    category: 'Risk & Compliance',
    icon: Shield,
    color: 'text-red-400',
    items: [
      { id: 'dnsl_rule', label: 'Do-Not-Spend-Or-Lose rule active on all agents', status: 'done', note: 'Restricted agent permissions active' },
      { id: 'approval_queue', label: 'Approval queue reviewed', status: 'done', note: 'Awaiting approvals monitored' },
      { id: 'risk_alerts', label: 'All open risk alerts reviewed', status: 'done', note: 'System health verified' },
      { id: 'legal_review', label: 'Fan community terms and policies reviewed', status: 'done', note: 'Reviewed terms of service' },
      { id: 'charity_tracking', label: 'Charity donation tracking active', status: 'done', note: '10% monthly giving tracked' },
    ],
  },
  {
    category: 'TikTok & Social',
    icon: Zap,
    color: 'text-purple-400',
    items: [
      { id: 'tiktok_code_fix', label: 'TIKTOK_CLIENT_KEY whitespace fix active', status: 'done', note: '.trim() active on token strings' },
      { id: 'tiktok_secret_reenter', label: 'TIKTOK_CLIENT_KEY configured', status: 'done', note: 'Client keys saved in Secrets' },
      { id: 'tiktok_secret_rotate', label: 'TIKTOK_CLIENT_SECRET active', status: 'done', note: 'Secret updated in settings' },
      { id: 'tiktok_oauth_live', label: 'TikTok OAuth active on gannonwaye.com', status: 'done', note: 'OAuth link ready' },
      { id: 'tiktok_upload_live', label: 'TikTok video.upload flow active', status: 'done', note: 'Draft flow active' },
      { id: 'metricool_connected', label: 'Metricool API connected', status: 'done', note: 'User ID and Blog ID connection verified' },
    ],
  },
  {
    category: 'QA & Browser Tests',
    icon: Shield,
    color: 'text-orange-400',
    items: [
      { id: 'playwright_built', label: 'Playwright test pack built', status: 'done', note: 'Tests available in repository' },
      { id: 'playwright_run', label: 'Browser QA run against production', status: 'done', note: 'End-to-end paths verified' },
      { id: 'approval_chain_proof', label: 'ApprovalQueue auto-action proven', status: 'done', note: 'Tested: proposal -> approval -> campaign' },
      { id: 'agent_revenue_status', label: 'Agent revenue status reviewed', status: 'done', note: 'Reviewed dashboard' },
      { id: 'final_system_status', label: 'Final system status verified', status: 'done', note: 'Verified 100% operational status' },
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