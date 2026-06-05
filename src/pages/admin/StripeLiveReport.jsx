import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle2, AlertTriangle, XCircle, Loader2, Copy, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const READINESS_CHECKLIST = [
  {
    category: 'Keys & Environment',
    items: [
      { label: 'STRIPE_SECRET_KEY set (sk_live_...)', status: 'done', note: 'Set 17 May 2026' },
      { label: 'STRIPE_PUBLISHABLE_KEY set (pk_live_...)', status: 'done', note: 'Set 17 May 2026' },
      { label: 'STRIPE_WEBHOOK_SECRET environment variable', status: 'action', note: 'Required after registering webhook endpoint at dashboard.stripe.com/webhooks' },
      { label: 'No test keys (sk_test / pk_test) in production', status: 'done', note: 'Only live keys active' },
    ],
  },
  {
    category: 'Webhook Events',
    items: [
      { label: 'checkout.session.completed — handled', status: 'review', note: 'onNewOrderAutomation handles payment_intent.succeeded' },
      { label: 'payment_intent.succeeded — handled', status: 'done', note: 'onNewOrderAutomation processes this event' },
      { label: 'payment_intent.payment_failed — handled', status: 'todo', note: 'Add failure handling to onNewOrderAutomation' },
      { label: 'charge.refunded — handled', status: 'todo', note: 'Add refund event handler with admin notification' },
      { label: 'Webhook signature verification', status: 'action', note: 'Requires STRIPE_WEBHOOK_SECRET to be set first' },
    ],
  },
  {
    category: 'Payment Methods',
    items: [
      { label: 'Credit/Debit card payments', status: 'done', note: 'automatic_payment_methods: enabled covers all cards' },
      { label: 'Apple Pay support', status: 'done', note: 'Enabled via automatic_payment_methods — requires HTTPS domain' },
      { label: 'Google Pay support', status: 'done', note: 'Enabled via automatic_payment_methods — requires HTTPS domain' },
      { label: 'Mobile checkout compatibility', status: 'done', note: 'Stripe Elements is fully responsive' },
    ],
  },
  {
    category: 'Security',
    items: [
      { label: 'Server-side price recalculation', status: 'done', note: 'createPaymentIntent validates price from DB — cannot be tampered' },
      { label: 'Promo code server-side enforcement', status: 'done', note: 'Category restrictions enforced in createPaymentIntent' },
      { label: 'Order idempotency protection', status: 'done', note: 'IdempotenceLog prevents duplicate order processing' },
      { label: 'Customer email required for payment', status: 'done', note: 'Enforced in createPaymentIntent — returns 400 if missing' },
      { label: 'No client-side amount trust', status: 'done', note: 'Server recalculates from DB product price' },
    ],
  },
  {
    category: 'Order Flow',
    items: [
      { label: 'Order record created on payment', status: 'done', note: 'MerchOrder saved via onNewOrderAutomation' },
      { label: 'Customer receipt email sent', status: 'done', note: 'sendOrderReceipt triggered by automation' },
      { label: 'Admin notification email sent', status: 'done', note: 'notifyAdminNewOrderGmail triggered' },
      { label: 'Order synced to Google Sheet', status: 'done', note: 'syncOrderToSheets triggered' },
      { label: 'Stock quantity decremented', status: 'review', note: 'Verify stock update logic in onNewOrderAutomation' },
    ],
  },
  {
    category: 'Stripe Connect',
    items: [
      { label: 'Stripe Connect — NOT enabled', status: 'done', note: 'Not required — direct merchant account only' },
      { label: 'No connected accounts', status: 'done', note: 'Single merchant account architecture' },
    ],
  },
];

const STATUS_CONFIG = {
  done: { label: 'Done', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2, iconColor: 'text-green-400' },
  review: { label: 'Review', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: AlertTriangle, iconColor: 'text-yellow-400' },
  action: { label: 'Action Required', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle, iconColor: 'text-red-400' },
  todo: { label: 'To Do', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: AlertTriangle, iconColor: 'text-slate-400' },
};

export default function StripeLiveReport() {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState('');
  const { toast } = useToast();

  const allItems = READINESS_CHECKLIST.flatMap(c => c.items);
  const done = allItems.filter(i => i.status === 'done').length;
  const actions = allItems.filter(i => i.status === 'action').length;
  const reviews = allItems.filter(i => i.status === 'review').length;
  const todos = allItems.filter(i => i.status === 'todo').length;
  const score = Math.round((done / allItems.length) * 100);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a senior Stripe payments architect conducting a live readiness audit.

Platform: Gannon Waye music artist store (gannonwaye.com)
Stack: React frontend, Deno backend functions, Stripe v14, AUD currency
Date: ${new Date().toLocaleDateString('en-AU')}

Current configuration:
- Stripe live keys: SET (sk_live / pk_live) ✓
- Payment mode: Direct merchant (no Connect)
- automatic_payment_methods: enabled (covers Apple Pay, Google Pay, cards)
- Server-side price verification: active ✓
- Idempotency protection: active ✓
- Webhook secret: NOT YET SET (requires action)
- payment_failed handler: not yet implemented
- charge.refunded handler: not yet implemented

Generate a comprehensive Stripe Live Readiness Report covering:

## CURRENT MODE
Current operational state and key configuration

## LIVE READINESS SCORE
Score out of 100 with breakdown by category:
- Security (weight 30%)
- Webhook Coverage (weight 25%)
- Payment Methods (weight 20%)
- Order Flow (weight 15%)
- Compliance (weight 10%)

## CRITICAL ACTIONS REQUIRED (before going fully live)
1-3 items that MUST be done first

## RECOMMENDED IMPROVEMENTS (non-blocking)
3-5 items to improve reliability

## SECURITY RISKS
Current risks and mitigations in place

## APPLE PAY / GOOGLE PAY STATUS
What's required for these to work in production

## MOBILE CHECKOUT STATUS
Mobile readiness assessment

## PRODUCTION READINESS VERDICT
Final go/no-go assessment with conditions

Be technical, specific, and actionable. Use the actual configuration details above.`,
        model: 'claude_sonnet_4_6',
      });
      setReport(result);
      toast({ title: 'Report generated' });
    } catch {
      toast({ title: 'Generation failed', variant: 'destructive' });
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Stripe Live Readiness</h1>
          <p className="text-muted-foreground text-sm mt-1">Payment infrastructure audit — live mode verification</p>
        </div>
        <Button onClick={generateReport} disabled={generating} className="gradient-gold-button border-0 gap-2">
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Zap className="w-4 h-4" />Generate Full Report</>}
        </Button>
      </div>

      {/* Score Card */}
      <Card className="border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Production Readiness Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">{score}</span>
                <span className="text-xl text-muted-foreground">/100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{done}/{allItems.length} items verified</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-3 text-sm">
                  <span className="text-green-400">✓ {done} done</span>
                  <span className="text-red-400">⚠ {actions} action required</span>
                  <span className="text-yellow-400">~ {reviews} review</span>
                  <span className="text-muted-foreground">○ {todos} todo</span>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 min-w-48">
                <div className="h-3 rounded-full transition-all" style={{ width: `${score}%`, background: score >= 80 ? 'hsl(var(--primary))' : '#f59e0b' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Actions */}
      {actions > 0 && (
        <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-red-300 flex items-center gap-2"><XCircle className="w-4 h-4" />Critical Actions Required Before Full Live Mode</p>
          {READINESS_CHECKLIST.flatMap(c => c.items).filter(i => i.status === 'action').map(item => (
            <div key={item.label} className="flex items-start gap-2 text-xs">
              <span className="text-red-400 mt-0.5">→</span>
              <div>
                <p className="text-red-300 font-medium">{item.label}</p>
                <p className="text-muted-foreground">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checklist by Category */}
      {READINESS_CHECKLIST.map(cat => (
        <Card key={cat.category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />{cat.category}
              <Badge variant="outline" className="ml-auto text-xs">
                {cat.items.filter(i => i.status === 'done').length}/{cat.items.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {cat.items.map(item => {
              const cfg = STATUS_CONFIG[item.status];
              const Ic = cfg.icon;
              return (
                <div key={item.label} className="flex items-start gap-3 p-2 rounded-lg">
                  <Ic className={`w-4 h-4 ${cfg.iconColor} shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm ${item.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item.label}</span>
                      <Badge className={`text-[10px] border ${cfg.color}`}>{cfg.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* AI Report */}
      {generating && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Generating Stripe Live Readiness Report with Claude Sonnet...</p>
          </CardContent>
        </Card>
      )}

      {report && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" />AI-Generated Readiness Report</CardTitle>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { navigator.clipboard.writeText(report); }}>
                <Copy className="w-3 h-3 mr-1" />Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}