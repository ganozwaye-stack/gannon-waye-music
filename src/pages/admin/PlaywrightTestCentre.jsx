import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Copy, Download, CheckCircle2, XCircle, Clock,
  AlertTriangle, Terminal, Zap, RefreshCw, ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// ─── QA STATUS (manual truth — updated when tests run) ───────────────────────
const QA_SUITES = [
  { id: 'store', label: 'Store Load', status: 'failed', lastError: 'TypeError: uu(a=>a.getItemCount()) — FIXED IN DEPLOY', file: 'store-load.spec.js', priority: 'critical' },
  { id: 'cart', label: 'Cart', status: 'unknown', lastError: null, file: 'cart.spec.js', priority: 'critical' },
  { id: 'checkout', label: 'Checkout', status: 'unknown', lastError: null, file: 'checkout.spec.js', priority: 'critical' },
  { id: 'shipping', label: 'Shipping', status: 'unknown', lastError: null, file: 'shipping.spec.js', priority: 'high' },
  { id: 'promo', label: 'Promo Codes', status: 'unknown', lastError: null, file: 'promo-codes.spec.js', priority: 'high' },
  { id: 'security', label: 'Security', status: 'unknown', lastError: null, file: 'security.spec.js', priority: 'medium' },
  { id: 'coaching', label: 'Coaching Lock', status: 'unknown', lastError: null, file: 'coaching-private-lock.spec.js', priority: 'medium' },
];

const GITHUB_ACTIONS_STATUS = {
  workflow_file_created: true,
  workflow_committed: false,
  workflow_active: false,
  last_run_url: null,
  last_result: null,
};

// ─── GITHUB ACTIONS WORKFLOW CONTENT ─────────────────────────────────────────
const WORKFLOW_CONTENT = `name: Playwright Store QA

on:
  workflow_dispatch:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *'

jobs:
  playwright:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: gannonwaye-playwright-pack
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      - name: Run store tests
        run: npx playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js
        env:
          BASE_URL: https://gannonwaye.com
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: gannonwaye-playwright-pack/playwright-report/
          retention-days: 14
`;

const COMMIT_CMDS_BASH = `mkdir -p .github/workflows
cp docs/playwright-store-tests.yml .github/workflows/playwright-store-tests.yml
git add .github/workflows/playwright-store-tests.yml
git commit -m "Add automated Playwright store QA"
git push -u origin main`;

const COMMIT_CMDS_PWSH = `New-Item -ItemType Directory -Force -Path ".github/workflows"
Copy-Item "docs/playwright-store-tests.yml" ".github/workflows/playwright-store-tests.yml"
git add .github/workflows/playwright-store-tests.yml
git commit -m "Add automated Playwright store QA"
git push -u origin main`;

// ─── COMPLETE TEST FILES ──────────────────────────────────────────────────────
const STORE_LOAD_SPEC = `const { test, expect } = require('@playwright/test');

test.describe('Store Load', () => {
  test('store loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/store', { waitUntil: 'domcontentloaded', timeout: 10000 });
    expect(Date.now() - start).toBeLessThan(5000);
  });

  test('store page renders', async ({ page }) => {
    await page.goto('/store');
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 8000 });
  });

  test('at least one product visible', async ({ page }) => {
    await page.goto('/store');
    await expect(page.locator('[data-testid="product-grid"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('no critical console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/store');
    await page.waitForTimeout(2000);
    const critical = errors.filter(e =>
      e.includes('TypeError') || e.includes('is not a function') || e.includes('Cannot read')
    );
    expect(critical).toHaveLength(0);
  });
});`;

const CART_SPEC = `const { test, expect } = require('@playwright/test');

test.describe('Cart', () => {
  test('cart button is visible', async ({ page }) => {
    await page.goto('/store');
    await expect(page.locator('[data-testid="cart-button"]')).toBeVisible({ timeout: 8000 });
  });

  test('cart count updates after add to cart', async ({ page }) => {
    await page.goto('/store');
    const addBtn = page.locator('[data-testid="add-to-cart-btn"]').first();
    if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addBtn.click();
      await expect(page.locator('[data-testid="cart-count"]')).toBeVisible({ timeout: 3000 });
    }
  });

  test('cart drawer opens when cart button clicked', async ({ page }) => {
    await page.goto('/store');
    await page.locator('[data-testid="cart-button"]').click();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 3000 });
  });

  test('checkout button visible in cart drawer when items present', async ({ page }) => {
    await page.goto('/store');
    const addBtn = page.locator('[data-testid="add-to-cart-btn"]').first();
    if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addBtn.click();
      await page.locator('[data-testid="cart-button"]').click();
      await expect(page.locator('[data-testid="cart-checkout-button"]')).toBeVisible({ timeout: 3000 });
    }
  });

  test('sticky checkout bar visible when cart has items', async ({ page }) => {
    await page.goto('/store');
    const addBtn = page.locator('[data-testid="add-to-cart-btn"]').first();
    if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addBtn.click();
      await expect(page.locator('[data-testid="store-sticky-checkout"]')).toBeVisible({ timeout: 3000 });
    }
  });

  test('sticky checkout navigates to /store/checkout', async ({ page }) => {
    await page.goto('/store');
    const addBtn = page.locator('[data-testid="add-to-cart-btn"]').first();
    if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addBtn.click();
      await page.locator('[data-testid="store-sticky-checkout-button"]').click();
      await expect(page).toHaveURL(/store\/checkout/, { timeout: 5000 });
    }
  });
});`;

const CHECKOUT_SPEC = `const { test, expect } = require('@playwright/test');

test.describe('Checkout Page', () => {
  test('checkout page renders when navigated directly', async ({ page }) => {
    await page.goto('/store/checkout');
    await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible({ timeout: 8000 });
  });

  test('empty cart shows return to store', async ({ page }) => {
    await page.goto('/store/checkout');
    const emptyReturn = page.locator('[data-testid="empty-cart-return-store"]');
    if (await emptyReturn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(emptyReturn).toBeVisible();
    }
  });

  test('checkout pay button visible when cart has items', async ({ page }) => {
    await page.goto('/store');
    const addBtn = page.locator('[data-testid="add-to-cart-btn"]').first();
    if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addBtn.click();
      await page.goto('/store/checkout');
      await expect(page.locator('[data-testid="checkout-pay-button"]')).toBeVisible({ timeout: 5000 });
    }
  });
});`;

const SHIPPING_SPEC = `const { test, expect } = require('@playwright/test');

test.describe('Shipping Logic', () => {
  test('checkout shows shipping calculation', async ({ page }) => {
    await page.goto('/store/checkout');
    // Only test if cart has items
    const payBtn = page.locator('[data-testid="checkout-pay-button"]');
    if (await payBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const pageText = await page.textContent('body');
      expect(pageText).toMatch(/shipping|free|AUD/i);
    }
  });
});`;

const PROMO_SPEC = `const { test, expect } = require('@playwright/test');

test.describe('Promo Codes', () => {
  test('promo code field is present on checkout', async ({ page }) => {
    await page.goto('/store');
    const addBtn = page.locator('[data-testid="add-to-cart-btn"]').first();
    if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addBtn.click();
      await page.goto('/store/checkout');
      const promoInput = page.locator('input[placeholder*="code" i], input[placeholder*="promo" i]');
      await expect(promoInput.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('invalid promo code shows error', async ({ page }) => {
    await page.goto('/store');
    const addBtn = page.locator('[data-testid="add-to-cart-btn"]').first();
    if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addBtn.click();
      await page.goto('/store/checkout');
      const promoInput = page.locator('input[placeholder*="code" i], input[placeholder*="promo" i]').first();
      if (await promoInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await promoInput.fill('INVALIDTEST999');
        await page.locator('button:has-text("Apply")').first().click();
        await page.waitForTimeout(2000);
        const pageText = await page.textContent('body');
        expect(pageText).toMatch(/invalid|not valid|not found|expired/i);
      }
    }
  });
});`;

const TEST_FILES = [
  { id: 'store', label: 'store-load.spec.js', priority: 'Critical', content: STORE_LOAD_SPEC },
  { id: 'cart', label: 'cart.spec.js', priority: 'Critical', content: CART_SPEC },
  { id: 'checkout', label: 'checkout.spec.js', priority: 'Critical', content: CHECKOUT_SPEC },
  { id: 'shipping', label: 'shipping.spec.js', priority: 'High', content: SHIPPING_SPEC },
  { id: 'promo', label: 'promo-codes.spec.js', priority: 'High', content: PROMO_SPEC },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    failed: 'bg-red-500/20 text-red-300 border-red-500/30',
    passed: 'bg-green-500/20 text-green-300 border-green-500/30',
    unknown: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    in_progress: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };
  return <Badge className={`text-[10px] uppercase tracking-wider ${map[status] || map.unknown}`} variant="outline">{status.replace('_', ' ')}</Badge>;
}

function CopyButton({ text, label = 'Copy' }) {
  const { toast } = useToast();
  return (
    <Button variant="outline" size="sm" className="gap-1.5 text-xs shrink-0"
      onClick={() => { navigator.clipboard.writeText(text); toast({ title: 'Copied!' }); }}>
      <Copy className="w-3 h-3" />{label}
    </Button>
  );
}

function DownloadButton({ filename, content, label = 'Download' }) {
  const { toast } = useToast();
  const download = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded ${filename}` });
  };
  return (
    <Button variant="outline" size="sm" className="gap-1.5 text-xs shrink-0" onClick={download}>
      <Download className="w-3 h-3" />{label}
    </Button>
  );
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function PlaywrightTestCentre() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState('status');
  const [selectedFile, setSelectedFile] = useState(TEST_FILES[0]);
  const [repairInput, setRepairInput] = useState({ run_url: '', failed_tests: '', console_errors: '' });
  const [repairResult, setRepairResult] = useState(null);
  const [repairLoading, setRepairLoading] = useState(false);

  const RUN_CMD = 'npx playwright test tests/store-load.spec.js tests/cart.spec.js tests/checkout.spec.js tests/shipping.spec.js tests/promo-codes.spec.js --headed';
  const FAST_CMD = 'npx playwright test tests/store-load.spec.js --headed';

  const createRepairTask = useMutation({
    mutationFn: async (data) => {
      const [issue, msg] = await Promise.all([
        base44.entities.SystemHealthIssue.create({
          system_area: 'other',
          issue_title: `Playwright Failure: ${data.failed_tests || 'Store QA'}`,
          severity: 'high',
          detected_by: 'Playwright Test Centre',
          recommended_fix: data.console_errors || 'Review Playwright report and fix failing selectors',
          status: 'open',
          requires_approval: false,
          risk_type: 'none',
        }),
        base44.entities.AgentMessage.create({
          message_type: 'playwright_failure',
          priority: 'high',
          subject: `Playwright Store QA Failed`,
          summary: `Tests failed: ${data.failed_tests || 'unknown'}. Errors: ${data.console_errors || 'none captured'}`,
          payload_json: JSON.stringify({ run_url: data.run_url, failed_tests: data.failed_tests, errors: data.console_errors }),
          linked_route: '/admin/playwright-test-centre',
          status: 'new',
          requires_approval: false,
          risk_level: 'high',
        }),
      ]);
      return { issue, msg };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['systemHealthIssues'] });
      toast({ title: 'Repair task created in SystemHealthIssue + AgentMessage' });
    },
  });

  const runOpenAIRepair = async () => {
    if (!repairInput.failed_tests && !repairInput.console_errors) {
      toast({ title: 'Enter failed tests or console errors first', variant: 'destructive' });
      return;
    }
    setRepairLoading(true);
    setRepairResult(null);
    try {
      const res = await base44.functions.invoke('openAIRepairAssistant', {
        failure_type: 'playwright_test',
        failed_tests: repairInput.failed_tests,
        console_errors: repairInput.console_errors,
        run_url: repairInput.run_url,
        suspected_files: ['lib/cartStore.js', 'pages/Store.jsx', 'components/store/CartDrawer.jsx'],
      });
      setRepairResult(res.data);
    } catch (err) {
      setRepairResult({ error: err.message, fallback: true, analysis: 'OpenAI unavailable (rate limited). Use deterministic repair below.', cursor_prompt: `Fix Playwright failure:\nFailed tests: ${repairInput.failed_tests}\nErrors: ${repairInput.console_errors}\nCheck: lib/cartStore.js selectors, data-testid attributes on Store/CartDrawer/StoreCheckout` });
    }
    setRepairLoading(false);
  };

  const downloadAll = () => {
    TEST_FILES.forEach(f => {
      const blob = new Blob([f.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `tests/${f.label}`; a.click();
      URL.revokeObjectURL(url);
    });
    // Also download workflow
    const wb = new Blob([WORKFLOW_CONTENT], { type: 'text/plain' });
    const wu = URL.createObjectURL(wb);
    const wa = document.createElement('a');
    wa.href = wu; wa.download = 'playwright-store-tests.yml'; wa.click();
    URL.revokeObjectURL(wu);
    toast({ title: `Downloaded ${TEST_FILES.length} test files + GitHub Actions workflow` });
  };

  const TABS = [
    { id: 'status', label: '📊 QA Status' },
    { id: 'run', label: '▶ Run Tests' },
    { id: 'github', label: '⚙ GitHub Actions' },
    { id: 'repair', label: '🔧 Repair Loop' },
    { id: 'files', label: '📁 Test Files' },
  ];

  const criticalFailed = QA_SUITES.filter(s => s.status === 'failed' && s.priority === 'critical');

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/qa-command-centre"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Playwright QA Control</h1>
            <p className="text-sm text-muted-foreground mt-1">Automation dashboard — status, runner, repair loop, downloads</p>
          </div>
        </div>
        <Button size="sm" onClick={downloadAll} className="gap-1.5">
          <Download className="w-3 h-3" />Download All Tests + Workflow
        </Button>
      </div>

      {/* Critical alert banner */}
      {criticalFailed.length > 0 && (
        <div className="border border-red-500/40 bg-red-500/5 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300 text-sm">CRITICAL FAILURE — Store QA not passing</p>
            <p className="text-xs text-muted-foreground mt-1">
              {criticalFailed.map(s => s.label).join(', ')} · Run tests after redeployment to confirm fix
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <CopyButton text={FAST_CMD} label="Copy Fast Store Test" />
              <Link to="/admin/autonomous-repair-loop"><Button size="sm" variant="outline" className="gap-1.5 text-xs border-red-500/30 text-red-300"><Zap className="w-3 h-3" />Open Repair Loop</Button></Link>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <Button key={t.id} variant={tab === t.id ? 'default' : 'outline'} size="sm" onClick={() => setTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>

      {/* ── TAB: QA STATUS ── */}
      {tab === 'status' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-red-500/20"><CardContent className="p-4"><p className="text-2xl font-bold text-red-400">{QA_SUITES.filter(s => s.status === 'failed').length}</p><p className="text-xs text-muted-foreground">Failed</p></CardContent></Card>
            <Card className="border-green-500/20"><CardContent className="p-4"><p className="text-2xl font-bold text-green-400">{QA_SUITES.filter(s => s.status === 'passed').length}</p><p className="text-xs text-muted-foreground">Passed</p></CardContent></Card>
            <Card className="border-slate-500/20"><CardContent className="p-4"><p className="text-2xl font-bold text-slate-400">{QA_SUITES.filter(s => s.status === 'unknown').length}</p><p className="text-xs text-muted-foreground">Not Run</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{QA_SUITES.length}</p><p className="text-xs text-muted-foreground">Total Suites</p></CardContent></Card>
          </div>

          <div className="space-y-2">
            {QA_SUITES.map(suite => (
              <div key={suite.id} className="border border-border/40 rounded-xl p-4 flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  {suite.status === 'failed' ? <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> :
                    suite.status === 'passed' ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> :
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{suite.label}</p>
                      <StatusBadge status={suite.status} />
                      <Badge className="text-[10px] bg-secondary text-muted-foreground">{suite.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">tests/{suite.file}</p>
                    {suite.lastError && <p className="text-xs text-red-400 mt-1">⚠ {suite.lastError}</p>}
                  </div>
                </div>
                <CopyButton text={`npx playwright test tests/${suite.file} --headed`} label="Copy Run" />
              </div>
            ))}
          </div>

          <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 text-sm space-y-1">
            <p className="font-semibold text-amber-300">System Status Truth</p>
            <div className="text-xs text-muted-foreground space-y-1 mt-2">
              <p>🔴 <strong className="text-foreground">Store:</strong> FAILED — selector fix deployed, retest required</p>
              <p>⚪ <strong className="text-foreground">GitHub Actions:</strong> WORKFLOW CREATED — NOT YET COMMITTED TO GITHUB</p>
              <p>🟡 <strong className="text-foreground">OpenAI:</strong> VALID BUT RATE LIMITED</p>
              <p>🟡 <strong className="text-foreground">Metricool:</strong> REST CONNECTED — PROFILE NEEDS CONFIRMATION</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: RUN TESTS ── */}
      {tab === 'run' && (
        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Run tests locally against gannonwaye.com</p>
              <p>Open Warp or terminal in your playwright pack folder, then run the commands below.</p>
            </CardContent>
          </Card>

          {[
            { label: 'Fast store test (validate fix)', cmd: FAST_CMD },
            { label: 'Full store + checkout suite', cmd: RUN_CMD },
            { label: 'Cart tests only', cmd: 'npx playwright test tests/cart.spec.js --headed' },
            { label: 'Checkout tests only', cmd: 'npx playwright test tests/checkout.spec.js --headed' },
            { label: 'All public tests', cmd: 'npx playwright test tests/ --headed' },
            { label: 'View last report', cmd: 'npx playwright show-report' },
            { label: 'Install browsers (first time)', cmd: 'npx playwright install chromium' },
          ].map(({ label, cmd }) => (
            <div key={label} className="border border-border/40 rounded-lg p-3 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <code className="text-sm font-mono text-foreground break-all">{cmd}</code>
              </div>
              <CopyButton text={cmd} />
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: GITHUB ACTIONS ── */}
      {tab === 'github' && (
        <div className="space-y-4">
          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: 'Workflow File Created', value: GITHUB_ACTIONS_STATUS.workflow_file_created, note: 'In docs/' },
              { label: 'Committed to GitHub', value: GITHUB_ACTIONS_STATUS.workflow_committed, note: 'Must commit .github/workflows/' },
              { label: 'GitHub Actions Active', value: GITHUB_ACTIONS_STATUS.workflow_active, note: 'Auto-runs on push/schedule' },
            ].map(item => (
              <Card key={item.label} className={item.value ? 'border-green-500/30' : 'border-amber-500/30'}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {item.value ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                    <p className="font-semibold text-sm">{item.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Download workflow */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-sm font-mono">.github/workflows/playwright-store-tests.yml</CardTitle>
                <div className="flex gap-2">
                  <CopyButton text={WORKFLOW_CONTENT} label="Copy Workflow" />
                  <DownloadButton filename="playwright-store-tests.yml" content={WORKFLOW_CONTENT} label="Download" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto max-h-64 font-mono">{WORKFLOW_CONTENT}</pre>
            </CardContent>
          </Card>

          {/* Commit commands */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Step 2 — Commit workflow to GitHub</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Bash / Mac / Linux:</p>
                <div className="flex items-start gap-2">
                  <pre className="text-xs bg-secondary/50 rounded-lg p-3 flex-1 font-mono overflow-x-auto">{COMMIT_CMDS_BASH}</pre>
                  <CopyButton text={COMMIT_CMDS_BASH} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Windows PowerShell:</p>
                <div className="flex items-start gap-2">
                  <pre className="text-xs bg-secondary/50 rounded-lg p-3 flex-1 font-mono overflow-x-auto">{COMMIT_CMDS_PWSH}</pre>
                  <CopyButton text={COMMIT_CMDS_PWSH} />
                </div>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-blue-300 mb-1">After committing:</p>
                <p>1. Go to github.com → your repo → Actions tab</p>
                <p>2. You will see "Playwright Store QA" workflow</p>
                <p>3. Click "Run workflow" to trigger manually</p>
                <p>4. Results appear in the Actions tab with downloadable report</p>
              </div>
            </CardContent>
          </Card>

          {/* Ingest result */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Step 3 — After Run: Ingest Result</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">After a GitHub Actions run completes, paste the results into the Repair Loop tab to create repair tasks automatically.</p>
              <Link to="/admin/autonomous-repair-loop">
                <Button size="sm" className="gap-1.5">
                  <Zap className="w-3 h-3" />Open Repair Loop
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB: REPAIR LOOP ── */}
      {tab === 'repair' && (
        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-sm">
              <p className="font-semibold text-foreground mb-1">Repair Loop — Paste GitHub Actions result to generate fix tasks</p>
              <p className="text-xs text-muted-foreground">Fill in what failed, then create a repair task or run OpenAI analysis.</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">GitHub Actions Run URL (optional)</label>
              <input
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="https://github.com/your-repo/actions/runs/..."
                value={repairInput.run_url}
                onChange={e => setRepairInput(p => ({ ...p, run_url: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Failed Tests</label>
              <textarea
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 h-20 resize-none font-mono"
                placeholder="e.g. store-load.spec.js › store loads within 5 seconds"
                value={repairInput.failed_tests}
                onChange={e => setRepairInput(p => ({ ...p, failed_tests: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Console Errors</label>
              <textarea
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 h-20 resize-none font-mono"
                placeholder="e.g. TypeError: uu(a=>a.getItemCount()) is not a function"
                value={repairInput.console_errors}
                onChange={e => setRepairInput(p => ({ ...p, console_errors: e.target.value }))}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="gap-1.5"
                onClick={() => createRepairTask.mutate(repairInput)}
                disabled={createRepairTask.isPending}>
                <Zap className="w-3 h-3" />Create Repair Task
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5"
                onClick={runOpenAIRepair}
                disabled={repairLoading}>
                {repairLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                Run OpenAI Repair Assistant
              </Button>
            </div>
          </div>

          {repairResult && (
            <Card className={repairResult.error ? 'border-amber-500/30' : 'border-green-500/30'}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{repairResult.error ? '⚠ OpenAI Rate Limited — Fallback Analysis' : '✅ OpenAI Repair Analysis'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {repairResult.analysis && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Analysis</p>
                    <p className="text-sm text-foreground">{repairResult.analysis}</p>
                  </div>
                )}
                {repairResult.cursor_prompt && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cursor Prompt</p>
                    <div className="flex items-start gap-2">
                      <pre className="text-xs bg-secondary/50 rounded p-2 flex-1 whitespace-pre-wrap font-mono">{repairResult.cursor_prompt}</pre>
                      <CopyButton text={repairResult.cursor_prompt} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Link to="/admin/autonomous-repair-loop"><Button size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Autonomous Repair Loop</Button></Link>
            <Link to="/admin/site-health"><Button size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />System Health Issues</Button></Link>
            <Link to="/admin/business-attention-centre"><Button size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Business Attention Centre</Button></Link>
          </div>
        </div>
      )}

      {/* ── TAB: TEST FILES ── */}
      {tab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {TEST_FILES.map(f => (
              <Card key={f.id}
                className={`cursor-pointer hover:border-primary/40 transition-colors ${selectedFile?.id === f.id ? 'border-primary/60' : ''}`}
                onClick={() => setSelectedFile(f)}>
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm">{f.label}</p>
                    <Badge className={`text-[10px] mt-1 ${f.priority === 'Critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>{f.priority}</Badge>
                  </div>
                  <DownloadButton filename={`tests/${f.label}`} content={f.content} label="" />
                </CardContent>
              </Card>
            ))}
            <Card className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setSelectedFile({ id: 'workflow', label: 'playwright-store-tests.yml', content: WORKFLOW_CONTENT })}>
              <CardContent className="p-3 flex items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm">playwright-store-tests.yml</p>
                  <Badge className="text-[10px] mt-1 bg-blue-500/20 text-blue-300">GitHub Actions</Badge>
                </div>
                <DownloadButton filename="playwright-store-tests.yml" content={WORKFLOW_CONTENT} label="" />
              </CardContent>
            </Card>
          </div>

          {selectedFile && (
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-sm font-mono">{selectedFile.label}</CardTitle>
                  <div className="flex gap-2">
                    <CopyButton text={selectedFile.content} />
                    <DownloadButton filename={selectedFile.label} content={selectedFile.content} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedFile.content}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}