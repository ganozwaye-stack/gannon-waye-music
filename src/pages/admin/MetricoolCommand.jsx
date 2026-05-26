import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Zap, Settings, Image, Calendar, BarChart2, AlertTriangle, CheckCircle2, 
  ExternalLink, ChevronRight, RefreshCw, Lock, Globe
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TOOLS = [
  { label: 'API Setup', path: '/admin/metricool-api-setup', icon: Settings, desc: 'Configure token, test connection, MCP setup' },
  { label: 'Media Pipeline', path: '/admin/metricool-media-pipeline', icon: Image, desc: 'Normalize & upload assets → Metricool mediaId' },
  { label: 'Scheduler Queue', path: '/admin/metricool-scheduler-queue', icon: Calendar, desc: 'Send approved posts to Metricool API' },
  { label: 'Performance Intel', path: '/admin/metricool-performance-intelligence', icon: BarChart2, desc: 'Import metrics from Metricool API' },
];

const SOURCE_CHAIN = [
  'SocialAsset', 'ContentCalendarPost', 'QualityReview',
  'ApprovalQueue', 'MetricoolSchedulerQueue', 'Metricool', 'ContentPerformance'
];

export default function MetricoolCommand() {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [configResult, setConfigResult] = useState(null);

  const { data: posts = [] } = useQuery({
    queryKey: ['mc-cmd-posts'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint' }, 'sprint_day', 200),
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['mc-cmd-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 50),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['mc-cmd-notifs'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20),
  });

  const metricoolAlerts = notifications.filter(n =>
    n.source === 'validateMetricoolConfig' || n.source === 'metricoolSchedulePost' ||
    n.source === 'metricoolNormalizeMedia' || n.linked_route?.includes('metricool')
  );

  const stats = {
    total: posts.length,
    approved: posts.filter(p => p.status === 'approved').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    posted: posts.filter(p => p.status === 'posted').length,
    pending: posts.filter(p => p.status === 'pending_approval').length,
  };

  const runConfigTest = async () => {
    setTesting(true);
    setConfigResult(null);
    try {
      const res = await base44.functions.invoke('validateMetricoolConfig', {});
      setConfigResult(res.data);
      toast({ title: res.data?.valid ? 'Metricool connected ✓' : `Config issue: ${res.data?.message}` });
    } catch (err) {
      setConfigResult({ valid: false, message: err?.response?.data?.error || err.message });
      toast({ title: 'Config test failed', variant: 'destructive' });
    }
    setTesting(false);
  };

  const configOk = configResult?.valid === true;
  const configFailed = configResult && !configResult.valid;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Social Infrastructure</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Metricool Command</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Approval-gated social scheduling · No external posts without human sign-off</p>
        </div>
        <Button onClick={runConfigTest} disabled={testing} variant="outline" className="gap-2">
          {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Test API Connection
        </Button>
      </div>

      {/* Config result */}
      {configResult && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${configOk ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
          {configOk ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          <div>
            <p className={`font-body text-sm font-semibold ${configOk ? 'text-green-400' : 'text-red-400'}`}>{configResult.message}</p>
            {configResult.missing?.length > 0 && (
              <p className="font-body text-xs text-muted-foreground mt-1">Missing secrets: {configResult.missing.join(', ')} — add in <Link to="/admin/metricool-api-setup" className="text-primary underline">API Setup</Link></p>
            )}
            {configResult.api_status && <p className="font-body text-xs text-muted-foreground mt-0.5">API status: {configResult.api_status}</p>}
          </div>
        </div>
      )}

      {/* Alerts */}
      {metricoolAlerts.length > 0 && (
        <div className="space-y-2">
          {metricoolAlerts.slice(0, 3).map(n => (
            <div key={n.id} className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-3 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-amber-400 font-semibold">{n.title}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{n.summary}</p>
              </div>
              {n.linked_route && (
                <Link to={n.linked_route}><ChevronRight className="w-4 h-4 text-muted-foreground" /></Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Posts', value: stats.total, color: 'text-foreground' },
          { label: 'Pending Review', value: stats.pending, color: 'text-amber-400' },
          { label: 'Approved', value: stats.approved, color: 'text-green-400' },
          { label: 'In Metricool', value: stats.scheduled, color: 'text-blue-400' },
          { label: 'Posted Live', value: stats.posted, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Approvals alert */}
      {approvals.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-body text-sm font-semibold text-amber-400">{approvals.length} items awaiting approval</p>
                <p className="font-body text-xs text-muted-foreground">Must approve before scheduling to Metricool</p>
              </div>
            </div>
            <Link to="/admin/approval-queue">
              <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-400 gap-1.5">
                <ChevronRight className="w-3 h-3" /> Review
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Tool grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map(t => (
          <Link key={t.path} to={t.path}>
            <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <t.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-foreground">{t.label}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Source chain */}
      <Card className="border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" /> Full Source Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-1.5">
            {SOURCE_CHAIN.map((step, i) => (
              <React.Fragment key={step}>
                <Badge className="bg-secondary text-foreground border-border/50 text-[10px] tracking-wide">{step}</Badge>
                {i < SOURCE_CHAIN.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety notice */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-green-400 font-semibold">Approval-gated — no automated posting</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Every post must pass: Generate → QualityReview → ApprovalQueue (admin approved) → MetricoolSchedulerQueue → Metricool API.
            Sensitive assets blocked by default.
          </p>
        </div>
      </div>

      {/* MCP info */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <p className="font-body text-sm text-blue-400 font-semibold mb-1 flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Official Metricool MCP</p>
          <p className="font-body text-xs text-muted-foreground">
            Connect via <a href="https://ai.metricool.com/mcp" target="_blank" rel="noopener noreferrer" className="text-primary underline">ai.metricool.com/mcp</a> using your token + user ID for AI-native scheduling.
            Approval gate still applies — configure in <Link to="/admin/metricool-api-setup" className="text-primary underline">API Setup</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}