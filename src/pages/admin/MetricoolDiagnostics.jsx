import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink,
  Shield, Wifi, WifiOff, Info, Lock
} from 'lucide-react';

const StatusDot = ({ ok, unknown }) => {
  if (unknown) return <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40 shrink-0" />;
  return <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${ok ? 'bg-green-400' : 'bg-red-400'}`} />;
};

const TestRow = ({ label, result }) => {
  if (!result) return null;
  const ok = result.result === 'connected' || result.result === 'reachable' || result.result === 'working';
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/20 last:border-0">
      <StatusDot ok={ok} unknown={!result.result} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">{label}</span>
          {result.status && <Badge variant="outline" className={`text-[10px] ${ok ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}`}>HTTP {result.status}</Badge>}
          <Badge variant="outline" className="text-[10px]">{result.result}</Badge>
        </div>
        {result.error && <p className="text-xs text-muted-foreground mt-0.5">{result.error}</p>}
      </div>
    </div>
  );
};

const LIKELY_CAUSES = [
  { cause: 'Wrong token', fix: 'Regenerate in Metricool → Settings → API Access → Generate Token' },
  { cause: 'Token not trimmed', fix: 'Copy token again carefully — no leading/trailing spaces' },
  { cause: 'userId mismatch', fix: 'userId must match the token owner account' },
  { cause: 'blogId mismatch', fix: 'blogId must belong to the userId account — check in Metricool → Brands' },
  { cause: 'Account plan limitation', fix: 'API access requires Metricool Advanced+ plan' },
];

export default function MetricoolDiagnostics() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runDiagnostics = async () => {
    setRunning(true);
    try {
      const res = await base44.functions.invoke('metricoolDiagnostics', {});
      setResult(res.data);
    } catch (err) {
      setResult({ error: err?.response?.data?.error || err.message, auth_status: 'error' });
    }
    setRunning(false);
  };

  const isConnected = result?.auth_status === 'connected';
  const isFailed = result && !isConnected;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Metricool</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">API Diagnostics</h1>
        <p className="text-muted-foreground text-sm mt-1">Full authentication + endpoint test — safe, no tokens exposed</p>
      </div>

      <Button onClick={runDiagnostics} disabled={running} className="gap-2">
        {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
        {running ? 'Running diagnostics...' : 'Run Full Diagnostics'}
      </Button>

      {result && (
        <div className="space-y-4">
          <div className={`rounded-xl border p-4 flex items-start gap-3 ${isConnected ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
            {isConnected
              ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className={`font-semibold text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {result.summary || result.error}
              </p>
              {result.next_action && <p className="text-xs text-muted-foreground mt-1">{result.next_action}</p>}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Secrets Check</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {[
                { label: 'METRICOOL_API_TOKEN', present: result.token_present },
                { label: 'METRICOOL_USER_ID', present: result.userId_present },
                { label: 'METRICOOL_BLOG_ID', present: result.blogId_present },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <StatusDot ok={s.present} />
                  <span className="text-sm font-mono">{s.label}</span>
                  <Badge variant="outline" className={`text-[10px] ${s.present ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}`}>
                    {s.present ? 'present' : 'MISSING'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-400 mb-1">MCP Direct Mode: Blocked by Protocol</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The MCP endpoint requires JSON-RPC session protocol — cannot be called as plain REST. The REST API is the production approach.
                </p>
                <p className="text-xs text-blue-300 mt-1">REST fallback: {result.rest_fallback_mode === 'active' ? '✓ Active' : '—'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Wifi className="w-4 h-4 text-primary" /> Endpoint Tests</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <TestRow label="simpleProfiles (auth test)" result={result.tests?.simpleProfiles} />
              <TestRow label="Scheduler endpoint" result={result.tests?.schedulerEndpoint} />
              <TestRow label="Normalize image URL" result={result.tests?.normalizeEndpoint} />
              <TestRow label="Analytics endpoint" result={result.tests?.analyticsEndpoint} />
            </CardContent>
          </Card>

          {isFailed && (
            <Card className="border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Likely Causes & Fixes</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {LIKELY_CAUSES.map((c, i) => (
                  <div key={i} className="border border-border/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-amber-300">{c.cause}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.fix}</p>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <a href="https://app.metricool.com/settings" target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Open Metricool Settings
                    </Button>
                  </a>
                  <Link to="/admin/metricool-api-setup">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Update Secrets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {result.checked_at && (
            <p className="text-xs text-muted-foreground text-right">Checked: {new Date(result.checked_at).toLocaleString('en-AU')}</p>
          )}
        </div>
      )}

      {!result && (
        <Card className="border-border/30">
          <CardContent className="p-6 text-center">
            <WifiOff className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Click "Run Full Diagnostics" to test all Metricool endpoints</p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Link to="/admin/metricool-command"><Button variant="outline" size="sm">← Metricool Command</Button></Link>
        <Link to="/admin/metricool-api-setup"><Button variant="outline" size="sm">API Setup</Button></Link>
      </div>
    </div>
  );
}