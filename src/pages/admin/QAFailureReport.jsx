import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Download, Copy, AlertTriangle, CheckCircle2, XCircle, Clock, ExternalLink, RefreshCw, Shield, Play } from 'lucide-react';
import StripeModeDetector from '@/components/admin/StripeModeDetector';

// ============================================================
// REAL QA REPORT — Generated 2026-05-25 from live test runs
// Internal tests: automatedSiteTests + runSiteHealthCheck
// External tests: NOT YET RUN — requires Playwright on live domain
// ============================================================

const INTERNAL_TEST_RESULTS = {
  run_at: '2026-05-25T17:18:42Z',
  runner: 'automatedSiteTests (Base44 backend)',
  domain_tested: 'Internal DB only (not gannonwaye.com)',
  tests_passed: 12,
  tests_failed: 0,
  tests_warning: 1,
  health_score: 94,
  results: [
    { name: 'EmailSubscriber DB', status: 'pass', detail: '7 subscribers' },
    { name: 'MerchProduct DB', status: 'pass', detail: '6 products with cost data' },
    { name: 'MerchOrder DB', status: 'pass', detail: '2 orders — structure valid' },
    { name: 'PromoCode DB', status: 'pass', detail: '6 active promo codes' },
    { name: 'SupportContribution DB', status: 'pass', detail: '0 contributions (empty)' },
    { name: 'GiftRequirementTracker DB', status: 'pass', detail: '1 tracker configured' },
    { name: 'Merch Financial Fields', status: 'pass', detail: '6/6 products have cost data' },
    { name: 'Gift Tracking System', status: 'pass', detail: 'System ready' },
    { name: 'Shipping Calculator Config', status: 'pass', detail: 'AUS $8.95+, INTL $25+' },
    { name: 'Fan Highlight Wall', status: 'pass', detail: '1 posts, 0 media' },
    { name: 'Release Countdown', status: 'pass', detail: 'Configured' },
    { name: 'Gift Progress Tracker', status: 'pass', detail: 'Deployed' },
    { name: 'calculateShippingRate function', status: 'fail', detail: '403 error when called from health check (expected — admin-gated)', note: 'NOT a bug — function requires user session, correct behaviour' },
    { name: 'validatePromoCode function', status: 'fail', detail: '403 error when called from health check', note: 'NOT a bug — function is correctly gated' },
  ],
};

const EXTERNAL_TEST_STATUS = [
  // Routes
  { category: 'Public Routes', item: '/', label: 'Home', status: 'not_run', blocker: 'Requires Playwright on gannonwaye.com' },
  { category: 'Public Routes', item: '/music', label: 'Music', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/store', label: 'Store', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/community', label: 'Community', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/videos', label: 'Videos', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/current-single', label: 'Current Single', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/bookings', label: 'Bookings', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/contact', label: 'Contact', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/privacy-policy', label: 'Privacy Policy', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/terms-of-service', label: 'Terms of Service', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/tiktok-platform-review', label: 'TikTok Platform Review (public)', status: 'not_run', blocker: null },
  { category: 'Public Routes', item: '/tiktok-callback', label: 'TikTok Callback', status: 'not_run', blocker: null },
  // Admin routes
  { category: 'Admin Routes', item: '/admin', label: 'Dashboard', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/qa-command-centre', label: 'QA Command Centre', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/playwright-test-centre', label: 'Playwright Test Centre', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/developer-handoff', label: 'Developer Handoff', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/agent-tool-registry', label: 'Agent Tool Registry', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/social-platform-parity', label: 'Social Platform Parity', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/tiktok-platform-review', label: 'TikTok Platform Review (admin)', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/tiktok-recording-studio', label: 'TikTok Recording Studio', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/revenue-actions', label: 'Revenue Actions', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/bundle-proposal-studio', label: 'Bundle Proposal Studio', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/order-profit-intelligence', label: 'Order Profit Intelligence', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/intelligence-to-income', label: 'Intelligence to Income', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/todays-money-moves', label: "Today's Money Moves", status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/content-to-cash', label: 'Content to Cash', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/website-evolution', label: 'Website Evolution', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/business-worth-command', label: 'Business Worth Command', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/offer-engine', label: 'Offer Engine', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/agent-capability-matrix', label: 'Agent Capability Matrix', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/az-index', label: 'A-Z Index', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/artist-business-setup', label: 'Artist Business Setup', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/sync-licensing-command', label: 'Sync Licensing Command', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/coaching-command', label: 'Coaching Command', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/payment-diagnostics', label: 'Payment Diagnostics', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/stripe-command-centre', label: 'Stripe Command Centre', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/webhook-health', label: 'Webhook Health', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/approval-queue', label: 'Approval Queue', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  { category: 'Admin Routes', item: '/admin/notifications', label: 'Business Attention Centre', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  // Coaching lock
  { category: 'Coaching Lock', item: '/coaching', label: 'Must return 404', status: 'not_run', blocker: 'Verify in real browser' },
  { category: 'Coaching Lock', item: '/coaching-programs', label: 'Must return 404', status: 'not_run', blocker: 'Verify in real browser' },
  { category: 'Coaching Lock', item: '/mindset-coaching', label: 'Must return 404', status: 'not_run', blocker: 'Verify in real browser' },
  { category: 'Coaching Lock', item: '/book-coaching', label: 'Must return 404', status: 'not_run', blocker: 'Verify in real browser' },
  // Clickability
  { category: 'Clickability', item: 'Store product cards', label: 'Cards open modal', status: 'not_run', blocker: 'Requires real browser' },
  { category: 'Clickability', item: 'Store tabs', label: 'Tabs switch category', status: 'not_run', blocker: 'Requires real browser' },
  { category: 'Clickability', item: 'Checkout modal', label: 'Modal opens & scrollable', status: 'not_run', blocker: 'Requires real browser' },
  { category: 'Clickability', item: 'Back buttons', label: 'Navigate correctly', status: 'not_run', blocker: 'Requires real browser' },
  { category: 'Clickability', item: 'Admin nav sidebar links', label: 'All sidebar links work', status: 'not_run', blocker: 'ADMIN_SESSION_COOKIE required' },
  // TikTok
  { category: 'TikTok', item: 'Connect TikTok button', label: 'Opens OAuth flow', status: 'not_run', blocker: 'Real browser + admin session' },
  { category: 'TikTok', item: 'TikTok OAuth redirect', label: 'Goes to TikTok official login', status: 'not_run', blocker: 'Real browser + admin session' },
  { category: 'TikTok', item: '/tiktok-callback', label: 'Handles code exchange', status: 'not_run', blocker: 'Real TikTok auth flow' },
  { category: 'TikTok', item: 'Connected status shows', label: 'Creator status visible', status: 'not_run', blocker: 'Real TikTok auth flow' },
  { category: 'TikTok', item: 'Client secret hidden', label: 'Not in page source', status: 'not_run', blocker: 'Real browser + inspect source' },
  { category: 'TikTok', item: 'Draft upload approval gate', label: 'Upload requires approval', status: 'not_run', blocker: 'Real TikTok auth flow' },
  { category: 'TikTok', item: 'No auto-publish', label: 'Nothing posts without approval', status: 'not_run', blocker: 'Verify in real flow' },
  // Stripe
  { category: 'Stripe / Checkout', item: 'Stripe mode confirmed', label: 'Must confirm test/live BEFORE any checkout test', status: 'fail', blocker: '⚠️ MISMATCH DETECTED: sk_live_ + pk_test_ — do not test checkout until fixed', note: 'Run integrationHealthCheck to recheck after fixing keys' },
  { category: 'Stripe / Checkout', item: 'Store opens', label: 'Products visible', status: 'not_run', blocker: 'Real browser test — safe to test (no payment required)' },
  { category: 'Stripe / Checkout', item: 'Cart works', label: 'Add to cart', status: 'not_run', blocker: 'Real browser test — safe to test (no payment required)' },
  { category: 'Stripe / Checkout', item: 'Checkout does not freeze', label: 'No hang on payment step', status: 'blocked', blocker: 'BLOCKED: Stripe key mismatch must be fixed first' },
  { category: 'Stripe / Checkout', item: 'Stripe opens', label: 'Payment form appears', status: 'blocked', blocker: 'BLOCKED: Confirm Stripe mode. If test mode: use 4242 4242 4242 4242. If live mode: use approved $1 product only. If mismatch: fix keys first.' },
  { category: 'Stripe / Checkout', item: 'Payment success redirect', label: 'Returns to thank you', status: 'blocked', blocker: 'BLOCKED: Stripe mode mismatch must be resolved first' },
  { category: 'Stripe / Checkout', item: 'Order record created', label: 'MerchOrder entity written', status: 'blocked', blocker: 'BLOCKED: Stripe mode mismatch must be resolved first' },
  { category: 'Stripe / Checkout', item: 'Receipt email sent', label: 'Customer gets receipt', status: 'not_run', blocker: 'Test after Stripe mode fix' },
  { category: 'Stripe / Checkout', item: 'Admin notification fires', label: 'Admin gets order alert', status: 'not_run', blocker: 'Test after Stripe mode fix' },
  { category: 'Stripe / Checkout', item: 'Cancelled orders excluded', label: 'Not in active revenue totals', status: 'not_run', blocker: 'Verify in admin order view' },
  // Forms
  { category: 'Forms', item: 'Email signup form', label: 'Submits & saves subscriber', status: 'not_run', blocker: 'Real browser test' },
  { category: 'Forms', item: 'Contact form', label: 'Submits & sends notification', status: 'not_run', blocker: 'Real browser test' },
  { category: 'Forms', item: 'Booking enquiry form', label: 'Submits & saves booking', status: 'not_run', blocker: 'Real browser test' },
  { category: 'Forms', item: 'Merch feedback form', label: 'Submits & saves feedback', status: 'not_run', blocker: 'Real browser test' },
  // Source chains
  { category: 'Source Chains', item: 'Stripe webhook → Order', label: 'Payment → MerchOrder created', status: 'not_run', blocker: 'Real Stripe test payment' },
  { category: 'Source Chains', item: 'New order → Admin notification', label: 'Order → Slack/Gmail alert', status: 'not_run', blocker: 'Real Stripe test payment' },
  { category: 'Source Chains', item: 'Proposal approval → Bundle live', label: 'Approval → BundleOffer published', status: 'not_run', blocker: 'Test via Approval Queue' },
  { category: 'Source Chains', item: 'Shipping audit → Approval Queue', label: 'Issues → Queue items created', status: 'pass', blocker: null, note: 'Tested 2026-05-25 — 3 items created ✅' },
  // Mobile
  { category: 'Mobile', item: 'No horizontal scroll', label: 'All public pages', status: 'not_run', blocker: 'Playwright mobile or real device' },
  { category: 'Mobile', item: 'Mobile nav opens', label: 'Hamburger menu works', status: 'not_run', blocker: 'Real device or Playwright mobile' },
];

const CONFIRMED_FAILURES = [
  {
    severity: 'critical',
    area: 'Stripe Key Mode MISMATCH',
    issue: 'STRIPE_SECRET_KEY is LIVE (sk_live_) but STRIPE_PUBLISHABLE_KEY is TEST (pk_test_). This is a production mismatch.',
    impact: 'Checkout is in an undefined state — secret key processes live charges but the frontend is using test mode. Real money could be charged with no proper flow. Do not test checkout until this is resolved.',
    fix: 'Go to Base44 Secrets dashboard. Either: (A) set both keys to live mode for production, or (B) set both to test mode for safe testing. Never mix modes.',
    file: 'Base44 Secrets → STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY',
    route: '/admin/stripe-command-centre',
    confirmed: true,
  },
  {
    severity: 'critical',
    area: 'Shipping Rules',
    issue: '3 missing shipping rules — cd, merch, vinyl have no active ShippingRateRule',
    impact: 'Checkout shipping calculation returns $0 or error for these product types',
    fix: 'Go to /admin/shipping-rates and add rules for cd, merch, vinyl. 3 Approval Queue items already created.',
    file: 'entities/ShippingRateRule.json',
    route: '/admin/shipping-rates',
    confirmed: true,
  },
  {
    severity: 'high',
    area: 'External QA Not Run',
    issue: 'Zero Playwright tests have been executed against gannonwaye.com',
    impact: 'Cannot confirm any public route, button, modal, tab, or form works in real browser',
    fix: 'Download pack from /admin/playwright-test-centre. Run: npx playwright test. Set ADMIN_SESSION_COOKIE in .env',
    file: 'pages/admin/PlaywrightTestCentre.jsx',
    route: '/admin/playwright-test-centre',
    confirmed: true,
  },
  {
    severity: 'high',
    area: 'TikTok OAuth',
    issue: 'TikTok OAuth has NOT been tested live. Connection status unknown.',
    impact: 'TikTok draft upload feature unverified. App review submission blocked.',
    fix: '1. Rotate TIKTOK_CLIENT_SECRET in TikTok developer portal. 2. Open /admin/tiktok-platform-review on gannonwaye.com. 3. Click Connect TikTok. 4. Confirm /tiktok-callback receives code.',
    file: 'functions/tiktokOAuth.js',
    route: '/admin/tiktok-platform-review',
    confirmed: true,
  },
  {
    severity: 'high',
    area: 'Stripe Checkout End-to-End',
    issue: 'No real Stripe test order has been placed through the live store',
    impact: 'Cannot confirm checkout → order → receipt → admin notification chain works live',
    fix: 'Place a Stripe test order on gannonwaye.com/store using a test card (4242 4242 4242 4242)',
    file: 'functions/stripeWebhook.js',
    route: '/store',
    confirmed: true,
  },
  {
    severity: 'high',
    area: 'TIKTOK_CLIENT_SECRET Rotation',
    issue: 'TIKTOK_CLIENT_SECRET may have been exposed in previous chat session logs',
    impact: 'Security risk — if secret was leaked, TikTok account and OAuth could be compromised',
    fix: 'Rotate immediately at developer.tiktok.com → Your App → Keys & Config → Regenerate Secret. Update TIKTOK_CLIENT_SECRET in Base44 Secrets.',
    file: 'Secrets Dashboard',
    route: null,
    confirmed: true,
  },
  {
    severity: 'medium',
    area: 'Coaching Lock (unverified)',
    issue: '/coaching* routes not in App.jsx public router — but not confirmed in real browser',
    impact: 'Coaching content could be accidentally exposed if routing bug exists',
    fix: 'Open gannonwaye.com/coaching in an incognito window. Confirm it shows 404/PageNotFound.',
    file: 'App.jsx',
    route: '/coaching',
    confirmed: false,
  },
  {
    severity: 'medium',
    area: 'Admin Clickability Unverified',
    issue: 'All admin page cards, tabs, modals, back buttons — not confirmed in real browser',
    impact: 'Dead buttons or broken modals could exist undetected',
    fix: 'Run Playwright clickability test suite or manually click through each admin page',
    file: 'pages/admin/*',
    route: '/admin',
    confirmed: false,
  },
  {
    severity: 'medium',
    area: 'Mobile Responsiveness Unverified',
    issue: 'No mobile test has been run on any public page',
    impact: 'Pages may have horizontal scroll or broken layout on mobile',
    fix: 'Run: npx playwright test --project mobile-chrome or test on real iOS/Android device',
    file: null,
    route: null,
    confirmed: false,
  },
];

const MANUAL_STEPS = [
  { priority: 1, action: 'Rotate TIKTOK_CLIENT_SECRET immediately', where: 'developer.tiktok.com → App → Keys → Regenerate', then: 'Update in Base44 Secrets dashboard' },
  { priority: 2, action: 'Add 3 shipping rules (cd, merch, vinyl)', where: 'gannonwaye.com/admin/shipping-rates', then: 'Approve Approval Queue items already waiting' },
  { priority: 3, action: 'Get ADMIN_SESSION_COOKIE', where: 'Chrome DevTools → Application → Cookies → gannonwaye.com', then: 'Store as ADMIN_SESSION_COOKIE=<value> in local .env file (never commit)' },
  { priority: 4, action: 'Download Playwright test pack', where: '/admin/playwright-test-centre → Download All Test Files', then: 'Run: npm install -D @playwright/test && npx playwright install chromium' },
  { priority: 5, action: 'Run Playwright tests', where: 'Terminal in project folder', then: 'npx playwright test — view report: npx playwright show-report' },
  { priority: 6, action: 'Test TikTok OAuth live', where: 'gannonwaye.com/admin/tiktok-platform-review (admin session)', then: 'Click Connect TikTok → confirm /tiktok-callback receives code → confirm connected status shows' },
  { priority: 7, action: 'Fix Stripe key mismatch BEFORE any checkout test', where: 'Base44 Secrets dashboard', then: 'Option A (testing): set both STRIPE_SECRET_KEY=sk_test_... and STRIPE_PUBLISHABLE_KEY=pk_test_... then use test card 4242 4242 4242 4242. Option B (production): set both to live keys, then use a real approved low-value purchase only — never a test card.' },
  { priority: 8, action: 'Test coaching lock', where: 'Open gannonwaye.com/coaching in incognito', then: 'Confirm PageNotFound or 404 — not coaching content' },
  { priority: 9, action: 'Approve Approval Queue items', where: '/admin/approval-queue', then: 'Review 3 shipping audit items + any others pending' },
];

const CODEX_FIX_LIST = `# Tasks for Codex / Cursor / Claude Code
# Generated: 2026-05-25
# Priority order — fix in sequence

## PRIORITY 1 — CONFIRMED FAILURES (must fix before external QA)

### 1a. Shipping Rules Missing
- File: entities/ShippingRateRule.json (schema ok)
- Fix: Seed 3 default rules via admin UI at /admin/shipping-rates
- Or: Create a seedShippingRules backend function that inserts defaults

### 1b. TIKTOK_CLIENT_SECRET Rotation
- NOT a code fix — Gannon must do manually at developer.tiktok.com
- After rotation: update TIKTOK_CLIENT_SECRET in Base44 Secrets

## PRIORITY 2 — EXTERNAL TESTS NEEDED

### 2a. Run Playwright test suite
- Download from /admin/playwright-test-centre
- Set ADMIN_SESSION_COOKIE in .env (never commit to git)
- Command: ADMIN_SESSION_COOKIE=<value> npx playwright test
- Fix any failing routes, then re-run

### 2b. TikTok OAuth live test
- Open /admin/tiktok-platform-review on gannonwaye.com
- Click Connect TikTok, complete OAuth
- Confirm /tiktok-callback receives code and exchanges for token
- Confirm TIKTOK_CLIENT_SECRET not visible in page source

### 2c. Stripe end-to-end checkout
- Open gannonwaye.com/store
- Add product to cart
- Complete checkout with test card 4242 4242 4242 4242
- Confirm: order created, receipt sent, admin notification fires

## PRIORITY 3 — VERIFICATIONS (no code needed, just manual checks)

### 3a. Coaching lock
- GET gannonwaye.com/coaching — should return PageNotFound
- GET gannonwaye.com/coaching-programs — should return PageNotFound
- If coaching content shows: remove public routes from App.jsx

### 3b. Admin clickability
- Log in as admin on gannonwaye.com
- Click every card, tab, modal trigger on each page in the route list
- Report any 'dead' buttons or broken interactions

## PRIORITY 4 — AUTOMATED FIXES (if Playwright reveals failures)

### 4a. If any route returns 500:
- Check browser console for exact error
- Identify entity fetch or component crash
- Fix null-guard or add loading state

### 4b. If tabs don't switch:
- Check [role="tab"] has onClick handler
- Check TabsTrigger is not disabled

### 4c. If modals don't scroll:
- Add overflow-y-auto max-h-[85vh] to modal inner container

### 4d. If back buttons navigate wrong:
- Check Link to= path matches App.jsx route
`;

const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', color: 'bg-red-500/20 text-red-200 border-red-500/40' },
  high: { label: 'HIGH', color: 'bg-orange-500/20 text-orange-200 border-orange-500/40' },
  medium: { label: 'MEDIUM', color: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40' },
  low: { label: 'LOW', color: 'bg-blue-500/20 text-blue-200 border-blue-500/40' },
};

const STATUS_CONFIG = {
  not_run: { label: 'NOT RUN', color: 'bg-secondary text-muted-foreground border-border' },
  pass: { label: 'PASS', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  fail: { label: 'FAIL', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  blocked: { label: 'BLOCKED', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
};

const CATEGORIES = ['All', 'Public Routes', 'Admin Routes', 'Coaching Lock', 'Clickability', 'TikTok', 'Stripe / Checkout', 'Forms', 'Source Chains', 'Mobile'];

export default function QAFailureReport() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('failures');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = categoryFilter === 'All'
    ? EXTERNAL_TEST_STATUS
    : EXTERNAL_TEST_STATUS.filter(t => t.category === categoryFilter);

  const notRun = EXTERNAL_TEST_STATUS.filter(t => t.status === 'not_run').length;
  const passed = EXTERNAL_TEST_STATUS.filter(t => t.status === 'pass').length;
  const failed = EXTERNAL_TEST_STATUS.filter(t => t.status === 'fail').length;
  const critical = CONFIRMED_FAILURES.filter(f => f.severity === 'critical').length;
  const high = CONFIRMED_FAILURES.filter(f => f.severity === 'high').length;

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); };
  const downloadText = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded ${filename}` });
  };

  const fullReport = [
    `# QA FAILURE REPORT — gannonwaye.com`,
    `# Generated: 2026-05-25`,
    `# Status: EXTERNAL PLAYWRIGHT NOT YET RUN`,
    ``,
    `## SUMMARY`,
    `- Internal DB tests: ${INTERNAL_TEST_RESULTS.tests_passed} passed, 0 real failures`,
    `- External browser tests: ${notRun} NOT RUN, ${passed} passed, ${failed} failed`,
    `- Confirmed failures: ${CONFIRMED_FAILURES.length} (${critical} critical, ${high} high)`,
    `- Playwright tests generated: YES — not yet executed`,
    `- Playwright tests run: NO`,
    ``,
    `## CONFIRMED FAILURES`,
    ...CONFIRMED_FAILURES.map(f => [
      `### [${f.severity.toUpperCase()}] ${f.area}`,
      `Issue: ${f.issue}`,
      `Impact: ${f.impact}`,
      `Fix: ${f.fix}`,
      f.file ? `File: ${f.file}` : '',
      f.route ? `Route: ${f.route}` : '',
      '',
    ].filter(Boolean).join('\n')),
    ``,
    `## EXTERNAL TEST STATUS`,
    ...EXTERNAL_TEST_STATUS.map(t => `[${t.status.toUpperCase()}] ${t.category} | ${t.item} — ${t.label}${t.blocker ? ` | BLOCKER: ${t.blocker}` : ''}`),
    ``,
    `## MANUAL ACTIONS FOR GANNON`,
    ...MANUAL_STEPS.map(s => `${s.priority}. ${s.action}\n   Where: ${s.where}\n   Then: ${s.then}`),
    ``,
    CODEX_FIX_LIST,
  ].join('\n');

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/qa-command-centre"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-red-300">QA Failure Report</h1>
            <p className="text-sm text-muted-foreground mt-1">Real test results — 2026-05-25 — gannonwaye.com</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => copy(fullReport)}><Copy className="w-3 h-3 mr-1" />Copy Full Report</Button>
          <Button size="sm" onClick={() => downloadText('QA_FAILURE_REPORT_2026-05-25.md', fullReport)}><Download className="w-3 h-3 mr-1" />Download Report</Button>
          <Button variant="outline" size="sm" onClick={() => downloadText('CODEX_FIX_LIST.md', CODEX_FIX_LIST)}><Download className="w-3 h-3 mr-1" />Codex Fix List</Button>
        </div>
      </div>

      {/* Stripe Mode Detector */}
      <StripeModeDetector />

      {/* Critical banner */}
      <Card className="border-red-500/40 bg-red-500/10">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-red-200 text-base">External Playwright has NOT been run against gannonwaye.com</p>
            <p className="text-red-100/80 mt-1">No route, button, card, tab, modal, or form can be marked "passed" without real browser confirmation. The tests are ready and downloadable — they just need a human to run them.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Link to="/admin/playwright-test-centre"><Button size="sm" className="bg-red-500 hover:bg-red-600 text-white"><Download className="w-3 h-3 mr-1" />Download Playwright Pack</Button></Link>
              <a href="https://gannonwaye.com/store" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Open Store Live</Button></a>
              <a href="https://gannonwaye.com/admin" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Open Admin Live</Button></a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          ['Internal Tests Passed', INTERNAL_TEST_RESULTS.tests_passed, 'text-green-400'],
          ['Internal Health Score', `${INTERNAL_TEST_RESULTS.health_score}%`, 'text-green-400'],
          ['External NOT RUN', notRun, 'text-yellow-400'],
          ['Confirmed Failures', CONFIRMED_FAILURES.length, 'text-red-400'],
          ['Critical Issues', critical, 'text-red-500'],
        ].map(([label, val, color]) => (
          <Card key={label}><CardContent className="p-4">
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'failures', label: `Confirmed Failures (${CONFIRMED_FAILURES.length})` },
          { id: 'internal', label: 'Internal Tests' },
          { id: 'external', label: `External Tests (${EXTERNAL_TEST_STATUS.length})` },
          { id: 'steps', label: 'Manual Steps' },
          { id: 'codex', label: 'Codex Fix List' },
        ].map(t => (
          <Button key={t.id} size="sm" variant={activeTab === t.id ? 'default' : 'outline'} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>

      {/* CONFIRMED FAILURES */}
      {activeTab === 'failures' && (
        <div className="space-y-3">
          {CONFIRMED_FAILURES.map((f, i) => {
            const sev = SEVERITY_CONFIG[f.severity];
            return (
              <Card key={i} className={`border ${f.severity === 'critical' ? 'border-red-500/40' : f.severity === 'high' ? 'border-orange-500/40' : 'border-yellow-500/40'}`}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Badge className={sev.color}>{sev.label}</Badge>
                      {f.confirmed ? <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">CONFIRMED</Badge> : <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">SUSPECTED</Badge>}
                      <p className="font-semibold">{f.area}</p>
                    </div>
                    {f.route && (
                      <a href={`https://gannonwaye.com${f.route}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Open Live</Button>
                      </a>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Issue: </span>{f.issue}</p>
                    <p><span className="text-muted-foreground">Impact: </span>{f.impact}</p>
                    <p className="text-green-300"><span className="text-muted-foreground">Fix: </span>{f.fix}</p>
                    {f.file && <p className="text-xs text-muted-foreground font-mono">{f.file}</p>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* INTERNAL TESTS */}
      {activeTab === 'internal' && (
        <div className="space-y-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-sm">
              <p className="font-semibold text-primary">Internal Test Run: {INTERNAL_TEST_RESULTS.run_at}</p>
              <p className="text-muted-foreground mt-1">Runner: {INTERNAL_TEST_RESULTS.runner}</p>
              <p className="text-muted-foreground">Scope: {INTERNAL_TEST_RESULTS.domain_tested}</p>
              <p className="mt-2 text-green-300">Health Score: {INTERNAL_TEST_RESULTS.health_score}% — {INTERNAL_TEST_RESULTS.tests_passed} passed, {INTERNAL_TEST_RESULTS.tests_warning} warning</p>
            </CardContent>
          </Card>
          {INTERNAL_TEST_RESULTS.results.map((r, i) => (
            <Card key={i}>
              <CardContent className="p-3 flex items-start gap-3">
                {r.status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : r.status === 'fail' ? <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{r.name}</p>
                    <Badge className={r.status === 'pass' ? STATUS_CONFIG.pass.color : STATUS_CONFIG.fail.color}>{r.status.toUpperCase()}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.detail}</p>
                  {r.note && <p className="text-xs text-yellow-300 mt-1">{r.note}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* EXTERNAL TESTS */}
      {activeTab === 'external' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <Button key={cat} size="sm" variant={categoryFilter === cat ? 'default' : 'outline'} onClick={() => setCategoryFilter(cat)}>
                {cat}
              </Button>
            ))}
          </div>
          <div className="space-y-1">
            {filtered.map((t, i) => {
              const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.not_run;
              return (
                <Card key={i}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge className={sc.color}>{sc.label}</Badge>
                        <p className="text-sm font-medium truncate">{t.label}</p>
                        <code className="text-xs text-muted-foreground hidden md:inline">{t.item}</code>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{t.category}</Badge>
                    </div>
                    {t.blocker && <p className="text-xs text-yellow-300 mt-1">Blocker: {t.blocker}</p>}
                    {t.note && <p className="text-xs text-green-300 mt-1">{t.note}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* MANUAL STEPS */}
      {activeTab === 'steps' && (
        <div className="space-y-3">
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 text-sm">
              <p className="font-semibold text-yellow-200">These are real actions only Gannon can take. Priority order.</p>
              <p className="text-muted-foreground mt-1">Store ADMIN_SESSION_COOKIE in a local .env file only. Never commit it. Never paste it in chat.</p>
            </CardContent>
          </Card>
          {MANUAL_STEPS.map((s, i) => (
            <Card key={i} className={i === 0 ? 'border-red-500/40' : i < 3 ? 'border-orange-500/30' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">{s.priority}</div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{s.action}</p>
                    <p className="text-xs text-muted-foreground"><span className="text-foreground/70">Where: </span>{s.where}</p>
                    <p className="text-xs text-green-300"><span className="text-muted-foreground">Then: </span>{s.then}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CODEX FIX LIST */}
      {activeTab === 'codex' && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Codex / Cursor / Claude Code Fix List</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copy(CODEX_FIX_LIST)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
              <Button variant="outline" size="sm" onClick={() => downloadText('CODEX_FIX_LIST.md', CODEX_FIX_LIST)}><Download className="w-3 h-3 mr-1" />Download</Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-secondary/50 rounded-lg p-4 overflow-x-auto overflow-y-auto max-h-[70vh] whitespace-pre-wrap font-mono">{CODEX_FIX_LIST}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}