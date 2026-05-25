import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Clock, Play, Shield,
  RefreshCw, ExternalLink, Zap, FileText, BarChart3, Eye
} from 'lucide-react';

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
  // Admin
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
  { route: '/admin/agent-capability-matrix', label: 'Agent Capability Matrix', category: 'admin', loginRequired: true },
  { route: '/admin/az-index', label: 'A-Z Index', category: 'admin', loginRequired: true },
  { route: '/admin/coaching-command', label: 'Coaching Command', category: 'admin', loginRequired: true },
  { route: '/admin/artist-business-setup', label: 'Artist Business Setup', category: 'admin', loginRequired: true },
  { route: '/admin/sync-licensing-command', label: 'Sync Licensing Command', category: 'admin', loginRequired: true },
  { route: '/admin/tiktok-platform-review', label: 'TikTok Platform Review', category: 'admin', loginRequired: true },
  { route: '/admin/tiktok-recording-studio', label: 'TikTok Recording Studio', category: 'admin', loginRequired: true },
  { route: '/admin/social-platform-parity', label: 'Social Platform Parity', category: 'admin', loginRequired: true },
  { route: '/admin/social-oauth-command', label: 'Social OAuth Command', category: 'admin', loginRequired: true },
  { route: '/admin/social-review-readiness', label: 'Social Review Readiness', category: 'admin', loginRequired: true },
  { route: '/admin/social-content-readiness', label: 'Social Content Readiness', category: 'admin', loginRequired: true },
  { route: '/admin/social-analytics-command', label: 'Social Analytics Command', category: 'admin', loginRequired: true },
  { route: '/admin/payment-diagnostics', label: 'Payment Diagnostics', category: 'admin', loginRequired: true },
  { route: '/admin/stripe-command-centre', label: 'Stripe Command Centre', category: 'admin', loginRequired: true },
  { route: '/admin/webhook-health', label: 'Webhook Health', category: 'admin', loginRequired: true },
  { route: '/admin/notifications', label: 'Business Attention Centre', category: 'admin', loginRequired: true },
  { route: '/admin/approval-queue', label: 'Approval Queue', category: 'admin', loginRequired: true },
  { route: '/admin/revenue-actions', label: 'Revenue Actions', category: 'admin', loginRequired: true },
  { route: '/admin/intelligence-to-income', label: 'Intelligence to Income', category: 'admin', loginRequired: true },
  { route: '/admin/weekly-money-report', label: 'Weekly Money Report', category: 'admin', loginRequired: true },
  { route: '/admin/agent-intelligence', label: 'Agent Intelligence', category: 'admin', loginRequired: true },
  { route: '/admin/agent-capability-matrix', label: 'Agent Capability Matrix', category: 'admin', loginRequired: true },
  { route: '/admin/knowledge-vault', label: 'Knowledge Vault', category: 'admin', loginRequired: true },
  { route: '/admin/qa-command-centre', label: 'QA Command Centre', category: 'admin', loginRequired: true },
  { route: '/admin/developer-handoff', label: 'Developer Handoff', category: 'admin', loginRequired: true },
  // Coaching lock check
  { route: '/coaching', label: 'Coaching (must 404)', category: 'coaching_lock', loginRequired: false, mustFail: true },
  { route: '/coaching-programs', label: 'Coaching Programs (must 404)', category: 'coaching_lock', loginRequired: false, mustFail: true },
  { route: '/mindset-coaching', label: 'Mindset Coaching (must 404)', category: 'coaching_lock', loginRequired: false, mustFail: true },
];

const TEST_CATEGORIES = [
  { id: 'all', label: 'All Tests' },
  { id: 'public', label: 'Public Routes' },
  { id: 'admin', label: 'Admin Routes' },
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

export default function QACommandCentre() {
  const { toast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [testResults, setTestResults] = useState({});
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = categoryFilter === 'all' ? ROUTES_TO_TEST : ROUTES_TO_TEST.filter(r => r.category === categoryFilter);

  // Simulated route existence check (real Playwright must run externally)
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

    // Create a System Health issue for external test requirement
    await base44.entities.SystemHealthIssue.create({
      system_area: 'qa',
      issue_title: 'External Playwright QA required — internal route check complete',
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
      title: `QA route check: ${ROUTES_TO_TEST.length} routes catalogued — external Playwright test required`,
      summary: 'Internal check complete. Real browser test required on gannonwaye.com. Download test pack from Playwright Test Centre.',
      source: 'QACommandCentre',
      requires_action: true,
      linked_route: '/admin/qa-command-centre',
    }).catch(() => {});

    toast({ title: `${ROUTES_TO_TEST.length} routes catalogued. External Playwright test required — see test pack.` });
  };

  const passed = Object.values(testResults).filter(r => r.status === 'passed').length;
  const failed = Object.values(testResults).filter(r => r.status === 'failed').length;
  const pending = Object.values(testResults).filter(r => r.status === 'pending').length;
  const needsManual = Object.values(testResults).filter(r => r.status === 'needs_manual').length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">QA Command Centre</h1>
            <p className="text-sm text-muted-foreground mt-1">{ROUTES_TO_TEST.length} routes catalogued. External Playwright test required for full browser validation.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/playwright-test-centre"><Button variant="outline" size="sm"><FileText className="w-3 h-3 mr-1" />Playwright Test Pack</Button></Link>
          <Link to="/admin/developer-handoff"><Button variant="outline" size="sm">Dev Handoff</Button></Link>
          <Button size="sm" onClick={runInternalRouteCheck} disabled={running}>
            {running ? <><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Checking...</> : <><Play className="w-3 h-3 mr-1" />Run Route Catalogue</>}
          </Button>
        </div>
      </div>

      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-300 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-orange-200">External Playwright Required</p>
            <p className="text-orange-100/80 mt-1">Base44 cannot run a real browser test against gannonwaye.com from inside the builder. Download the Playwright test pack from the Test Centre and run it externally on the live domain.</p>
            <div className="flex gap-2 mt-2">
              <Link to="/admin/playwright-test-centre"><Button size="sm" className="gradient-gold-button">Get Playwright Test Pack</Button></Link>
              <a href="https://gannonwaye.com/admin" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Open Live Site</Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Total Routes', ROUTES_TO_TEST.length, 'text-foreground'],
          ['Passed', passed, 'text-green-400'],
          ['Failed', failed, 'text-red-400'],
          ['Needs Manual', needsManual || ROUTES_TO_TEST.length, 'text-yellow-400'],
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
              <div><p className="text-xs text-muted-foreground">How to Test</p><p>Open on gannonwaye.com{selected.loginRequired ? ' while logged in as admin' : ''}</p></div>
            </div>
            <div className="rounded-lg border border-border/50 p-3 text-xs text-muted-foreground">
              External Playwright test command: <code className="ml-1">npx playwright test --grep "{selected.route}"</code>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}><ArrowLeft className="w-3 h-3 mr-1" />Close</Button>
              <a href={`https://gannonwaye.com${selected.route}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Open on Live Site</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}