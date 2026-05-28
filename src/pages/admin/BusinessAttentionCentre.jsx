import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2, Circle, AlertTriangle, Terminal, GitBranch,
  Play, ExternalLink, Copy, Download, Zap, Shield, RefreshCw,
  Upload, Eye, ChevronRight
} from 'lucide-react';

// ─── ACTION TASKS (click-only, no chat) ──────────────────────────────────────
const ACTION_TASKS = [
  // ── STORE REPAIR ──
  {
    id: 'run-playwright-retest', group: 'Store Repair',
    label: 'Run Playwright retest — store + cart',
    detail: 'PRIMARY: Run this in Warp from your test folder. Paste results into Repair Loop.',
    priority: 'critical', cmd: 'npx playwright test tests/store-load.spec.js tests/cart.spec.js --headed',
    link: '/admin/autonomous-repair-loop', linkLabel: 'Repair Loop',
    actions: ['Run', 'Paste Results'],
  },
  {
    id: 'run-fast-verification', group: 'Store Repair',
    label: 'Run fast verification suite',
    detail: 'Verifies store load, shipping display, promo code validation.',
    priority: 'critical', cmd: 'npx playwright test tests/store-load.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed',
    actions: ['Run', 'Copy Command'],
  },
  {
    id: 'ingest-playwright-results', group: 'Store Repair',
    label: 'Paste Playwright results into Repair Loop',
    detail: 'After running tests → paste full output into Repair Loop → auto-creates fix tasks.',
    priority: 'critical',
    link: '/admin/autonomous-repair-loop', linkLabel: 'Open Repair Loop',
    actions: ['Open', 'Upload'],
  },
  {
    id: 'confirm-cart-spec', group: 'Store Repair',
    label: 'Download cart.spec.js from Repair Loop',
    detail: 'Cart spec is built. Download it, place in /tests folder, run it.',
    priority: 'critical',
    link: '/admin/autonomous-repair-loop', linkLabel: 'Repair Loop → cart.spec.js',
    actions: ['Download', 'Test'],
  },
  // ── GITHUB ACTIONS ──
  {
    id: 'create-github-repo', group: 'GitHub Actions',
    label: 'Create GitHub private repo',
    detail: 'github.com → New → Private → name: gannonwaye-business-os',
    priority: 'critical',
    link: 'https://github.com/new', linkLabel: 'Open GitHub', external: true,
    actions: ['Open'],
  },
  {
    id: 'download-gh-workflow', group: 'GitHub Actions',
    label: 'Download GitHub Actions workflow file',
    detail: 'Download playwright-store-tests.yml → place at .github/workflows/ in your repo.',
    priority: 'critical',
    link: '/admin/autonomous-repair-loop', linkLabel: 'Download Workflow',
    actions: ['Download', 'Open'],
  },
  {
    id: 'commit-workflow', group: 'GitHub Actions',
    label: 'Commit workflow to GitHub + run manually',
    detail: 'git add .github/workflows/playwright-store-tests.yml → commit → push → Actions tab → Run workflow.',
    priority: 'critical', cmd: 'git add .github/workflows/playwright-store-tests.yml && git commit -m "ci: add playwright store qa workflow" && git push',
    actions: ['Run', 'Copy Command'],
  },
  {
    id: 'ingest-gh-result', group: 'GitHub Actions',
    label: 'Ingest GitHub Actions result',
    detail: 'After Actions run → paste URL, status, counts into Repair Loop → auto-creates fix tasks.',
    priority: 'high',
    link: '/admin/autonomous-repair-loop', linkLabel: 'GitHub Actions Results Tab',
    actions: ['Open', 'Upload'],
  },
  // ── STRIPE / CHECKOUT ──
  {
    id: 'set-stripe-mode', group: 'Checkout / Stripe',
    label: 'Set STRIPE_MODE=test in .env.local',
    detail: 'Confirm sk_test_ and pk_test_ keys are active → add STRIPE_MODE=test to .env.local → unskips checkout tests.',
    priority: 'critical', cmd: 'echo "STRIPE_MODE=test" >> .env.local',
    actions: ['Run', 'Skip for now'],
  },
  {
    id: 'run-checkout-tests', group: 'Checkout / Stripe',
    label: 'Run checkout tests (after STRIPE_MODE set)',
    detail: 'Only run after confirming test keys. BLOCKED until STRIPE_MODE=test is set.',
    priority: 'high', cmd: 'STRIPE_MODE=test npx playwright test tests/checkout.spec.js --headed',
    actions: ['Run', 'Skip for now'],
  },
  {
    id: 'run-stripe-test-order', group: 'Checkout / Stripe',
    label: 'Run controlled Stripe test order',
    detail: 'Use test card 4242 4242 4242 4242 → verify MerchOrder created, webhook fires, inventory decremented.',
    priority: 'high',
    link: 'https://gannonwaye.com/store', linkLabel: 'Open Store', external: true,
    actions: ['Test', 'Approve', 'Skip for now'],
  },
  // ── METRICOOL ──
  {
    id: 'connect-metricool-profile', group: 'Metricool',
    label: 'Connect Metricool profile/account ID',
    detail: 'METRICOOL_API_TOKEN is set. Missing: profile/account ID. Run diagnostics → connect profile.',
    priority: 'high',
    link: '/admin/metricool-diagnostics', linkLabel: 'Metricool Diagnostics',
    actions: ['Open', 'Test'],
  },
  {
    id: 'test-metricool', group: 'Metricool',
    label: 'Test Metricool connection end-to-end',
    detail: 'Token test → profile list → queue draft → error reporting. Must pass before scheduling.',
    priority: 'high',
    link: '/admin/metricool-command', linkLabel: 'Metricool Command',
    actions: ['Test', 'Open'],
  },
  // ── CONTENT ──
  {
    id: 'approve-content-posts', group: 'Content',
    label: 'Approve first content posts',
    detail: '2 posts are awaiting approval (Instagram + TikTok Thank You campaign). Review and approve or reject.',
    priority: 'high',
    link: '/admin/content-command', linkLabel: 'Content Command',
    actions: ['Approve', 'Reject', 'Revise'],
  },
  {
    id: 'test-founding-supporter', group: 'Content',
    label: 'Test Founding Supporter public signup',
    detail: 'Visit /founding-supporter → submit test form → verify record created → verify no duplicates possible.',
    priority: 'high',
    link: '/founding-supporter', linkLabel: 'Open Signup Page', external: true,
    actions: ['Test', 'Open'],
  },
  // ── CURSOR CLOUD AGENT ──
  {
    id: 'export-source', group: 'Cursor Cloud Agent',
    label: 'Export source code to GitHub',
    detail: 'Required before Cursor Cloud Agent can run. Export Base44 source → push to GitHub repo.',
    priority: 'high',
    link: '/admin/external-engineering-command', linkLabel: 'External Engineering',
    actions: ['Open', 'Skip for now'],
  },
  {
    id: 'approve-cursor-agent', group: 'Cursor Cloud Agent',
    label: 'Approve Cursor Cloud Agent run',
    detail: 'AWAITING APPROVAL. Do not run without explicit budget confirmation. Uses CURSOR_API_KEY credits.',
    priority: 'high',
    link: '/admin/cursor-cloud-agent-command', linkLabel: 'Cursor Command',
    actions: ['Approve', 'Reject', 'Skip for now'],
  },
  // ── SECURITY ──
  {
    id: 'rotate-stripe-secret', group: 'Security',
    label: 'Rotate STRIPE_WEBHOOK_SECRET if needed',
    detail: 'Stripe → Developers → Webhooks → check if secret may have been exposed. Rotate if unsure.',
    priority: 'high',
    link: 'https://dashboard.stripe.com/webhooks', linkLabel: 'Stripe Dashboard', external: true,
    actions: ['Open', 'Skip for now'],
  },
];

const GROUP_ORDER = ['Store Repair', 'GitHub Actions', 'Checkout / Stripe', 'Metricool', 'Content', 'Cursor Cloud Agent', 'Security'];

const PRIORITY_COLOR = {
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  medium: 'bg-secondary text-muted-foreground border-border',
};

export default function BusinessAttentionCentre() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bac_completed_v2') || '{}'); } catch { return {}; }
  });
  const [activeTab, setActiveTab] = useState('tasks');
  const [activeGroup, setActiveGroup] = useState('All');

  const { data: notifications = [] } = useQuery({
    queryKey: ['bac-notifications'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20),
    refetchInterval: 30000,
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['bac-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 10),
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: id => base44.entities.AdminNotification.update(id, { is_read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bac-notifications'] }),
  });

  const approvalMutation = useMutation({
    mutationFn: ({ id, status, note }) => base44.entities.ApprovalQueue.update(id, {
      status, decision_note: note, decided_at: new Date().toISOString(),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bac-approvals'] }); toast({ title: 'Decision saved' }); },
  });

  const copy = text => { navigator.clipboard.writeText(text); toast({ title: 'Copied!' }); };

  const toggleComplete = id => {
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    localStorage.setItem('bac_completed_v2', JSON.stringify(updated));
  };

  const groups = ['All', ...GROUP_ORDER];
  const filteredTasks = activeGroup === 'All' ? ACTION_TASKS : ACTION_TASKS.filter(t => t.group === activeGroup);
  const doneCount = ACTION_TASKS.filter(a => completed[a.id]).length;
  const criticalRemaining = ACTION_TASKS.filter(a => a.priority === 'critical' && !completed[a.id]).length;

  const tabs = [
    { id: 'tasks', label: `Action Tasks (${doneCount}/${ACTION_TASKS.length})` },
    { id: 'notifications', label: `Notifications (${notifications.length})` },
    { id: 'approvals', label: `Approvals (${approvals.length})` },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Business Attention Centre</h1>
          <p className="text-sm text-muted-foreground mt-1">Click-only. No chat. Each task has direct action buttons.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/autonomous-repair-loop"><Button variant="outline" size="sm"><RefreshCw className="w-3 h-3 mr-1" />Repair Loop</Button></Link>
          <Link to="/admin/playwright-test-centre"><Button variant="outline" size="sm"><Play className="w-3 h-3 mr-1" />Playwright</Button></Link>
        </div>
      </div>

      {/* Progress + critical alert */}
      <div className="grid md:grid-cols-2 gap-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-primary">{doneCount} / {ACTION_TASKS.length} tasks done</p>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(doneCount / ACTION_TASKS.length) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card className={criticalRemaining > 0 ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5'}>
          <CardContent className="p-4 flex items-center gap-3">
            {criticalRemaining > 0
              ? <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              : <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
            <div>
              <p className={`text-sm font-semibold ${criticalRemaining > 0 ? 'text-red-300' : 'text-green-300'}`}>
                {criticalRemaining > 0 ? `${criticalRemaining} CRITICAL tasks remaining` : 'All critical tasks done'}
              </p>
              <p className="text-xs text-muted-foreground">Store repair first priority</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <Button key={t.id} variant={activeTab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>

      {/* ── ACTION TASKS ── */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Group filter */}
          <div className="flex flex-wrap gap-2">
            {groups.map(g => (
              <Button key={g} variant={activeGroup === g ? 'default' : 'outline'} size="sm" onClick={() => setActiveGroup(g)}>{g}</Button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredTasks.map((action, i) => {
              const isDone = completed[action.id];
              return (
                <div key={action.id}
                  className={`border rounded-lg p-4 transition-colors ${isDone ? 'border-green-500/30 bg-green-500/5 opacity-70' : 'border-border/40 hover:border-border/60'}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleComplete(action.id)} className="shrink-0 mt-0.5">
                      {isDone
                        ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                        : <Circle className="w-5 h-5 text-muted-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-secondary text-muted-foreground text-xs" variant="outline">{action.group}</Badge>
                        <p className={`text-sm font-semibold ${isDone ? 'line-through text-muted-foreground' : ''}`}>{action.label}</p>
                        <Badge className={`${PRIORITY_COLOR[action.priority]} text-xs`} variant="outline">{action.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{action.detail}</p>
                      {action.cmd && (
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs bg-secondary/80 px-2 py-1 rounded font-mono text-green-300 flex-1 break-all">{action.cmd}</code>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copy(action.cmd)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      {/* Action buttons */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {action.link && (
                          action.external ? (
                            <a href={action.link} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                <ExternalLink className="w-3 h-3 mr-1" />{action.linkLabel}
                              </Button>
                            </a>
                          ) : (
                            <Link to={action.link}>
                              <Button variant="outline" size="sm" className="h-7 text-xs">{action.linkLabel}</Button>
                            </Link>
                          )
                        )}
                        {(action.actions || []).map(act => {
                          if (act === 'Copy Command' && action.cmd) {
                            return <Button key={act} variant="ghost" size="sm" className="h-7 text-xs" onClick={() => copy(action.cmd)}><Copy className="w-3 h-3 mr-1" />Copy</Button>;
                          }
                          if (act === 'Run' || act === 'Test' || act === 'Upload') {
                            return <Button key={act} size="sm" className="h-7 text-xs" onClick={() => toggleComplete(action.id)}><Play className="w-3 h-3 mr-1" />{act}</Button>;
                          }
                          if (act === 'Approve') {
                            return <Button key={act} size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => toggleComplete(action.id)}><CheckCircle2 className="w-3 h-3 mr-1" />Approve</Button>;
                          }
                          if (act === 'Reject') {
                            return <Button key={act} variant="destructive" size="sm" className="h-7 text-xs" onClick={() => toggleComplete(action.id)}>Reject</Button>;
                          }
                          if (act === 'Skip for now') {
                            return <Button key={act} variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => toggleComplete(action.id)}>Skip for now</Button>;
                          }
                          if (act === 'Download') {
                            return (
                              <Link key={act} to={action.link || '/admin/autonomous-repair-loop'}>
                                <Button variant="outline" size="sm" className="h-7 text-xs"><Download className="w-3 h-3 mr-1" />Download</Button>
                              </Link>
                            );
                          }
                          return <Button key={act} variant="outline" size="sm" className="h-7 text-xs" onClick={() => toggleComplete(action.id)}>{act}</Button>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === 'notifications' && (
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No unread notifications</CardContent></Card>
          ) : (
            notifications.map(n => (
              <Card key={n.id} className={
                n.severity === 'critical' ? 'border-red-500/30' :
                n.severity === 'high' ? 'border-amber-500/30' : 'border-border/40'
              }>
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                      n.severity === 'critical' ? 'text-red-400' :
                      n.severity === 'high' ? 'text-amber-400' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{n.title}</p>
                      {n.summary && <p className="text-xs text-muted-foreground mt-1">{n.summary.substring(0, 200)}</p>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{n.notification_type}</Badge>
                        {n.linked_route && (
                          <Link to={n.linked_route}><Button variant="ghost" size="sm" className="h-6 text-xs">View →</Button></Link>
                        )}
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={() => markReadMutation.mutate(n.id)}>
                          Mark Read
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ── APPROVALS ── */}
      {activeTab === 'approvals' && (
        <div className="space-y-2">
          {approvals.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No pending approvals</CardContent></Card>
          ) : (
            approvals.map(a => (
              <Card key={a.id} className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 justify-between flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{a.action_title}</p>
                      {a.action_description && <p className="text-xs text-muted-foreground mt-1">{a.action_description.substring(0, 200)}</p>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge className="bg-amber-500/20 text-amber-300 text-xs">{a.risk_level}</Badge>
                        <Badge variant="outline" className="text-xs">{a.agent_name}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700"
                      onClick={() => approvalMutation.mutate({ id: a.id, status: 'approved', note: 'Approved via Business Attention Centre' })}>
                      <CheckCircle2 className="w-3 h-3 mr-1" />Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="h-7 text-xs"
                      onClick={() => approvalMutation.mutate({ id: a.id, status: 'rejected', note: 'Rejected via Business Attention Centre' })}>
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs"
                      onClick={() => approvalMutation.mutate({ id: a.id, status: 'in_review', note: 'Under review' })}>
                      Revise
                    </Button>
                    <Link to="/admin/approval-queue">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Full Review →</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}