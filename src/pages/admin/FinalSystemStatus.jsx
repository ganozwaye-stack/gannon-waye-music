import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock, XCircle, ExternalLink, Shield, Zap, Brain, Video, ShoppingBag, Play } from 'lucide-react';

const STATUS_CONFIG = {
  'Complete': { color: 'bg-green-500/10 text-green-300 border-green-500/30', icon: CheckCircle2 },
  'Live-tested complete': { color: 'bg-green-500/10 text-green-300 border-green-500/30', icon: CheckCircle2 },
  'Built but untested': { color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', icon: Clock },
  'Blocked by external login': { color: 'bg-orange-500/10 text-orange-300 border-orange-500/30', icon: AlertTriangle },
  'Blocked by secret rotation': { color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: AlertTriangle },
  'Blocked by Gannon approval': { color: 'bg-blue-500/10 text-blue-300 border-blue-500/30', icon: Shield },
  'Failed and needs fix': { color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle },
  'Not done': { color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: XCircle },
};

const SECTIONS = [
  {
    title: '🔐 Stripe Webhook Secret Rotation',
    icon: Shield,
    iconColor: 'text-red-400',
    items: [
      { label: 'Stripe webhook secret rotation', status: 'Blocked by secret rotation', detail: 'ROTATE NOW at dashboard.stripe.com/webhooks → roll signing secret → paste NEW value into Base44 Secrets only. Never paste into chat.' },
      { label: 'SystemHealthIssue active until rotated', status: 'Complete', detail: 'Issue record exists and remains open' },
      { label: 'Business Attention Centre alert active', status: 'Complete', detail: 'Alert present in notifications' },
      { label: 'No raw secret values displayed anywhere', status: 'Complete', detail: 'All pages show only: present / needs rotation / missing' },
      { label: 'Post-rotation: run integrationHealthCheck', status: 'Blocked by secret rotation', detail: 'Run after Gannon enters new secret' },
    ],
  },
  {
    title: '📱 TikTok OAuth — Live Test',
    icon: Video,
    iconColor: 'text-purple-400',
    items: [
      { label: 'TIKTOK_CLIENT_KEY leading-space fix in code', status: 'Complete', detail: '.trim() added to tiktokOAuth function — OAuth URL now correct' },
      { label: 'TIKTOK_CLIENT_KEY stored secret re-entered (no spaces)', status: 'Blocked by Gannon approval', detail: 'Re-enter in Base44 Secrets → Settings → Environment Variables. No leading/trailing spaces.' },
      { label: 'TIKTOK_CLIENT_SECRET rotated', status: 'Blocked by Gannon approval', detail: 'Rotate at developers.tiktok.com → Manage Apps → your app → Secret → Regenerate' },
      { label: 'OAuth URL tested live on gannonwaye.com', status: 'Blocked by external login', detail: 'Go to gannonwaye.com/admin/tiktok-platform-review → click Connect TikTok → confirm official TikTok consent page opens' },
      { label: 'OAuth callback confirmed (code= param)', status: 'Blocked by external login', detail: 'Redirect to /tiktok-callback?code=... must complete' },
      { label: 'Connected creator status shown', status: 'Blocked by external login', detail: 'Token stored in KnowledgeVault, creator profile displayed' },
      { label: 'Tokens hidden from UI', status: 'Complete', detail: 'No raw tokens ever displayed — stored in KnowledgeVault as admin-only entity' },
      { label: 'video.upload draft flow tested', status: 'Blocked by external login', detail: 'Requires live OAuth token first — then test via /admin/tiktok-platform-review upload flow' },
      { label: 'Confirmed nothing auto-posts publicly', status: 'Complete', detail: 'TikTok requires manual publish — draft upload only, no auto-post' },
    ],
  },
  {
    title: '🛒 Checkout — Live Test',
    icon: ShoppingBag,
    iconColor: 'text-green-400',
    items: [
      { label: 'Stripe keys confirmed live/live', status: 'Complete', detail: 'sk_live_* and pk_live_* confirmed present' },
      { label: 'Webhook secret rotated first', status: 'Blocked by secret rotation', detail: 'Must rotate webhook secret before running live test' },
      { label: 'Shipping rules exist', status: 'Complete', detail: 'calculateShippingRate function deployed and logic present' },
      { label: 'Promo codes behave correctly', status: 'Complete', detail: 'LAUNCH15 and THANKYOU10 tested internally — FAMILY100 inactive' },
      { label: 'Full checkout flow live-tested', status: 'Blocked by secret rotation', detail: 'Do after webhook secret rotation — use real card at gannonwaye.com/store' },
      { label: 'Order created in database', status: 'Blocked by secret rotation', detail: 'Verify in Admin → Orders after test purchase' },
      { label: 'Receipt / notification fires', status: 'Blocked by secret rotation', detail: 'Check ganozwaye@gmail.com for receipt and admin alert after test purchase' },
      { label: 'No checkout freeze or misleading messages', status: 'Built but untested', detail: 'Requires live browser test to confirm UX flow' },
    ],
  },
  {
    title: '🧪 Playwright / Browser QA',
    icon: Play,
    iconColor: 'text-orange-400',
    items: [
      { label: 'Playwright test pack built', status: 'Complete', detail: 'Available at /admin/playwright-test-centre — download and run against gannonwaye.com' },
      { label: 'All public routes catalogued', status: 'Complete', detail: '20 public routes documented in QA Command Centre' },
      { label: 'All admin routes catalogued', status: 'Complete', detail: '100+ admin routes documented' },
      { label: 'Browser QA actually run', status: 'Built but untested', detail: 'NOT RUN. Must be executed from an external terminal against gannonwaye.com. Go to /admin/playwright-test-centre to download the test pack.' },
      { label: 'Mobile layout verified', status: 'Built but untested', detail: 'Requires real device or browser mobile simulation' },
      { label: 'All buttons/forms/modals confirmed clickable', status: 'Built but untested', detail: 'Requires browser run — cannot be confirmed from code alone' },
    ],
  },
  {
    title: '✅ ApprovalQueue Auto-Action Proof',
    icon: Shield,
    iconColor: 'text-yellow-400',
    items: [
      { label: 'Test ApprovalQueue item exists', status: 'Live-tested complete', detail: 'LIVE-TESTED — proofApprovalChain created a real test proposal, approved it, and confirmed BundleOffer was created.' },
      { label: 'publishApprovedProposal function works', status: 'Live-tested complete', detail: 'LIVE-TESTED — BundleOffer created and confirmed in proofApprovalChain test run.' },
      { label: 'Duplicate approval prevention', status: 'Live-tested complete', detail: 'LIVE-TESTED — proofApprovalChain confirmed duplicate_blocked: true.' },
      { label: 'Notification created on approval', status: 'Live-tested complete', detail: 'LIVE-TESTED — Business Attention Centre notification created during proof chain run.' },
      { label: 'Full chain: proposal → approve → BundleOffer', status: 'Live-tested complete', detail: 'LIVE-TESTED via proofApprovalChain: 7 steps completed, BundleOffer created and cleaned up. Chain is proven.' },
      { label: 'Full UI → approve → published proof (Gannon)', status: 'Blocked by Gannon approval', detail: 'Backend chain proven. UI approval by Gannon still needed: go to /admin/approval-queue → approve a social draft or proposal → confirm result.' },
    ],
  },
  {
    title: '🎬 Training Videos',
    icon: Video,
    iconColor: 'text-blue-400',
    items: [
      { label: 'Training Hub modules rebuilt (50+)', status: 'Complete', detail: '9 categories, 50+ written modules at /admin/training' },
      { label: 'TikTok recording studio script', status: 'Complete', detail: 'Full voiceover script + 8-step shot list at /admin/tiktok-recording-studio' },
      { label: 'Actual screen-recorded training videos', status: 'Not done', detail: 'NOT RECORDED. No video files exist. Written guides only. Use /admin/training modules + the scripts below to record when ready.' },
      { label: 'Video recording scripts available', status: 'Complete', detail: 'TikTok demo script in /admin/tiktok-recording-studio — other module scripts must still be written' },
    ],
  },
  {
    title: '🤖 Agent Revenue System',
    icon: Brain,
    iconColor: 'text-cyan-400',
    items: [
      { label: 'Agents running on schedule', status: 'Complete', detail: 'agentProposalScanner, growthOpportunityScanner, agentIntelligenceLoop all running daily' },
      { label: 'Proposals created and going to Approval Queue', status: 'Complete', detail: 'Live proposals confirmed in AgentActionProposal entity' },
      { label: 'Agents connected to order/product data', status: 'Complete', detail: 'agentProposalScanner reads MerchProduct + stock levels' },
      { label: 'Agents connected to KnowledgeVault', status: 'Complete', detail: 'agentIntelligenceLoop writes insights; others can read' },
      { label: 'Agents connected to Metricool data', status: 'Built but untested', detail: 'metricoolImportMetrics function exists — not yet scheduled into agent loop' },
      { label: 'Agents connected to release sprint posts', status: 'Built but untested', detail: 'ContentCalendarPost entity exists — no agent reads it yet for opportunity detection' },
      { label: 'Weekly learning from approvals/rejections', status: 'Built but untested', detail: 'agentSelfImprovement function exists — not yet triggered by approval events' },
      { label: 'Richer data as platform grows', status: 'Blocked by Gannon approval', detail: 'Currently 2 orders, 7 subscribers, 6 products. Agents need real launch traffic to generate specific insights.' },
    ],
  },
  {
    title: '📱 Social AI Engine',
    icon: Brain,
    iconColor: 'text-pink-400',
    items: [
      { label: 'generateDailyDrafts function', status: 'Live-tested complete', detail: 'LIVE-TESTED — 3 drafts created for 2026-05-28. Went to ContentCalendarPost + ApprovalQueue. Zero auto-posting.' },
      { label: 'socialQualityCouncil function', status: 'Live-tested complete', detail: 'LIVE-TESTED — 5-agent council ran, average score 8.2/10, verdict PASS, post moved to pending_approval.' },
      { label: 'Metricool API auth (X-Mc-Auth)', status: 'Live-tested complete', detail: 'LIVE-TESTED — All 5 Metricool endpoints returned 200. 2 brands confirmed. Profiles, media, normalize, schedule all confirmed reachable.' },
      { label: 'metricoolSchedulePost endpoint corrected', status: 'Complete', detail: 'Fixed from /api/v2/scheduler/posts to confirmed working /api/posts endpoint.' },
      { label: 'DailyPostEngine page', status: 'Complete', detail: 'Built at /admin/daily-post-engine — generate drafts, run quality council, copy for Metricool.' },
      { label: 'SocialAgentOS page', status: 'Complete', detail: 'Built at /admin/social-agent-os — 10-agent workflow overview with run controls.' },
      { label: 'AgentWorkbench page', status: 'Complete', detail: 'Built at /admin/agent-workbench — all 10 agents with run buttons and approval gating.' },
      { label: 'MetricoolDiagnostics page', status: 'Live-tested complete', detail: 'LIVE-TESTED — diagnostic function confirms all endpoints 200, 2 brands, auth working.' },
      { label: 'Zero auto-posting enforcement', status: 'Live-tested complete', detail: 'CONFIRMED — All posts require: Draft → Quality Council → ApprovalQueue approval → Metricool schedule. No bypass path exists.' },
    ],
  },
];

const NEXT_ACTIONS = [
  { priority: '🔴 Critical', action: 'Rotate Stripe webhook secret', link: 'https://dashboard.stripe.com/webhooks', label: 'Stripe Dashboard', external: true },
  { priority: '🔴 Critical', action: 'Enter NEW webhook secret into Base44 Secrets (never in chat)', link: null, label: null },
  { priority: '🟡 High', action: 'Re-enter TIKTOK_CLIENT_KEY in Base44 Secrets — no spaces', link: null, label: null },
  { priority: '🟡 High', action: 'Rotate TIKTOK_CLIENT_SECRET at developers.tiktok.com', link: 'https://developers.tiktok.com', label: 'TikTok Dev Portal', external: true },
  { priority: '🟡 High', action: 'Test TikTok OAuth live on gannonwaye.com/admin/tiktok-platform-review', link: '/admin/tiktok-platform-review', label: 'TikTok Platform Review', external: false },
  { priority: '🟠 Medium', action: 'After webhook rotation: place real test order at gannonwaye.com/store', link: '/store', label: 'Store', external: false },
  { priority: '🟠 Medium', action: 'Approve a pending proposal in Approval Queue to prove full auto-action chain', link: '/admin/approval-queue', label: 'Approval Queue', external: false },
  { priority: '🟠 Medium', action: 'Download and run Playwright test pack against gannonwaye.com', link: '/admin/playwright-test-centre', label: 'Playwright Test Centre', external: false },
  { priority: '🔵 Ongoing', action: 'Record training videos using scripts in /admin/tiktok-recording-studio', link: '/admin/tiktok-recording-studio', label: 'Recording Studio', external: false },
];

export default function FinalSystemStatus() {
  const totalItems = SECTIONS.flatMap(s => s.items);
  const completeCount = totalItems.filter(i => i.status === 'Complete' || i.status === 'Live-tested complete').length;
  const blockedCount = totalItems.filter(i => i.status.includes('Blocked')).length;
  const untestedCount = totalItems.filter(i => i.status === 'Built but untested').length;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Final System Status</h1>
        <p className="text-muted-foreground text-sm mt-1">Accurate completion status — not marked complete until live tests done</p>
      </div>

      {/* Overall progress */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300 text-sm">⚠ System Audit NOT marked complete</p>
            <p className="text-xs text-muted-foreground mt-1">Stripe webhook secret must be rotated. TikTok OAuth must be live-tested. Checkout must be live-tested. Browser QA must be run. These are external actions only Gannon can take.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{completeCount}</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{untestedCount}</p>
            <p className="text-xs text-muted-foreground">Built but untested</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{blockedCount}</p>
            <p className="text-xs text-muted-foreground">Blocked (external)</p>
          </CardContent>
        </Card>
      </div>

      {/* Next actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Exact Next Steps for Gannon</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {NEXT_ACTIONS.map((action, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/30 hover:bg-secondary/20">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-sm shrink-0 font-medium">{action.priority}</span>
                <p className="text-sm text-muted-foreground">{action.action}</p>
              </div>
              {action.link && (
                action.external ? (
                  <a href={action.link} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <ExternalLink className="w-3 h-3" />{action.label}
                    </Button>
                  </a>
                ) : (
                  <Link to={action.link} className="shrink-0">
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <Zap className="w-3 h-3" />{action.label}
                    </Button>
                  </Link>
                )
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section detail */}
      {SECTIONS.map(section => {
        const SIcon = section.icon;
        const sectionDone = section.items.filter(i => i.status === 'Complete' || i.status === 'Live-tested complete').length;
        return (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <SIcon className={`w-4 h-4 ${section.iconColor}`} />
                {section.title}
                <Badge variant="outline" className="ml-auto text-xs">{sectionDone}/{section.items.length} complete</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {section.items.map((item, i) => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Built but untested'];
                const Icon = cfg.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/20">
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${item.status.includes('Complete') ? 'text-green-400' : item.status.includes('Blocked') ? 'text-orange-400' : 'text-yellow-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm">{item.label}</span>
                        <Badge className={`text-[10px] border ${cfg.color}`}>{item.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Training video notice */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Video className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-300 text-sm">Training Videos — NOT RECORDED</p>
            <p className="text-xs text-muted-foreground mt-1">
              Written training modules exist (50+ at /admin/training). The TikTok recording demo script exists at /admin/tiktok-recording-studio.
              No actual screen-recorded video files have been created. To record: use a screen recorder (OBS, QuickTime, Loom) and follow the scripts.
            </p>
            <Link to="/admin/tiktok-recording-studio">
              <Button size="sm" variant="outline" className="mt-2 gap-1 text-xs">
                <Play className="w-3 h-3" />View Recording Scripts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}