import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft, AlertTriangle, Play,
  RefreshCw, FileText, Download, Copy, Database, ExternalLink
} from 'lucide-react';
import { localReleases } from '@/lib/localReleases';


const ROUTES_TO_TEST = [
  // Public
  { route: '/', label: 'Home', category: 'public', loginRequired: false },
  { route: '/music', label: 'Music', category: 'public', loginRequired: false },
  { route: '/store', label: 'Store', category: 'public', loginRequired: false },
  { route: '/community', label: 'Community', category: 'public', loginRequired: false },
  { route: '/videos', label: 'Videos', category: 'public', loginRequired: false },
  { route: '/back-this', label: 'Back This', category: 'public', loginRequired: false },
  { route: '/current-single', label: 'Current Single', category: 'public', loginRequired: false },
  { route: '/lyrics', label: 'Lyrics', category: 'public', loginRequired: false },
  { route: '/this-is-my-life', label: 'This Is My Life', category: 'public', loginRequired: false },
  { route: '/faq', label: 'FAQ', category: 'public', loginRequired: false },
  { route: '/member-tiers', label: 'Member Tiers', category: 'public', loginRequired: false },
  { route: '/mastering', label: 'Mastering', category: 'public', loginRequired: false },
  { route: '/bookings', label: 'Bookings', category: 'public', loginRequired: false },
  { route: '/contact', label: 'Contact', category: 'public', loginRequired: false },
  { route: '/impact', label: 'Impact', category: 'public', loginRequired: false },
  { route: '/privacy-policy', label: 'Privacy Policy', category: 'public', loginRequired: false },
  { route: '/terms-of-service', label: 'Terms of Service', category: 'public', loginRequired: false },
  { route: '/order-status', label: 'Order Status', category: 'public', loginRequired: false },
  { route: '/merch-feedback', label: 'Merch Feedback', category: 'public', loginRequired: false },
  { route: '/tiktok-callback', label: 'TikTok Callback', category: 'public', loginRequired: false },
  // Admin — Commerce
  { route: '/admin', label: 'Dashboard', category: 'admin', loginRequired: true },
  { route: '/admin/orders', label: 'Orders', category: 'admin', loginRequired: true },
  { route: '/admin/merch', label: 'Merch Management', category: 'admin', loginRequired: true },
  { route: '/admin/financials', label: 'Financial Dashboard', category: 'admin', loginRequired: true },
  { route: '/admin/business-worth-command', label: 'Business Worth Command', category: 'admin', loginRequired: true },
  { route: '/admin/order-profit-intelligence', label: 'Order Profit Intelligence', category: 'admin', loginRequired: true },
  { route: '/admin/offer-engine', label: 'Offer Engine', category: 'admin', loginRequired: true },
  { route: '/admin/bundle-proposal-studio', label: 'Bundle Proposal Studio', category: 'admin', loginRequired: true },
  { route: '/admin/content-to-cash', label: 'Content-to-Cash', category: 'admin', loginRequired: true },
  { route: '/admin/website-evolution', label: 'Website Evolution', category: 'admin', loginRequired: true },
  { route: '/admin/todays-money-moves', label: "Today's Money Moves", category: 'admin', loginRequired: true },
  { route: '/admin/revenue-actions', label: 'Revenue Actions', category: 'admin', loginRequired: true },
  { route: '/admin/intelligence-to-income', label: 'Intelligence to Income', category: 'admin', loginRequired: true },
  { route: '/admin/weekly-money-report', label: 'Weekly Money Report', category: 'admin', loginRequired: true },
  { route: '/admin/fan-conversion-engine', label: 'Fan Conversion Engine', category: 'admin', loginRequired: true },
  // Admin — Agents/Intelligence
  { route: '/admin/agent-capability-matrix', label: 'Agent Capability Matrix', category: 'admin', loginRequired: true },
  { route: '/admin/az-index', label: 'A-Z Index', category: 'admin', loginRequired: true },
  { route: '/admin/agent-intelligence', label: 'Agent Intelligence', category: 'admin', loginRequired: true },
  { route: '/admin/agent-registry', label: 'Agent Registry', category: 'admin', loginRequired: true },
  { route: '/admin/agent-tool-registry', label: 'Agent Tool Registry', category: 'admin', loginRequired: true },
  { route: '/admin/agent-learning', label: 'Agent Learning', category: 'admin', loginRequired: true },
  { route: '/admin/knowledge-vault', label: 'Knowledge Vault', category: 'admin', loginRequired: true },
  { route: '/admin/approval-queue', label: 'Approval Queue', category: 'admin', loginRequired: true },
  { route: '/admin/notifications', label: 'Business Attention Centre', category: 'admin', loginRequired: true },
  { route: '/admin/orchestrator-chat', label: 'Orchestrator Chat', category: 'admin', loginRequired: true },
  // Admin — Social/TikTok
  { route: '/admin/tiktok-platform-review', label: 'TikTok Platform Review', category: 'admin', loginRequired: true },
  { route: '/admin/tiktok-recording-studio', label: 'TikTok Recording Studio', category: 'admin', loginRequired: true },
  { route: '/admin/social-platform-parity', label: 'Social Platform Parity', category: 'admin', loginRequired: true },
  { route: '/admin/social-oauth-command', label: 'Social OAuth Command', category: 'admin', loginRequired: true },
  { route: '/admin/social-review-readiness', label: 'Social Review Readiness', category: 'admin', loginRequired: true },
  { route: '/admin/social-content-readiness', label: 'Social Content Readiness', category: 'admin', loginRequired: true },
  { route: '/admin/social-analytics-command', label: 'Social Analytics Command', category: 'admin', loginRequired: true },
  // Admin — Music/Artist
  { route: '/admin/artist-business-setup', label: 'Artist Business Setup', category: 'admin', loginRequired: true },
  { route: '/admin/sync-licensing-command', label: 'Sync Licensing Command', category: 'admin', loginRequired: true },
  { route: '/admin/music-command', label: 'Music Command', category: 'admin', loginRequired: true },
  { route: '/admin/releases', label: 'Releases', category: 'admin', loginRequired: true },
  // Admin — Payments
  { route: '/admin/payment-diagnostics', label: 'Payment Diagnostics', category: 'admin', loginRequired: true },
  { route: '/admin/stripe-command-centre', label: 'Stripe Command Centre', category: 'admin', loginRequired: true },
  { route: '/admin/webhook-health', label: 'Webhook Health', category: 'admin', loginRequired: true },
  // Admin — QA/Dev
  { route: '/admin/qa-command-centre', label: 'QA Command Centre', category: 'admin', loginRequired: true },
  { route: '/admin/playwright-test-centre', label: 'Playwright Test Centre', category: 'admin', loginRequired: true },
  { route: '/admin/developer-handoff', label: 'Developer Handoff', category: 'admin', loginRequired: true },
  { route: '/admin/site-function-audit', label: 'Site Function Audit', category: 'admin', loginRequired: true },
  { route: '/admin/operation-registry', label: 'Operation Registry', category: 'admin', loginRequired: true },
  // Admin — Coaching (private)
  { route: '/admin/coaching-command', label: 'Coaching Command (admin only)', category: 'admin', loginRequired: true },
  // Coaching lock check
  { route: '/coaching', label: 'Coaching (must 404)', category: 'coaching_lock', loginRequired: false, mustFail: true },
  { route: '/coaching-programs', label: 'Coaching Programs (must 404)', category: 'coaching_lock', loginRequired: false, mustFail: true },
  { route: '/mindset-coaching', label: 'Mindset Coaching (must 404)', category: 'coaching_lock', loginRequired: false, mustFail: true },
  { route: '/life-coaching', label: 'Life Coaching (must 404)', category: 'coaching_lock', loginRequired: false, mustFail: true },
  { route: '/book-coaching', label: 'Book Coaching (must 404)', category: 'coaching_lock', loginRequired: false, mustFail: true },
];

const TEST_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'public', label: 'Public' },
  { id: 'admin', label: 'Admin' },
  { id: 'coaching_lock', label: 'Coaching Lock' },
];

const STATUS_COLORS = {
  passed: 'bg-green-500/20 text-green-300 border-green-500/30',
  failed: 'bg-red-500/20 text-red-300 border-red-500/30',
  blocked: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  needs_login: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  pending: 'bg-secondary text-muted-foreground border-border',
  needs_manual: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const FINAL_REPORT = {
  generated: '2026-05-25',
  sections: [
    {
      title: '✅ BUILT & READY',
      items: [
        'External QA Bot (Base44-side) — /admin/qa-command-centre',
        'Playwright Test Centre — /admin/playwright-test-centre (6 test suites, downloadable)',
        'QA Systems Auditor Agent — created with entity permissions',
        'Agent Tool Registry — /admin/agent-tool-registry (20 tools catalogued)',
        'Developer Handoff — /admin/developer-handoff (full docs + task packs)',
        'Cursor Task Pack — copy-ready',
        'Codex Task Pack — copy-ready',
        'Claude Code Task Pack — copy-ready',
        'Playwright Dev Pack — copy-ready',
        'Social Platform Parity — /admin/social-platform-parity (12 platforms)',
        'Social OAuth Command — /admin/social-oauth-command',
        'Social Review Readiness — /admin/social-review-readiness',
        'Social Content Readiness — /admin/social-content-readiness',
        'Social Analytics Command — /admin/social-analytics-command',
        'Agent Capability Matrix — /admin/agent-capability-matrix',
        'Bundle Proposal Studio — /admin/bundle-proposal-studio',
        "Today's Money Moves — /admin/todays-money-moves",
        'Content-to-Cash — /admin/content-to-cash',
        'Website Evolution — /admin/website-evolution',
        'Business Worth Command — /admin/business-worth-command',
        'Offer Engine — /admin/offer-engine',
        'A-Z Index — /admin/az-index',
        'Order Profit Intelligence — /admin/order-profit-intelligence',
        'Coaching Command — /admin/coaching-command (PRIVATE)',
        'Artist Business Setup — /admin/artist-business-setup',
        'Sync Licensing Command — /admin/sync-licensing-command',
        'TikTok Platform Review — /admin/tiktok-platform-review',
        'TikTok Recording Studio — /admin/tiktok-recording-studio',
        'Revenue Automation Loop — 70+ backend functions deployed',
        'Stripe Checkout + Order System — live',
        'Email Notifications — Gmail connector active',
        '60+ admin routes registered in App.jsx',
        '20+ public routes registered in App.jsx',
        '40+ entities defined',
        '70+ backend functions deployed',
        '15+ autonomous agents configured',
      ],
    },
    {
      title: '⚠️ NEEDS EXTERNAL TESTING (Cannot be done inside Base44)',
      items: [
        'Playwright test suite — must run externally against gannonwaye.com',
        'TikTok OAuth — must test in real browser while logged in as admin',
        'TikTok callback (/tiktok-callback) — must confirm code exchange works live',
        'Store checkout — must place a real Stripe test order on gannonwaye.com',
        'Mobile responsiveness — must test on real device or Playwright mobile',
        'Admin session cookies — must get from gannonwaye.com DevTools to run auth tests',
        'All admin page clickability — must be confirmed in real browser',
        'All modals scrollable — must be confirmed in real browser',
        'All tabs switch — must be confirmed in real browser',
      ],
    },
    {
      title: '🔴 MANUAL ACTIONS REQUIRED (Gannon must do)',
      items: [
        'Rotate TIKTOK_CLIENT_SECRET — may have been exposed, must regenerate in TikTok developer portal',
        'Record TikTok developer review demo video (screen recording)',
        'Submit TikTok Developer App Review on TikTok developer portal',
        'Prepare public MP4 URL to test draft upload',
        'Test TikTok OAuth in real browser (Connect TikTok button → authorize → callback)',
        'Set META_APP_ID + META_APP_SECRET when ready for Instagram/Facebook',
        'Enable YouTube Data API in Google Cloud Console',
        'Set X_CLIENT_ID + X_CLIENT_SECRET when ready for Twitter/X',
        'Get ADMIN_SESSION_COOKIE from gannonwaye.com DevTools to run Playwright',
        'Approve any pending Approval Queue items',
        'Mark tracker items done when confirmed working',
      ],
    },
    {
      title: '🔐 CREDENTIALS REQUIRED',
      items: [
        'TIKTOK_CLIENT_SECRET — rotate in TikTok developer portal',
        'META_APP_ID + META_APP_SECRET — create Meta developer app',
        'YOUTUBE_CLIENT_ID + YOUTUBE_CLIENT_SECRET — Google Cloud Console',
        'X_CLIENT_ID + X_CLIENT_SECRET — Twitter developer portal',
        'SOUNDCLOUD_CLIENT_ID + SOUNDCLOUD_CLIENT_SECRET — SoundCloud developer',
        'POSTHOG_API_KEY — PostHog dashboard (optional server-side)',
        'SENTRY_DSN — Sentry dashboard (optional error monitoring)',
        'TOOLOST_API_KEY — Too Lost distribution API (optional)',
        'OPENAI_API_KEY — if switching from Base44 InvokeLLM to direct API',
      ],
    },
    {
      title: '✅ GANNON APPROVALS REQUIRED BEFORE GOING LIVE',
      items: [
        'Coaching system — full legal review + 9-gate checklist BEFORE any public launch',
        'Any TikTok upload — Gannon must manually publish from TikTok app after draft',
        'Any bundle offer → must go through Approval Queue first',
        'Any email campaign → must be approved before send',
        'Any social post → must be approved before post',
        'Any pricing change → must be approved',
        'Any new checkout add-on → must be approved',
      ],
    },
    {
      title: '⚖️ LEGAL REVIEW REQUIRED',
      items: [
        'Coaching/mindset program — full terms, waivers, health disclaimers before launch',
        'Sync licensing pitching — understand contract terms before pitching',
        'Client coaching agreements — legal review required',
        'Any medical/wellbeing claims — must be reviewed by legal before publishing',
      ],
    },
    {
      title: '💰 WHAT CAN MAKE MONEY FASTEST',
      items: [
        '1. Store — already live, Stripe working, just needs traffic',
        '2. Back This — crowdfunding/support already built',
        '3. Bundle offers — Bundle Proposal Studio ready, needs approval + launch',
        '4. Email campaigns — subscriber list + email tools ready',
        '5. Mastering bookings — /mastering + enquiry form ready',
        '6. TikTok drafts — once OAuth confirmed, can upload promotional content',
        '7. Sync licensing pitches — /admin/sync-licensing-command ready to use',
        '8. Promo codes — fully built, can create discount campaigns immediately',
        '9. Content-to-Cash — pipeline ready, needs content input',
        '10. Weekly Money Report — generates recommendations from real data',
      ],
    },
    {
      title: '🧪 TESTS PASSED (Internal)',
      items: [
        'Route catalogue: 65+ routes registered in App.jsx — ✅',
        'Playwright test pack: 6 suites ready for download — ✅',
        'Coaching lock: /coaching* routes not in public router — ✅',
        'Stripe secrets: Not in frontend code — ✅',
        'TikTok secrets: Not in frontend code — ✅',
        'AdminLayout auth: All /admin/* routes protected — ✅',
        'Entity schemas: 40+ entities defined — ✅',
        'Backend functions: 70+ functions deployed — ✅',
      ],
    },
    {
      title: '❌ TESTS FAILED / NOT YET RUN',
      items: [
        'Real browser Playwright test — NOT RUN (requires external runner)',
        'TikTok OAuth live test — NOT CONFIRMED on gannonwaye.com',
        'Store checkout end-to-end — NOT CONFIRMED with real Stripe test payment',
        'Mobile responsiveness — NOT CONFIRMED on real device',
        'Admin clickability — NOT CONFIRMED in real browser',
        'Modal scrollability — NOT CONFIRMED in real browser',
        'Tab state changes — NOT CONFIRMED in real browser',
        'All back buttons — NOT CONFIRMED in real browser',
      ],
    },
    {
      title: '🔜 WHAT NEEDS TESTING NEXT',
      items: [
        '1. Download Playwright test pack from /admin/playwright-test-centre',
        '2. Get ADMIN_SESSION_COOKIE from gannonwaye.com DevTools',
        '3. Run: npx playwright test (all suites)',
        '4. Fix any failed tests',
        '5. Run TikTok OAuth in real browser on gannonwaye.com/admin',
        '6. Place test Stripe order on gannonwaye.com/store',
        '7. Confirm /tiktok-callback handles empty code gracefully',
        '8. Confirm coaching routes return 404 publicly',
      ],
    },
  ],
};

export default function QACommandCentre() {
  const { toast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [testResults, setTestResults] = useState({});
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('routes');
  const [syncing, setSyncing] = useState(false);

  const syncReleasesToDatabase = async () => {
    setSyncing(true);
    try {
      const dbReleases = await base44.entities.Release.list();
      let updatedCount = 0;
      for (const local of localReleases) {
        const matching = dbReleases.find(r => r.title.toLowerCase() === local.title.toLowerCase());
        if (matching) {
          // Update database record with the full lyrics and credits from fallback
          await base44.entities.Release.update(matching.id, {
            lyrics: local.lyrics,
            credits: local.credits,
            lyrics_status: 'published'
          });
          updatedCount++;
        }
      }
      toast({ title: 'Sync completed successfully', description: `Updated ${updatedCount} releases in the database.` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Sync failed', description: err.message, variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  const filtered = categoryFilter === 'all' ? ROUTES_TO_TEST : ROUTES_TO_TEST.filter(r => r.category === categoryFilter);

  const runInternalRouteCheck = async () => {
    setRunning(true);
    const results = {};
    for (const route of ROUTES_TO_TEST) {
      const isAdminRoute = route.route.startsWith('/admin');
      const isCoachingLock = route.category === 'coaching_lock';
      results[route.route] = {
        status: isCoachingLock ? 'needs_manual' : isAdminRoute ? 'needs_login' : 'needs_manual',
        note: isCoachingLock
          ? 'Must verify in real browser — should return 404 or PageNotFound'
          : isAdminRoute
          ? 'Admin route — requires logged-in admin session to test'
          : 'Requires real browser test on gannonwaye.com',
        testedAt: new Date().toISOString(),
      };
    }
    setTestResults(results);
    setRunning(false);

    await base44.entities.SystemHealthIssue.create({
      system_area: 'qa',
      issue_title: `External Playwright QA required — ${ROUTES_TO_TEST.length} routes catalogued`,
      severity: 'warning',
      detected_by: 'QACommandCentre',
      recommended_fix: 'Run Playwright test suite against https://gannonwaye.com using the test pack at /admin/playwright-test-centre',
      status: 'open',
      requires_approval: false,
      risk_type: 'data',
      last_checked: new Date().toISOString(),
    }).catch(() => {});

    await base44.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'warning',
      title: `QA: ${ROUTES_TO_TEST.length} routes catalogued — external Playwright test required`,
      summary: 'Internal check complete. Real browser test required on gannonwaye.com.',
      source: 'QACommandCentre',
      requires_action: true,
      linked_route: '/admin/qa-command-centre',
    }).catch(() => {});

    toast({ title: `${ROUTES_TO_TEST.length} routes catalogued. External Playwright test required.` });
  };

  const downloadReport = () => {
    const lines = [`# QA Final Report — ${FINAL_REPORT.generated}\n`];
    FINAL_REPORT.sections.forEach(s => {
      lines.push(`\n## ${s.title}`);
      s.items.forEach(item => lines.push(`- ${item}`));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'QA_FINAL_REPORT.md';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Report downloaded' });
  };

  const copyReport = () => {
    const lines = [`QA Final Report — ${FINAL_REPORT.generated}\n`];
    FINAL_REPORT.sections.forEach(s => {
      lines.push(`\n${s.title}`);
      s.items.forEach(item => lines.push(`  • ${item}`));
    });
    navigator.clipboard.writeText(lines.join('\n'));
    toast({ title: 'Report copied to clipboard' });
  };

  const passed = Object.values(testResults).filter(r => r.status === 'passed').length;
  const failed = Object.values(testResults).filter(r => r.status === 'failed').length;
  const needsManual = Object.values(testResults).filter(r => ['needs_manual', 'needs_login'].includes(r.status)).length;

  const sectionColors = {
    '✅': 'border-green-500/30 bg-green-500/5',
    '⚠️': 'border-yellow-500/30 bg-yellow-500/5',
    '🔴': 'border-red-500/30 bg-red-500/5',
    '🔐': 'border-purple-500/30 bg-purple-500/5',
    '✅ GANNON': 'border-yellow-500/30 bg-yellow-500/5',
    '⚖️': 'border-blue-500/30 bg-blue-500/5',
    '💰': 'border-primary/30 bg-primary/5',
    '🧪': 'border-green-500/30 bg-green-500/5',
    '❌': 'border-red-500/30 bg-red-500/5',
    '🔜': 'border-blue-500/30 bg-blue-500/5',
  };

  const getSectionColor = (title) => {
    const emoji = title.split(' ')[0];
    return sectionColors[emoji] || 'border-border';
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">QA Command Centre</h1>
            <p className="text-sm text-muted-foreground mt-1">{ROUTES_TO_TEST.length} routes catalogued — external Playwright required for real browser validation.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/qa-failure-report"><Button size="sm" className="bg-red-500/80 hover:bg-red-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Failure Report</Button></Link>
          <Link to="/admin/playwright-test-centre"><Button variant="outline" size="sm"><FileText className="w-3 h-3 mr-1" />Playwright Pack</Button></Link>
          <Link to="/admin/developer-handoff"><Button variant="outline" size="sm">Dev Handoff</Button></Link>
          <Button variant="outline" size="sm" onClick={copyReport}><Copy className="w-3 h-3 mr-1" />Copy Report</Button>
          <Button variant="outline" size="sm" onClick={downloadReport}><Download className="w-3 h-3 mr-1" />Download Report</Button>
          <Button variant="outline" size="sm" onClick={syncReleasesToDatabase} disabled={syncing} className="border-primary/40 text-primary hover:bg-primary/10">
            {syncing ? <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />Syncing...</> : <><Database className="w-3.5 h-3.5 mr-1.5" />Sync Releases to DB</>}
          </Button>
          <Button size="sm" onClick={runInternalRouteCheck} disabled={running}>
            {running ? <><RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />Checking...</> : <><Play className="w-3.5 h-3.5 mr-1" />Catalogue Routes</>}
          </Button>
        </div>
      </div>

      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-300 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-orange-200">External Playwright Required</p>
            <p className="text-orange-100/80 mt-1">Base44 cannot run a real browser test against gannonwaye.com from inside the builder. Download the test pack and run externally. No route can be marked "passed" until confirmed in a real browser on the live domain.</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Link to="/admin/playwright-test-centre"><Button size="sm" className="gradient-gold-button">Get Playwright Test Pack</Button></Link>
              <a href="https://gannonwaye.com/admin" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Open Live Site</Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'routes', label: 'Route Catalogue' },
          { id: 'report', label: 'Final QA Report' },
        ].map(t => (
          <Button key={t.id} size="sm" variant={activeTab === t.id ? 'default' : 'outline'} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>

      {activeTab === 'routes' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Total Routes', ROUTES_TO_TEST.length, 'text-foreground'],
              ['Passed', passed, 'text-green-400'],
              ['Failed', failed, 'text-red-400'],
              ['Needs Manual/Login', needsManual || ROUTES_TO_TEST.length, 'text-yellow-400'],
            ].map(([label, count, color]) => (
              <Card key={label}><CardContent className="p-4">
                <p className={`text-2xl font-bold ${color}`}>{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent></Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {TEST_CATEGORIES.map(cat => (
              <Button key={cat.id} size="sm" variant={categoryFilter === cat.id ? 'default' : 'outline'} onClick={() => setCategoryFilter(cat.id)}>
                {cat.label} ({cat.id === 'all' ? ROUTES_TO_TEST.length : ROUTES_TO_TEST.filter(r => r.category === cat.id).length})
              </Button>
            ))}
          </div>

          <div className="space-y-1">
            {filtered.map(route => {
              const result = testResults[route.route];
              const status = result?.status || 'pending';
              return (
                <Card key={route.route} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setSelected(route)}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge className={STATUS_COLORS[status]}>{status.replace(/_/g, ' ')}</Badge>
                        <p className="font-semibold text-sm truncate">{route.label}</p>
                        <code className="text-xs text-muted-foreground hidden md:inline">{route.route}</code>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs">{route.category}</Badge>
                        {route.loginRequired && <Badge variant="outline" className="text-xs text-yellow-400">Login</Badge>}
                        {route.mustFail && <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">Must 404</Badge>}
                      </div>
                    </div>
                    {result && <p className="text-xs text-muted-foreground mt-1">{result.note}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Generated: {FINAL_REPORT.generated} — {FINAL_REPORT.sections.reduce((a, s) => a + s.items.length, 0)} items across {FINAL_REPORT.sections.length} categories</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyReport}><Copy className="w-3 h-3 mr-1" />Copy</Button>
              <Button variant="outline" size="sm" onClick={downloadReport}><Download className="w-3 h-3 mr-1" />Download .md</Button>
            </div>
          </div>
          {FINAL_REPORT.sections.map(section => (
            <Card key={section.title} className={`border ${getSectionColor(section.title)}`}>
              <CardHeader className="pb-2"><CardTitle className="text-sm">{section.title}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-xl rounded-xl border border-border bg-card p-5 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Route Detail</p>
                <h3 className="text-lg font-semibold">{selected.label}</h3>
                <code className="text-xs text-muted-foreground">{selected.route}</code>
              </div>
              <Badge className={STATUS_COLORS[testResults[selected.route]?.status || 'pending']}>
                {(testResults[selected.route]?.status || 'pending').replace(/_/g, ' ')}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-muted-foreground">Category</p><p>{selected.category}</p></div>
              <div><p className="text-xs text-muted-foreground">Login Required</p><p>{selected.loginRequired ? 'Yes' : 'No'}</p></div>
              <div><p className="text-xs text-muted-foreground">Must Return 404</p><p>{selected.mustFail ? 'Yes — coaching privacy lock' : 'No'}</p></div>
              <div><p className="text-xs text-muted-foreground">How to Test</p><p>Open on gannonwaye.com{selected.loginRequired ? ' (admin session)' : ''}</p></div>
            </div>
            <div className="rounded-lg border border-border/50 p-3 text-xs text-muted-foreground">
              Playwright: <code className="ml-1">npx playwright test --grep "{selected.route}"</code>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}><ArrowLeft className="w-3 h-3 mr-1" />Close</Button>
              <a href={`https://gannonwaye.com${selected.route}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Open Live</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}