import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Shield, Copy, AlertTriangle, CheckCircle2, Circle,
  GitBranch, Play, Lock, Zap, ExternalLink, Terminal, Key
} from 'lucide-react';

// ─── FIRST AGENT PROMPT ──────────────────────────────────────────────────────
const FIRST_AGENT_PROMPT = `Review and repair the Gannon Waye Business OS repo. Keep Base44 as backend/auth/entity store. Do not migrate to Next.js, Node.js, Postgres, or custom auth. First run build and Playwright tests. Focus on live store failure risk: /store loading speed, multi-item cart, combined shipping, promo validation for F20UN26DVIP and F30MOM26A, old-code rejection, Stripe checkout line items, order webhook, inventory decrement, profit/loss, product image zoom, coffee mug front/back images, clickability, performance, and security. Do not expose secrets. Do not make coaching public. Do not auto-publish, auto-pay, or deploy without approval. Create a branch and PR with tested fixes.`;

// ─── API REQUEST TEMPLATE ────────────────────────────────────────────────────
const API_TEMPLATE = `// POST /v1/agents
// Cursor Cloud Agents API — DO NOT RUN UNTIL GANNON APPROVES
// API key is in CURSOR_API_KEY secret (never hardcoded here)
// This is a safe template for review only

const agentPayload = {
  repoUrl: "https://github.com/GannonWaye/gannonwaye-business-os",
  startingRef: "main",
  autoCreatePR: true,
  workOnCurrentBranch: false,  // NEVER commit to main directly
  instructions: \`${FIRST_AGENT_PROMPT}\`
};

// To run via curl (in Warp, AFTER Gannon approves):
// curl -X POST https://api.cursor.sh/v1/agents \\
//   -H "Authorization: Bearer $CURSOR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{ ...agentPayload }'

// SAFETY RULES:
// - workOnCurrentBranch: false  → agent creates its own branch
// - autoCreatePR: true          → agent creates PR, not direct merge
// - Gannon reviews PR before merging
// - Do NOT run until: repo exists + secrets excluded + Playwright tests pass + budget approved`;

// ─── PRE-FLIGHT CHECKLIST ────────────────────────────────────────────────────
const PREFLIGHT = [
  { id: 'repo', label: 'Private GitHub repo exists (gannonwaye-business-os)', critical: true },
  { id: 'source', label: 'Source code synced/exported to repo', critical: true },
  { id: 'secrets', label: 'Secrets excluded from repo (.env.local in .gitignore)', critical: true },
  { id: 'playwright', label: 'Playwright tests exist in /tests folder', critical: true },
  { id: 'cursor-key', label: 'CURSOR_API_KEY saved in Base44 secrets', critical: true },
  { id: 'key-valid', label: 'Cursor API key tested (GET /v1/me returns valid)', critical: true },
  { id: 'budget', label: 'Budget cap set and approved', critical: false },
  { id: 'gannon', label: 'Gannon has approved first agent run', critical: true },
];

// ─── WARP COMMANDS ───────────────────────────────────────────────────────────
const WARP_STEPS = [
  { label: 'Navigate to repo folder', cmd: 'cd ~/gannonwaye-business-os' },
  { label: 'Install deps', cmd: 'npm install' },
  { label: 'Install Playwright', cmd: 'npm install -D @playwright/test' },
  { label: 'Install browsers', cmd: 'npx playwright install' },
  { label: 'Run all tests', cmd: 'npx playwright test' },
  { label: 'Focused store tests (headed)', cmd: 'npx playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed' },
  { label: 'View test report', cmd: 'npx playwright show-report' },
  { label: 'Open repo in Cursor', cmd: 'cursor .' },
  { label: 'Check git status', cmd: 'git status' },
  { label: 'Push to GitHub', cmd: 'git add . && git commit -m "fix: store cart checkout" && git push' },
];

export default function CursorCloudAgentCommand() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('preflight');
  const [preflight, setPreflight] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cursor_preflight') || '{}'); } catch { return {}; }
  });
  const [apiKeyStatus, setApiKeyStatus] = useState('unknown'); // unknown | valid | invalid | present
  const [testingKey, setTestingKey] = useState(false);
  const [agentApproved, setAgentApproved] = useState(false);

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied!' }); };

  const togglePreflight = (id) => {
    const updated = { ...preflight, [id]: !preflight[id] };
    setPreflight(updated);
    localStorage.setItem('cursor_preflight', JSON.stringify(updated));
  };

  const testCursorKey = async () => {
    setTestingKey(true);
    try {
      const resp = await base44.functions.invoke('testCursorApiKey', {});
      const status = resp.data?.status || 'invalid';
      setApiKeyStatus(status);
      toast({ title: status === 'valid' ? '✅ Cursor API key is valid' : '❌ Cursor API key invalid or missing' });
    } catch {
      setApiKeyStatus('invalid');
      toast({ title: 'Could not test key — check CURSOR_API_KEY secret' });
    }
    setTestingKey(false);
  };

  const preflightDone = PREFLIGHT.filter(p => preflight[p.id]).length;
  const allCriticalDone = PREFLIGHT.filter(p => p.critical).every(p => preflight[p.id]);

  const keyStatusColor = {
    unknown: 'bg-secondary text-muted-foreground',
    present: 'bg-amber-500/20 text-amber-300',
    valid: 'bg-green-500/20 text-green-300',
    invalid: 'bg-red-500/20 text-red-300',
  };

  const tabs = [
    { id: 'preflight', label: `Pre-flight (${preflightDone}/${PREFLIGHT.length})` },
    { id: 'apikey', label: 'API Key' },
    { id: 'prompt', label: 'First Agent Prompt' },
    { id: 'api-template', label: 'API Template' },
    { id: 'warp', label: 'Warp Commands' },
    { id: 'rules', label: 'Safety Rules' },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/external-engineering-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Cursor Cloud Agent Control</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage Cursor Cloud Agents safely. All agents create a branch + PR. No direct commits to main. Gannon approves before any agent runs.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/ai-tool-budget-control"><Button variant="outline" size="sm"><Lock className="w-3 h-3 mr-1" />Budget</Button></Link>
          <Link to="/admin/playwright-test-centre"><Button variant="outline" size="sm"><Play className="w-3 h-3 mr-1" />Tests</Button></Link>
        </div>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'GitHub Repo', value: 'gannonwaye-business-os', color: 'amber', note: 'Private — confirm exists' },
          { label: 'GitLab', value: 'SECONDARY', color: 'muted', note: 'Not used unless required' },
          { label: 'Cursor API Key', value: apiKeyStatus === 'valid' ? 'Valid' : apiKeyStatus === 'invalid' ? 'Invalid' : 'Not Tested', color: apiKeyStatus === 'valid' ? 'green' : 'amber', note: 'Save as CURSOR_API_KEY secret' },
          { label: 'Agent Status', value: allCriticalDone && agentApproved ? 'READY' : 'BLOCKED', color: allCriticalDone && agentApproved ? 'green' : 'red', note: allCriticalDone ? 'All checks passed' : 'Complete pre-flight first' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold mt-0.5">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blocked banner */}
      {!allCriticalDone && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300">Cursor Cloud Agents BLOCKED — Complete pre-flight checklist first</p>
              <p className="text-xs text-muted-foreground mt-1">
                {PREFLIGHT.filter(p => p.critical && !preflight[p.id]).map(p => p.label).join(' · ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <Button key={t.id} variant={activeTab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>

      {/* TAB: PRE-FLIGHT */}
      {activeTab === 'preflight' && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">All critical items must be checked before running any Cursor Cloud Agent. Click to mark complete.</p>
          {PREFLIGHT.map(item => (
            <div
              key={item.id}
              className={`border rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-colors ${preflight[item.id] ? 'border-green-500/30 bg-green-500/5' : item.critical ? 'border-red-500/20 hover:border-red-500/40' : 'border-border/40 hover:border-border/60'}`}
              onClick={() => togglePreflight(item.id)}
            >
              {preflight[item.id]
                ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                : <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              }
              <div className="flex-1">
                <p className={`text-sm ${preflight[item.id] ? 'line-through text-muted-foreground' : ''}`}>{item.label}</p>
              </div>
              {item.critical && <Badge className="bg-red-500/20 text-red-300 text-xs" variant="outline">Critical</Badge>}
            </div>
          ))}

          {allCriticalDone && !agentApproved && (
            <Card className="border-primary/30 bg-primary/5 mt-4">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-primary mb-2">All critical checks passed. Approve first agent run?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Agent will: create its own branch, run Playwright tests, fix store/cart/checkout/promo issues, open a PR. Gannon reviews PR before merge. No direct commit to main.
                </p>
                <Button onClick={() => { setAgentApproved(true); toast({ title: 'First agent run approved — copy the API template and run in Warp' }); }}>
                  ✅ Approve First Cursor Cloud Agent Run
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB: API KEY */}
      {activeTab === 'apikey' && (
        <div className="space-y-4">
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-semibold text-amber-300 flex items-center gap-2"><Key className="w-4 h-4" />CURSOR_API_KEY — Secure Setup</p>
              <p className="text-xs text-muted-foreground">Never paste the key in chat. Never hardcode it in source. Store only in Base44 Secrets.</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {[
              { step: '1', label: 'Get key from Cursor Dashboard', detail: 'cursor.sh → Account → Integrations → API Keys → Create Key', link: 'https://cursor.sh', linkLabel: 'cursor.sh' },
              { step: '2', label: 'Save as CURSOR_API_KEY in Base44', detail: 'Base44 Dashboard → Settings → Environment Variables → Add: CURSOR_API_KEY = your_key_here', link: '/admin/api-setup', linkLabel: 'API Setup' },
              { step: '3', label: 'Test the key (button below)', detail: 'Calls GET /v1/me via backend function. Key value is never shown in UI.' },
            ].map(s => (
              <div key={s.step} className="border border-border/40 rounded-lg p-4 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold shrink-0">{s.step}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.detail}</p>
                </div>
                {s.link && (
                  s.link.startsWith('http') ? (
                    <a href={s.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />{s.linkLabel}</Button>
                    </a>
                  ) : (
                    <Link to={s.link}><Button variant="outline" size="sm">{s.linkLabel}</Button></Link>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Test button */}
          <Card>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Test CURSOR_API_KEY</p>
                <p className="text-xs text-muted-foreground">Calls GET /v1/me via backend. Key is never shown.</p>
                <div className="mt-2">
                  <Badge className={keyStatusColor[apiKeyStatus]}>
                    {apiKeyStatus === 'unknown' ? 'Not tested yet' : apiKeyStatus === 'valid' ? '✅ Valid' : apiKeyStatus === 'present' ? '⚠ Present but unverified' : '❌ Invalid or missing'}
                  </Badge>
                </div>
              </div>
              <Button onClick={testCursorKey} disabled={testingKey} variant="outline">
                {testingKey ? 'Testing…' : 'Test Key'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-3">
              <p className="text-xs font-semibold text-red-300 mb-1">Security Rules for CURSOR_API_KEY</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Do NOT paste in chat</li>
                <li>• Do NOT hardcode in source files</li>
                <li>• Do NOT commit to GitHub</li>
                <li>• Do NOT log or print</li>
                <li>• Only access via Deno.env.get("CURSOR_API_KEY") in backend functions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: FIRST AGENT PROMPT */}
      {activeTab === 'prompt' && (
        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">First Cursor Cloud Agent Prompt</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copy(FIRST_AGENT_PROMPT)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-secondary/50 rounded-lg p-4 whitespace-pre-wrap font-mono leading-relaxed text-foreground">
                {FIRST_AGENT_PROMPT}
              </pre>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-amber-300 mb-1">What this prompt tells the agent:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✅ Keep Base44 as backend — do not migrate</li>
                <li>✅ Run Playwright tests first</li>
                <li>✅ Fix store, cart, shipping, promo, Stripe, inventory</li>
                <li>✅ Do not expose secrets</li>
                <li>✅ Do not make coaching public</li>
                <li>✅ Create branch + PR — no auto-deploy</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: API TEMPLATE */}
      {activeTab === 'api-template' && (
        <div className="space-y-4">
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">DO NOT RUN until Gannon approves (pre-flight complete). This is a template for review only. API key is in CURSOR_API_KEY secret — never shown here.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">POST /v1/agents — Safe API Template</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copy(API_TEMPLATE)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono leading-relaxed">
                {API_TEMPLATE}
              </pre>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'repo', value: 'https://github.com/GannonWaye/gannonwaye-business-os' },
              { label: 'startingRef', value: 'main' },
              { label: 'autoCreatePR', value: 'true' },
              { label: 'workOnCurrentBranch', value: 'false (NEVER commit to main)' },
            ].map(p => (
              <div key={p.label} className="border border-border/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{p.label}</p>
                <p className="text-sm font-mono font-semibold mt-0.5">{p.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: WARP */}
      {activeTab === 'warp' && (
        <div className="space-y-3">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-3">
              <p className="text-sm font-semibold text-green-300">Warp: INSTALLED + GitHub signed in. Playwright: INSTALLED locally (Firefox + WebKit).</p>
              <p className="text-xs text-muted-foreground mt-1">Use Warp for local test execution first. Cursor Cloud Agents are secondary.</p>
            </CardContent>
          </Card>

          {WARP_STEPS.map(({ label, cmd }) => (
            <div key={label} className="border border-border/40 rounded-lg p-3 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <code className="text-sm font-mono text-foreground break-all">{cmd}</code>
              </div>
              <Button variant="outline" size="sm" onClick={() => copy(cmd)} className="shrink-0"><Copy className="w-3 h-3 mr-1" />Copy</Button>
            </div>
          ))}

          <Card className="border-red-500/20 bg-red-500/5 mt-2">
            <CardContent className="p-3">
              <p className="text-xs font-semibold text-red-300 mb-1">Warp Safety Rules</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Do not commit .env or .env.local</li>
                <li>• Do not run rm -rf without confirmation</li>
                <li>• Do not deploy to production without approval</li>
                <li>• Do not run paid cloud agents without approval</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: SAFETY RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-3">
          {[
            { icon: '🔒', title: 'GitHub = Primary', rule: 'Warp signed in with GitHub. Cursor connected to GitHub. GitHub is the primary repo. GitLab is secondary — do not use unless there is a clear technical reason.' },
            { icon: '🚫', title: 'No direct commits to main', rule: 'workOnCurrentBranch: false at all times. Cursor agents always create a new branch and open a PR. Gannon reviews the PR before merge.' },
            { icon: '🔑', title: 'Secrets never in source', rule: 'CURSOR_API_KEY, STRIPE_SECRET_KEY, TIKTOK_CLIENT_SECRET, METRICOOL_API_TOKEN must never appear in any source file, git commit, or chat message.' },
            { icon: '💰', title: 'Spend cap required', rule: 'Do not run paid Cursor Cloud Agents until: repo exists, secrets excluded, Playwright tests pass, budget cap set, Gannon approves.' },
            { icon: '🏫', title: 'Coaching stays private', rule: 'COACHING_PUBLIC_LAUNCH_ENABLED = false. No agent may change this. Any coaching-public change requires legal review + 9-gate checklist + Gannon approval.' },
            { icon: '📋', title: 'Local first, cloud second', rule: 'Priority: 1. Warp + Playwright (local) → 2. Manual Cursor (local) → 3. Cursor Cloud Agents (paid, gated). Do not skip to step 3.' },
          ].map(r => (
            <div key={r.title} className="border border-border/40 rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">{r.icon} {r.title}</p>
              <p className="text-xs text-muted-foreground">{r.rule}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}