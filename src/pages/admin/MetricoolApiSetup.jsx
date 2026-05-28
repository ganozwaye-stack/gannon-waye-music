import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Settings, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink,
  Copy, Check, Lock, Zap, Globe, UserCircle, Calendar, BarChart2,
  ChevronRight, Info, XCircle
} from 'lucide-react';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function StatusPill({ status }) {
  const map = {
    connected:    'bg-green-500/15 text-green-400 border-green-500/30',
    selected:     'bg-green-500/15 text-green-400 border-green-500/30',
    ready:        'bg-green-500/15 text-green-400 border-green-500/30',
    reachable:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
    failed:       'bg-red-500/15 text-red-400 border-red-500/30',
    auth_failed:  'bg-red-500/15 text-red-400 border-red-500/30',
    missing:      'bg-amber-500/15 text-amber-400 border-amber-500/30',
    needs_confirmation: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    untested:     'bg-secondary text-muted-foreground border-border/40',
    optional:     'bg-secondary text-muted-foreground border-border/40',
    unauthorized: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    blocked_by_protocol: 'bg-secondary text-muted-foreground border-border/40',
  };
  const label = {
    connected: 'CONNECTED', selected: 'SELECTED', ready: 'READY', reachable: 'REACHABLE',
    failed: 'FAILED', auth_failed: 'AUTH FAILED', missing: 'MISSING',
    needs_confirmation: 'NEEDS CONFIRMATION', untested: 'UNTESTED',
    optional: 'OPTIONAL', unauthorized: 'UNAUTHORIZED',
    blocked_by_protocol: 'REST API ONLY',
  };
  const cls = map[status] || map.untested;
  return <span className={`font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-full border ${cls}`}>{label[status] || status.toUpperCase()}</span>;
}

const STATUS_ROWS = [
  { key: 'rest_api',   IconComp: Zap,          label: 'Metricool REST API' },
  { key: 'profile',    IconComp: UserCircle,    label: 'Profile / Blog ID' },
  { key: 'scheduler',  IconComp: Calendar,      label: 'Scheduler Endpoint' },
  { key: 'analytics',  IconComp: BarChart2,     label: 'Analytics Endpoint' },
  { key: 'mcp',        IconComp: Globe,         label: 'Metricool MCP' },
];

export default function MetricoolApiSetup() {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [diag, setDiag]       = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => { runDiag(); }, []);

  const runDiag = async () => {
    setTesting(true);
    setDiag(null);
    try {
      const res = await base44.functions.invoke('metricoolDiagnostics', {});
      setDiag(res.data);
    } catch (err) {
      setDiag({ error: err?.response?.data?.error || err.message });
      toast({ title: 'Diagnostic failed', variant: 'destructive' });
    }
    setTesting(false);
  };

  const loadProfiles = async () => {
    setLoadingProfiles(true);
    setProfiles(null);
    try {
      const res = await base44.functions.invoke('listMetricoolProfiles', {});
      setProfiles(res.data);
    } catch (err) {
      toast({ title: `Profile list failed: ${err?.response?.data?.error || err.message}`, variant: 'destructive' });
    }
    setLoadingProfiles(false);
  };

  // Derive clean status booleans from diag
  const restOk      = diag?.auth_status === 'connected';
  const profilesReturned = diag?.tests?.simpleProfiles?.result === 'connected';
  const blogIdPresent = diag?.blogId_present;
  const schedulerOk = diag?.tests?.schedulerEndpoint?.result === 'reachable';
  const analyticsOk = diag?.tests?.analyticsEndpoint?.result === 'reachable';

  const statusMap = {
    rest_api:  restOk ? 'connected' : (diag ? 'failed' : 'untested'),
    profile:   blogIdPresent && profilesReturned ? 'needs_confirmation' : (blogIdPresent ? 'needs_confirmation' : 'missing'),
    scheduler: !diag ? 'untested' : (schedulerOk ? 'reachable' : 'failed'),
    analytics: !diag ? 'untested' : (analyticsOk ? 'reachable' : 'failed'),
    mcp:       'blocked_by_protocol',
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Metricool Integration</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">API Setup & Diagnostics</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          REST API · Profile Selection · Scheduler · Analytics · MCP — each tracked separately
        </p>
      </div>

      {/* ── Status Dashboard ─────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Connection Status Dashboard</CardTitle>
            <Button size="sm" variant="outline" onClick={runDiag} disabled={testing} className="gap-1.5">
              {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              {testing ? 'Testing…' : 'Re-test All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {diag?.error ? (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-400">{diag.error}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {STATUS_ROWS.map(({ key, IconComp, label }) => (
                <div key={key} className="flex items-center justify-between py-2.5 border-b border-border/20 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="font-body text-sm text-foreground">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!diag && testing ? <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" /> : <StatusPill status={statusMap[key]} />}
                    {key === 'mcp' && diag && (
                      <span className="font-body text-[10px] text-muted-foreground max-w-[200px] text-right hidden md:block">REST API only — MCP requires authenticated MCP client session</span>
                    )}
                    {key === 'profile' && diag && !selectedProfile && (
                      <Button size="sm" variant="ghost" onClick={loadProfiles} disabled={loadingProfiles} className="h-6 text-xs gap-1">
                        {loadingProfiles ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                        List Profiles
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {diag && (
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg space-y-1 text-xs font-body">
              <p className="font-semibold text-foreground">{diag.summary}</p>
              {diag.next_action && <p className="text-muted-foreground">{diag.next_action}</p>}
              {diag.checked_at && <p className="text-muted-foreground/50">Checked: {new Date(diag.checked_at).toLocaleTimeString()}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── MCP Explanation ──────────────────────────────────── */}
      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 font-body">
            <p className="font-semibold text-orange-300">MCP Unauthorized — This Does Not Mean REST API Failed</p>
            <p className="text-muted-foreground">
              <code className="text-primary">ai.metricool.com/mcp</code> returns <code className="text-orange-400">"error":"unauthorized"</code> when accessed without an authenticated MCP client session.
              This is separate from the REST API. The REST API (<code className="text-primary">app.metricool.com/api</code>) uses <code className="text-primary">X-Mc-Auth</code> token auth and can be fully connected even when MCP shows unauthorized.
            </p>
            <p className="text-muted-foreground">
              MCP requires a dedicated MCP-compatible client tool (e.g. Claude Desktop, Cursor, custom MCP proxy). It is <strong className="text-foreground">optional</strong> — all scheduling and analytics work via the REST API.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Profile Selector ─────────────────────────────────── */}
      {profiles && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><UserCircle className="w-4 h-4 text-primary" /> Select Your Metricool Profile / Blog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground font-body">
              {profiles.profiles?.length > 0
                ? `${profiles.profiles.length} profile(s) returned. Select the correct one to confirm your METRICOOL_BLOG_ID.`
                : profiles.error || 'No profiles returned — check credentials.'}
            </p>

            {Array.isArray(profiles.profiles) && profiles.profiles.map((p, i) => (
              <div key={i} className={`border rounded-xl p-3 transition-all ${selectedProfile === p ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/30'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5 text-xs font-body">
                    <p className="font-semibold text-foreground">{p.name || p.blogName || `Profile ${i + 1}`}</p>
                    {p.blogId && <p className="text-muted-foreground">Blog ID: <code className="text-primary">{p.blogId}</code></p>}
                    {p.userId && <p className="text-muted-foreground">User ID: <code className="text-primary">{p.userId}</code></p>}
                    {p.type && <p className="text-muted-foreground">Type: {p.type}</p>}
                    {p.status && <p className="text-muted-foreground">Status: {p.status}</p>}
                  </div>
                  <Button size="sm" variant={selectedProfile === p ? 'default' : 'outline'}
                    onClick={() => setSelectedProfile(p)}
                    className="shrink-0 text-xs">
                    {selectedProfile === p ? <><Check className="w-3 h-3 mr-1" />Selected</> : 'Select'}
                  </Button>
                </div>
              </div>
            ))}

            {selectedProfile && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-xs font-body space-y-1">
                <p className="text-green-400 font-semibold">Profile selected: {selectedProfile.name || selectedProfile.blogName}</p>
                <p className="text-muted-foreground">Blog ID to save: <code className="text-primary">{selectedProfile.blogId}</code></p>
                <p className="text-amber-400 mt-1">To activate: Update METRICOOL_BLOG_ID secret in Base44 → Settings → Secrets with this value.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Endpoint Details ─────────────────────────────────── */}
      {diag && diag.tests && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Endpoint Test Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs font-body">
              {Object.entries(diag.tests).map(([name, t]) => (
                <div key={name} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center py-1.5 border-b border-border/20 last:border-0">
                  <div>
                    <span className="text-foreground font-medium">{name}</span>
                    {t.endpoint && <span className="block text-muted-foreground/60 font-mono text-[10px] truncate max-w-xs">{t.endpoint}</span>}
                    {t.error && <span className="block text-red-400 mt-0.5">{t.error}</span>}
                  </div>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${t.result === 'connected' || t.result === 'working' || t.result === 'reachable' ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'}`}>
                    {t.result?.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground">{t.status || '—'}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Secrets Guide ────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Required Secrets (never shown — presence only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs font-body">
            {[
              { key: 'METRICOOL_API_TOKEN', where: 'Metricool → Account Settings → API → API Token', present: diag?.token_present },
              { key: 'METRICOOL_USER_ID',   where: 'Metricool → Account Settings → API → User ID',   present: diag?.userId_present },
              { key: 'METRICOOL_BLOG_ID',   where: 'Metricool → Account Settings → API → Blog ID',   present: diag?.blogId_present },
            ].map(s => (
              <div key={s.key} className="flex items-center justify-between p-2.5 border border-border/40 rounded-lg">
                <div>
                  <code className="text-primary">{s.key}</code>
                  <p className="text-muted-foreground mt-0.5">{s.where}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={s.present === true ? 'text-green-400' : s.present === false ? 'text-red-400' : 'text-muted-foreground'}>
                    {s.present === true ? '✓ present' : s.present === false ? '✗ missing' : '— untested'}
                  </span>
                  <CopyBtn text={s.key} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="https://app.metricool.com/home#accountSettings" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Open Metricool Settings</Button>
            </a>
            <Button size="sm" variant="outline" onClick={loadProfiles} disabled={loadingProfiles} className="gap-1.5 text-xs">
              {loadingProfiles ? <RefreshCw className="w-3 h-3 animate-spin" /> : <UserCircle className="w-3 h-3" />}
              List Profiles
            </Button>
            <Button size="sm" onClick={runDiag} disabled={testing} className="gradient-gold-button border-0 gap-1.5 text-xs">
              {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              Test REST API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}