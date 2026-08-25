# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: merch-visual-lab.spec.js >> Merch Visual Lab — Admin >> page loads at /admin/merch-visual-lab
- Location: src/gannonwaye-playwright-pack/tests/merch-visual-lab.spec.js:15:7

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
              - generic [ref=e325]: merch visual lab
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
          - generic [ref=e346]:
            - heading "Merch Visual Lab" [level=1] [ref=e347]
            - paragraph [ref=e348]: Create premium transparent cut-outs, layered compositions, reel assets and store visuals for the Thank You merch release.
            - generic [ref=e349]:
              - generic [ref=e350]: ✦
              - text: Respect is earned. Not a game you make me play.
          - generic [ref=e351]:
            - tablist [ref=e352]:
              - tab "Product Assets" [selected] [ref=e353] [cursor=pointer]
              - tab "BG Removal Guide" [ref=e354] [cursor=pointer]
              - tab "PNG Uploads" [ref=e355] [cursor=pointer]
              - tab "Composition Builder" [ref=e356] [cursor=pointer]
              - tab "Reel Builder" [ref=e357] [cursor=pointer]
              - tab "Store Visuals" [ref=e358] [cursor=pointer]
              - tab "Approval Queue" [ref=e359] [cursor=pointer]
              - tab "Export Centre" [ref=e360] [cursor=pointer]
            - tabpanel "Product Assets" [ref=e361]:
              - generic [ref=e362]:
                - generic [ref=e363]:
                  - generic [ref=e364]:
                    - heading "Product Assets" [level=2] [ref=e365]
                    - paragraph [ref=e366]: 0 assets — 0 approved for public use
                  - button "Upload Images" [ref=e367] [cursor=pointer]:
                    - img
                    - text: Upload Images
                - generic [ref=e368] [cursor=pointer]:
                  - img [ref=e369]
                  - paragraph [ref=e372]: Drag & drop product images here, or click to select
                  - paragraph [ref=e373]: Supports multiple files — hoodie, mug, shirt, tote, bundle, packaging, etc.
                - generic [ref=e374]:
                  - img [ref=e375]
                  - paragraph [ref=e378]: No assets yet. Drag & drop product images above.
```

# Test source

```ts
  1  | /* eslint-disable no-undef */
  2  | import { test, expect } from '@playwright/test';
  3  |  
  4  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  5  | 
  6  | test.describe('Merch Visual Lab — Admin', () => {
  7  | 
  8  |   test.beforeEach(async ({ page }) => {
  9  |     await page.goto(`${BASE_URL}/store`);
  10 |     await page.evaluate(() => {
  11 |       localStorage.setItem('base44_access_token', 'mock-admin-token');
  12 |     });
  13 |   });
  14 | 
  15 |   test('page loads at /admin/merch-visual-lab', async ({ page }) => {
  16 |     const errors = [];
  17 |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  18 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  19 |     await page.waitForLoadState('load');
  20 |     await expect(page.locator('text=Merch Visual Lab').first()).toBeVisible();
  21 |     const critical = errors.filter(e => !e.includes('favicon') && !e.includes('analytics') && !e.includes('posthog') && !e.includes('ERR_CONNECTION_REFUSED') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required') && !e.includes('net::ERR'));
> 22 |     expect(critical).toHaveLength(0);
     |                      ^ Error: expect(received).toHaveLength(expected)
  23 |   });
  24 | 
  25 |   test('all 8 tabs are present', async ({ page }) => {
  26 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  27 |     await page.waitForLoadState('load');
  28 |     for (const tab of ['Product Assets', 'BG Removal Guide', 'PNG Uploads', 'Composition Builder', 'Reel Builder', 'Store Visuals', 'Approval Queue', 'Export Centre']) {
  29 |       await expect(page.locator(`text=${tab}`).first()).toBeVisible();
  30 |     }
  31 |   });
  32 | 
  33 |   test('upload product image button exists', async ({ page }) => {
  34 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  35 |     await page.waitForLoadState('load');
  36 |     await expect(page.locator('text=Upload Images').first()).toBeVisible();
  37 |   });
  38 | 
  39 |   test('BG Removal Guide tab shows tool list', async ({ page }) => {
  40 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  41 |     await page.waitForLoadState('load');
  42 |     await page.click('text=BG Removal Guide');
  43 |     await expect(page.locator('text=Remove.bg').first()).toBeVisible();
  44 |     await expect(page.locator('text=Adobe Photoshop').first()).toBeVisible();
  45 |     await expect(page.locator('text=Transparent PNG').first()).toBeVisible();
  46 |   });
  47 | 
  48 |   test('Composition Builder tab loads', async ({ page }) => {
  49 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  50 |     await page.waitForLoadState('load');
  51 |     await page.click('text=Composition Builder');
  52 |     await expect(page.locator('text=Composition Builder').first()).toBeVisible();
  53 |   });
  54 | 
  55 |   test('Reel Builder tab shows storyboard', async ({ page }) => {
  56 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  57 |     await page.waitForLoadState('load');
  58 |     await page.click('text=Reel Builder');
  59 |     await expect(page.locator('text=Reel Storyboard Builder').first()).toBeVisible();
  60 |     await expect(page.locator('text=Respect is earned.').first()).toBeVisible();
  61 |   });
  62 | 
  63 |   test('Approval Queue shows auto-post blocked warning', async ({ page }) => {
  64 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  65 |     await page.waitForLoadState('load');
  66 |     await page.click('text=Approval Queue');
  67 |     await expect(page.locator('text=BLOCKED').first()).toBeVisible();
  68 |   });
  69 | 
  70 |   test('Export Centre shows Metricool blocked', async ({ page }) => {
  71 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  72 |     await page.waitForLoadState('load');
  73 |     await page.click('text=Export Centre');
  74 |     await expect(page.locator('text=BLOCKED').first()).toBeVisible();
  75 |   });
  76 | 
  77 |   test('mobile responsive — loads on 390px viewport', async ({ page }) => {
  78 |     await page.setViewportSize({ width: 390, height: 844 });
  79 |     await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
  80 |     await page.waitForLoadState('load');
  81 |     await expect(page.locator('text=Merch Visual Lab').first()).toBeVisible();
  82 |   });
  83 | 
  84 | });
```