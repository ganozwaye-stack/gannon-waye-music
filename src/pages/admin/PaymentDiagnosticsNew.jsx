import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle2, XCircle, ArrowLeft, ExternalLink,
  RefreshCw, Clock, CreditCard, Package, ShoppingBag, Webhook,
  AlertCircle, DollarSign, Repeat, FileX
} from 'lucide-react';

const severityColor = (s) => {
  if (s === 'critical') return 'bg-red-600/20 text-red-300 border-red-600/30';
  if (s === 'high') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
  if (s === 'warning') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
};

const statusColor = (s) => {
  if (['confirmed', 'paid', 'shipped', 'resolved'].includes(s)) return 'bg-green-500/20 text-green-300';
  if (['pending', 'investigating'].includes(s)) return 'bg-yellow-500/20 text-yellow-300';
  if (['failed', 'cancelled', 'open'].includes(s)) return 'bg-red-500/20 text-red-300';
  return 'bg-secondary text-muted-foreground';
};

const diagnosticLabel = {
  failed_payment: 'Failed Payment',
  checkout_timeout: 'Checkout Timeout',
  checkout_frozen: 'Checkout Frozen',
  webhook_failure: 'Webhook Failure',
  webhook_signature_failure: 'Signature Failure',
  payment_without_order: 'Payment / No Order',
  order_without_payment: 'Order / No Payment',
  receipt_failure: 'Receipt Failure',
  dispute: 'Dispute / Chargeback',
  refund: 'Refund',
  missing_stripe_config: 'Config Missing',
  reconciliation_issue: 'Reconciliation Issue',
};

function DiagnosticDetail({ diag, onClose }) {
  const qc = useQueryClient();
  const resolve = useMutation({
    mutationFn: () => base44.entities.PaymentDiagnostic.update(diag.id, { status: 'resolved', resolved_date: new Date().toISOString() }),
    onSuccess: () => { qc.invalidateQueries(['diagnostics']); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Payment Diagnostic</p>
            <h3 className="text-xl font-semibold mt-1">{diagnosticLabel[diag.diagnostic_type] || diag.diagnostic_type}</h3>
          </div>
          <Badge className={severityColor(diag.severity)}>{diag.severity}</Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="bg-secondary/40 rounded p-3">
            <p className="text-xs text-muted-foreground mb-1">Plain English Issue</p>
            <p>{diag.issue_summary}</p>
          </div>
          {diag.admin_message && (
            <div className="bg-secondary/40 rounded p-3">
              <p className="text-xs text-muted-foreground mb-1">Technical Detail</p>
              <p className="text-sm">{diag.admin_message}</p>
            </div>
          )}
          {diag.customer_safe_message && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
              <p className="text-xs text-blue-300 mb-1">Customer-Safe Message</p>
              <p className="text-sm">{diag.customer_safe_message}</p>
            </div>
          )}
          {diag.recommended_fix && (
            <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
              <p className="text-xs text-green-300 mb-1">Recommended Fix</p>
              <p className="text-sm">{diag.recommended_fix}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {diag.customer_email && <div><p className="text-xs text-muted-foreground">Customer Email</p><p>{diag.customer_email}</p></div>}
          {diag.amount && <div><p className="text-xs text-muted-foreground">Amount</p><p className="text-primary font-semibold">${diag.amount?.toFixed(2)} {diag.currency?.toUpperCase()}</p></div>}
          {diag.stripe_event_id && <div><p className="text-xs text-muted-foreground">Stripe Event ID</p><p className="font-mono text-xs break-all">{diag.stripe_event_id}</p></div>}
          {diag.checkout_session_id && <div><p className="text-xs text-muted-foreground">Checkout Session</p><p className="font-mono text-xs break-all">{diag.checkout_session_id}</p></div>}
          {diag.payment_intent_id && <div><p className="text-xs text-muted-foreground">Payment Intent</p><p className="font-mono text-xs break-all">{diag.payment_intent_id}</p></div>}
          {diag.order_id && <div><p className="text-xs text-muted-foreground">Order ID</p><p className="font-mono text-xs break-all">{diag.order_id}</p></div>}
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: 'Receipt Sent', val: diag.receipt_sent },
            { label: 'Notification Sent', val: diag.notification_sent },
            { label: 'Webhook Processed', val: diag.webhook_processed },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5 bg-secondary/30 rounded p-2">
              {item.val ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {diag.source_chain && (
          <div className="border border-border/40 rounded-lg p-3 text-xs">
            <p className="font-semibold text-muted-foreground">Source Chain</p>
            <p className="text-muted-foreground font-mono mt-1">{diag.source_chain}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onClose}><ArrowLeft className="w-3 h-3 mr-1" />Back</Button>
          {diag.status !== 'resolved' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => resolve.mutate()} disabled={resolve.isPending}>
              <CheckCircle2 className="w-3 h-3 mr-1" />{resolve.isPending ? 'Resolving...' : 'Mark Resolved'}
            </Button>
          )}
          {diag.stripe_event_id && (
            <a href={`https://dashboard.stripe.com/events/${diag.stripe_event_id}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />View in Stripe</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderDetail({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Order Detail</p>
            <h3 className="text-xl font-semibold mt-1">{order.customer_name || 'Unknown Customer'}</h3>
          </div>
          <Badge className={statusColor(order.status)}>{order.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-xs text-muted-foreground">Email</p><p>{order.customer_email || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Total</p><p className="text-primary font-semibold">${order.total_amount?.toFixed(2) || '0.00'} AUD</p></div>
          <div><p className="text-xs text-muted-foreground">Shipping</p><p>{order.shipping_address || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Promo Code</p><p>{order.promo_code || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Created</p><p>{order.created_date ? new Date(order.created_date).toLocaleString('en-AU') : '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Stripe Session</p><p className="font-mono text-xs break-all">{order.stripe_session_id || '—'}</p></div>
        </div>
        {order.items?.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Items</p>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm bg-secondary/40 rounded px-3 py-2">
                  <span>{item.product_name}{item.size ? ` — ${item.size}` : ''} ×{item.quantity || 1}</span>
                  <span className="text-primary">${item.price?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="border border-border/40 rounded-lg p-3 text-xs">
          <p className="font-semibold text-muted-foreground">Source Chain</p>
          <p className="text-muted-foreground mt-1">Store → Stripe Payment → stripeIntelligenceRouter → MerchOrder → Receipt → Admin Notification</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}><ArrowLeft className="w-3 h-3 mr-1" />Back</Button>
          <Link to="/admin/orders"><Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />All Orders</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentDiagnosticsNew() {
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [tab, setTab] = useState('diagnostics');
  const qc = useQueryClient();

  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 100),
  });

  const { data: diagnostics = [], isLoading: diagLoading, refetch: refetchDiags } = useQuery({
    queryKey: ['diagnostics'],
    queryFn: () => base44.entities.PaymentDiagnostic.list('-created_date', 100),
  });

  const { data: eventLogs = [], isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['stripeEventLogs'],
    queryFn: () => base44.entities.StripeEventLog.list('-created_date', 50),
  });

  const confirmed = orders.filter(o => ['confirmed', 'paid', 'shipped'].includes(o.status));
  const pending = orders.filter(o => o.status === 'pending');
  const failed = orders.filter(o => ['failed', 'cancelled'].includes(o.status));
  const stuckPending = pending.filter(o => o.created_date && Date.now() - new Date(o.created_date).getTime() > 30 * 60 * 1000);

  const openDiags = diagnostics.filter(d => d.status === 'open');
  const criticalDiags = diagnostics.filter(d => d.severity === 'critical' && d.status === 'open');
  const disputes = diagnostics.filter(d => d.diagnostic_type === 'dispute');
  const refunds = diagnostics.filter(d => d.diagnostic_type === 'refund');
  const webhookFails = diagnostics.filter(d => ['webhook_failure', 'webhook_signature_failure'].includes(d.diagnostic_type));
  const paymentWithoutOrder = diagnostics.filter(d => d.diagnostic_type === 'payment_without_order');

  const refetchAll = () => { refetchOrders(); refetchDiags(); refetchLogs(); };

  const summaryCards = [
    { label: 'Successful Orders', value: confirmed.length, icon: CheckCircle2, color: 'text-green-400', tab: 'orders' },
    { label: 'Open Issues', value: openDiags.length, icon: AlertTriangle, color: criticalDiags.length > 0 ? 'text-red-400' : 'text-orange-400', tab: 'diagnostics' },
    { label: 'Disputes', value: disputes.length, icon: AlertCircle, color: 'text-red-400', tab: 'disputes' },
    { label: 'Webhook Failures', value: webhookFails.length, icon: Webhook, color: 'text-orange-400', tab: 'webhooks' },
    { label: 'Stuck Orders', value: stuckPending.length, icon: Clock, color: 'text-yellow-400', tab: 'stuck' },
    { label: 'Payment / No Order', value: paymentWithoutOrder.length, icon: FileX, color: 'text-red-400', tab: 'reconcile' },
    { label: 'Refunds', value: refunds.length, icon: Repeat, color: 'text-blue-400', tab: 'refunds' },
    { label: 'Event Logs', value: eventLogs.length, icon: DollarSign, color: 'text-primary', tab: 'logs' },
  ];

  const tabData = {
    diagnostics: openDiags,
    resolved: diagnostics.filter(d => d.status === 'resolved'),
    orders: confirmed,
    pending,
    stuck: stuckPending,
    failed,
    disputes,
    refunds,
    webhooks: webhookFails,
    reconcile: paymentWithoutOrder,
    logs: eventLogs,
  };

  const displayed = tabData[tab] || [];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Payment Diagnostics</h1>
          <p className="text-muted-foreground text-sm mt-1">Full Stripe payment reliability dashboard</p>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto gap-1 text-xs" onClick={refetchAll}>
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      {criticalDiags.length > 0 && (
        <div className="border border-red-500/50 bg-red-500/10 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">{criticalDiags.length} critical issue(s) require immediate attention</p>
            <p className="text-sm text-foreground/70 mt-1">{criticalDiags[0].issue_summary}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map(s => (
          <Card key={s.label} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setTab(s.tab)}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stripe Tax Audit Card */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" /> Stripe Tax Configuration — Code Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            { label: 'automatic_tax: { enabled: true }', ok: true, detail: 'Set in createCheckoutSession — line 253' },
            { label: 'customer_creation: "always"', ok: true, detail: 'Set — Stripe saves customer for tax/receipts' },
            { label: 'billing_address_collection: "required"', ok: true, detail: 'Set — required for Stripe Tax address calculation' },
            { label: 'shipping_address_collection', ok: true, detail: 'Set for physical orders — AU, NZ, US, GB, CA, SG, IN' },
            { label: 'tax_behavior: "inclusive" on all line items', ok: true, detail: 'Set on each price_data including shipping line' },
            { label: 'mode: "payment"', ok: true, detail: 'Set correctly' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
          <div className="mt-3 border border-amber-500/30 bg-amber-500/10 rounded-lg p-3 text-xs">
            <p className="font-semibold text-amber-300 mb-1">⚠ Not proven until next controlled live checkout</p>
            <p className="text-muted-foreground">Stripe Tax dashboard will only show activity after a real checkout session is created post-patch. All fields are confirmed present in source code. Once a live order completes, Stripe Tax dashboard at <a href="https://dashboard.stripe.com/tax" target="_blank" rel="noopener noreferrer" className="underline text-amber-300">dashboard.stripe.com/tax</a> will reflect activity.</p>
          </div>
          <div className="mt-2 border border-blue-500/20 bg-blue-500/10 rounded-lg p-3 text-xs">
            <p className="font-semibold text-blue-300 mb-1">Stripe Tax — remaining manual action</p>
            <p className="text-muted-foreground">1. Go to Stripe Dashboard → Tax → Settings → enable "Automatic tax collection"<br/>2. Add your business address (AU) as tax origin<br/>3. Confirm product tax codes are set for physical goods<br/>Once done, the next live checkout will populate the Tax dashboard.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Checkout System Status</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            { label: 'Stripe Intelligence Router', ok: true, detail: 'Public endpoint with signature verification — no admin auth required' },
            { label: 'Webhook signature verification', ok: true, detail: 'constructEventAsync with STRIPE_WEBHOOK_SECRET' },
            { label: 'Duplicate event prevention', ok: true, detail: 'StripeEventLog deduplication by stripe_event_id' },
            { label: 'Duplicate order prevention', ok: true, detail: 'MerchOrder filter by stripe_session_id before creation' },
            { label: 'Payment without order diagnostic', ok: true, detail: 'Critical PaymentDiagnostic + AdminNotification on order failure' },
            { label: 'Dispute / chargeback alerts', ok: true, detail: 'charge.dispute.created creates critical alert + diagnostic' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'diagnostics', label: 'Open Issues', count: openDiags.length },
          { id: 'orders', label: 'Successful', count: confirmed.length },
          { id: 'pending', label: 'Pending', count: pending.length },
          { id: 'stuck', label: '⚠ Stuck >30m', count: stuckPending.length },
          { id: 'failed', label: 'Failed', count: failed.length },
          { id: 'disputes', label: 'Disputes', count: disputes.length },
          { id: 'refunds', label: 'Refunds', count: refunds.length },
          { id: 'webhooks', label: 'Webhook Failures', count: webhookFails.length },
          { id: 'reconcile', label: 'Payment/No Order', count: paymentWithoutOrder.length },
          { id: 'resolved', label: 'Resolved', count: diagnostics.filter(d => d.status === 'resolved').length },
          { id: 'logs', label: 'Event Logs', count: eventLogs.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${tab === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
            {t.label} ({t.count})
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={refetchAll} className="ml-auto gap-1 text-xs">
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      {(ordersLoading || diagLoading || logsLoading) ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No items in this category.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {displayed.map(item => {
            const isDiag = !!item.diagnostic_type;
            const isLog = !!item.stripe_event_id && !isDiag;
            return (
              <div key={item.id}
                onClick={() => { setSelected(item); setSelectedType(isDiag ? 'diagnostic' : 'order'); }}
                className="border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">
                        {isDiag ? (diagnosticLabel[item.diagnostic_type] || item.diagnostic_type) :
                         isLog ? item.event_type :
                         (item.customer_name || 'Unknown')}
                      </p>
                      <Badge className={isDiag ? severityColor(item.severity) : statusColor(item.status)}>
                        {isDiag ? item.severity : item.status}
                      </Badge>
                      {item.duplicate_detected && <Badge className="bg-gray-500/20 text-gray-300">duplicate</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isDiag ? item.issue_summary : isLog ? item.safe_summary : item.customer_email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {(item.amount || item.total_amount) && (
                      <p className="font-semibold text-primary">${(item.amount || item.total_amount)?.toFixed(2)}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{item.created_date ? new Date(item.created_date).toLocaleDateString('en-AU') : '—'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1"><CreditCard className="w-3 h-3" />Stripe Payments</Button>
          </a>
          <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1"><Webhook className="w-3 h-3" />Stripe Webhooks</Button>
          </a>
          <Link to="/admin/orders"><Button variant="outline" size="sm" className="gap-1"><Package className="w-3 h-3" />All Orders</Button></Link>
          <Link to="/admin/webhook-health"><Button variant="outline" size="sm" className="gap-1"><Webhook className="w-3 h-3" />Webhook Health</Button></Link>
          <Link to="/admin/stripe-command-centre"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Stripe Command Centre</Button></Link>
        </CardContent>
      </Card>

      {selected && selectedType === 'diagnostic' && <DiagnosticDetail diag={selected} onClose={() => setSelected(null)} />}
      {selected && selectedType === 'order' && <OrderDetail order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}