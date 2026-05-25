import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, RefreshCw, Webhook, CheckCircle2,
  XCircle, AlertTriangle, Copy, Activity, Shield
} from 'lucide-react';

const WEBHOOK_ENDPOINT = 'https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter';

const statusBadge = (s) => {
  if (s === 'processed') return 'bg-green-500/20 text-green-300';
  if (s === 'duplicate') return 'bg-gray-500/20 text-gray-300';
  if (s === 'failed') return 'bg-red-500/20 text-red-300';
  return 'bg-blue-500/20 text-blue-300';
};

export default function WebhookHealthNew() {
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const qc = useQueryClient();

  const { data: eventLogs = [], isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['webhookEventLogs'],
    queryFn: () => base44.entities.StripeEventLog.list('-created_date', 100),
  });

  const { data: diagnostics = [], refetch: refetchDiags } = useQuery({
    queryKey: ['webhookDiagnostics'],
    queryFn: () => base44.entities.PaymentDiagnostic.list('-created_date', 50),
  });

  const healthCheck = useMutation({
    mutationFn: () => base44.functions.invoke('integrationHealthCheck', {}),
    onSuccess: () => { refetchLogs(); refetchDiags(); },
  });

  const resolveDiag = useMutation({
    mutationFn: (id) => base44.entities.PaymentDiagnostic.update(id, { status: 'resolved', resolved_date: new Date().toISOString() }),
    onSuccess: () => { qc.invalidateQueries(['webhookDiagnostics']); setSelected(null); },
  });

  const copyUrl = () => {
    navigator.clipboard.writeText(WEBHOOK_ENDPOINT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const received = eventLogs.length;
  const processed = eventLogs.filter(l => l.processing_status === 'processed').length;
  const failed = eventLogs.filter(l => l.processing_status === 'failed').length;
  const duplicates = eventLogs.filter(l => l.duplicate_detected).length;
  const sigFails = diagnostics.filter(d => d.diagnostic_type === 'webhook_signature_failure' && d.status === 'open');
  const lastSuccess = eventLogs.find(l => l.processing_status === 'processed');
  const lastFailed = eventLogs.find(l => l.processing_status === 'failed');

  const overallHealth = sigFails.length > 0 ? 'critical' : failed > 2 ? 'degraded' : received === 0 ? 'unknown' : 'healthy';

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/stripe-command-centre"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Webhook Health</h1>
          <p className="text-muted-foreground text-sm mt-1">Stripe Intelligence Router monitoring</p>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto gap-1 text-xs" onClick={() => { refetchLogs(); refetchDiags(); }}>
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      <Card className={`border ${overallHealth === 'healthy' ? 'border-green-500/30' : overallHealth === 'critical' ? 'border-red-500/50' : 'border-yellow-500/30'}`}>
        <CardContent className="p-4 flex items-center gap-4">
          <Activity className={`w-6 h-6 ${overallHealth === 'healthy' ? 'text-green-400' : overallHealth === 'critical' ? 'text-red-400' : 'text-yellow-400'}`} />
          <div>
            <p className="font-semibold capitalize">
              {overallHealth === 'healthy' ? 'Webhook System Healthy' :
               overallHealth === 'critical' ? 'Webhook System — Issues Detected' :
               overallHealth === 'unknown' ? 'No webhooks received yet' : 'Webhook System Degraded'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {received} received · {processed} processed · {failed} failed · {duplicates} duplicates blocked
            </p>
          </div>
          <Badge className={`ml-auto ${overallHealth === 'healthy' ? 'bg-green-500/20 text-green-300' : overallHealth === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
            {overallHealth}
          </Badge>
        </CardContent>
      </Card>

      {sigFails.length > 0 && (
        <div className="border border-red-500/50 bg-red-500/10 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">{sigFails.length} webhook signature verification failure(s)</p>
            <p className="text-sm text-foreground/70 mt-1">Check STRIPE_WEBHOOK_SECRET in app settings matches Stripe Dashboard → Webhooks → your endpoint → Signing secret.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Events Received', value: received, color: 'text-primary' },
          { label: 'Processed OK', value: processed, color: 'text-green-400' },
          { label: 'Failed', value: failed, color: failed > 0 ? 'text-red-400' : 'text-muted-foreground' },
          { label: 'Duplicates Blocked', value: duplicates, color: 'text-blue-400' },
          { label: 'Sig Failures', value: sigFails.length, color: sigFails.length > 0 ? 'text-red-400' : 'text-muted-foreground' },
          { label: 'Last Success', value: lastSuccess ? new Date(lastSuccess.received_at || lastSuccess.created_date).toLocaleTimeString('en-AU') : '—', color: 'text-green-300' },
          { label: 'Last Failure', value: lastFailed ? new Date(lastFailed.received_at || lastFailed.created_date).toLocaleTimeString('en-AU') : 'None', color: lastFailed ? 'text-red-300' : 'text-muted-foreground' },
          { label: 'Open Diagnostics', value: diagnostics.filter(d => d.status === 'open').length, color: 'text-orange-400' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Webhook className="w-4 h-4 text-primary" />Active Endpoint</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs bg-secondary/50 rounded p-2 flex-1 break-all">{WEBHOOK_ENDPOINT}</p>
            <Button variant="ghost" size="sm" onClick={copyUrl}>
              {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Stripe Webhooks Dashboard</Button>
            </a>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => healthCheck.mutate()} disabled={healthCheck.isPending}>
              <RefreshCw className={`w-3 h-3 ${healthCheck.isPending ? 'animate-spin' : ''}`} />
              {healthCheck.isPending ? 'Checking...' : 'Run Health Check'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">Event Log</h2>
        {logsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : eventLogs.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No webhook events yet. Configure the endpoint in Stripe and add STRIPE_WEBHOOK_SECRET to start receiving events.</CardContent></Card>
        ) : (
          <div className="space-y-2">
            {eventLogs.map(log => (
              <div key={log.id} onClick={() => setSelected(log)}
                className="border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mono text-sm">{log.event_type}</p>
                      <Badge className={statusBadge(log.processing_status)}>{log.processing_status}</Badge>
                      <Badge className={log.category === 'revenue' ? 'bg-green-500/20 text-green-300' : log.category === 'risk' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}>{log.category}</Badge>
                      {log.duplicate_detected && <Badge className="bg-gray-500/20 text-gray-400 text-xs">duplicate blocked</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{log.safe_summary}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {log.amount ? <p className="text-primary font-semibold">${log.amount?.toFixed(2)}</p> : null}
                    <p className="text-xs text-muted-foreground">{log.received_at ? new Date(log.received_at).toLocaleString('en-AU') : log.created_date ? new Date(log.created_date).toLocaleString('en-AU') : '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Webhook Event</p>
                <h3 className="text-xl font-semibold font-mono mt-1">{selected.event_type}</h3>
              </div>
              <Badge className={statusBadge(selected.processing_status)}>{selected.processing_status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Category', val: selected.category },
                { label: 'Priority', val: selected.priority },
                { label: 'Amount', val: selected.amount ? `$${selected.amount.toFixed(2)} ${selected.currency}` : '—' },
                { label: 'Duplicate Detected', val: selected.duplicate_detected ? 'Yes — blocked' : 'No' },
                { label: 'Received At', val: selected.received_at ? new Date(selected.received_at).toLocaleString('en-AU') : '—' },
                { label: 'Processed At', val: selected.processed_at ? new Date(selected.processed_at).toLocaleString('en-AU') : '—' },
              ].map(item => (
                <div key={item.label}><p className="text-xs text-muted-foreground">{item.label}</p><p className="capitalize">{item.val}</p></div>
              ))}
            </div>
            {selected.stripe_event_id && <div><p className="text-xs text-muted-foreground">Stripe Event ID</p><p className="font-mono text-xs break-all">{selected.stripe_event_id}</p></div>}
            {selected.source_chain && (
              <div className="border border-border/40 rounded p-3 text-xs">
                <p className="font-semibold text-muted-foreground mb-1">Source Chain</p>
                <p className="font-mono text-muted-foreground">{selected.source_chain}</p>
              </div>
            )}
            {selected.error_message && (
              <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-xs">
                <p className="text-red-300 font-semibold mb-1">Error</p>
                <p className="font-mono">{selected.error_message}</p>
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}><ArrowLeft className="w-3 h-3 mr-1" />Back</Button>
              {selected.stripe_event_id && (
                <a href={`https://dashboard.stripe.com/events/${selected.stripe_event_id}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />View in Stripe</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}