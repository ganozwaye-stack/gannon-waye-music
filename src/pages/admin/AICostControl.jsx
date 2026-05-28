import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  Brain, DollarSign, AlertTriangle, Shield, TrendingUp, Zap, Activity,
  CheckCircle2, Lock, XCircle, ArrowLeft
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TOOL_BUDGET = [
  { name: 'Base44', cost: 'Included in subscription', status: 'active', canPay: true, approved: true, note: 'Core platform — keep active' },
  { name: 'GitHub (private repo)', cost: 'Free', status: 'ready', canPay: true, approved: true, note: 'Create repo: gannonwaye-business-os (private). Warp + Cursor both connected to GitHub.' },
  { name: 'Playwright', cost: 'Free', status: 'ready', canPay: true, approved: true, note: 'INSTALLED locally. Firefox + WebKit confirmed. Download test pack from /admin/playwright-test-centre.' },
  { name: 'Warp Free', cost: 'Free tier', status: 'recommended', canPay: true, approved: true, note: 'INSTALLED + GitHub signed in. Primary local test runner. Use before any cloud agent.' },
  { name: 'Cursor (local)', cost: 'Free tier', status: 'recommended', canPay: true, approved: true, note: 'INSTALLED + GitHub connected. Use for manual repo editing after source export.' },
  { name: 'Cursor Cloud Agents API', cost: 'Usage-based (varies)', status: 'blocked', canPay: false, approved: false, note: 'BLOCKED UNTIL BUDGET APPROVED. API available. Must complete: repo + secrets excluded + Playwright pass + budget cap + Gannon approval. See /admin/cursor-cloud-agent-command.' },
  { name: 'Cursor Pro', cost: '~$20/month', status: 'hold', canPay: false, approved: false, note: 'Only after GitHub repo exists and source export confirmed. First paid external tool recommended.' },
  { name: 'Warp Build', cost: '~$19/month', status: 'hold', canPay: false, approved: false, note: 'Only after: repo exists + Playwright tests run + clear task list.' },
  { name: 'Replit Free', cost: 'Free tier', status: 'optional', canPay: false, approved: false, note: 'Only if cloud dev environment is needed. Not recommended yet.' },
  { name: 'Replit Pro', cost: '~$25/month', status: 'blocked', canPay: false, approved: false, note: 'Do NOT use yet. Wait until GitHub repo + cloud need confirmed.' },
  { name: 'GitLab', cost: 'Free tier', status: 'hold', canPay: false, approved: false, note: 'SECONDARY. Gannon joined GitLab but GitHub is primary. Do not split project unless clear technical reason.' },
  { name: 'Sage (OpenClaw plugin)', cost: 'Free (via OpenClaw)', status: 'pending_install', canPay: true, approved: true, note: 'Install via: openclaw plugins install @gendigital/sage-openclaw.' },
];

const BUDGET_RULES = [
  'Do not spend more than the minimum needed.',
  'Do not enable paid API usage without approval.',
  'Do not enable auto-reload credits without approval.',
  'Do not run open-ended AI loops.',
  'Use free/local/static tests first.',
  'Use Playwright before spending on more AI prompting.',
  'Use Cursor Free before upgrading to Cursor Pro.',
  'Use Warp Free before upgrading to Warp Build.',
  'Do not pay for Replit Pro until GitHub repo + cloud need is confirmed.',
];

const FREE_FIRST_CHECKLIST = [
  { item: 'Base44 GitHub Sync — check dashboard', done: false },
  { item: 'Download Playwright test pack', done: false },
  { item: 'Run npm install -D @playwright/test', done: false },
  { item: 'Run: npx playwright install chromium', done: false },
  { item: 'Set ADMIN_SESSION_COOKIE in .env.local', done: false },
  { item: 'Run: npx playwright test', done: false },
  { item: 'View report: npx playwright show-report', done: false },
  { item: 'Download Cursor handoff pack', done: false },
  { item: 'Start Warp on Free tier', done: false },
  { item: 'Only after all above: consider Cursor Pro', done: false },
];

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-500/20 text-green-300 border-green-500/30',
    recommended: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    ready: 'bg-green-500/20 text-green-300 border-green-500/30',
    not_started: 'bg-secondary text-muted-foreground border-border',
    hold: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    blocked: 'bg-red-500/20 text-red-300 border-red-500/30',
    optional: 'bg-secondary text-muted-foreground border-border',
    pending_install: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };
  const label = {
    active: 'Active', recommended: 'Recommended', ready: 'Ready',
    not_started: 'Not Started', hold: 'On Hold', blocked: '🔴 Blocked',
    optional: 'Optional', pending_install: 'Pending Install',
  };
  return <Badge className={`${map[status] || 'bg-secondary text-muted-foreground'} text-xs`} variant="outline">{label[status] || status}</Badge>;
}

export default function AICostControl() {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState(FREE_FIRST_CHECKLIST.map(i => ({ ...i })));
  const [activeTab, setActiveTab] = useState('budget');

  const { data: taskLogs = [] } = useQuery({
    queryKey: ['agent-task-logs'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 50),
  });

  const todayTasks = taskLogs.filter(t => new Date(t.created_date).toDateString() === new Date().toDateString());
  const approvedMonthly = TOOL_BUDGET.filter(t => t.approved && t.cost !== 'Included in subscription' && t.cost !== 'Free' && t.cost !== 'Free tier' && !t.cost.includes('Free')).reduce((s, t) => s, 0);
  const blockedMonthly = TOOL_BUDGET.filter(t => !t.approved && t.cost.includes('/month')).length;

  const toggleCheck = (i) => {
    const updated = [...checklist];
    updated[i].done = !updated[i].done;
    setChecklist(updated);
    const doneCount = updated.filter(c => c.done).length;
    if (doneCount === updated.length) toast({ title: 'Free setup complete! Now consider Cursor Pro if repo exists.' });
  };

  const tabs = [
    { id: 'budget', label: 'Tool Budget' },
    { id: 'rules', label: 'Budget Rules' },
    { id: 'checklist', label: 'Free Setup Checklist' },
    { id: 'activity', label: 'AI Activity' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/external-engineering-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">AI Tool Budget Control</h1>
            <p className="text-sm text-muted-foreground mt-1">Low-cost first. Free tools before paid. No auto-reload. No open-ended loops.</p>
          </div>
        </div>
        <Link to="/admin/external-engineering-command">
          <Button variant="outline" size="sm"><Zap className="w-3 h-3 mr-1" />Engineering Command</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-green-400" /></div>
            <div>
              <p className="text-2xl font-bold">$0</p>
              <p className="text-xs text-muted-foreground">External Tool Spend</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded-lg"><Lock className="w-5 h-5 text-amber-400" /></div>
            <div>
              <p className="text-2xl font-bold">{blockedMonthly}</p>
              <p className="text-xs text-muted-foreground">Paid Tools Blocked</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg"><CheckCircle2 className="w-5 h-5 text-blue-400" /></div>
            <div>
              <p className="text-2xl font-bold">{checklist.filter(c => c.done).length}/{checklist.length}</p>
              <p className="text-xs text-muted-foreground">Free Steps Done</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-purple-500/10 p-2 rounded-lg"><Activity className="w-5 h-5 text-purple-400" /></div>
            <div>
              <p className="text-2xl font-bold">{todayTasks.length}</p>
              <p className="text-xs text-muted-foreground">Agent Actions Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* First Recommended Paid Tool */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-semibold text-primary">RECOMMENDED FIRST PAID TOOL: Cursor Pro (~$20/month)</p>
          <p className="text-xs text-muted-foreground">Only pay when: GitHub repo or source export exists. Use Cursor to fix: store load, cart, promo codes, shipping, checkout freeze, unauthenticated functions, TikTok OAuth.</p>
          <p className="text-xs text-amber-300">DO NOT PAY YET until source export is confirmed. Complete the free checklist first.</p>
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

      {/* TAB: BUDGET */}
      {activeTab === 'budget' && (
        <div className="space-y-2">
          {TOOL_BUDGET.map(tool => (
            <div key={tool.name} className="border border-border/40 rounded-lg p-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{tool.name}</p>
                  <StatusBadge status={tool.status} />
                  <Badge variant="outline" className="text-xs">{tool.cost}</Badge>
                  {tool.approved ? (
                    <Badge className="bg-green-500/10 text-green-400 text-xs">Approved</Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-400 text-xs">Blocked</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{tool.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: RULES */}
      {activeTab === 'rules' && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Default Budget Rules</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {BUDGET_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 p-2 border border-border/40 rounded-lg">
                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">{rule}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB: FREE SETUP CHECKLIST */}
      {activeTab === 'checklist' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Free Setup Checklist — Complete Before Paying for Anything</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {checklist.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${item.done ? 'border-green-500/30 bg-green-500/5' : 'border-border/40 hover:border-border/60'}`}
                onClick={() => toggleCheck(i)}
              >
                {item.done ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" />}
                <p className={`text-sm ${item.done ? 'line-through text-muted-foreground' : ''}`}>{item.item}</p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">Click items to mark complete. Only consider Cursor Pro after all free steps are done.</p>
          </CardContent>
        </Card>
      )}

      {/* TAB: AI ACTIVITY */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Agent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {taskLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agent tasks recorded yet.</p>
            ) : (
              taskLogs.slice(0, 30).map(task => (
                <div key={task.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{task.task_title}</p>
                    <Badge variant="outline" className="text-xs">{new Date(task.created_date).toLocaleDateString('en-AU')}</Badge>
                  </div>
                  {task.agent_name && <p className="text-xs text-muted-foreground">Agent: {task.agent_name}</p>}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}