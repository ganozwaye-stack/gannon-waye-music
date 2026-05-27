import { CheckCircle2, XCircle, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG = {
  complete: { icon: <CheckCircle2 className="w-4 h-4 text-green-400" />, badge: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Complete' },
  blocked: { icon: <XCircle className="w-4 h-4 text-red-400" />, badge: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Blocked' },
  partial: { icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Partial' },
  pending: { icon: <Clock className="w-4 h-4 text-muted-foreground" />, badge: 'bg-muted/30 text-muted-foreground border-border', label: 'Not started' },
};

const STATIC_ITEMS = [
  {
    section: '💳 Stripe',
    items: [
      { label: 'Webhook secret rotated', key: 'stripe', note: 'Rotate at dashboard.stripe.com/webhooks' },
      { label: 'Key mode confirmed (live/test match)', key: 'stripe', note: 'Both keys must be same environment' },
      { label: 'Checkout tested end-to-end', key: 'stripe', note: 'Order created, receipt sent, webhook received' },
    ],
  },
  {
    section: '🎵 TikTok',
    items: [
      { label: 'Client key saved (no spaces)', key: 'tiktok', note: 'Must be exactly as shown in TikTok portal' },
      { label: 'Client secret rotated', key: 'tiktok', note: 'Rotate in TikTok Developer portal' },
      { label: 'OAuth flow tested', key: 'tiktok', note: 'Login → callback → connected status' },
      { label: 'video.upload draft tested', key: 'tiktok', note: 'Draft only — nothing public' },
      { label: 'Demo video recorded', key: 'tiktok', note: 'Required for TikTok app review' },
    ],
  },
  {
    section: '📅 Metricool',
    items: [
      { label: 'API token connected', key: 'metricool', note: 'Token in Base44 Secrets' },
      { label: 'Brand ID confirmed', key: 'metricool', note: 'METRICOOL_BLOG_ID matches your brand' },
      { label: 'Social profiles verified', key: 'metricool', note: 'All connected platforms checked' },
    ],
  },
  {
    section: '🤖 AI Keys',
    items: [
      { label: 'Cost controls set', key: 'aikeys', note: 'Daily/monthly caps + hard stop' },
      { label: 'OpenAI key', key: 'aikeys', note: 'Optional — fallback to Base44 InvokeLLM' },
      { label: 'Perplexity key', key: 'aikeys', note: 'Optional — fallback to Base44 search' },
    ],
  },
  {
    section: '🧪 Playwright QA',
    items: [
      { label: 'Tests run externally', key: 'playwright', note: 'Must run from terminal, not inside app' },
      { label: 'Results imported', key: 'playwright', note: 'All critical paths passing' },
    ],
  },
  {
    section: '📦 Shipping + Promos',
    items: [
      { label: 'All shipping rules exist', key: 'shipping', note: 'AU + International for all product types' },
      { label: 'Promo codes audited', key: 'shipping', note: 'All codes safe and correctly restricted' },
    ],
  },
  {
    section: '✅ ApprovalQueue',
    items: [
      { label: 'Auto-action chain proven', key: 'approval', note: '7/7 steps: proven 26 May 2026' },
      { label: 'UI approval test done', key: 'approval', note: 'Approve real item from queue UI' },
    ],
  },
  {
    section: '🎓 Training Videos',
    items: [
      { label: 'Screen recordings done', note: 'Scripts exist — recordings still needed', key: null },
    ],
  },
  {
    section: '🔒 Coaching',
    items: [
      { label: 'Private locked (not publicly launched)', note: 'Launch only after deliberate approval', key: null },
    ],
  },
];

export default function SetupFinalBoard({ stepStatus = {} }) {
  const total = STATIC_ITEMS.reduce((a, s) => a + s.items.length, 0);
  const completed = STATIC_ITEMS.reduce((a, s) => a + s.items.filter(i => i.key && stepStatus[i.key] === 'complete').length, 0);
  const blocked = STATIC_ITEMS.reduce((a, s) => a + s.items.filter(i => i.key && stepStatus[i.key] === 'blocked').length, 0);

  const pct = Math.round((completed / total) * 100);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🏁</span>
          <h2 className="font-semibold text-lg">Final Setup Dashboard</h2>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
            <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-bold text-primary">{pct}%</span>
        </div>
        <div className="flex gap-3 text-sm">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{completed} complete</Badge>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{blocked} blocked</Badge>
          <Badge className="bg-muted/30 text-muted-foreground border-border">{total - completed - blocked} pending</Badge>
        </div>
      </div>

      {STATIC_ITEMS.map(section => (
        <Card key={section.section}>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-semibold">{section.section}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0 space-y-2">
            {section.items.map(item => {
              const status = item.key ? (stepStatus[item.key] || 'pending') : 'pending';
              const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
              return (
                <div key={item.label} className="flex items-start justify-between gap-2 py-1 border-b border-border last:border-0">
                  <div className="flex items-start gap-2">
                    {cfg.icon}
                    <div>
                      <p className="text-sm text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs border shrink-0 ${cfg.badge}`}>{cfg.label}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <p className="text-sm font-semibold text-foreground mb-2">🚀 First action to take right now:</p>
        <p className="text-sm text-muted-foreground mb-3">Rotate the Stripe webhook secret — this unblocks checkout and all payment flows.</p>
        <Button className="gap-2" onClick={() => window.open('https://dashboard.stripe.com/webhooks', '_blank')}>
          <ExternalLink className="w-4 h-4" /> Open Stripe Webhooks → Roll Secret Now
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2" onClick={() => window.open('/admin/go-live', '_blank')}>
          <ExternalLink className="w-4 h-4" /> Full Go-Live Checklist
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => window.open('/admin/final-system-status', '_blank')}>
          <ExternalLink className="w-4 h-4" /> Final System Status
        </Button>
      </div>
    </div>
  );
}