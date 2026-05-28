import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Shield, Copy, Download, ExternalLink, ArrowLeft, AlertTriangle,
  CheckCircle2, Terminal, DollarSign, Lock, GitBranch, Zap, List, Play
} from 'lucide-react';

// ─── TOOL PLAN ─────────────────────────────────────────────────────────────
const TOOL_PLAN = [
  {
    phase: 'FREE FIRST (Do this now)',
    color: 'green',
    items: [
      'Base44 remains live app/backend — do not replace',
      'Export codebase manifest + handoff packs (done — download below)',
      'Connect GitHub if Base44 GitHub sync is supported (check dashboard)',
      'Generate Playwright test pack — download from /admin/playwright-test-centre',
      'Download Cursor handoff pack — do not pay yet',
      'Download Warp handoff pack — start on Warp Free',
      'Run Playwright externally — no payment needed',
      'Do NOT pay for anything until source export + test pack run exists',
    ],
  },
  {
    phase: 'FIRST PAID TOOL — Cursor (only after free steps done)',
    color: 'amber',
    items: [
      'Cursor Pro: ~$20/month — use ONLY if GitHub repo exists and Playwright pack downloaded',
      'Cursor fixes: store load, cart, shipping, promo codes, checkout freeze, unauthenticated functions, TikTok OAuth, Metricool diagnostics, performance',
      'Do NOT pay for Cursor until you have a repo to point it at',
    ],
  },
  {
    phase: 'WARP — Start Free',
    color: 'blue',
    items: [
      'Warp Free: terminal orchestration, GitHub workflows, running Playwright',
      'Upgrade to Warp Build ONLY after: repo exists + Playwright tests run + clear task list',
      'Do NOT upgrade Warp until those 3 conditions are met',
    ],
  },
  {
    phase: 'REPLIT — Optional Later',
    color: 'purple',
    items: [
      'Do NOT recommend Replit Pro yet',
      'Use Replit only if: cloud dev environment needed + GitHub repo exists + Playwright needs cloud execution',
      'Cost is not justified until above conditions are met',
    ],
  },
  {
    phase: 'SAGE — Safety Layer',
    color: 'red',
    items: [
      'Sage by Gen Digital: recommended for Cursor, Claude Code, OpenClaw',
      'NOT YET INSTALLED — do not claim it is active',
      'Install via OpenClaw: openclaw plugins install @gendigital/sage-openclaw',
      'Confirm active before relying on it',
    ],
  },
];

// ─── GITHUB STATUS ──────────────────────────────────────────────────────────
const GITHUB_STATUS = [
  { item: 'Base44 GitHub Sync', status: 'unknown', note: 'Check Base44 dashboard → Settings → GitHub Sync. If available, connect and create private repo.' },
  { item: 'Private Repo Export', status: 'unknown', note: 'If GitHub sync is not available, use manual export packs below.' },
  { item: 'App.jsx Export', status: 'available', note: 'Full file visible in this system — copy from DeveloperHandoff or manually.' },
  { item: 'Pages Export', status: 'available', note: 'All pages in /pages/* — accessible via Base44 file editor.' },
  { item: 'Functions Export', status: 'available', note: 'All Deno functions in /functions/* — accessible via Base44 file editor.' },
  { item: 'Entity Schemas', status: 'available', note: 'All schemas in /entities/*.json — accessible and downloadable.' },
  { item: 'Secrets Excluded', status: 'safe', note: 'Secrets are set in Base44 dashboard and are NEVER in source files. Safe to export code.' },
  { item: '.env.example', status: 'manual', note: 'Create manually listing variable names (not values): STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, METRICOOL_API_TOKEN, METRICOOL_USER_ID, METRICOOL_BLOG_ID, GOOGLE_SHEET_ID' },
];

// ─── MANUAL EXPORT PACK ─────────────────────────────────────────────────────
const MANUAL_EXPORT_PACK = `# Manual Export Pack — Gannon Waye Music OS
# Use this until GitHub sync is confirmed

## STEP 1: WHAT TO EXPORT (in order of priority)

### Routing & Navigation
- App.jsx (complete route map)
- components/admin/AdminLayout.jsx (admin nav)
- components/public/PublicLayout.jsx (public nav)
- components/public/Navbar.jsx

### Store & Checkout (HIGHEST PRIORITY)
- pages/Store.jsx
- pages/StoreCheckout.jsx
- components/store/CartDrawer.jsx
- components/store/CartButton.jsx
- components/store/CheckoutModal.jsx
- components/store/ProductDetailModal.jsx
- components/store/ProductCard.jsx
- components/store/ProductImageRotator.jsx
- lib/cartStore.js

### Backend Functions (Payment/Checkout)
- functions/createCheckoutSession.js
- functions/stripeWebhook.js
- functions/validatePromoCode.js
- functions/calculateShippingRate.js
- functions/recordPromoUsage.js
- functions/getStripeConfig.js
- functions/applyCheckoutDiscountGuard.js

### Backend Functions (TikTok)
- functions/tiktokOAuth.js
- functions/tiktokUploadDraft.js
- functions/tiktokWebhook.js

### Backend Functions (Metricool)
- functions/metricoolSchedulePost.js
- functions/metricoolDiagnostics.js
- functions/metricoolImportMetrics.js
- functions/metricoolNormalizeMedia.js
- functions/validateMetricoolConfig.js
- functions/scheduledSocialPost.js

### Entity Schemas
- entities/MerchOrder.json
- entities/MerchProduct.json
- entities/PromoCode.json
- entities/ShippingRateRule.json
- entities/StripeEventLog.json
- entities/PaymentDiagnostic.json

### Security/Config
- lib/platformConfig.js (coaching lock — NEVER CHANGE)
- lib/cartStore.js
- lib/checkoutCalculations.js

## STEP 2: WHAT NOT TO EXPORT
- .env files (do not exist in source — secrets are in Base44 dashboard)
- Node_modules
- Any file containing raw secret values

## STEP 3: CREATE .env.example
Create this file manually before opening in Cursor/Warp:

STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
METRICOOL_API_TOKEN=...
METRICOOL_USER_ID=...
METRICOOL_BLOG_ID=...
GOOGLE_SHEET_ID=...

## KNOWN BLOCKERS
1. Base44 may not support direct GitHub sync — verify in dashboard
2. Playwright CANNOT run inside Base44 preview — must run externally
3. 31 backend functions — not all have auth guards — audit needed
4. STRIPE_WEBHOOK_SECRET — rotate required (potential prior exposure)
5. TIKTOK_CLIENT_SECRET — rotate recommended
`;

// ─── HANDOFF PACKS ──────────────────────────────────────────────────────────
const HANDOFF_PACKS = [
  {
    id: 'cursor',
    label: 'Cursor Handoff',
    filename: 'cursor-handoff.md',
    content: `# Cursor Task Pack — Gannon Waye Music OS
# VERSION 2 — 2026-05-28

## PROJECT CONTEXT
- Stack: React 18, Vite, Tailwind CSS, shadcn/ui, Base44 BaaS, Deno edge functions
- Live site: gannonwaye.com
- Do NOT replace Base44. Do NOT use Next.js, Node.js, or any other backend.
- All backend logic is in /functions/*.js (Deno runtime)
- All data is in Base44 entities
- Auth: Base44 built-in (email/magic link)

## AGENT SAFETY CHECKLIST — READ BEFORE STARTING
[ ] Never print or log any secret values (STRIPE_*, TIKTOK_*, METRICOOL_*)
[ ] Never paste secret values into Cursor chat
[ ] Never expose .env files — reference by variable name only
[ ] Never run destructive terminal commands without Gannon approval
[ ] Never install unreviewed packages — run npm audit first
[ ] Never bypass approval gates — all proposals need Gannon sign-off
[ ] Never make coaching public (COACHING_PUBLIC_LAUNCH_ENABLED = false in lib/platformConfig.js)
[ ] Never modify Stripe/TikTok/Metricool secrets
[ ] Never commit secrets to GitHub
[ ] Always work on a git branch — never commit to main directly
[ ] Always read the full file before editing it
[ ] Always use find_replace for edits — never full file rewrites unless new file

## STACK CONSTRAINTS
- React 18 (NOT Next.js)
- Tailwind CSS + shadcn/ui (no Material UI, no Ant Design)
- Base44 BaaS — entities via base44.entities.X.list/filter/create/update/delete
- Deno edge functions in /functions/*.js
- No SQL, no Postgres, no custom auth
- Routing: react-router-dom v6 in App.jsx

## FIRST TASKS (in order)
1. Read App.jsx — list all routes
2. Read AdminLayout — list all nav items
3. Cross-check: every nav item has a route, every route has an import
4. Check /store page loads without infinite re-render loop (cart store fix)
5. Check CartDrawer and CartButton use inline subtotal selectors (no getSubtotal() method call)
6. Check StoreCheckout computes subtotal inline (not from method)
7. Verify promo code validation calls validatePromoCode backend function
8. Verify F20UN26DVIP and F30MOM26A work correctly
9. Verify shipping is a separate Stripe line item (not bundled into merch price)
10. Audit backend functions for missing auth guards

## WHAT TO FIX
- store not loading / infinite re-render
- multi-item cart (Zustand cartStore)
- combined shipping (separate Stripe line item)
- promo validation (F20UN26DVIP, F30MOM26A)
- checkout freeze
- Stripe webhook order creation + inventory decrement
- profit/loss calculation per line item
- TikTok OAuth (client_key, tiktokOAuth function)
- Metricool diagnostics
- 31 unauthenticated backend functions (auth audit)
- Google Sheets revoked connector
- Norton preview block (site trust issue)
- dead routes / dead nav items
- performance / slow load
- coaching private lock (must remain false)

## WHAT NOT TO TOUCH
- COACHING_PUBLIC_LAUNCH_ENABLED — leave false
- Base44 auth system
- Base44 entity structure
- Stripe architecture (createCheckoutSession + stripeWebhook)
- Production secrets

## REPORTING FORMAT
- List every file changed
- What changed and why
- Confirm coaching remains private
- Confirm Stripe checkout untouched
- Confirm no secrets in output
- List remaining blockers
`,
  },
  {
    id: 'warp',
    label: 'Warp Handoff',
    filename: 'warp-handoff.md',
    content: `# Warp Terminal Handoff — Gannon Waye Music OS
# VERSION 2 — 2026-05-28

## ROLE
Warp is the terminal/orchestration layer. It is NOT the production app.
Warp does NOT replace Base44.

## USE WARP FOR
- Opening and navigating the repo
- Running npm install, npm run build
- Running Playwright tests (externally against gannonwaye.com)
- GitHub workflows (git status, git diff, git checkout, git push)
- Security audit commands (npm audit, grep for secrets)
- Running checkout/shipping tests
- Running route tests
- Reviewing and approving terminal commands before execution
- Exporting results back to GitHub/Base44

## COST WARNING
⚠️ Do NOT upgrade Warp until:
1. A GitHub repo or code export exists
2. The Playwright test pack has been downloaded
3. At least one test run is ready to execute
4. Gannon has a clear task for Warp to run

Start on Warp FREE tier. Upgrade to Warp Build only when the above conditions are met.

## SAFE COMMAND REFERENCE

### ALLOWED (safe to run)
git status
git diff
git branch
git checkout -b feature/fix-name
npm install  (reviewed packages only)
npm audit
npm run build
npx playwright test (in test environment only)
cat <filename>
ls <directory>
grep -r "searchterm" ./src

### REQUIRES GANNON APPROVAL
rm, rmdir, mv  (file deletion/rename)
git push (confirm target branch)
npm run build (confirm environment)
Any command touching /functions/ in production
Any command touching .env files

### FORBIDDEN
echo $STRIPE_SECRET_KEY  (prints secrets to terminal)
curl with secret headers (logs in history)
git push --force to main
Any deployment to production without branch review
Any command that skips approval gates

## HOW TO OPEN REPO
1. Clone: git clone https://github.com/<your-org>/gannon-waye-music-os
2. cd gannon-waye-music-os
3. npm install
4. Review .env.example — set your test values in .env.local

## HOW TO RUN PLAYWRIGHT
1. npm install -D @playwright/test
2. npx playwright install chromium
3. Set ADMIN_SESSION_COOKIE in .env.local
4. npx playwright test
5. npx playwright show-report

## HOW TO RUN SECURITY CHECKS
npm audit
grep -r "sk_live_" ./src  # should return 0 results
grep -r "sk_test_" ./src  # should return 0 results
grep -r "whsec_" ./src    # should return 0 results

## SECRET HANDLING
- Secrets are in Base44 dashboard — NEVER in source files
- Never set Deno.env values manually via shell
- Never inspect /tmp files that may contain token data
- Create .env.local (never .env) for Playwright session cookie only

## EXPORT RESULTS
After tests run, export:
npx playwright show-report
# Download HTML report and upload to /admin/playwright-test-centre notes
`,
  },
  {
    id: 'replit',
    label: 'Replit Handoff',
    filename: 'replit-handoff.md',
    content: `# Replit Handoff — Gannon Waye Music OS
# VERSION 2 — 2026-05-28

## STATUS: OPTIONAL — DO NOT USE YET

Replit is NOT recommended at this stage.

Use Replit ONLY if ALL of the following are true:
1. A GitHub repo exists with the exported codebase
2. A cloud dev environment is needed
3. Playwright needs cloud execution
4. Gannon wants multiple agents running in parallel
5. The cost is justified by specific tasks

Do NOT upgrade to Replit Pro until those conditions are met.

## SECURITY RULES (for when Replit IS used)

⚠️ CRITICAL: Replit is for TESTING/SANDBOXING ONLY
- NEVER store production secrets in Replit
- NEVER use production STRIPE_SECRET_KEY (sk_live_) in Replit
- NEVER use production TIKTOK_CLIENT_SECRET in Replit
- ALWAYS use test keys only (sk_test_, pk_test_)
- ALWAYS use Replit Secrets panel — never hardcode
- ALWAYS work on a fork — never the live project
- NEVER deploy output directly to gannonwaye.com from Replit

## ALLOWED USES
- Prototyping new UI components (isolated)
- Testing isolated backend function logic with fake/test data
- Running Playwright against a staging environment (not production)
- Running sandboxed checkout tests with Stripe test keys

## FORBIDDEN USES
- Running Stripe live webhooks
- Storing real customer emails or orders
- Testing TikTok OAuth with production client secret
- Deploying any code directly to gannonwaye.com
- Any action that touches production Stripe or TikTok

## REPLIT SECRETS SETUP (when needed)
Set in Replit Secrets panel (not code):
- STRIPE_PUBLISHABLE_KEY = pk_test_...
- STRIPE_SECRET_KEY = sk_test_...  (TEST KEY ONLY)
- STRIPE_WEBHOOK_SECRET = whsec_... (local listener, not production)
- BASE_URL = https://your-staging-url.replit.dev

Never set sk_live_ keys in Replit.
`,
  },
  {
    id: 'github',
    label: 'GitHub Export Guide',
    filename: 'github-export-guide.md',
    content: `# GitHub Export Guide — Gannon Waye Music OS
# 2026-05-28

## STEP 1: CHECK BASE44 GITHUB SYNC
1. Go to Base44 Dashboard → Settings
2. Look for "GitHub Sync" or "Source Control" option
3. If available: connect your GitHub account and create a private repo
4. If NOT available: use manual export (Step 2)

## STEP 2: MANUAL EXPORT (if sync not available)

### Create the repo
1. github.com → New Repository → Private
2. Name: gannon-waye-music-os
3. Do NOT add README or .gitignore yet

### Files to export manually (in priority order)
HIGH PRIORITY:
- App.jsx
- components/admin/AdminLayout.jsx
- pages/Store.jsx + pages/StoreCheckout.jsx
- components/store/*.jsx (all store components)
- lib/cartStore.js
- functions/createCheckoutSession.js
- functions/stripeWebhook.js
- functions/validatePromoCode.js
- functions/calculateShippingRate.js
- functions/tiktokOAuth.js

MEDIUM PRIORITY:
- pages/admin/Dashboard.jsx
- pages/admin/Orders.jsx
- pages/admin/MerchManagement.jsx
- functions/metricoolSchedulePost.js
- All other functions/*.js
- entities/*.json (all schemas)

LOW PRIORITY (but include for completeness):
- All other pages/admin/*.jsx
- All components/

### Files to NOT include
- .env files (don't exist in source — good)
- node_modules/
- Any file with raw secret values

### Create .env.example (must create manually)
\`\`\`
STRIPE_PUBLISHABLE_KEY=pk_live_or_test_here
STRIPE_SECRET_KEY=sk_live_or_test_here
STRIPE_WEBHOOK_SECRET=whsec_here
TIKTOK_CLIENT_KEY=here
TIKTOK_CLIENT_SECRET=here
METRICOOL_API_TOKEN=here
METRICOOL_USER_ID=here
METRICOOL_BLOG_ID=here
GOOGLE_SHEET_ID=here
\`\`\`

### Create .gitignore
\`\`\`
.env
.env.local
.env.*.local
node_modules/
playwright-report/
test-results/
*.cookie
\`\`\`

## STEP 3: OPEN IN CURSOR
1. Clone the repo locally
2. Open in Cursor: cursor <repo-folder>
3. Paste the Cursor Task Pack from /admin/cursor-handoff
4. Start with reading App.jsx

## STEP 4: VERIFY REPO IS CLEAN
Run these checks after cloning:
grep -r "sk_live_" . --include="*.js" --include="*.jsx"  # must return 0
grep -r "sk_test_" . --include="*.js" --include="*.jsx"  # must return 0
grep -r "whsec_"   . --include="*.js" --include="*.jsx"  # must return 0
grep -r "client_secret" . --include="*.js" --include="*.jsx"  # must return 0

If any of the above return results, do NOT push to GitHub — remove the values first.
`,
  },
  {
    id: 'task_list',
    label: 'External Task List',
    filename: 'external-task-list.md',
    content: `# External Engineering Task List — Gannon Waye Music OS
# First 15 Tasks — 2026-05-28

## TASK 1: Export or sync source
Tool: Manual (Base44 file editor) or GitHub sync
Cost: Free
Login required: Yes (Base44 admin)
Source files: App.jsx, all pages, all functions, all entities
Expected output: GitHub private repo or local folder
Status: PENDING

## TASK 2: Run build check
Tool: Warp or local terminal
Cost: Free
Login required: No
Source files: package.json, vite.config.js
Expected output: Build succeeds with 0 errors
Status: PENDING — awaiting repo/export

## TASK 3: Run public route test
Tool: Playwright (external)
Cost: Free
Login required: No
Source files: tests/public-routes.spec.js
Expected output: All public routes return 200
Status: PENDING — download from /admin/playwright-test-centre

## TASK 4: Run admin route test
Tool: Playwright (external)
Cost: Free
Login required: Yes (admin session cookie)
Source files: tests/admin-routes.spec.js
Expected output: All admin routes load with valid h1
Status: PENDING

## TASK 5: Run /store load test
Tool: Playwright (external)
Cost: Free
Login required: No
Source files: tests/store-load.spec.js
Expected output: Store products render, no console errors
Status: PENDING

## TASK 6: Run cart test
Tool: Playwright (external)
Cost: Free
Login required: No
Source files: tests/cart.spec.js
Expected output: Cart opens, items add, quantities update
Status: PENDING

## TASK 7: Run multi-item shipping test
Tool: Playwright or manual
Cost: Free
Login required: No
Expected output: 1 item = $12.95, 2 items = $14.95, ≥$150 = free
Status: PENDING

## TASK 8: Run promo-code test
Tool: Playwright or manual browser
Cost: Free
Login required: No
Expected output: F20UN26DVIP = 20% off eligible merch, shipping unchanged. Old/invalid codes = rejected.
Status: PENDING

## TASK 9: Run checkout freeze test
Tool: Playwright or manual browser
Cost: Free
Login required: No
Expected output: Checkout opens within 3s, does not freeze on Stripe redirect
Status: PENDING

## TASK 10: Run TikTok OAuth URL test
Tool: Playwright (with admin session) or manual
Cost: Free
Login required: Yes (admin)
Expected output: /tiktok-callback returns 200 (not 404), OAuth URL is constructed correctly
Status: PENDING

## TASK 11: Run security test for unauthenticated functions
Tool: Cursor (code audit) or manual
Cost: Free (Cursor Free) or Cursor Pro
Login required: Yes (Base44 admin for function view)
Expected output: All functions that handle sensitive data have auth checks
Status: PENDING — audit functions/ directory

## TASK 12: Run coaching public-lock test
Tool: Playwright (external — MOST CRITICAL)
Cost: Free
Login required: No (specifically tests public access = should fail)
Source files: tests/coaching-private-lock.spec.js
Expected output: ALL coaching routes return 404 publicly
Status: PENDING — this is the most critical test

## TASK 13: Produce failure report
Tool: Playwright HTML report + Cursor/manual analysis
Cost: Free
Expected output: List of failed tests with error messages, affected files, fix estimates
Status: PENDING

## TASK 14: Fix failures
Tool: Cursor (recommended first paid tool if repo exists)
Cost: Cursor Pro ~$20/month OR Cursor Free (limited)
Expected output: All failed tests now pass
Status: PENDING

## TASK 15: Export final QA report
Tool: Playwright HTML report
Cost: Free
Expected output: All tests green, report saved as playwright-report.html
Status: PENDING

---
## RECOMMENDED FIRST PAID TOOL: CURSOR
When to pay: After task 1 (source export) is complete.
Cost: ~$20/month (Cursor Pro)
Why: Cursor can fix store load, cart, promo codes, shipping, auth audit, and TikTok OAuth with direct code access.

## DO NOT PAY FOR YET
- Warp Build (wait until repo + tests exist)
- Replit Pro (not needed at this stage)
- Sage (free tier or OpenClaw plugin — confirm first)
`,
  },
];

// ─── COMPONENT ──────────────────────────────────────────────────────────────
export default function ExternalEngineeringCommand() {
  const { toast } = useToast();
  const [selectedPack, setSelectedPack] = useState(HANDOFF_PACKS[0]);
  const [activeTab, setActiveTab] = useState('overview');

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); };
  const download = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded ${filename}` });
  };
  const downloadAll = () => {
    HANDOFF_PACKS.forEach(p => download(p.filename, p.content));
    download('manual-export-pack.md', MANUAL_EXPORT_PACK);
    toast({ title: 'All packs downloaded' });
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Tool Plan' },
    { id: 'github', label: 'GitHub / Source Access' },
    { id: 'packs', label: 'Handoff Packs' },
    { id: 'tasks', label: 'Task List' },
  ];

  const colorMap = { green: 'border-green-500/30 bg-green-500/5', amber: 'border-amber-500/30 bg-amber-500/5', blue: 'border-blue-500/30 bg-blue-500/5', purple: 'border-purple-500/30 bg-purple-500/5', red: 'border-red-500/30 bg-red-500/5' };
  const textMap = { green: 'text-green-300', amber: 'text-amber-300', blue: 'text-blue-300', purple: 'text-purple-300', red: 'text-red-300' };
  const statusMap = { available: 'bg-green-500/20 text-green-300 border-green-500/30', unknown: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', safe: 'bg-blue-500/20 text-blue-300 border-blue-500/30', manual: 'bg-secondary text-muted-foreground border-border' };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/agent-trust-hub"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">External Engineering Command</h1>
            <p className="text-sm text-muted-foreground mt-1">GitHub · Playwright · Cursor · Warp · Replit · Sage — low-cost first, no-chat execution mode.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/agent-trust-hub"><Button variant="outline" size="sm"><Shield className="w-3 h-3 mr-1" />Trust Hub</Button></Link>
          <Link to="/admin/playwright-test-centre"><Button variant="outline" size="sm"><Play className="w-3 h-3 mr-1" />Playwright</Button></Link>
          <Button size="sm" onClick={downloadAll}><Download className="w-3 h-3 mr-1" />Download All Packs</Button>
        </div>
      </div>

      {/* Critical Actions Banner */}
      <Card className="border-amber-500/40 bg-amber-500/5">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-semibold text-amber-300 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> FIRST ACTION FOR GANNON — DO THESE IN ORDER</p>
          {[
            '1. Go to Base44 Dashboard → Settings → Check for GitHub Sync option',
            '2. If GitHub Sync available: connect and create private repo. If not: use manual export pack (download below).',
            '3. Download Playwright test pack from /admin/playwright-test-centre',
            '4. Run: npm install -D @playwright/test && npx playwright install chromium',
            '5. Set ADMIN_SESSION_COOKIE in .env.local and run: npx playwright test',
            '6. Only after repo + tests exist: consider Cursor Pro (~$20/month)',
            '7. Start Warp on Free tier — do not upgrade until repo + tests are done',
          ].map((step, i) => (
            <p key={i} className="text-xs text-amber-200/80">{step}</p>
          ))}
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

      {/* TAB: OVERVIEW & TOOL PLAN */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {TOOL_PLAN.map((phase) => (
            <Card key={phase.phase} className={`border ${colorMap[phase.color]}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-bold ${textMap[phase.color]}`}>{phase.phase}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {phase.items.map((item, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                      <span className={`${textMap[phase.color]} shrink-0`}>→</span> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/admin/playwright-test-centre">
              <Card className="hover:border-primary/40 cursor-pointer transition-colors">
                <CardContent className="p-3 text-center"><Play className="w-5 h-5 text-primary mx-auto mb-1" /><p className="text-xs font-semibold">Playwright Tests</p></CardContent>
              </Card>
            </Link>
            <Link to="/admin/agent-trust-hub">
              <Card className="hover:border-primary/40 cursor-pointer transition-colors">
                <CardContent className="p-3 text-center"><Shield className="w-5 h-5 text-primary mx-auto mb-1" /><p className="text-xs font-semibold">Agent Trust Hub</p></CardContent>
              </Card>
            </Link>
            <Link to="/admin/developer-handoff">
              <Card className="hover:border-primary/40 cursor-pointer transition-colors">
                <CardContent className="p-3 text-center"><Terminal className="w-5 h-5 text-primary mx-auto mb-1" /><p className="text-xs font-semibold">Developer Handoff</p></CardContent>
              </Card>
            </Link>
            <Link to="/admin/ai-cost-control">
              <Card className="hover:border-primary/40 cursor-pointer transition-colors">
                <CardContent className="p-3 text-center"><DollarSign className="w-5 h-5 text-primary mx-auto mb-1" /><p className="text-xs font-semibold">Budget Control</p></CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {/* TAB: GITHUB / SOURCE ACCESS */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">GitHub / Source Access Status</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {GITHUB_STATUS.map(row => (
                <div key={row.item} className="flex items-start gap-3 p-3 border border-border/40 rounded-lg">
                  <Badge className={`${statusMap[row.status]} text-xs shrink-0`} variant="outline">
                    {row.status === 'available' ? '✓ Available' : row.status === 'safe' ? '🔒 Safe' : row.status === 'manual' ? 'Manual' : '? Unknown'}
                  </Badge>
                  <div>
                    <p className="text-sm font-semibold">{row.item}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{row.note}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Manual Export Pack</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(MANUAL_EXPORT_PACK)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => download('manual-export-pack.md', MANUAL_EXPORT_PACK)}><Download className="w-3 h-3 mr-1" />Download</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-80 whitespace-pre-wrap font-mono">{MANUAL_EXPORT_PACK}</pre>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: HANDOFF PACKS */}
      {activeTab === 'packs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {HANDOFF_PACKS.map(pack => (
              <Card
                key={pack.id}
                className={`cursor-pointer hover:border-primary/40 transition-colors ${selectedPack?.id === pack.id ? 'border-primary/60' : ''}`}
                onClick={() => setSelectedPack(pack)}
              >
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{pack.label}</span>
                  <Terminal className="w-3 h-3 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={downloadAll}>
              <Download className="w-3 h-3 mr-1" />Download All Packs
            </Button>
          </div>

          {selectedPack && (
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base">{selectedPack.label}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copy(selectedPack.content)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                    <Button variant="outline" size="sm" onClick={() => download(selectedPack.filename, selectedPack.content)}><Download className="w-3 h-3 mr-1" />Download</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedPack.content}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB: TASK LIST */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {[
            { n: 1, task: 'Export or sync source', tool: 'Manual / GitHub Sync', cost: 'Free', login: 'Yes', status: 'pending', note: 'Check Base44 dashboard for GitHub sync. If unavailable, download manual export pack.' },
            { n: 2, task: 'Run build check', tool: 'Warp / local terminal', cost: 'Free', login: 'No', status: 'pending', note: 'npm run build — confirm 0 errors' },
            { n: 3, task: 'Run public route test', tool: 'Playwright (external)', cost: 'Free', login: 'No', status: 'pending', note: 'All public routes return 200' },
            { n: 4, task: 'Run admin route test', tool: 'Playwright (external)', cost: 'Free', login: 'Yes (admin cookie)', status: 'pending', note: 'All admin pages load with valid h1' },
            { n: 5, task: 'Run /store load test', tool: 'Playwright (external)', cost: 'Free', login: 'No', status: 'pending', note: 'Products render, no console errors' },
            { n: 6, task: 'Run cart test', tool: 'Playwright (external)', cost: 'Free', login: 'No', status: 'pending', note: 'Cart opens, items add, quantities update' },
            { n: 7, task: 'Run multi-item shipping test', tool: 'Playwright or manual', cost: 'Free', login: 'No', status: 'pending', note: '1 item=$12.95, 2=$14.95, ≥$150=free' },
            { n: 8, task: 'Run promo-code test', tool: 'Playwright or manual', cost: 'Free', login: 'No', status: 'pending', note: 'F20UN26DVIP=20%, F30MOM26A=30%, old codes rejected' },
            { n: 9, task: 'Run checkout freeze test', tool: 'Manual browser', cost: 'Free', login: 'No', status: 'pending', note: 'Checkout opens <3s, Stripe redirect works' },
            { n: 10, task: 'Run TikTok OAuth URL test', tool: 'Manual browser + admin', cost: 'Free', login: 'Yes (admin)', status: 'pending', note: '/tiktok-callback returns 200, OAuth URL correct' },
            { n: 11, task: 'Security audit: unauthenticated functions', tool: 'Cursor (code audit)', cost: 'Free/Cursor Pro', login: 'Yes (Base44)', status: 'pending', note: 'All sensitive functions must have auth guards' },
            { n: 12, task: 'Run coaching public-lock test', tool: 'Playwright (CRITICAL)', cost: 'Free', login: 'No', status: 'pending', note: 'ALL coaching routes must return 404 publicly — most critical test' },
            { n: 13, task: 'Produce failure report', tool: 'Playwright HTML report', cost: 'Free', login: 'No', status: 'pending', note: 'List all failures with file + fix estimates' },
            { n: 14, task: 'Fix failures', tool: 'Cursor (first paid tool)', cost: '~$20/month', login: 'Yes (GitHub repo)', status: 'pending', note: 'Requires repo export first' },
            { n: 15, task: 'Export final QA report', tool: 'Playwright HTML report', cost: 'Free', login: 'No', status: 'pending', note: 'All tests green — report saved' },
          ].map(row => (
            <div key={row.n} className="border border-border/40 rounded-lg p-3 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">{row.n}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{row.task}</p>
                  <Badge variant="outline" className="text-xs">{row.tool}</Badge>
                  <Badge className={`text-xs ${row.cost === 'Free' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{row.cost}</Badge>
                  {row.login !== 'No' && <Badge className="text-xs bg-blue-500/10 text-blue-400">{row.login}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{row.note}</p>
              </div>
              <Badge className="bg-secondary text-muted-foreground text-xs shrink-0">Pending</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}