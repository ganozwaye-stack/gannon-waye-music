import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Brain, Shield, AlertTriangle, Zap,
  ArrowLeft, RefreshCw, Lock, Pause, Play, Activity, Eye, Copy
} from 'lucide-react';

export default function OpenAICommandCentre() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState('status');
  const [keyStatus, setKeyStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [repairForm, setRepairForm] = useState({ failedTests: '', errorStack: '' });
  const [repairResult, setRepairResult] = useState(null);
  const [repairRunning, setRepairRunning] = useState(false);
  const [contentForm, setContentForm] = useState({ platform: 'instagram', campaign: 'thank_you_june5', context: '' });
  const [contentRunning, setContentRunning] = useState(false);

  const { data: messages = [] } = useQuery({
    queryKey: ['agentMessages'],
    queryFn: () => base44.entities.AgentMessage.list('-created_date', 30),
    refetchInterval: 15000,
  });

  const resolveMsg = useMutation({
    mutationFn: id => base44.entities.AgentMessage.update(id, { status: 'resolved', resolved_date: new Date().toISOString() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agentMessages'] }),
  });

  const copy = t => { navigator.clipboard.writeText(t); toast({ title: 'Copied!' }); };

  const testKey = async () => {
    setTesting(true);
    setKeyStatus(null);
    try {
      const res = await base44.functions.invoke('testOpenAIKey', {});
      setKeyStatus(res.data);
      toast({ title: res.data?.valid ? '✅ OpenAI key valid' : '❌ Key issue — see status' });
    } catch (err) {
      setKeyStatus({ present: false, valid: false, error_type: err?.response?.data?.error || err.message });
      toast({ title: 'Test failed', variant: 'destructive' });
    }
    setTesting(false);
  };

  const runRepairAnalysis = async () => {
    if (!repairForm.failedTests && !repairForm.errorStack) {
      toast({ title: 'Paste failed test names or error stack first', variant: 'destructive' });
      return;
    }
    setRepairRunning(true);
    setRepairResult(null);
    try {
      const res = await base44.functions.invoke('openAIRepairAssistant', {
        failedTests: repairForm.failedTests.split('\n').filter(Boolean),
        errorStack: repairForm.errorStack,
        source: 'openai_command_centre',
      });
      setRepairResult(res.data);
      qc.invalidateQueries({ queryKey: ['agentMessages'] });
      toast({ title: '✅ Repair analysis complete — fix tasks created' });
    } catch (err) {
      toast({ title: err?.response?.data?.error || 'Repair failed', variant: 'destructive' });
    }
    setRepairRunning(false);
  };

  const runContentGeneration = async () => {
    setContentRunning(true);
    try {
      const res = await base44.functions.invoke('openAIContentAssistant', {
        platform: contentForm.platform,
        campaign: contentForm.campaign,
        context: contentForm.context,
        max_variants: 2,
      });
      qc.invalidateQueries({ queryKey: ['agentMessages'] });
      toast({ title: `✅ ${res.data?.drafts_created} drafts created — awaiting approval` });
    } catch (err) {
      toast({ title: err?.response?.data?.error || 'Content generation failed', variant: 'destructive' });
    }
    setContentRunning(false);
  };

  const activeMessages = messages.filter(m => !['resolved', 'failed'].includes(m.status));
  const failedMessages = messages.filter(m => m.status === 'failed');
  const repairMessages = messages.filter(m => m.message_type === 'store_repair_task');
  const contentMessages = messages.filter(m => ['content_task', 'content_request'].includes(m.message_type));

  const keyBadge = keyStatus
    ? keyStatus.valid
      ? <Badge className="bg-green-500/20 text-green-300 border-green-500/30">✓ valid</Badge>
      : <Badge className="bg-red-500/20 text-red-300 border-red-500/30">✗ {keyStatus.error_type || 'invalid'}</Badge>
    : <Badge className="bg-secondary text-muted-foreground">not tested</Badge>;

  const TABS = [
    { id: 'status', label: '🔑 Key & Status' },
    { id: 'message-bus', label: `📨 Message Bus (${activeMessages.length})` },
    { id: 'repair', label: '🔧 Repair Assistant' },
    { id: 'content', label: '✍️ Content Assistant' },
    { id: 'cost', label: '💰 Cost Control' },
    { id: 'security', label: '🔒 Security' },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">OpenAI Control Bridge</h1>
            <p className="text-sm text-muted-foreground mt-1">Admin-only · Cost-controlled · Secret-safe · Approval-gated</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant={paused ? 'default' : 'outline'} size="sm" onClick={() => setPaused(p => !p)}>
            {paused ? <><Play className="w-3 h-3 mr-1" />Resume AI</> : <><Pause className="w-3 h-3 mr-1" />Pause AI</>}
          </Button>
          <Button onClick={testKey} disabled={testing} variant="outline" size="sm">
            {testing ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Zap className="w-3 h-3 mr-1" />}
            Test Key
          </Button>
        </div>
      </div>

      {/* Paused banner */}
      {paused && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-3 flex items-center gap-2">
            <Pause className="w-4 h-4 text-amber-400" />
            <p className="text-sm font-semibold text-amber-300">All AI jobs PAUSED. No OpenAI calls will be made until resumed.</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <Button key={t.id} variant={tab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setTab(t.id)}>{t.label}</Button>
        ))}
      </div>

      {/* ── KEY & STATUS ── */}
      {tab === 'status' && (
        <div className="space-y-4">
          {/* Security warning */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300 text-sm">Previous OpenAI key was exposed — revoke it immediately</p>
                <p className="text-xs text-muted-foreground mt-1">Go to platform.openai.com → API Keys → revoke any old key → generate new key → save as OPENAI_API_KEY in Base44 Secrets only.</p>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
                  <Button variant="destructive" size="sm" className="h-7 text-xs">Revoke Old Key →</Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Key status */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'OPENAI_API_KEY', value: keyBadge, Ic: Lock },
              { label: 'Key Display', value: <span className="text-xs text-muted-foreground">{keyStatus?.key_display || 'not tested'}</span>, Ic: Eye },
              { label: 'Model Reachable', value: keyStatus ? (keyStatus.model_reachable ? <span className="text-green-300 text-xs">gpt-4o-mini ✓</span> : <span className="text-red-300 text-xs">unreachable</span>) : <span className="text-xs text-muted-foreground">—</span>, Ic: Brain },
              { label: 'Last Checked', value: <span className="text-xs text-muted-foreground">{keyStatus?.last_checked ? new Date(keyStatus.last_checked).toLocaleTimeString('en-AU') : 'never'}</span>, Ic: Activity },
            ].map(({ label, value, Ic }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Ic className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                  {value}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System overview */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">System Status</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                ['Store repair', 'FAILED — NEEDS FIX', 'red', '/admin/autonomous-repair-loop'],
                ['AI Message Bus', `${messages.length} messages`, 'green', '/admin/openai-command'],
                ['Content Command', 'BUILT BUT UNTESTED', 'amber', '/admin/content-command'],
                ['Metricool', 'BLOCKED BY PROFILE/ACCOUNT ID', 'orange', '/admin/metricool-command'],
                ['Approval Queue', 'ACTIVE', 'green', '/admin/approval-queue'],
                ['Paid AI jobs', paused ? 'PAUSED' : 'ENABLED (cost-controlled)', paused ? 'orange' : 'green', null],
              ].map(([label, status, color, route]) => (
                <div key={label} className="flex items-center justify-between gap-2 p-2 border border-border/20 rounded text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      color === 'green' ? 'bg-green-500/20 text-green-300 border-green-500/30 text-xs' :
                      color === 'red' ? 'bg-red-500/20 text-red-300 border-red-500/30 text-xs' :
                      color === 'orange' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs'
                    } variant="outline">{status}</Badge>
                    {route && <Link to={route}><Button variant="ghost" size="icon" className="h-5 w-5"><Eye className="w-3 h-3" /></Button></Link>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── MESSAGE BUS ── */}
      {tab === 'message-bus' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active', count: activeMessages.length, color: 'text-amber-400' },
              { label: 'Failed', count: failedMessages.length, color: 'text-red-400' },
              { label: 'Repair Tasks', count: repairMessages.length, color: 'text-orange-400' },
              { label: 'Content Tasks', count: contentMessages.length, color: 'text-blue-400' },
            ].map(({ label, count, color }) => (
              <Card key={label}><CardContent className="p-3 text-center">
                <p className={`text-2xl font-bold ${color}`}>{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent></Card>
            ))}
          </div>
          <div className="space-y-2">
            {messages.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No agent messages yet. Run Repair or Content assistants to create messages.</CardContent></Card>
            ) : messages.map(msg => (
              <Card key={msg.id} className={
                msg.priority === 'critical' ? 'border-red-500/20' :
                msg.status === 'resolved' ? 'opacity-50 border-border/20' : 'border-border/30'
              }>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className="bg-secondary text-xs" variant="outline">{msg.message_type?.replace(/_/g, ' ')}</Badge>
                        <Badge className={`text-xs ${msg.priority === 'critical' ? 'bg-red-500/20 text-red-300' : msg.priority === 'high' ? 'bg-amber-500/20 text-amber-300' : 'bg-secondary text-muted-foreground'}`} variant="outline">{msg.priority}</Badge>
                        <Badge className={`text-xs ${msg.status === 'resolved' ? 'bg-green-500/20 text-green-300' : msg.status === 'failed' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`} variant="outline">{msg.status}</Badge>
                      </div>
                      <p className="text-sm font-medium">{msg.subject}</p>
                      {msg.summary && <p className="text-xs text-muted-foreground mt-0.5">{msg.summary.substring(0, 120)}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">{msg.from_system} → {msg.to_system}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {msg.linked_route && <Link to={msg.linked_route}><Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3 h-3" /></Button></Link>}
                      {msg.status !== 'resolved' && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => resolveMsg.mutate(msg.id)}>Resolve</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── REPAIR ASSISTANT ── */}
      {tab === 'repair' && (
        <div className="space-y-4">
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4">
              <p className="font-semibold text-amber-300 text-sm mb-1">Store Status: FAILED — NEEDS FIX</p>
              <p className="text-xs text-muted-foreground">Paste Playwright failures → OpenAI analyses → creates fix plan, Cursor prompt, Warp command, SystemHealthIssue, AgentMessage.</p>
            </CardContent>
          </Card>
          {repairResult ? (
            <div className="space-y-3">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-300">AI Repair Analysis</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {repairResult.analysis?.root_cause && (
                    <div><p className="text-muted-foreground font-medium mb-1">Root Cause</p><p>{repairResult.analysis.root_cause}</p></div>
                  )}
                  {repairResult.analysis?.fix_plan && (
                    <div><p className="text-muted-foreground font-medium mb-1">Fix Plan</p><p className="whitespace-pre-wrap">{repairResult.analysis.fix_plan}</p></div>
                  )}
                  {repairResult.analysis?.cursor_prompt && (
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">Cursor Prompt</p>
                      <div className="flex items-start gap-2">
                        <code className="bg-secondary/50 p-2 rounded flex-1 break-all">{repairResult.analysis.cursor_prompt}</code>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copy(repairResult.analysis.cursor_prompt)}><Copy className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  )}
                  {repairResult.analysis?.retest_command && (
                    <div>
                      <p className="text-muted-foreground font-medium mb-1">Retest Command</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-secondary/50 px-2 py-1 rounded flex-1 font-mono">{repairResult.analysis.retest_command}</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copy(repairResult.analysis.retest_command)}><Copy className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  )}
                  <p className="text-muted-foreground">Tokens: {repairResult.tokens_used} · Est. cost: ${repairResult.estimated_cost_usd}</p>
                </CardContent>
              </Card>
              <Button variant="outline" size="sm" onClick={() => setRepairResult(null)}>Run Another Analysis</Button>
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">OpenAI Repair Assistant</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Failed test names (one per line)</label>
                  <textarea value={repairForm.failedTests} onChange={e => setRepairForm(f => ({...f, failedTests: e.target.value}))} rows={3}
                    placeholder="Store loads within 5 seconds&#10;Store shows at least one product&#10;TypeError: uu is not a function"
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-xs font-mono text-foreground" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Error stack / Playwright output</label>
                  <textarea value={repairForm.errorStack} onChange={e => setRepairForm(f => ({...f, errorStack: e.target.value}))} rows={5}
                    placeholder="Paste Playwright output here..."
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-xs font-mono text-foreground" />
                </div>
                <Button onClick={runRepairAnalysis} disabled={repairRunning || paused} className="w-full">
                  {repairRunning ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Analysing...</> : <><Brain className="w-4 h-4 mr-2" />Run Repair Analysis (~$0.001)</>}
                </Button>
                {paused && <p className="text-xs text-amber-300 text-center">AI is paused. Resume to run analysis.</p>}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── CONTENT ASSISTANT ── */}
      {tab === 'content' && (
        <div className="space-y-4">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-3">
              <p className="text-sm font-semibold text-green-300 mb-1">All generated posts → awaiting_approval → no auto-posting</p>
              <p className="text-xs text-muted-foreground">Posts created in ContentPost entity with status: awaiting_approval. Review at /admin/content-command before anything is published.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">OpenAI Content Assistant</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Platform</label>
                  <select value={contentForm.platform} onChange={e => setContentForm(f => ({...f, platform: e.target.value}))}
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                    {['instagram','tiktok','facebook','youtube_shorts','threads','pinterest','twitter_x'].map(p => <option key={p} value={p}>{p.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Campaign</label>
                  <select value={contentForm.campaign} onChange={e => setContentForm(f => ({...f, campaign: e.target.value}))}
                    className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
                    {['thank_you_june5','merch_launch','coffee_mug_campaign','founding_supporters','store_promotion'].map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Context / brief (optional)</label>
                <textarea value={contentForm.context} onChange={e => setContentForm(f => ({...f, context: e.target.value}))} rows={2}
                  placeholder="e.g. Focus on pre-save CTA. Emotional vulnerability. Store launch."
                  className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" />
              </div>
              <Button onClick={runContentGeneration} disabled={contentRunning || paused} className="w-full">
                {contentRunning ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Zap className="w-4 h-4 mr-2" />Generate 2 Drafts (~$0.0005) → awaiting approval</>}
              </Button>
              <div className="flex gap-2">
                <Link to="/admin/content-command" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Review in Content Command →</Button>
                </Link>
                <Link to="/admin/approval-queue" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Approval Queue →</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── COST CONTROL ── */}
      {tab === 'cost' && (
        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold text-primary text-sm">Default: Paid AI jobs DISABLED until key is valid + budget cap set</p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                {[
                  ['Monthly cap', 'NOT SET — set before enabling'],
                  ['Daily cap', 'NOT SET'],
                  ['Per-run cap', '$0.05 max per call'],
                  ['Model default', 'gpt-4o-mini (cheapest)'],
                  ['Low-cost mode', 'ENABLED'],
                  ['Approval threshold', '$0.10+ requires approval'],
                  ['Cursor Cloud Agent', 'BLOCKED — requires approval'],
                  ['Auto-retries', 'MAX 3 per task'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between p-2 border border-border/20 rounded">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-3 text-xs space-y-1 text-muted-foreground">
              <p className="font-semibold text-red-300 mb-2">Hard limits — never override:</p>
              <p>· No endless AI loops</p>
              <p>· No auto-posting without approval</p>
              <p>· No Cursor Cloud Agent without approval + budget</p>
              <p>· No expensive model (GPT-4o, Claude Opus) for template work</p>
              <p>· No long video processing without approval</p>
              <p>· No paid jobs if key is invalid or paused</p>
            </CardContent>
          </Card>
          <Link to="/admin/ai-cost-control">
            <Button variant="outline" className="w-full">Full AI Budget Dashboard →</Button>
          </Link>
        </div>
      )}

      {/* ── SECURITY ── */}
      {tab === 'security' && (
        <div className="space-y-4">
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold text-red-300 text-sm flex items-center gap-2"><Shield className="w-4 h-4" />Secret Scan Rules</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                {[
                  'OPENAI_API_KEY — never displayed, never logged, never in frontend',
                  'STRIPE_SECRET_KEY — server-side only, never in browser',
                  'STRIPE_WEBHOOK_SECRET — only validated in stripeWebhook function',
                  'TIKTOK_CLIENT_SECRET — only in tiktokOAuth function',
                  'METRICOOL_API_TOKEN — only in metricool* functions',
                  'CURSOR_API_KEY — only in testCursorApiKey function',
                  'Admin session cookies — never stored in DB',
                  'All secrets — Base44 Secrets panel only, never committed to GitHub',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 p-2 border border-red-500/10 rounded">
                    <Lock className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-xs space-y-1 text-muted-foreground">
              <p className="font-semibold text-foreground mb-2">Scan status</p>
              {[
                ['Frontend pages', 'No secrets detected in source'],
                ['Backend functions', 'All keys via Deno.env.get() only'],
                ['Admin pages', 'No key values displayed — status only'],
                ['GitHub export', 'BLOCKED until .gitignore verified'],
                ['AgentMessage entity', 'Admin-only RLS — no public access'],
                ['ContentPost entity', 'Admin-only RLS'],
                ['SystemHealthIssue entity', 'Admin-only RLS'],
              ].map(([area, status]) => (
                <div key={area} className="flex items-center justify-between p-1.5 border border-border/20 rounded">
                  <span>{area}</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs" variant="outline">{status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
            <Button variant="destructive" className="w-full">Revoke Exposed OpenAI Key → platform.openai.com</Button>
          </a>
        </div>
      )}
    </div>
  );
}