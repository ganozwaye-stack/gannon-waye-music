import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Zap, Settings, Image, Calendar, BarChart2, AlertTriangle, CheckCircle2,
  ExternalLink, ChevronRight, RefreshCw, Lock, Globe, XCircle, Wifi,
  Brain, Eye, WifiOff
} from 'lucide-react';
import { toast } from 'sonner';

const TOOLS = [
  { label: 'API Setup', path: '/admin/metricool-api-setup', icon: Settings, desc: 'Configure token, test connection' },
  { label: 'Full Diagnostics', path: '/admin/metricool-diagnostics', icon: Wifi, desc: 'Test all endpoints safely' },
  { label: 'Daily Post Engine', path: '/admin/daily-post-engine', icon: Brain, desc: '2–3 approval-gated drafts/day' },
  { label: 'Social Agent OS', path: '/admin/social-agent-os', icon: Brain, desc: '10-agent collaboration system' },
  { label: 'Media Pipeline', path: '/admin/metricool-media-pipeline', icon: Image, desc: 'Normalize & upload assets' },
  { label: 'Scheduler Queue', path: '/admin/metricool-scheduler-queue', icon: Calendar, desc: 'Send approved posts to Metricool' },
  { label: 'Performance Intel', path: '/admin/metricool-performance-intelligence', icon: BarChart2, desc: 'Import metrics from Metricool' },
  { label: 'Content Performance', path: '/admin/content-performance', icon: BarChart2, desc: 'Track what works' },
];

const SOURCE_CHAIN = [
  'SocialAsset', 'DailyDraftEngine', 'QualityCouncil(5agents)',
  'ApprovalQueue', 'MetricoolScheduler', 'Metricool', 'ContentPerformance', 'LearningRecord'
];

export default function MetricoolCommand() {
  const [testing, setTesting] = useState(false);
  const [diagResult, setDiagResult] = useState(null);

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
    n.source?.includes('metricool') || n.source?.includes('Metricool') ||
    n.linked_route?.includes('metricool')
  );

  const stats = {
    total: posts.length,
    approved: posts.filter(p => p.status === 'approved').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    posted: posts.filter(p => p.status === 'posted').length,
    pending: posts.filter(p => p.status === 'pending_approval').length,
    draft: posts.filter(p => p.status === 'draft').length,
  };

  const runDiagnostics = async () => {
    setTesting(true);
    setDiagResult(null);
    try {
      const res = await base44.functions.invoke('metricoolDiagnostics', {});
      setDiagResult(res.data);
      toast.success(res.data?.auth_status === 'connected' ? 'Metricool REST API connected ✓' : `Issue: ${res.data?.last_error}`);
    } catch (err) {
      setDiagResult({ auth_status: 'error', last_error: err?.response?.data?.error || err.message });
      toast.error('Diagnostics failed');
    }
    setTesting(false);
  };

  const isConnected = diagResult?.auth_status === 'connected';
  const hasTested = diagResult !== null;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Social Infrastructure</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Metricool Command</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Approval-gated social scheduling · No external posts without human sign-off</p>
        </div>
        <Button onClick={runDiagnostics} disabled={testing} variant="outline" className="gap-2">
          {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
          {testing ? 'Testing...' : 'Test Connection'}
        </Button>
      </div>

      {/* Live connection status */}
      {hasTested && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${isConnected ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
          {isConnected ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className={`font-semibold text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? '✓ Metricool REST API connected' : '✗ Metricool connection issue'}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span>Token: {diagResult.token_present ? '✓ present' : '✗ missing'}</span>
              <span>UserID: {diagResult.userId_present ? '✓ present' : '✗ missing'}</span>
              <span>BlogID: {diagResult.blogId_present ? '✓ present' : '✗ missing'}</span>
              <span>Profiles: {diagResult.profiles?.length || 0} brands</span>
              <span>Scheduler: {diagResult.scheduler_reachable ? '✓' : '✗'}</span>
              <span>Normalize: {diagResult.normalize_reachable ? '✓' : '✗'}</span>
            </div>
            {diagResult.next_action && (
              <p className="text-xs text-muted-foreground mt-1">{diagResult.next_action}</p>
            )}
          </div>
          <Link to="/admin/metricool-diagnostics">
            <Button size="sm" variant="ghost" className="gap-1 text-xs"><Eye className="w-3 h-3" /> Details</Button>
          </Link>
        </div>
      )}

      {!hasTested && (
        <div className="rounded-xl border border-border/30 p-4 flex items-center gap-3 bg-secondary/20">
          <WifiOff className="w-5 h-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Connection not tested yet</p>
            <p className="text-xs text-muted-foreground">Click "Test Connection" to verify Metricool REST API. All 3 secrets are configured.</p>
          </div>
        </div>
      )}

      {/* MCP note */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-blue-400">MCP endpoint (ai.metricool.com/mcp) — Protocol mismatch</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            The MCP endpoint requires a JSON-RPC session protocol — it cannot be called as raw REST from backend functions. This is why MCP returns "unauthorized."
            The production approach uses Metricool REST API (<code className="text-green-300">app.metricool.com/api/v2/...</code>) which is working correctly. MCP remains available for AI tool connections (Cursor/ChatGPT/Claude).
          </p>
        </div>
      </div>

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
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {[
          { label: 'Drafts', value: stats.draft, color: 'text-muted-foreground' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
          { label: 'Approved', value: stats.approved, color: 'text-green-400' },
          { label: 'In Metricool', value: stats.scheduled, color: 'text-blue-400' },
          { label: 'Posted', value: stats.posted, color: 'text-primary' },
          { label: 'Total', value: stats.total, color: 'text-foreground' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-3 text-center">
            <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TOOLS.map(t => (
          <Link key={t.path} to={t.path}>
            <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <t.icon className="w-4 h-4 text-primary" />
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
              <div key={step} className="flex items-center gap-1.5">
                <Badge className="bg-secondary text-foreground border-border/50 text-[10px] tracking-wide">{step}</Badge>
                {i < SOURCE_CHAIN.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety notice */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-green-400 font-semibold">Approval-gated — zero automated posting</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Every post: Generate → Quality Council (5 agents) → ApprovalQueue (Gannon approves) → MetricoolScheduler → Metricool API.
            Tokens never exposed to browser. Assets require permission. No post leaves without your sign-off.
          </p>
        </div>
      </div>
    </div>
  );
}