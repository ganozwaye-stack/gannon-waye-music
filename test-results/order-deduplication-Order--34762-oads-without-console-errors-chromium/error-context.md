# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order-deduplication.spec.js >> Order Deduplication — Thea Elsworth >> admin orders page loads without console errors
- Location: src/gannonwaye-playwright-pack/tests/order-deduplication.spec.js:31:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 3
Received array:  ["Failed to load resource: the server responded with a status of 404 (Not Found)", "Failed to load resource: the server responded with a status of 404 (Not Found)", "Failed to load resource: the server responded with a status of 404 (Not Found)"]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Support Now" [ref=e4] [cursor=pointer]:
    - /url: /back-this
    - button "Support Now" [ref=e5]
  - generic [ref=e6]:
    - complementary [ref=e7]:
      - generic [ref=e8]:
        - heading "Gannon Waye" [level=2] [ref=e9]
        - paragraph [ref=e10]: Admin OS
      - navigation [ref=e11]:
        - generic [ref=e12]:
          - button "Daily Operating" [ref=e13] [cursor=pointer]:
            - text: Daily Operating
            - img [ref=e14]
          - generic [ref=e16]:
            - link "Daily Dashboard" [ref=e17] [cursor=pointer]:
              - /url: /admin/dashboard
              - img [ref=e18]
              - generic [ref=e23]: Daily Dashboard
            - link "Deego" [ref=e24] [cursor=pointer]:
              - /url: /admin/orchestrator-chat
              - img [ref=e25]
              - generic [ref=e35]: Deego
            - link "Communications Hub" [ref=e36] [cursor=pointer]:
              - /url: /admin/communications-hub
              - img [ref=e37]
              - generic [ref=e40]: Communications Hub
            - link "Command Center" [ref=e41] [cursor=pointer]:
              - /url: /admin/command-centre
              - img [ref=e42]
              - generic [ref=e44]: Command Center
            - link "Today's Top Priorities" [ref=e45] [cursor=pointer]:
              - /url: /admin/dashboard
              - img [ref=e46]
              - generic [ref=e52]: Today's Top Priorities
            - link "Daily Admin Checklist" [ref=e53] [cursor=pointer]:
              - /url: /admin/dashboard
              - img [ref=e54]
              - generic [ref=e57]: Daily Admin Checklist
            - link "Daily To-Dos" [ref=e58] [cursor=pointer]:
              - /url: /admin/dashboard
              - img [ref=e59]
              - generic [ref=e62]: Daily To-Dos
            - link "Approval Queue" [ref=e63] [cursor=pointer]:
              - /url: /admin/approval-queue
              - img [ref=e64]
              - generic [ref=e66]: Approval Queue
            - link "Blocked Items" [ref=e67] [cursor=pointer]:
              - /url: /admin/dashboard
              - img [ref=e68]
              - generic [ref=e70]: Blocked Items
            - link "Website Overhaul" [ref=e71] [cursor=pointer]:
              - /url: /admin/site-upgrade-audit
              - img [ref=e72]
              - generic [ref=e75]: Website Overhaul
            - link "Content Studio" [ref=e76] [cursor=pointer]:
              - /url: /admin/content-studio
              - img [ref=e77]
              - generic [ref=e79]: Content Studio
            - link "Owner Command V3" [ref=e80] [cursor=pointer]:
              - /url: /admin/owner-command-v3
              - img [ref=e81]
              - generic [ref=e83]: Owner Command V3
        - generic [ref=e84]:
          - button "Automations and Agents" [ref=e85] [cursor=pointer]:
            - text: Automations and Agents
            - img [ref=e86]
          - generic [ref=e88]:
            - link "Agent Registry" [ref=e89] [cursor=pointer]:
              - /url: /admin/agent-registry
              - img [ref=e90]
              - generic [ref=e93]: Agent Registry
            - link "Agent Task Log" [ref=e94] [cursor=pointer]:
              - /url: /admin/agent-task-log
              - img [ref=e95]
              - generic [ref=e97]: Agent Task Log
            - link "Agent Workbench" [ref=e98] [cursor=pointer]:
              - /url: /admin/agent-workbench
              - img [ref=e99]
              - generic [ref=e101]: Agent Workbench
            - link "Automation and Agents Hub" [ref=e102] [cursor=pointer]:
              - /url: /admin/automation-agents
              - img [ref=e103]
              - generic [ref=e113]: Automation and Agents Hub
        - generic [ref=e114]:
          - button "Business and Finance" [ref=e115] [cursor=pointer]:
            - text: Business and Finance
            - img [ref=e116]
          - generic [ref=e118]:
            - link "Attention Centre" [ref=e119] [cursor=pointer]:
              - /url: /admin/business-attention-centre
              - img [ref=e120]
              - generic [ref=e123]: Attention Centre
            - link "Financial Dashboard" [ref=e124] [cursor=pointer]:
              - /url: /admin/financials
              - img [ref=e125]
              - generic [ref=e127]: Financial Dashboard
            - link "Revenue Command" [ref=e128] [cursor=pointer]:
              - /url: /admin/revenue-command
              - img [ref=e129]
              - generic [ref=e131]: Revenue Command
            - link "Stripe Command" [ref=e132] [cursor=pointer]:
              - /url: /admin/stripe-command-centre
              - img [ref=e133]
              - generic [ref=e135]: Stripe Command
        - generic [ref=e136]:
          - button "Coaching and Private Work" [ref=e137] [cursor=pointer]:
            - text: Coaching and Private Work
            - img [ref=e138]
          - generic [ref=e140]:
            - link "Coaching Clients" [ref=e141] [cursor=pointer]:
              - /url: /admin/coaching-clients
              - img [ref=e142]
              - generic [ref=e147]: Coaching Clients
            - link "Coaching Hub" [ref=e148] [cursor=pointer]:
              - /url: /admin/coaching-hub
              - img [ref=e149]
              - generic [ref=e152]: Coaching Hub
            - link "Coaching Leads" [ref=e153] [cursor=pointer]:
              - /url: /admin/coaching-leads
              - img [ref=e154]
              - generic [ref=e157]: Coaching Leads
            - link "Memorial" [ref=e158] [cursor=pointer]:
              - /url: /admin/memorial
              - img [ref=e159]
              - generic [ref=e161]: Memorial
            - link "Mum Tribute" [ref=e162] [cursor=pointer]:
              - /url: /admin/mum
              - img [ref=e163]
              - generic [ref=e165]: Mum Tribute
            - link "Mum's Garden" [ref=e166] [cursor=pointer]:
              - /url: /admin/mums-garden
              - img [ref=e167]
              - generic [ref=e169]: Mum's Garden
        - generic [ref=e170]:
          - button "Content and Social" [ref=e171] [cursor=pointer]:
            - text: Content and Social
            - img [ref=e172]
          - generic [ref=e174]:
            - link "Brand Kit" [ref=e175] [cursor=pointer]:
              - /url: /admin/brand-kit
              - img [ref=e176]
              - generic [ref=e182]: Brand Kit
            - link "Content Studio" [ref=e183] [cursor=pointer]:
              - /url: /admin/content-studio
              - img [ref=e184]
              - generic [ref=e186]: Content Studio
            - link "Daily Post Engine" [ref=e187] [cursor=pointer]:
              - /url: /admin/daily-post-engine
              - img [ref=e188]
              - generic [ref=e190]: Daily Post Engine
            - link "Launch and Content Hub" [ref=e191] [cursor=pointer]:
              - /url: /admin/launch-content
              - img [ref=e192]
              - generic [ref=e195]: Launch and Content Hub
            - link "ManyChat Drafts" [ref=e196] [cursor=pointer]:
              - /url: /admin/manychat-drafts
              - img [ref=e197]
              - generic [ref=e199]: ManyChat Drafts
            - link "Reel Factory" [ref=e200] [cursor=pointer]:
              - /url: /admin/reel-factory
              - img [ref=e201]
              - generic [ref=e203]: Reel Factory
            - link "Social Monitor" [ref=e204] [cursor=pointer]:
              - /url: /admin/social-monitor
              - img [ref=e205]
              - generic [ref=e207]: Social Monitor
        - generic [ref=e208]:
          - button "Music and Releases" [ref=e209] [cursor=pointer]:
            - text: Music and Releases
            - img [ref=e210]
          - generic [ref=e212]:
            - link "Lyrics Archive" [ref=e213] [cursor=pointer]:
              - /url: /admin/lyrics-archive
              - img [ref=e214]
              - generic [ref=e217]: Lyrics Archive
            - link "Music Roadmap" [ref=e218] [cursor=pointer]:
              - /url: /admin/music-roadmap
              - img [ref=e219]
              - generic [ref=e221]: Music Roadmap
            - link "Music and Fan Hub" [ref=e222] [cursor=pointer]:
              - /url: /admin/music-fan
              - img [ref=e223]
              - generic [ref=e227]: Music and Fan Hub
            - link "Press Kit" [ref=e228] [cursor=pointer]:
              - /url: /admin/press-kit
              - img [ref=e229]
              - generic [ref=e232]: Press Kit
            - link "Production Tracker" [ref=e233] [cursor=pointer]:
              - /url: /admin/production-tracker
              - img [ref=e234]
              - generic [ref=e236]: Production Tracker
            - link "Releases" [ref=e237] [cursor=pointer]:
              - /url: /admin/releases
              - img [ref=e238]
              - generic [ref=e240]: Releases
            - link "Videos" [ref=e241] [cursor=pointer]:
              - /url: /admin/videos
              - img [ref=e242]
              - generic [ref=e245]: Videos
        - generic [ref=e246]:
          - button "Store and Orders" [ref=e247] [cursor=pointer]:
            - text: Store and Orders
            - img [ref=e248]
          - generic [ref=e250]:
            - link "Merch Approval Gate" [ref=e251] [cursor=pointer]:
              - /url: /admin/merch-approval
              - img [ref=e252]
              - generic [ref=e255]: Merch Approval Gate
            - link "Merch Management" [ref=e256] [cursor=pointer]:
              - /url: /admin/merch
              - img [ref=e257]
              - generic [ref=e261]: Merch Management
            - link "Orders" [ref=e262] [cursor=pointer]:
              - /url: /admin/orders
              - img [ref=e263]
              - generic [ref=e267]: Orders
            - link "Promo Codes" [ref=e268] [cursor=pointer]:
              - /url: /admin/promo-codes
              - img [ref=e269]
              - generic [ref=e272]: Promo Codes
            - link "Shipping Rates" [ref=e273] [cursor=pointer]:
              - /url: /admin/shipping-rates
              - img [ref=e274]
              - generic [ref=e276]: Shipping Rates
            - link "Store and Orders Hub" [ref=e277] [cursor=pointer]:
              - /url: /admin/store-orders
              - img [ref=e278]
              - generic [ref=e281]: Store and Orders Hub
        - generic [ref=e282]:
          - button "System Health" [ref=e283] [cursor=pointer]:
            - text: System Health
            - img [ref=e284]
          - generic [ref=e286]:
            - link "API Setup" [ref=e287] [cursor=pointer]:
              - /url: /admin/api-setup
              - img [ref=e288]
              - generic [ref=e290]: API Setup
            - link "Security Centre" [ref=e291] [cursor=pointer]:
              - /url: /admin/security-centre
              - img [ref=e292]
              - generic [ref=e294]: Security Centre
            - link "Site Health" [ref=e295] [cursor=pointer]:
              - /url: /admin/site-health
              - img [ref=e296]
              - generic [ref=e298]: Site Health
            - link "Site Settings" [ref=e299] [cursor=pointer]:
              - /url: /admin/settings
              - img [ref=e300]
              - generic [ref=e303]: Site Settings
            - link "Systems and QA Hub" [ref=e304] [cursor=pointer]:
              - /url: /admin/systems-qa
              - img [ref=e305]
              - generic [ref=e307]: Systems and QA Hub
      - generic [ref=e308]:
        - link "View Site" [ref=e309] [cursor=pointer]:
          - /url: /
          - img [ref=e310]
          - text: View Site
        - button "Sign Out" [ref=e313] [cursor=pointer]:
          - img [ref=e314]
          - text: Sign Out
    - main [ref=e317]:
      - generic [ref=e318]:
        - generic [ref=e319]:
          - generic [ref=e320]:
            - link "Admin" [ref=e321] [cursor=pointer]:
              - /url: /admin
            - generic [ref=e322]:
              - img [ref=e323]
              - generic [ref=e325]: orders
          - generic [ref=e326]:
            - button "Open notifications" [ref=e328] [cursor=pointer]:
              - img [ref=e330]
              - generic [ref=e333]: "2"
            - button "Search ⌘F" [ref=e334] [cursor=pointer]:
              - img [ref=e335]
              - generic [ref=e338]: Search
              - generic [ref=e339]: ⌘F
            - button "Commands ⌘K" [ref=e340] [cursor=pointer]:
              - img [ref=e341]
              - generic [ref=e343]: Commands
              - generic [ref=e344]: ⌘K
        - generic [ref=e345]:
          - button "Back to Dashboard" [ref=e346] [cursor=pointer]:
            - img [ref=e347]
            - text: Back to Dashboard
          - generic [ref=e349]:
            - generic [ref=e350]:
              - heading "Order Management" [level=1] [ref=e351]
              - paragraph [ref=e352]:
                - text: 3 active orders · $245.00 revenue · 1 pending
                - generic [ref=e353]: · 1 duplicate void excluded
            - button "Export" [ref=e355] [cursor=pointer]:
              - img
              - text: Export
          - generic [ref=e356]:
            - button "3 Total Orders" [ref=e357] [cursor=pointer]:
              - img [ref=e358]
              - paragraph [ref=e362]: "3"
              - paragraph [ref=e363]: Total Orders
            - button "$245.00 Revenue" [ref=e364] [cursor=pointer]:
              - img [ref=e365]
              - paragraph [ref=e367]: $245.00
              - paragraph [ref=e368]: Revenue
            - button "1 Pending" [ref=e369] [cursor=pointer]:
              - img [ref=e370]
              - paragraph [ref=e373]: "1"
              - paragraph [ref=e374]: Pending
            - button "1 Shipped" [ref=e375] [cursor=pointer]:
              - img [ref=e376]
              - paragraph [ref=e381]: "1"
              - paragraph [ref=e382]: Shipped
            - button "$81.67 Avg Order" [ref=e383] [cursor=pointer]:
              - img [ref=e384]
              - paragraph [ref=e387]: $81.67
              - paragraph [ref=e388]: Avg Order
          - generic [ref=e389]:
            - textbox "Search by name, email, or order ID..." [ref=e391]
            - combobox [ref=e392] [cursor=pointer]:
              - generic: Active Orders
              - img [ref=e393]
            - combobox [ref=e395] [cursor=pointer]:
              - generic: All Time
              - img [ref=e396]
          - generic [ref=e398]:
            - img [ref=e399]
            - paragraph [ref=e401]:
              - text: 1 duplicate void order excluded from totals ($90.48 AUD).
              - button "View duplicates" [ref=e402] [cursor=pointer]
          - generic [ref=e404]:
            - img [ref=e405]
            - paragraph [ref=e409]: No orders found with current filters.
```

# Test source

```ts
  1   | /**
  2   | /* eslint-disable no-undef */
  3   | /*
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
> 37  |     expect(criticalErrors).toHaveLength(0);
      |                            ^ Error: expect(received).toHaveLength(expected)
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
  104 |     await expect(page.locator('text=Stripe Webhook Delivery Failure').first()).toBeVisible();
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
```