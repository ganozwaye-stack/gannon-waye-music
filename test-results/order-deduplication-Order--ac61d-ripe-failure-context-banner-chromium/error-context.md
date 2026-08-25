# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order-deduplication.spec.js >> Order Deduplication — Thea Elsworth >> webhook health page shows Stripe failure context banner
- Location: src/gannonwaye-playwright-pack/tests/order-deduplication.spec.js:101:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Stripe Webhook Delivery Failure').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Stripe Webhook Delivery Failure').first()

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
- complementary:
  - heading "Gannon Waye" [level=2]
  - paragraph: Admin OS
  - navigation:
    - button "Daily Operating":
      - text: Daily Operating
      - img
    - link "Daily Dashboard":
      - /url: /admin/dashboard
      - img
      - text: Daily Dashboard
    - link "Deego":
      - /url: /admin/orchestrator-chat
      - img
      - text: Deego
    - link "Communications Hub":
      - /url: /admin/communications-hub
      - img
      - text: Communications Hub
    - link "Command Center":
      - /url: /admin/command-centre
      - img
      - text: Command Center
    - link "Today's Top Priorities":
      - /url: /admin/dashboard
      - img
      - text: Today's Top Priorities
    - link "Daily Admin Checklist":
      - /url: /admin/dashboard
      - img
      - text: Daily Admin Checklist
    - link "Daily To-Dos":
      - /url: /admin/dashboard
      - img
      - text: Daily To-Dos
    - link "Approval Queue":
      - /url: /admin/approval-queue
      - img
      - text: Approval Queue
    - link "Blocked Items":
      - /url: /admin/dashboard
      - img
      - text: Blocked Items
    - link "Website Overhaul":
      - /url: /admin/site-upgrade-audit
      - img
      - text: Website Overhaul
    - link "Content Studio":
      - /url: /admin/content-studio
      - img
      - text: Content Studio
    - link "Owner Command V3":
      - /url: /admin/owner-command-v3
      - img
      - text: Owner Command V3
    - button "Automations and Agents":
      - text: Automations and Agents
      - img
    - link "Agent Registry":
      - /url: /admin/agent-registry
      - img
      - text: Agent Registry
    - link "Agent Task Log":
      - /url: /admin/agent-task-log
      - img
      - text: Agent Task Log
    - link "Agent Workbench":
      - /url: /admin/agent-workbench
      - img
      - text: Agent Workbench
    - link "Automation and Agents Hub":
      - /url: /admin/automation-agents
      - img
      - text: Automation and Agents Hub
    - button "Business and Finance":
      - text: Business and Finance
      - img
    - link "Attention Centre":
      - /url: /admin/business-attention-centre
      - img
      - text: Attention Centre
    - link "Financial Dashboard":
      - /url: /admin/financials
      - img
      - text: Financial Dashboard
    - link "Revenue Command":
      - /url: /admin/revenue-command
      - img
      - text: Revenue Command
    - link "Stripe Command":
      - /url: /admin/stripe-command-centre
      - img
      - text: Stripe Command
    - button "Coaching and Private Work":
      - text: Coaching and Private Work
      - img
    - link "Coaching Clients":
      - /url: /admin/coaching-clients
      - img
      - text: Coaching Clients
    - link "Coaching Hub":
      - /url: /admin/coaching-hub
      - img
      - text: Coaching Hub
    - link "Coaching Leads":
      - /url: /admin/coaching-leads
      - img
      - text: Coaching Leads
    - link "Memorial":
      - /url: /admin/memorial
      - img
      - text: Memorial
    - link "Mum Tribute":
      - /url: /admin/mum
      - img
      - text: Mum Tribute
    - link "Mum's Garden":
      - /url: /admin/mums-garden
      - img
      - text: Mum's Garden
    - button "Content and Social":
      - text: Content and Social
      - img
    - link "Brand Kit":
      - /url: /admin/brand-kit
      - img
      - text: Brand Kit
    - link "Content Studio":
      - /url: /admin/content-studio
      - img
      - text: Content Studio
    - link "Daily Post Engine":
      - /url: /admin/daily-post-engine
      - img
      - text: Daily Post Engine
    - link "Launch and Content Hub":
      - /url: /admin/launch-content
      - img
      - text: Launch and Content Hub
    - link "ManyChat Drafts":
      - /url: /admin/manychat-drafts
      - img
      - text: ManyChat Drafts
    - link "Reel Factory":
      - /url: /admin/reel-factory
      - img
      - text: Reel Factory
    - link "Social Monitor":
      - /url: /admin/social-monitor
      - img
      - text: Social Monitor
    - button "Music and Releases":
      - text: Music and Releases
      - img
    - link "Lyrics Archive":
      - /url: /admin/lyrics-archive
      - img
      - text: Lyrics Archive
    - link "Music Roadmap":
      - /url: /admin/music-roadmap
      - img
      - text: Music Roadmap
    - link "Music and Fan Hub":
      - /url: /admin/music-fan
      - img
      - text: Music and Fan Hub
    - link "Press Kit":
      - /url: /admin/press-kit
      - img
      - text: Press Kit
    - link "Production Tracker":
      - /url: /admin/production-tracker
      - img
      - text: Production Tracker
    - link "Releases":
      - /url: /admin/releases
      - img
      - text: Releases
    - link "Videos":
      - /url: /admin/videos
      - img
      - text: Videos
    - button "Store and Orders":
      - text: Store and Orders
      - img
    - link "Merch Approval Gate":
      - /url: /admin/merch-approval
      - img
      - text: Merch Approval Gate
    - link "Merch Management":
      - /url: /admin/merch
      - img
      - text: Merch Management
    - link "Orders":
      - /url: /admin/orders
      - img
      - text: Orders
    - link "Promo Codes":
      - /url: /admin/promo-codes
      - img
      - text: Promo Codes
    - link "Shipping Rates":
      - /url: /admin/shipping-rates
      - img
      - text: Shipping Rates
    - link "Store and Orders Hub":
      - /url: /admin/store-orders
      - img
      - text: Store and Orders Hub
    - button "System Health":
      - text: System Health
      - img
    - link "API Setup":
      - /url: /admin/api-setup
      - img
      - text: API Setup
    - link "Security Centre":
      - /url: /admin/security-centre
      - img
      - text: Security Centre
    - link "Site Health":
      - /url: /admin/site-health
      - img
      - text: Site Health
    - link "Site Settings":
      - /url: /admin/settings
      - img
      - text: Site Settings
    - link "Systems and QA Hub":
      - /url: /admin/systems-qa
      - img
      - text: Systems and QA Hub
  - link "View Site":
    - /url: /
    - img
    - text: View Site
  - button "Sign Out":
    - img
    - text: Sign Out
- main:
  - link "Admin":
    - /url: /admin
  - img
  - text: webhook health
  - button "Open notifications":
    - img
    - text: "2"
  - button "Search ⌘F":
    - img
    - text: Search ⌘F
  - button "Commands ⌘K":
    - img
    - text: Commands ⌘K
  - link:
    - /url: /admin/stripe-command-centre
    - button:
      - img
  - heading "Webhook Health" [level=1]
  - paragraph: Stripe Intelligence Router monitoring
  - button "Refresh":
    - img
    - text: Refresh
  - img
  - paragraph: No webhooks received yet
  - paragraph: 0 received · 0 processed · 0 failed · 0 duplicates blocked
  - text: unknown
  - paragraph: "0"
  - paragraph: Events Received
  - paragraph: "0"
  - paragraph: Processed OK
  - paragraph: "0"
  - paragraph: Failed
  - paragraph: "0"
  - paragraph: Duplicates Blocked
  - paragraph: "0"
  - paragraph: Sig Failures
  - paragraph: —
  - paragraph: Last Success
  - paragraph: None
  - paragraph: Last Failure
  - paragraph: "0"
  - paragraph: Open Diagnostics
  - img
  - text: Webhook Endpoints
  - paragraph: Primary — Order Fulfillment (Required)
  - paragraph: https://api.base44.app/api/apps/69eb7905ca6eb4180010f794/functions/stripeWebhook
  - button:
    - img
  - paragraph: Secondary — Retire (dead /api/v2 route)
  - paragraph: DISABLED — retire the legacy /api/v2 stripeIntelligenceRouter endpoint
  - button:
    - img
  - link "Stripe Webhooks Dashboard":
    - /url: https://dashboard.stripe.com/webhooks
    - button "Stripe Webhooks Dashboard":
      - img
      - text: Stripe Webhooks Dashboard
  - button "Run Health Check":
    - img
    - text: Run Health Check
  - img
  - paragraph: Verify Webhook Delivery in Stripe Dashboard
  - paragraph:
    - text: Confirm your
    - strong: stripeWebhook
    - text: endpoint is receiving signed events and returning 2xx. This is the primary order fulfillment path.
  - paragraph:
    - text: ✅
    - strong: "stripeWebhook:"
    - text: Primary — creates MerchOrder, decrements inventory, sends receipts, notifies admin.
  - paragraph:
    - text: ✅
    - strong: "stripeIntelligenceRouter:"
    - text: Optional secondary — logs events, creates diagnostics. Does NOT create orders.
  - paragraph: ⚠️ Only Stripe Dashboard → Recent deliveries proves delivery is working.
  - paragraph: "Manual Stripe Dashboard steps:"
  - list:
    - listitem:
      - text: Open
      - link "dashboard.stripe.com/webhooks":
        - /url: https://dashboard.stripe.com/webhooks
    - listitem:
      - text: Click the
      - code: stripeWebhook
      - text: endpoint
    - listitem:
      - text: Open
      - strong: Recent deliveries
      - text: — confirm HTTP 2xx responses
    - listitem:
      - text: If you see
      - emphasis: "\"Webhook signature failed\""
      - text: → click
      - strong: Reveal
      - text: on Signing secret → copy it → update
      - code: STRIPE_WEBHOOK_SECRET
      - text: in Base44 → Settings → Environment Variables
    - listitem:
      - text: Click
      - strong: Resend
      - text: on a recent event and confirm 2xx
  - paragraph: Last Event Received
  - paragraph: — No live events yet
  - paragraph: Last Event Type
  - paragraph: —
  - paragraph: STRIPE_WEBHOOK_SECRET
  - paragraph: ✓ Set (presence only — value hidden)
  - img
  - text: Order Recovery Scanner May 26 – Now
  - paragraph: Scans the last 50 completed Stripe checkout sessions and compares against MerchOrder records. Only admin-approved recoveries will create orders. No auto-recovery.
  - button "Run Missing Order Scan":
    - img
    - text: Run Missing Order Scan
  - link "Open Stripe Webhooks":
    - /url: https://dashboard.stripe.com/webhooks
    - button "Open Stripe Webhooks":
      - img
      - text: Open Stripe Webhooks
  - link "Review Stripe Payments":
    - /url: https://dashboard.stripe.com/payments
    - button "Review Stripe Payments":
      - img
      - text: Review Stripe Payments
  - paragraph: "Stripe Dashboard Steps for Gannon:"
  - list:
    - listitem:
      - text: Go to
      - link "dashboard.stripe.com/webhooks":
        - /url: https://dashboard.stripe.com/webhooks
    - listitem:
      - text: "Open endpoint:"
      - code: stripeIntelligenceRouter
    - listitem: Check failed events log — copy latest error
    - listitem: Click "Resend" on any failed events from May 26 onwards
    - listitem:
      - text: Confirm
      - link "/admin/orders":
        - /url: /admin/orders
      - text: shows matching orders
    - listitem: If endpoint is proven healthy, Stripe will resume normal delivery
  - heading "Event Log" [level=2]
  - text: No webhook events yet. Configure the endpoint in Stripe and add STRIPE_WEBHOOK_SECRET to start receiving events.
```

# Test source

```ts
  4   |  * order-deduplication.spec.js
  5   |  *
  6   |  * Tests that the order system correctly handles duplicate Stripe sessions:
  7   |  * - Duplicate orders are marked duplicate_void
  8   |  * - Duplicate orders are excluded from dashboard totals
  9   |  * - stripeWebhook idempotency prevents duplicate creation
  10  |  * - recoverStripeOrders detects duplicates in scan
  11  |  * - /admin/orders hides duplicates from default view
  12  |  */
  13  | 
  14  | /* eslint-disable no-undef */
  15  | import { test, expect } from '@playwright/test';
  16  | 
  17  | const BASE_URL = (typeof process !== 'undefined' && process.env?.BASE_URL) || 'http://localhost:5173';
  18  | const THEA_SESSION_ID = 'cs_live_b1NME9LVRZv1N2g7jG3tDc4LRJVDrvleilDQ9AtKxY0kOH7s72bob5PYQW';
  19  | const THEA_EMAIL = 'dorotheae@icloud.com';
  20  | const THEA_AMOUNT = 90.48;
  21  | 
  22  | test.describe('Order Deduplication — Thea Elsworth', () => {
  23  | 
  24  |   test.beforeEach(async ({ page }) => {
  25  |     await page.goto(`${BASE_URL}/store`);
  26  |     await page.evaluate(() => {
  27  |       localStorage.setItem('base44_access_token', 'mock-admin-token');
  28  |     });
  29  |   });
  30  | 
  31  |   test('admin orders page loads without console errors', async ({ page }) => {
  32  |     const errors = [];
  33  |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  34  |     await page.goto(`${BASE_URL}/admin/orders`);
  35  |     await page.waitForLoadState('load');
  36  |     const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('analytics') && !e.includes('posthog') && !e.includes('ERR_CONNECTION_REFUSED') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required') && !e.includes('net::ERR'));
  37  |     expect(criticalErrors).toHaveLength(0);
  38  |   });
  39  | 
  40  |   test('default order view (Active Orders) does not show duplicate_void orders', async ({ page }) => {
  41  |     await page.goto(`${BASE_URL}/admin/orders`);
  42  |     await page.waitForLoadState('load');
  43  | 
  44  |     // Default filter should be "Active Orders" — duplicates hidden
  45  |     const duplicateBadges = page.locator('text=DUPLICATE VOID');
  46  |     // Should either not exist or only appear in the warning banner, not in the order list
  47  |     const listDuplicates = page.locator('.space-y-3 >> text=DUPLICATE VOID');
  48  |     await expect(listDuplicates).toHaveCount(0);
  49  |   });
  50  | 
  51  |   test('duplicate warning banner appears when duplicates exist', async ({ page }) => {
  52  |     await page.goto(`${BASE_URL}/admin/orders`);
  53  |     await page.waitForLoadState('load');
  54  |     // Banner should mention excluded duplicate
  55  |     const banner = page.locator('text=/duplicate void order/i');
  56  |     await expect(banner).toBeVisible();
  57  |   });
  58  | 
  59  |   test('switching to Duplicates / Voids filter shows voided Thea order', async ({ page }) => {
  60  |     await page.goto(`${BASE_URL}/admin/orders`);
  61  |     await page.waitForLoadState('load');
  62  | 
  63  |     // Switch to duplicates filter
  64  |     await page.click('button:has-text("Active Orders")');
  65  |     await page.click('text=⚠ Duplicates / Voids');
  66  |     await page.waitForTimeout(500);
  67  | 
  68  |     // Thea's name should appear
  69  |     await expect(page.locator(`text=${THEA_EMAIL}`).first()).toBeVisible();
  70  |   });
  71  | 
  72  |   test('active order count excludes the duplicate (expects 3 not 4)', async ({ page }) => {
  73  |     await page.goto(`${BASE_URL}/admin/orders`);
  74  |     await page.waitForLoadState('load');
  75  | 
  76  |     // The header/subtitle should show active orders count
  77  |     // We check revenue does NOT include double-counted $90.48
  78  |     const header = page.locator('p:has-text("active orders")');
  79  |     const text = await header.textContent();
  80  |     // Should NOT say 4 active orders (that would mean duplicate is counted)
  81  |     expect(text).not.toMatch(/4 active/);
  82  |   });
  83  | 
  84  |   test('revenue total excludes duplicate $90.48', async ({ page }) => {
  85  |     await page.goto(`${BASE_URL}/admin/orders`);
  86  |     await page.waitForLoadState('load');
  87  | 
  88  |     // Revenue card — should not be double-counting Thea's order
  89  |     // Just verify the page shows a Revenue stat card
  90  |     const revenueCard = page.locator('text=Revenue').first();
  91  |     await expect(revenueCard).toBeVisible();
  92  |   });
  93  | 
  94  |   test('webhook health page loads and shows recovery scanner', async ({ page }) => {
  95  |     await page.goto(`${BASE_URL}/admin/webhook-health`);
  96  |     await page.waitForLoadState('load');
  97  |     await expect(page.locator('text=Order Recovery Scanner')).toBeVisible();
  98  |     await expect(page.locator('text=Run Missing Order Scan')).toBeVisible();
  99  |   });
  100 | 
  101 |   test('webhook health page shows Stripe failure context banner', async ({ page }) => {
  102 |     await page.goto(`${BASE_URL}/admin/webhook-health`);
  103 |     await page.waitForLoadState('load');
> 104 |     await expect(page.locator('text=Stripe Webhook Delivery Failure').first()).toBeVisible();
      |                                                                                ^ Error: expect(locator).toBeVisible() failed
  105 |   });
  106 | 
  107 |   test('scan button is clickable and returns results', async ({ page }) => {
  108 |     await page.goto(`${BASE_URL}/admin/webhook-health`);
  109 |     await page.waitForLoadState('load');
  110 | 
  111 |     const scanBtn = page.locator('text=Run Missing Order Scan');
  112 |     await expect(scanBtn).toBeVisible();
  113 |     await expect(scanBtn).toBeEnabled();
  114 |   });
  115 | 
  116 |   test('no duplicate_void order appears in Stripe event log as revenue', async ({ page }) => {
  117 |     await page.goto(`${BASE_URL}/admin/webhook-health`);
  118 |     await page.waitForLoadState('load');
  119 |     // The event log section exists
  120 |     await expect(page.locator('text=Event Log').first()).toBeVisible();
  121 |   });
  122 | 
  123 |   test('admin orders page is mobile responsive', async ({ page }) => {
  124 |     await page.setViewportSize({ width: 390, height: 844 });
  125 |     await page.goto(`${BASE_URL}/admin/orders`);
  126 |     await page.waitForLoadState('load');
  127 |     await expect(page.locator('text=Order Management')).toBeVisible();
  128 |     const errors = [];
  129 |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  130 |     const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('analytics') && !e.includes('posthog') && !e.includes('ERR_CONNECTION_REFUSED') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required') && !e.includes('net::ERR'));
  131 |     expect(criticalErrors).toHaveLength(0);
  132 |   });
  133 | 
  134 | });
  135 | 
  136 | test.describe('Idempotency Guards', () => {
  137 | 
  138 |   test('stripeWebhook endpoint returns 400 without signature (not 500)', async ({ request }) => {
  139 |     const response = await request.post(`${BASE_URL}/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeWebhook`, {
  140 |       data: { type: 'checkout.session.completed', data: { object: { id: THEA_SESSION_ID } } },
  141 |       headers: { 'Content-Type': 'application/json' },
  142 |     });
  143 |     // Should reject without signature — 400 not 500
  144 |     expect(response.status()).toBeLessThan(500);
  145 |   });
  146 | 
  147 |   test('recoverStripeOrders returns 403 without admin auth', async ({ request }) => {
  148 |     const response = await request.post(`${BASE_URL}/api/v2/apps/69eb7905ca6eb4180010f794/functions/recoverStripeOrders`, {
  149 |       data: { action: 'scan' },
  150 |       headers: { 'Content-Type': 'application/json' },
  151 |     });
  152 |     expect(response.status()).toBe(403);
  153 |   });
  154 | 
  155 | });
```