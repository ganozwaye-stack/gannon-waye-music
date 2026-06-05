import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, CheckCircle2, XCircle, AlertTriangle, DollarSign, RefreshCw, Webhook, Copy,
  Eye, EyeOff, Package, AlertCircle, Repeat, Settings
} from 'lucide-react';

const WEBHOOK_ENDPOINT = 'https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter';

const RECOMMENDED_EVENTS = [
  'checkout.session.completed', 'checkout.session.expired',
  'payment_intent.succeeded', 'payment_intent.payment_failed',
  'charge.refunded', 'charge.dispute.created',
  'invoice.paid', 'invoice.payment_failed',
  'customer.subscription.created', 'customer.subscription.updated',
  'customer.subscription.deleted', 'payout.paid', 'payout.failed',
];

const severityColor = (s) => {
  if (s === 'critical') return 'bg-red-600/20 text-red-300';
  if (s === 'high') return 'bg-orange-500/20 text-orange-300';
  if (s === 'warning') return 'bg-yellow-500/20 text-yellow-300';
  return 'bg-blue-500/20 text-blue-300';
};

export default function StripeCommandCentreNew() {
  const [devMode, setDevMode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedDiag, setSelectedDiag] = useState(null);
  const [tab, setTab] = useState('overview');
  const qc = useQueryClient();

  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['sccOrders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 50),
  });

  const { data: diagnostics = [], refetch: refetchDiags } = useQuery({
    queryKey: ['sccDiagnostics'],
    queryFn: () => base44.entities.PaymentDiagnostic.list('-created_date', 50),
  });

  const { data: eventLogs = [], refetch: refetchLogs } = useQuery({
    queryKey: ['sccEventLogs'],
    queryFn: () => base44.entities.StripeEventLog.list('-created_date', 30),
  });

  const healthCheck = useMutation({
    mutationFn: () => base44.functions.invoke('integrationHealthCheck', {}),
    onSuccess: () => { refetchDiags(); },
  });

  const refetchAll = () => { refetchOrders(); refetchDiags(); refetchLogs(); };

  const copyUrl = () => {
    navigator.clipboard.writeText(WEBHOOK_ENDPOINT);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const successfulSales = orders.filter(o => ['confirmed', 'paid', 'shipped'].includes(o.status));
  const revenueTotal = successfulSales.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const openIssues = diagnostics.filter(d => d.status === 'open');
  const criticalIssues = openIssues.filter(d => d.severity === 'critical');
  const disputes = diagnostics.filter(d => d.diagnostic_type === 'dispute' && d.status === 'open');
  const refunds = diagnostics.filter(d => d.diagnostic_type === 'refund');
  const failedPayments = diagnostics.filter(d => d.diagnostic_type === 'failed_payment');
  const paymentNoOrder = diagnostics.filter(d => d.diagnostic_type === 'payment_without_order' && d.status === 'open');
  const webhookFails = diagnostics.filter(d => ['webhook_failure', 'webhook_signature_failure'].includes(d.diagnostic_type) && d.status === 'open');
  const processedEvents = eventLogs.filter(l => l.processing_status === 'processed').length;
  const duplicateEvents = eventLogs.filter(l => l.duplicate_detected).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Stripe Command Centre</h1>
          <p className="text-muted-foreground text-sm mt-1">Payment intelligence dashboard</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setDevMode(!devMode)}>
            {devMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {devMode ? 'Hide Dev' : 'Dev Mode'}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={refetchAll}>
            <RefreshCw className="w-3 h-3" /> Refresh
          </Button>
        </div>
      </div>

      {criticalIssues.length > 0 && (
        <div className="border border-red-500/50 bg-red-500/10 rounded-xl p-4 flex items-start gap-3 cursor-pointer" onClick={() => setTab('issues')}>
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">{criticalIssues.length} critical issue(s) — click to view</p>
            <p className="text-sm text-foreground/70">{criticalIssues[0].issue_summary}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: `$${revenueTotal.toFixed(2)}`, sub: 'AUD confirmed', icon: DollarSign, color: 'text-green-400', t: 'sales' },
          { label: 'Successful Sales', value: successfulSales.length, sub: 'orders confirmed', icon: CheckCircle2, color: 'text-green-400', t: 'sales' },
          { label: 'Open Issues', value: openIssues.length, sub: `${criticalIssues.length} critical`, icon: AlertTriangle, color: criticalIssues.length > 0 ? 'text-red-400' : 'text-orange-400', t: 'issues' },
          { label: 'Disputes', value: disputes.length, sub: 'need response', icon: AlertCircle, color: disputes.length > 0 ? 'text-red-400' : 'text-muted-foreground', t: 'issues' },
          { label: 'Failed Payments', value: failedPayments.length, sub: 'payment_intent.failed', icon: XCircle, color: 'text-orange-400', t: 'issues' },
          { label: 'Refunds', value: refunds.length, sub: 'charge.refunded', icon: Repeat, color: 'text-blue-400', t: 'issues' },
          { label: 'Payment / No Order', value: paymentNoOrder.length, sub: 'needs reconciliation', icon: Package, color: paymentNoOrder.length > 0 ? 'text-red-400' : 'text-muted-foreground', t: 'issues' },
          { label: 'Webhook Failures', value: webhookFails.length, sub: 'signature/processing', icon: Webhook, color: webhookFails.length > 0 ? 'text-red-400' : 'text-muted-foreground', t: 'issues' },
        ].map(s => (
          <Card key={s.label} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setTab(s.t)}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'issues', label: `Issues (${openIssues.length})` },
          { id: 'sales', label: `Sales (${successfulSales.length})` },
          { id: 'events', label: `Event Log (${eventLogs.length})` },
          { id: 'setup', label: 'Setup Guide' },
          { id: 'tax', label: 'ℹ️ GST Status' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${tab === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" />Automation Status</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {['Order creation on payment', 'Duplicate order prevention', 'Admin notification on sale', 'Payment failure diagnostic', 'Dispute → critical alert', 'Webhook signature verification', 'Duplicate event prevention'].map(label => (
                  <div key={label} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span>{label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Webhook className="w-4 h-4 text-primary" />Webhook Stats</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><p className="text-muted-foreground">Events Received</p><p className="font-bold text-lg">{eventLogs.length}</p></div>
                  <div><p className="text-muted-foreground">Processed</p><p className="font-bold text-lg text-green-400">{processedEvents}</p></div>
                  <div><p className="text-muted-foreground">Duplicates Blocked</p><p className="font-bold text-lg text-blue-400">{duplicateEvents}</p></div>
                  <div><p className="text-muted-foreground">Sig Failures</p><p className={`font-bold text-lg ${webhookFails.length > 0 ? 'text-red-400' : 'text-muted-foreground'}`}>{webhookFails.length}</p></div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Endpoint</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs bg-secondary/50 rounded p-2 flex-1 break-all text-muted-foreground">{WEBHOOK_ENDPOINT}</p>
                    <Button variant="ghost" size="sm" onClick={copyUrl}>{copiedUrl ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Manual Health Check</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Checks Stripe keys, webhook secret, connector status, and open diagnostics.</p>
              <Button onClick={() => healthCheck.mutate()} disabled={healthCheck.isPending} className="gap-2">
                <RefreshCw className={`w-4 h-4 ${healthCheck.isPending ? 'animate-spin' : ''}`} />
                {healthCheck.isPending ? 'Checking...' : 'Run Integration Health Check'}
              </Button>
              {healthCheck.isSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3 text-sm mt-2">
                  <p className="text-green-300 font-semibold">Health check complete</p>
                  <p className="text-xs text-muted-foreground mt-1">Passed: {healthCheck.data?.data?.passed_checks} · Alerts: {healthCheck.data?.data?.alert_count}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'issues' && (
        <div className="space-y-2">
          {openIssues.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No open issues.</CardContent></Card>
          ) : openIssues.map(diag => (
            <div key={diag.id} onClick={() => setSelectedDiag(diag)}
              className="border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors bg-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{diag.diagnostic_type?.replace(/_/g, ' ')}</p>
                    <Badge className={severityColor(diag.severity)}>{diag.severity}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{diag.issue_summary}</p>
                  {diag.recommended_fix && <p className="text-xs text-green-300/70 mt-0.5">Fix: {diag.recommended_fix}</p>}
                </div>
                {diag.amount ? <p className="text-primary font-semibold shrink-0">${diag.amount?.toFixed(2)}</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'sales' && (
        <div className="space-y-2">
          {successfulSales.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No successful sales yet.</CardContent></Card>
          ) : successfulSales.map(order => (
            <div key={order.id} className="border border-border rounded-xl p-4 bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{order.customer_name || 'Customer'}</p>
                  <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  {order.items?.[0] && <p className="text-xs text-muted-foreground mt-0.5"><Package className="w-3 h-3 inline mr-1" />{order.items[0].product_name}</p>}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-400">${order.total_amount?.toFixed(2)} AUD</p>
                  <p className="text-xs text-muted-foreground">{order.created_date ? new Date(order.created_date).toLocaleDateString('en-AU') : '—'}</p>
                  {devMode && <p className="font-mono text-xs text-muted-foreground/50 break-all max-w-[200px]">{order.stripe_session_id}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'events' && (
        <div className="space-y-2">
          {eventLogs.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No Stripe events logged yet.</CardContent></Card>
          ) : eventLogs.map(log => (
            <div key={log.id} className="border border-border rounded-xl p-3 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{log.event_type}</p>
                    <Badge className={log.processing_status === 'processed' ? 'bg-green-500/20 text-green-300' : log.processing_status === 'duplicate' ? 'bg-gray-500/20 text-gray-300' : 'bg-blue-500/20 text-blue-300'}>{log.processing_status}</Badge>
                    {log.duplicate_detected && <Badge className="bg-gray-500/20 text-gray-400 text-xs">duplicate blocked</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{log.safe_summary}</p>
                  {devMode && log.stripe_event_id && <p className="text-xs font-mono text-muted-foreground/50 mt-1">{log.stripe_event_id}</p>}
                </div>
                <div className="text-right shrink-0">
                  {log.amount ? <p className="text-primary font-semibold">${log.amount?.toFixed(2)}</p> : null}
                  <p className="text-xs text-muted-foreground">{log.received_at ? new Date(log.received_at).toLocaleString('en-AU') : '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tax' && (
        <div className="space-y-4">
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" />Stripe Tax & GST Status (GST Exempt)</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-foreground/80">Stripe Tax automatic calculations are currently <strong>disabled</strong> (<code className="bg-secondary/50 px-1 rounded">automatic_tax: &#123; enabled: false &#125;</code>) in your checkout session configuration.</p>
              <div className="space-y-2 text-xs text-foreground/70">
                <p><strong className="text-foreground">GST Exemption:</strong> In Australia, businesses with annual sales revenue below the $75,000 AUD threshold are exempt from registering for GST and collecting GST from customers. Since your store operates below this threshold, automatic GST tax calculation is disabled to prevent checkout errors caused by missing Stripe tax registrations.</p>
                <p><strong className="text-foreground">Code status:</strong> The <code className="bg-blue-500/10 text-blue-400 px-1 rounded">createCheckoutSession</code> backend function is configured with automatic tax disabled. Inclusive pricing behavior remains active for store display consistency.</p>
                <p className="text-blue-400 font-semibold">ℹ️ No actions are required in your Stripe Tax dashboard at this time. All products and checkouts will proceed without tax-registration blockages.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'setup' && (
        <div className="space-y-4">
          <Card className="border-primary/30">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Settings className="w-4 h-4 text-primary" />Stripe Webhook Setup Guide</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-2">Step 1 — Create Webhook Endpoint in Stripe</p>
                <p className="text-muted-foreground mb-2">Go to <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe Dashboard → Developers → Webhooks → Add endpoint</a></p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs bg-secondary/70 rounded p-2 flex-1 break-all">{WEBHOOK_ENDPOINT}</p>
                  <Button variant="ghost" size="sm" onClick={copyUrl}>{copiedUrl ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}</Button>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Step 2 — Select These Events</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {RECOMMENDED_EVENTS.map(e => (
                    <div key={e} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                      <span className="font-mono">{e}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-yellow-500/30 bg-yellow-500/10 rounded p-3">
                <p className="font-semibold text-yellow-300 mb-1">Step 3 — Save the Signing Secret</p>
                <p className="text-xs text-foreground/70">After creating the endpoint, Stripe shows a Signing secret starting with <code className="font-mono">whsec_</code>. Save it as:</p>
                <p className="font-mono text-sm mt-2 text-yellow-200">STRIPE_WEBHOOK_SECRET</p>
                <p className="text-xs text-muted-foreground mt-1">Go to Base44 → Settings → Environment Variables → add STRIPE_WEBHOOK_SECRET.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Quick Links</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link to="/admin/payment-diagnostics"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Payment Diagnostics</Button></Link>
              <Link to="/admin/webhook-health"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><Webhook className="w-3 h-3" />Webhook Health</Button></Link>
              <Link to="/admin/notifications"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Notifications</Button></Link>
              <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Stripe Webhooks</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedDiag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedDiag(null)}>
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{selectedDiag.diagnostic_type?.replace(/_/g, ' ')}</h3>
              <Badge className={severityColor(selectedDiag.severity)}>{selectedDiag.severity}</Badge>
            </div>
            <div className="bg-secondary/40 rounded p-3 text-sm">{selectedDiag.issue_summary}</div>
            {selectedDiag.recommended_fix && <div className="bg-green-500/10 border border-green-500/20 rounded p-3 text-sm"><p className="text-xs text-green-300 mb-1">Recommended Fix</p>{selectedDiag.recommended_fix}</div>}
            {selectedDiag.customer_safe_message && <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 text-sm"><p className="text-xs text-blue-300 mb-1">Customer Message</p>{selectedDiag.customer_safe_message}</div>}
            {devMode && selectedDiag.source_chain && (
              <div className="border border-border/40 rounded p-3 text-xs">
                <p className="text-muted-foreground font-semibold mb-1">Source Chain</p>
                <p className="font-mono text-muted-foreground">{selectedDiag.source_chain}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedDiag(null)}><ArrowLeft className="w-3 h-3 mr-1" />Back</Button>
              <Link to="/admin/payment-diagnostics"><Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Full Diagnostics</Button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}