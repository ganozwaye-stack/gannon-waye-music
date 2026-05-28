import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2, Circle, AlertTriangle, Terminal, GitBranch,
  Play, ExternalLink, Copy, Download, Zap, Shield
} from 'lucide-react';

// ─── ACTION TASKS ─────────────────────────────────────────────────────────────
const ENGINEERING_ACTIONS = [
  {
    id: 'github-repo',
    label: 'Create GitHub Private Repo',
    detail: 'github.com → New → Private → name: gannonwaye-business-os',
    link: 'https://github.com/new',
    linkLabel: 'Open GitHub',
    priority: 'critical',
    external: true,
  },
  {
    id: 'download-tests',
    label: 'Download Playwright Test Pack',
    detail: 'Download all test files from Playwright Test Centre → put in repo /tests folder',
    link: '/admin/playwright-test-centre',
    linkLabel: 'Open Test Centre',
    priority: 'critical',
    external: false,
  },
  {
    id: 'env-local',
    label: 'Create .env.local with Admin Cookie',
    detail: 'Copy .env.example → .env.local → add ADMIN_SESSION_COOKIE (from browser DevTools → Application → Cookies)',
    priority: 'critical',
    cmd: 'cp .env.example .env.local',
  },
  {
    id: 'run-store-tests',
    label: 'Run Store Tests in Warp',
    detail: 'In Warp terminal, navigate to test folder and run the focused store test command',
    priority: 'critical',
    cmd: 'npx playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed',
  },
  {
    id: 'run-all-tests',
    label: 'Run All Playwright Tests',
    detail: 'Run full test suite and view HTML report',
    priority: 'high',
    cmd: 'npx playwright test && npx playwright show-report',
  },
  {
    id: 'open-cursor',
    label: 'Open Repo in Cursor',
    detail: 'cursor <repo-folder> → paste Cursor task pack from External Engineering Command',
    link: '/admin/external-engineering-command',
    linkLabel: 'Get Cursor Pack',
    priority: 'high',
    external: false,
    cmd: 'cursor .',
  },
  {
    id: 'fix-failures',
    label: 'Fix Failed Tests',
    detail: 'Use Cursor to fix issues identified in Playwright report. Focus on store, cart, checkout, promo codes first.',
    link: '/admin/external-engineering-command',
    linkLabel: 'Cursor Handoff',
    priority: 'high',
    external: false,
  },
  {
    id: 'push-github',
    label: 'Push Fixes to GitHub',
    detail: 'After fixing in Cursor: git add . → git commit -m "fix: store/cart/checkout" → git push',
    priority: 'medium',
    cmd: 'git add . && git commit -m "fix: store cart checkout promo" && git push',
  },
  {
    id: 'approve-deployment',
    label: 'Approve Base44 Deployment',
    detail: 'Review changes in Base44 preview → confirm no regressions → approve live deployment',
    link: '/admin',
    linkLabel: 'Admin Dashboard',
    priority: 'medium',
    external: false,
  },
  {
    id: 'rotate-secrets',
    label: 'Rotate STRIPE_WEBHOOK_SECRET',
    detail: 'dashboard.stripe.com → Developers → Webhooks → rotate signing secret. May have been exposed in prior session.',
    link: 'https://dashboard.stripe.com/webhooks',
    linkLabel: 'Stripe Dashboard',
    priority: 'critical',
    external: true,
  },
];

const PRIORITY_COLOR = {
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  medium: 'bg-secondary text-muted-foreground border-border',
};

export default function BusinessAttentionCentre() {
  const { toast } = useToast();
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('action_completed') || '{}'); } catch { return {}; }
  });
  const [activeTab, setActiveTab] = useState('engineering');

  const { data: notifications = [] } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20),
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['approval-queue'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 10),
  });

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied!' }); };

  const toggleComplete = (id) => {
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    localStorage.setItem('action_completed', JSON.stringify(updated));
  };

  const doneCount = ENGINEERING_ACTIONS.filter(a => completed[a.id]).length;

  const tabs = [
    { id: 'engineering', label: `Engineering Tasks (${doneCount}/${ENGINEERING_ACTIONS.length})` },
    { id: 'notifications', label: `Notifications (${notifications.length})` },
    { id: 'approvals', label: `Approvals (${approvals.length})` },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Business Attention Centre</h1>
          <p className="text-sm text-muted-foreground mt-1">Click-only action tasks. No chat. Engineering pipeline + pending approvals + notifications.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/playwright-test-centre"><Button variant="outline" size="sm"><Play className="w-3 h-3 mr-1" />Playwright</Button></Link>
          <Link to="/admin/external-engineering-command"><Button variant="outline" size="sm"><Terminal className="w-3 h-3 mr-1" />Engineering</Button></Link>
        </div>
      </div>

      {/* Progress */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">{doneCount} / {ENGINEERING_ACTIONS.length} engineering tasks complete</p>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(doneCount / ENGINEERING_ACTIONS.length) * 100}%` }}
              />
            </div>
          </div>
          <Badge className={doneCount === ENGINEERING_ACTIONS.length ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}>
            {doneCount === ENGINEERING_ACTIONS.length ? 'Complete' : 'In Progress'}
          </Badge>
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

      {/* TAB: ENGINEERING TASKS */}
      {activeTab === 'engineering' && (
        <div className="space-y-2">
          {ENGINEERING_ACTIONS.map((action, i) => (
            <div
              key={action.id}
              className={`border rounded-lg p-4 transition-colors ${completed[action.id] ? 'border-green-500/30 bg-green-500/5 opacity-70' : 'border-border/40 hover:border-border/60'}`}
            >
              <div className="flex items-start gap-3">
                <button onClick={() => toggleComplete(action.id)} className="shrink-0 mt-0.5">
                  {completed[action.id]
                    ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                    : <Circle className="w-5 h-5 text-muted-foreground" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${completed[action.id] ? 'line-through text-muted-foreground' : ''}`}>
                      {i + 1}. {action.label}
                    </p>
                    <Badge className={`${PRIORITY_COLOR[action.priority]} text-xs`} variant="outline">
                      {action.priority}
                    </Badge>
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
                </div>
                {action.link && (
                  action.external ? (
                    <a href={action.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="shrink-0">
                        <ExternalLink className="w-3 h-3 mr-1" />{action.linkLabel}
                      </Button>
                    </a>
                  ) : (
                    <Link to={action.link}>
                      <Button variant="outline" size="sm" className="shrink-0">
                        {action.linkLabel}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No unread notifications</CardContent></Card>
          ) : (
            notifications.map(n => (
              <Card key={n.id} className={n.severity === 'critical' ? 'border-red-500/30' : n.severity === 'high' ? 'border-amber-500/30' : 'border-border/40'}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${n.severity === 'critical' ? 'text-red-400' : n.severity === 'high' ? 'text-amber-400' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{n.title}</p>
                      {n.summary && <p className="text-xs text-muted-foreground mt-1">{n.summary}</p>}
                    </div>
                    <Badge variant="outline" className="text-xs">{n.notification_type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB: APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-2">
          {approvals.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No pending approvals</CardContent></Card>
          ) : (
            approvals.map(a => (
              <Card key={a.id} className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3 justify-between">
                    <div>
                      <p className="text-sm font-semibold">{a.action_title}</p>
                      {a.action_description && <p className="text-xs text-muted-foreground mt-1">{a.action_description.substring(0, 150)}</p>}
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-amber-500/20 text-amber-300 text-xs">{a.risk_level}</Badge>
                        <Badge variant="outline" className="text-xs">{a.agent_name}</Badge>
                      </div>
                    </div>
                    <Link to="/admin/approval-queue">
                      <Button variant="outline" size="sm">Review</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {approvals.length > 0 && (
            <Link to="/admin/approval-queue">
              <Button className="w-full" variant="outline">View All in Approval Queue</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}