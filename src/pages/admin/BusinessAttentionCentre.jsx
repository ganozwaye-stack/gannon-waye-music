import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle2, XCircle, Clock, ExternalLink,
  ChevronRight, Shield, Zap, RefreshCw, Lock, Eye, SkipForward
} from 'lucide-react';
import { toast } from 'sonner';

// All items that need Gannon's decision, action, or awareness
const DECISIONS = [
  {
    id: 'stripe_webhook',
    category: 'Payments',
    task: 'Rotate Stripe Webhook Signing Secret',
    risk: 'critical',
    why: 'The current STRIPE_WEBHOOK_SECRET may be stale or exposed. Without rotation, Stripe webhooks cannot be trusted — orders may not be created, receipts may not send.',
    recommended: 'Rotate NOW',
    type: 'needs_secret',
    blocked_by: 'Stripe Dashboard login',
    external_url: 'https://dashboard.stripe.com/webhooks',
    external_label: 'Open Stripe Webhooks',
    setup_path: '/admin/guided-setup-concierge',
    setup_label: 'Setup Guide → Stripe',
    status: 'needs_action',
  },
  {
    id: 'tiktok_client_key',
    category: 'Social',
    task: 'Re-enter TIKTOK_CLIENT_KEY (no spaces)',
    risk: 'high',
    why: 'A leading/trailing space in the stored TIKTOK_CLIENT_KEY causes OAuth failures with "client_key invalid" error. The key must be re-entered trimmed.',
    recommended: 'Re-enter in Base44 Secrets (Settings → Environment Variables)',
    type: 'needs_secret',
    blocked_by: 'Base44 Secrets entry',
    external_url: 'https://developers.tiktok.com',
    external_label: 'TikTok Dev Portal (copy key)',
    setup_path: '/admin/guided-setup-concierge',
    setup_label: 'Setup Guide → TikTok',
    status: 'needs_action',
  },
  {
    id: 'tiktok_client_secret',
    category: 'Social',
    task: 'Rotate TIKTOK_CLIENT_SECRET',
    risk: 'high',
    why: 'The client secret should be rotated before any live OAuth testing. Re-generate in TikTok Developer Portal then save to Base44 Secrets.',
    recommended: 'Rotate + re-enter',
    type: 'needs_secret',
    blocked_by: 'TikTok Developer Portal login',
    external_url: 'https://developers.tiktok.com/apps',
    external_label: 'TikTok Apps Portal',
    setup_path: '/admin/guided-setup-concierge',
    setup_label: 'Setup Guide → TikTok',
    status: 'needs_action',
  },
  {
    id: 'tiktok_oauth_live',
    category: 'Social',
    task: 'Live-test TikTok OAuth flow',
    risk: 'high',
    why: 'Once keys are updated, the full OAuth loop must be proven: consent page opens → login → redirect → token stored → creator profile visible.',
    recommended: 'Do after key rotation',
    type: 'needs_login',
    blocked_by: 'TikTok OAuth login',
    external_url: null,
    setup_path: '/admin/tiktok-platform-review',
    setup_label: 'TikTok Platform Review',
    status: 'blocked',
  },
  {
    id: 'checkout_test',
    category: 'Payments',
    task: 'Live checkout test (real card)',
    risk: 'high',
    why: 'Full end-to-end checkout must be tested: modal opens → payment succeeds → webhook fires → order created → receipt sent. Cannot be confirmed without a real test purchase.',
    recommended: 'Do AFTER Stripe webhook rotation',
    type: 'needs_approval',
    blocked_by: 'Stripe webhook rotation must be done first',
    external_url: null,
    setup_path: '/admin/guided-setup-concierge',
    setup_label: 'Setup Guide → Checkout Test',
    status: 'blocked',
  },
  {
    id: 'approval_proof',
    category: 'Approvals',
    task: 'Approve a live proposal to prove full publish chain',
    risk: 'medium',
    why: 'The auto-publish chain (ApprovalQueue → publishApprovedProposal → BundleOffer → store) must be tested end-to-end with a real approval.',
    recommended: 'Approve a pending proposal in Approval Queue',
    type: 'needs_approval',
    blocked_by: 'Requires a pending proposal to exist',
    external_url: null,
    setup_path: '/admin/approval-queue',
    setup_label: 'Approval Queue',
    status: 'ready',
  },
  {
    id: 'playwright_qa',
    category: 'QA',
    task: 'Run Playwright browser test suite',
    risk: 'medium',
    why: 'No automated browser tests have been run. Broken buttons, 404s, mobile layout issues, and form bugs cannot be confirmed from code alone.',
    recommended: 'Download test pack + run against gannonwaye.com',
    type: 'needs_external',
    blocked_by: 'Requires external terminal / browser environment',
    external_url: null,
    setup_path: '/admin/playwright-test-centre',
    setup_label: 'Playwright Test Centre',
    status: 'blocked',
  },
  {
    id: 'coaching_private',
    category: 'Coaching',
    task: 'Coaching portal — confirm stays private',
    risk: 'low',
    why: 'Coaching pages exist at /admin/coaching-command but are admin-only. Confirm this stays private and hidden from public navigation.',
    recommended: 'No action needed — confirm as known',
    type: 'info',
    blocked_by: null,
    external_url: null,
    setup_path: '/admin/coaching-command',
    setup_label: 'Coaching Command',
    status: 'info',
  },
  {
    id: 'social_drafts_approve',
    category: 'Social',
    task: 'Review + approve daily social drafts in queue',
    risk: 'low',
    why: 'generateDailyDrafts is creating 3 posts/day. They are stuck in Approval Queue — nothing posts until you approve.',
    recommended: 'Review and approve posts you want scheduled',
    type: 'needs_approval',
    blocked_by: null,
    external_url: null,
    setup_path: '/admin/approval-queue',
    setup_label: 'Approval Queue',
    status: 'ready',
  },
];

const RISK_CONFIG = {
  critical: { color: 'bg-red-500/20 text-red-300 border-red-500/30', dot: 'bg-red-500' },
  high: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', dot: 'bg-orange-500' },
  medium: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', dot: 'bg-amber-500' },
  low: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
  info: { color: 'bg-secondary text-muted-foreground border-border', dot: 'bg-secondary' },
};

const TYPE_ICONS = {
  needs_secret: '🔑',
  needs_login: '🔐',
  needs_approval: '✅',
  needs_external: '💻',
  info: 'ℹ️',
};

export default function BusinessAttentionCentre() {
  const queryClient = useQueryClient();
  const [decisionState, setDecisionState] = useState({});
  const [runningHealthCheck, setRunningHealthCheck] = useState(false);
  const [healthResult, setHealthResult] = useState(null);
  const [runningProofChain, setRunningProofChain] = useState(false);
  const [proofResult, setProofResult] = useState(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ['bac-notifications'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 10),
  });
  const { data: pendingApprovals = [] } = useQuery({
    queryKey: ['bac-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 10),
  });
  const { data: healthIssues = [] } = useQuery({
    queryKey: ['bac-health'],
    queryFn: () => base44.entities.SystemHealthIssue.filter({ status: 'open' }, '-created_date', 10),
  });

  const decide = (id, action) => {
    setDecisionState(s => ({ ...s, [id]: action }));
    toast.success(`${id}: marked as ${action}`);
  };

  const runHealthCheck = async () => {
    setRunningHealthCheck(true);
    try {
      const res = await base44.functions.invoke('integrationHealthCheck', {});
      setHealthResult(res.data);
      toast.success('Health check complete');
    } catch (e) {
      toast.error(e.message);
    }
    setRunningHealthCheck(false);
  };

  const runProofChain = async () => {
    setRunningProofChain(true);
    try {
      const res = await base44.functions.invoke('proofApprovalChain', {});
      setProofResult(res.data);
      toast.success('Proof chain run complete');
    } catch (e) {
      toast.error(e.message);
    }
    setRunningProofChain(false);
  };

  const criticalItems = DECISIONS.filter(d => d.risk === 'critical' && decisionState[d.id] !== 'skip');
  const highItems = DECISIONS.filter(d => d.risk === 'high' && decisionState[d.id] !== 'skip');
  const allUnresolved = DECISIONS.filter(d => !decisionState[d.id] || decisionState[d.id] === 'skip');

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">System Control</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Business Attention Centre</h1>
        <p className="text-muted-foreground text-sm mt-1">All decisions, blockers, and approvals in one place — no chat needed</p>
      </div>

      {/* Master action bar */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-widest">Batch Actions</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700"
              onClick={() => DECISIONS.filter(d => d.risk === 'low' || d.type === 'info').forEach(d => decide(d.id, 'acknowledge'))}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge All Low-Risk
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 border-amber-500/40 text-amber-400"
              onClick={() => DECISIONS.filter(d => d.type === 'needs_approval' && d.status === 'ready').forEach(d => decide(d.id, 'open'))}>
              <Eye className="w-3.5 h-3.5" /> Mark All Approvals as Opened
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5"
              onClick={() => DECISIONS.filter(d => d.status === 'blocked').forEach(d => decide(d.id, 'skip'))}>
              <SkipForward className="w-3.5 h-3.5" /> Skip All Blocked Items
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={runHealthCheck} disabled={runningHealthCheck}>
              {runningHealthCheck ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              Run Integration Health Check
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={runProofChain} disabled={runningProofChain}>
              {runningProofChain ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
              Run Approval Chain Proof
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health check result */}
      {healthResult && (
        <Card className="border-border/40">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Integration Health Result</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(healthResult?.integrations || {}).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between bg-secondary/50 rounded-lg p-2">
                  <span className="text-xs text-muted-foreground capitalize">{key}</span>
                  <Badge className={`text-[10px] border ${val === 'ok' || val === 'present' || val === 'live' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>{val}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proof chain result */}
      {proofResult && (
        <Card className="border-border/40">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Approval Chain Proof</p>
            <div className="space-y-1">
              {(proofResult.steps || []).map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {step.passed ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                  <span className={step.passed ? 'text-green-300' : 'text-red-300'}>{step.label}</span>
                </div>
              ))}
              {proofResult.summary && <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">{proofResult.summary}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{criticalItems.length}</p>
          <p className="text-xs text-muted-foreground">Critical</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{highItems.length}</p>
          <p className="text-xs text-muted-foreground">High Priority</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{pendingApprovals.length}</p>
          <p className="text-xs text-muted-foreground">Pending Approvals</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{notifications.length}</p>
          <p className="text-xs text-muted-foreground">Unread Alerts</p>
        </CardContent></Card>
      </div>

      {/* Open system health issues */}
      {healthIssues.length > 0 && (
        <Card className="border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Open System Health Issues ({healthIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {healthIssues.slice(0, 5).map(issue => (
              <div key={issue.id} className="flex items-start justify-between gap-3 p-2 rounded-lg bg-secondary/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{issue.issue_title}</p>
                  <p className="text-xs text-muted-foreground">{issue.recommended_fix?.slice(0, 120)}</p>
                </div>
                <Badge className={`text-[10px] border shrink-0 ${RISK_CONFIG[issue.severity]?.color || ''}`}>{issue.severity}</Badge>
              </div>
            ))}
            <Link to="/admin/site-health">
              <Button size="sm" variant="outline" className="w-full gap-1 mt-1">View All in Site Health <ChevronRight className="w-3 h-3" /></Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Decision rows */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">All Required Actions</p>
        <div className="space-y-3">
          {DECISIONS.map(item => {
            const decision = decisionState[item.id];
            const riskCfg = RISK_CONFIG[item.risk] || RISK_CONFIG.info;
            const isDone = decision && decision !== 'skip';

            return (
              <Card key={item.id} className={`transition-all ${isDone ? 'opacity-60' : 'hover:border-primary/30'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${riskCfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm">{TYPE_ICONS[item.type]}</span>
                            <p className="text-sm font-semibold">{item.task}</p>
                            <Badge className={`text-[10px] border ${riskCfg.color}`}>{item.risk}</Badge>
                            <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                            {decision && (
                              <Badge className="text-[10px] bg-green-500/20 text-green-300 border-green-500/30">{decision}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.why}</p>
                          {item.blocked_by && (
                            <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Blocked by: {item.blocked_by}
                            </p>
                          )}
                          {item.recommended && (
                            <p className="text-xs text-primary mt-1">→ {item.recommended}</p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.setup_path && (
                          <Link to={item.setup_path}>
                            <Button size="sm" className="gap-1 text-xs">
                              <ChevronRight className="w-3 h-3" /> {item.setup_label}
                            </Button>
                          </Link>
                        )}
                        {item.external_url && (
                          <a href={item.external_url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-1 text-xs">
                              <ExternalLink className="w-3 h-3" /> {item.external_label}
                            </Button>
                          </a>
                        )}
                        <Button size="sm" variant="outline" className="gap-1 text-xs border-green-500/30 text-green-400"
                          onClick={() => decide(item.id, 'acknowledged')}>
                          <CheckCircle2 className="w-3 h-3" /> Acknowledge
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-1 text-xs text-muted-foreground"
                          onClick={() => decide(item.id, 'skip')}>
                          <SkipForward className="w-3 h-3" /> Skip for now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick nav */}
      <Card className="border-border/30">
        <CardContent className="p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Quick Nav</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Guided Setup Concierge', path: '/admin/guided-setup-concierge' },
              { label: 'Approval Queue', path: '/admin/approval-queue' },
              { label: 'Final System Status', path: '/admin/final-system-status' },
              { label: 'Site Health', path: '/admin/site-health' },
              { label: 'Notifications', path: '/admin/notifications' },
              { label: 'TikTok Platform Review', path: '/admin/tiktok-platform-review' },
              { label: 'Stripe Command Centre', path: '/admin/stripe-command-centre' },
              { label: 'Social Agent OS', path: '/admin/social-agent-os' },
              { label: 'Daily Post Engine', path: '/admin/daily-post-engine' },
            ].map(link => (
              <Link key={link.path} to={link.path}>
                <Button size="sm" variant="outline" className="text-xs">{link.label}</Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}