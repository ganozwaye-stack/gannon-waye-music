import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Settings, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink, 
  Copy, Check, Lock, Zap, Globe
} from 'lucide-react';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

const SECRETS_NEEDED = [
  { key: 'METRICOOL_API_TOKEN', label: 'API Token', where: 'Metricool → Account Settings → API → API Token' },
  { key: 'METRICOOL_USER_ID', label: 'User ID', where: 'Metricool → Account Settings → API → User ID' },
  { key: 'METRICOOL_BLOG_ID', label: 'Blog/Profile ID', where: 'Metricool → Account Settings → API → Blog ID (the social profile you\'re posting to)' },
];

export default function MetricoolApiSetup() {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('validateMetricoolConfig', {});
      setResult(res.data);
      toast({ title: res.data?.valid ? 'Connected ✓' : res.data?.message });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setResult({ valid: false, message: msg });
      toast({ title: `Test failed: ${msg}`, variant: 'destructive' });
    }
    setTesting(false);
  };

  const configOk = result?.valid === true;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Metricool Integration</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">API Setup</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Configure Metricool API credentials · Test connection · MCP setup guide</p>
      </div>

      {/* Step 1 — Get credentials */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Step 1 — Get Your Metricool Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-body text-xs text-muted-foreground">You need an Advanced or Custom Metricool plan for API access.</p>
          <a href="https://app.metricool.com/home#accountSettings" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> Open Metricool Account Settings
            </Button>
          </a>
          <div className="space-y-2">
            {SECRETS_NEEDED.map(s => (
              <div key={s.key} className="border border-border/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-mono text-xs text-primary">{s.key}</code>
                  <Badge className="bg-secondary text-muted-foreground border-0 text-[9px]">Secret</Badge>
                </div>
                <p className="font-body text-xs text-muted-foreground">{s.where}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2 — Add secrets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Step 2 — Add Secrets to Base44</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-body text-xs text-muted-foreground">Add all three secrets in Base44 dashboard → Settings → Secrets. They are never exposed to the frontend.</p>
          <div className="bg-secondary/30 rounded-lg p-3 space-y-1.5">
            {SECRETS_NEEDED.map(s => (
              <div key={s.key} className="flex items-center justify-between">
                <code className="font-mono text-xs text-primary">{s.key}</code>
                <CopyBtn text={s.key} />
              </div>
            ))}
          </div>
          <div className="space-y-2 text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p><strong className="text-foreground">Auth rules (Metricool REST API):</strong></p>
                <p>• Header: <code className="font-mono text-primary">X-Mc-Auth: &lt;userToken&gt;</code></p>
                <p>• Header: <code className="font-mono text-primary">Content-Type: application/json</code></p>
                <p>• Query params on every request: <code className="font-mono text-primary">?userId=...&blogId=...</code></p>
                <p className="text-muted-foreground/60">Never put credentials in frontend code. All requests go through backend functions only.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3 — Test */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Step 3 — Test Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={runTest} disabled={testing} className="gradient-gold-button border-0 gap-2">
            {testing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Testing...</> : <><Zap className="w-4 h-4" /> Run Config Test</>}
          </Button>

          {result && (
            <div className={`rounded-xl border p-4 space-y-2 ${configOk ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
              <div className="flex items-center gap-2">
                {configOk ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                <p className={`font-body text-sm font-semibold ${configOk ? 'text-green-400' : 'text-red-400'}`}>{result.message}</p>
              </div>
              {result.missing?.length > 0 && (
                <p className="font-body text-xs text-muted-foreground">Missing: {result.missing.join(', ')}</p>
              )}
              {result.api_status && (
                <div className="grid grid-cols-2 gap-2 text-xs font-body">
                  <div><span className="text-muted-foreground">API Status: </span><span className="text-foreground">{result.api_status}</span></div>
                  {result.profiles_returned !== null && result.profiles_returned !== undefined && (
                    <div><span className="text-muted-foreground">Brands returned: </span><span className="text-green-400">{result.profiles_returned}</span></div>
                  )}
                  {result.endpoint_tested && <div className="col-span-2"><span className="text-muted-foreground">Endpoint tested: </span><code className="text-primary text-[10px]">{result.endpoint_tested}</code></div>}
                  {result.api_error && <div className="col-span-2"><span className="text-muted-foreground">Error: </span><span className="text-red-400">{result.api_error}</span></div>}
                </div>
              )}
              {result.secrets_present && (
                <div className="flex gap-3 flex-wrap text-xs font-body">
                  {Object.entries(result.secrets_present).map(([k, v]) => (
                    <span key={k} className={v ? 'text-green-400' : 'text-red-400'}>
                      {v ? '✓' : '✗'} {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MCP Setup */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Optional — Metricool MCP (AI-Native Scheduling)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-body text-xs text-muted-foreground">
            The official Metricool MCP server at <a href="https://ai.metricool.com/mcp" target="_blank" rel="noopener noreferrer" className="text-primary underline">ai.metricool.com/mcp</a> allows AI agents to schedule posts natively.
            Approval gate still applies — no posts leave without admin sign-off.
          </p>
          <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
            <p className="font-body text-xs font-semibold text-foreground">MCP Connection Details:</p>
            <div className="space-y-1.5 text-xs font-body">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Endpoint:</span>
                <div className="flex items-center gap-1.5">
                  <code className="text-primary font-mono">https://ai.metricool.com/mcp</code>
                  <CopyBtn text="https://ai.metricool.com/mcp" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Auth header:</span>
                <code className="text-primary font-mono">X-Mc-Auth: &lt;userToken&gt;</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Query params:</span>
                <code className="text-primary font-mono">?userId=...&blogId=...</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Schedule endpoint:</span>
                <code className="text-primary font-mono text-[10px]">POST /api/v2/scheduler/posts</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Normalize endpoint:</span>
                <code className="text-primary font-mono text-[10px]">GET /api/actions/normalize/image/url?url=...</code>
              </div>
            </div>
          </div>
          <a href="https://ai.metricool.com/mcp" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 border-blue-500/40 text-blue-400">
              <ExternalLink className="w-3.5 h-3.5" /> Open Metricool MCP
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}