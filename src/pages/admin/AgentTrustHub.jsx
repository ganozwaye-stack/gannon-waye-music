import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Copy, Download,
  ExternalLink, ArrowLeft, Eye, Terminal, Package, Globe, Lock, Zap
} from 'lucide-react';

const SAGE_INFO = {
  name: 'Sage by Gen Digital',
  purpose: 'Lightweight agent security layer — intercepts dangerous commands, blocks malicious URLs, detects credential leaks, detects suspicious packages, detects destructive terminal actions.',
  website: 'https://gendigital.com',
  openclaw_install: 'openclaw plugins install @gendigital/sage-openclaw',
  coverage: [
    { risk: 'Credential/secret leak detection', covered: true },
    { risk: 'Malicious URL blocking', covered: true },
    { risk: 'Dangerous terminal command interception', covered: true },
    { risk: 'Supply-chain / package risk detection', covered: true },
    { risk: 'Destructive action detection', covered: true },
    { risk: '.env / secret file exposure detection', covered: true },
    { risk: 'Obfuscation / evasion attempt detection', covered: true },
    { risk: 'Persistence / tampering detection', covered: true },
  ],
};

const TOOLS = [
  {
    name: 'GitHub',
    sage_supported: 'Partial (secret scanning)',
    sage_installed: 'No',
    last_tested: 'Not yet',
    secret_risk: 'Medium (with secret scanning: Low)',
    cmd_risk: 'Low',
    url_risk: 'Low',
    pkg_risk: 'Low',
    setup: 'Enable GitHub Secret Scanning in repo settings. Add branch protection on main. Store all CI/CD secrets in GitHub Repository Secrets (never in YAML files). Create private repo — never public for this codebase.',
    action: 'Create private repo. Enable secret scanning. Add .gitignore with .env, .env.local, node_modules, playwright-report/.',
    status: 'action_required',
  },
  {
    name: 'Base44 Agent',
    sage_supported: 'N/A',
    sage_installed: 'N/A',
    last_tested: '2026-05-27',
    secret_risk: 'Low',
    cmd_risk: 'Low',
    url_risk: 'Low',
    pkg_risk: 'Low',
    setup: 'Built-in to Base44 platform. All agent operations are approval-gated.',
    action: 'None — approval gates active',
    status: 'safe',
  },
  {
    name: 'Cursor',
    sage_supported: 'No (no plugin API)',
    sage_installed: 'No',
    last_tested: 'Not yet',
    secret_risk: 'High',
    cmd_risk: 'High',
    url_risk: 'Medium',
    pkg_risk: 'Medium',
    setup: 'Use Cursor rules file (.cursorrules). Apply Agent Safety Checklist. Never paste secrets into Cursor chat.',
    action: 'Add .cursorrules with safety rules. Download Cursor Task Pack.',
    status: 'caution',
  },
  {
    name: 'Claude Code',
    sage_supported: 'Partial (via OpenClaw)',
    sage_installed: 'No — install recommended',
    last_tested: 'Not yet',
    secret_risk: 'High',
    cmd_risk: 'High',
    url_risk: 'Medium',
    pkg_risk: 'Medium',
    setup: 'openclaw plugins install @gendigital/sage-openclaw — then configure sage for this project directory.',
    action: 'Install Sage via OpenClaw. Run test. Confirm secret scanning active.',
    status: 'action_required',
  },
  {
    name: 'OpenClaw',
    sage_supported: 'Yes — native plugin',
    sage_installed: 'No — install recommended',
    last_tested: 'Not yet',
    secret_risk: 'Medium (with Sage: Low)',
    cmd_risk: 'Medium (with Sage: Low)',
    url_risk: 'Medium (with Sage: Low)',
    pkg_risk: 'Medium (with Sage: Low)',
    setup: 'openclaw plugins install @gendigital/sage-openclaw',
    action: 'Install Sage plugin. Verify active in openclaw status.',
    status: 'action_required',
  },
  {
    name: 'VS Code Agents',
    sage_supported: 'Partial (extension)',
    sage_installed: 'No',
    last_tested: 'Not yet',
    secret_risk: 'Medium',
    cmd_risk: 'Medium',
    url_risk: 'Low',
    pkg_risk: 'Medium',
    setup: 'Check VS Code marketplace for Sage by Gen Digital extension. Use .vscode/settings.json to disable dangerous extensions.',
    action: 'Search marketplace for Sage extension. Apply agent safety rules.',
    status: 'caution',
  },
  {
    name: 'Warp',
    sage_supported: 'Not confirmed — use native controls',
    sage_installed: 'No',
    last_tested: 'Not yet',
    secret_risk: 'Medium',
    cmd_risk: 'High',
    url_risk: 'Low',
    pkg_risk: 'Medium',
    setup: 'Warp does not confirm native Sage support. Use Warp\'s own data controls, command review, GitHub branches, and Playwright test isolation. Use Sage with Cursor/Claude/OpenClaw where available.',
    action: 'Enable Warp data controls. Use Git branches. Never run destructive commands without approval.',
    status: 'caution',
  },
  {
    name: 'Replit',
    sage_supported: 'No',
    sage_installed: 'No',
    last_tested: 'Not yet',
    secret_risk: 'Critical — secrets in .replit env',
    cmd_risk: 'High',
    url_risk: 'Medium',
    pkg_risk: 'High',
    setup: 'Never store production secrets in Replit. Use read-only forks. Replit is for testing/sandboxing only — never production.',
    action: 'Audit Replit projects for secret leakage. Never use production Stripe/TikTok keys in Replit.',
    status: 'warning',
  },
  {
    name: 'Playwright',
    sage_supported: 'N/A',
    sage_installed: 'N/A',
    last_tested: '2026-05-27',
    secret_risk: 'Medium (session cookies)',
    cmd_risk: 'Low',
    url_risk: 'Low',
    pkg_risk: 'Low',
    setup: 'Session cookies must remain local only. Never commit ADMIN_SESSION_COOKIE to Git. Use .env.local for test secrets.',
    action: 'Ensure .env.local is in .gitignore. Rotate session if it appears in any log.',
    status: 'caution',
  },
  {
    name: 'Codex (OpenAI)',
    sage_supported: 'No',
    sage_installed: 'No',
    last_tested: 'Not yet',
    secret_risk: 'High',
    cmd_risk: 'Medium',
    url_risk: 'Low',
    pkg_risk: 'Medium',
    setup: 'Use Codex Task Pack from Developer Handoff. Never paste secrets into Codex prompts. Redact all secret values before sharing context.',
    action: 'Apply secret redaction checklist before every Codex session.',
    status: 'caution',
  },
  {
    name: 'ChatGPT',
    sage_supported: 'No',
    sage_installed: 'No',
    last_tested: 'Ongoing',
    secret_risk: 'Critical — any pasted secret is in chat log',
    cmd_risk: 'N/A',
    url_risk: 'Low',
    pkg_risk: 'Low',
    setup: 'NEVER paste secret values into ChatGPT chat. Only share variable names (e.g. STRIPE_SECRET_KEY), never values. Use temporary files to share code context.',
    action: 'Review chat history. If any secret value was pasted, rotate immediately.',
    status: 'warning',
  },
  {
    name: 'GitHub Actions',
    sage_supported: 'Partial (via actions/security)',
    sage_installed: 'No',
    last_tested: 'Not yet',
    secret_risk: 'Medium (with secrets: Low)',
    cmd_risk: 'Medium',
    url_risk: 'Low',
    pkg_risk: 'Medium',
    setup: 'Store all secrets in GitHub repository Secrets (never hardcode). Use branch protection rules. Enable secret scanning in repository settings.',
    action: 'Enable GitHub secret scanning. Add branch protection for main. Review workflow files.',
    status: 'caution',
  },
];

const SAFETY_RULES = [
  'Never print or log secret values.',
  'Never paste secrets into any AI chat (ChatGPT, Claude, Cursor, Codex).',
  'Never expose .env files — share only variable names.',
  'Never upload private files to external agents.',
  'Never run destructive commands (rm -rf, drop table, delete *) without Gannon approval.',
  'Never install unknown packages without package validation (run npm audit).',
  'Never fetch suspicious URLs or click redirected links from agent output.',
  'Never disable security tools (firewalls, antivirus, Sage).',
  'Never bypass approval gates — all agent proposals require Gannon sign-off.',
  'Never publish content externally without approval (social, email, press).',
  'Never process payments or place supplier orders without Gannon approval.',
  'Never make coaching public (COACHING_PUBLIC_LAUNCH_ENABLED = false).',
  'Never modify Stripe/TikTok/Metricool secrets except through the Guided Setup Concierge.',
  'Never commit secrets to GitHub — use GitHub Secrets for CI/CD.',
  'Never include session cookies in logs, reports, or screenshots.',
  'Always work on a git branch — never commit directly to main.',
  'Always read a file in full before editing it.',
  'Always use find_replace for edits — never rewrite full files unless creating new.',
];

const SECRET_REDACTION_CHECKLIST = `## Secret Redaction Checklist
## Run this BEFORE sharing any context with an external agent

Before sharing code, files, logs, or screenshots with Cursor / Claude / Codex / ChatGPT / Replit:

[ ] Remove or redact STRIPE_SECRET_KEY — never share sk_live_ or sk_test_ values
[ ] Remove or redact STRIPE_PUBLISHABLE_KEY — share only the key name
[ ] Remove or redact STRIPE_WEBHOOK_SECRET — share only the key name
[ ] Remove or redact TIKTOK_CLIENT_SECRET — MUST be rotated if already exposed
[ ] Remove or redact TIKTOK_CLIENT_KEY — share only the key name
[ ] Remove or redact METRICOOL_API_TOKEN — share only the key name
[ ] Remove or redact GOOGLE_SHEET_ID — share only the key name
[ ] Redact any session/auth cookies from browser DevTools screenshots
[ ] Redact any admin tokens from network request logs
[ ] Redact any Base44 service tokens from log output
[ ] Confirm .env file is NOT included in any shared ZIP or repository snapshot
[ ] Confirm ADMIN_SESSION_COOKIE is NOT in any log file before sharing
[ ] Confirm no secret values appear in screenshot filenames or image content

After sharing:
[ ] Review what was shared — if any secret value slipped through, rotate immediately
[ ] Rotate at: dashboard.stripe.com (Stripe), developers.tiktok.com (TikTok), Base44 dashboard (others)`;

const statusStyle = (s) => {
  if (s === 'safe') return 'bg-green-500/20 text-green-300 border-green-500/30';
  if (s === 'caution') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  if (s === 'action_required') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
  if (s === 'warning') return 'bg-red-500/20 text-red-300 border-red-500/30';
  return 'bg-secondary text-muted-foreground';
};

const riskStyle = (r) => {
  if (!r || r === 'N/A') return 'text-muted-foreground';
  if (r.toLowerCase().includes('critical')) return 'text-red-400 font-semibold';
  if (r.toLowerCase().includes('high')) return 'text-orange-400';
  if (r.toLowerCase().includes('medium')) return 'text-yellow-400';
  return 'text-green-400';
};

export default function AgentTrustHub() {
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState(TOOLS[0]);
  const [activeTab, setActiveTab] = useState('tools');

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); };
  const download = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded ${filename}` });
  };

  const tabs = [
    { id: 'tools', label: 'Tool Trust Matrix' },
    { id: 'sage', label: 'Sage Safety Layer' },
    { id: 'rules', label: 'Agent Safety Rules' },
    { id: 'redaction', label: 'Secret Redaction' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/security-centre"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Agent Trust Hub</h1>
            <p className="text-sm text-muted-foreground mt-1">External engineering agent safety — Sage security layer, trust matrix, secret redaction, safe rules.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/developer-handoff"><Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Dev Handoff</Button></Link>
          <Link to="/admin/security-centre"><Button variant="outline" size="sm"><Shield className="w-3 h-3 mr-1" />Security Centre</Button></Link>
        </div>
      </div>

      {/* Warning banner */}
      <Card className="border-orange-500/40 bg-orange-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold text-orange-300">Agent Safety Layer: NOT YET INSTALLED</p>
              <p className="text-muted-foreground">Sage by Gen Digital is recommended for Cursor, Claude Code, and OpenClaw environments. Install via OpenClaw: <code className="bg-secondary px-1 rounded text-xs">openclaw plugins install @gendigital/sage-openclaw</code></p>
              <p className="text-muted-foreground">Until installed: follow all manual safety rules below. Never paste secrets into any chat.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <Button key={t.id} variant={activeTab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>

      {/* TOOL TRUST MATRIX */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest px-1 font-semibold">Tools ({TOOLS.length})</p>
            {TOOLS.map(tool => (
              <Card
                key={tool.name}
                className={`cursor-pointer transition-colors hover:border-primary/40 ${selectedTool?.name === tool.name ? 'border-primary/60' : ''}`}
                onClick={() => setSelectedTool(tool)}
              >
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{tool.name}</span>
                  <Badge className={statusStyle(tool.status)} variant="outline">
                    {tool.status === 'safe' ? '✓ Safe' : tool.status === 'action_required' ? '⚠ Action' : tool.status === 'warning' ? '🔴 Risk' : '⚡ Caution'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTool && (
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base">{selectedTool.name}</CardTitle>
                  <Badge className={statusStyle(selectedTool.status)} variant="outline">
                    {selectedTool.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Sage Supported</p>
                    <p className="font-medium">{selectedTool.sage_supported}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Sage Installed</p>
                    <p className="font-medium">{selectedTool.sage_installed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Last Tested</p>
                    <p className="font-medium">{selectedTool.last_tested}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Secret Exposure Risk</p>
                    <p className={riskStyle(selectedTool.secret_risk)}>{selectedTool.secret_risk}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Command Execution Risk</p>
                    <p className={riskStyle(selectedTool.cmd_risk)}>{selectedTool.cmd_risk}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Package Install Risk</p>
                    <p className={riskStyle(selectedTool.pkg_risk)}>{selectedTool.pkg_risk}</p>
                  </div>
                </div>
                <div className="border-t border-border/40 pt-3 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Recommended Setup</p>
                  <p className="text-sm text-foreground">{selectedTool.setup}</p>
                </div>
                <div className="border-t border-border/40 pt-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Action Required</p>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-300">{selectedTool.action}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* SAGE SECTION */}
      {activeTab === 'sage' && (
        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> {SAGE_INFO.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{SAGE_INFO.purpose}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Risk Coverage</p>
                  {SAGE_INFO.coverage.map(c => (
                    <div key={c.risk} className="flex items-center gap-2 text-sm">
                      {c.covered ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                      <span className={c.covered ? 'text-foreground' : 'text-muted-foreground'}>{c.risk}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Installation</p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">OpenClaw (recommended for Claude Code):</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-secondary/50 px-3 py-2 rounded text-xs font-mono">{SAGE_INFO.openclaw_install}</code>
                      <Button variant="outline" size="sm" onClick={() => copy(SAGE_INFO.openclaw_install)}><Copy className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300 space-y-1">
                    <p className="font-semibold">⚠ Warp Note</p>
                    <p>Warp does not confirm native Sage support. Use Warp's own data controls, command review, GitHub branches, and Playwright test isolation. Use Sage with Cursor/Claude/OpenClaw where available.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                    <p className="font-semibold mb-1">Do not claim Sage is installed until:</p>
                    <p>1. OpenClaw install command runs successfully</p>
                    <p>2. Sage reports active in openclaw status</p>
                    <p>3. A test command is blocked and logged by Sage</p>
                  </div>
                  <a href={SAGE_INFO.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-3 h-3 mr-1" /> Gen Digital Website
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SAFETY RULES */}
      {activeTab === 'rules' && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Agent Safety Rules — All External Agents Must Follow</CardTitle>
              <Button variant="outline" size="sm" onClick={() => copy(SAFETY_RULES.join('\n'))}><Copy className="w-3 h-3 mr-1" />Copy All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {SAFETY_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg border border-border/40 hover:border-border/60 text-sm">
                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SECRET REDACTION */}
      {activeTab === 'redaction' && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-sm">Secret Redaction Checklist</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copy(SECRET_REDACTION_CHECKLIST)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                <Button variant="outline" size="sm" onClick={() => download('secret-redaction-checklist.md', SECRET_REDACTION_CHECKLIST)}><Download className="w-3 h-3 mr-1" />Download</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono max-h-[60vh] overflow-y-auto">
              {SECRET_REDACTION_CHECKLIST}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}