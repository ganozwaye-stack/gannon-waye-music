# System Audit — 2026-07-10

## Current verdict

The Gannon Waye Music codebase is buildable and the main public pages render locally. The system is not fully business-ready yet because the revenue/automation layer has several blockers:

- Store payment diagnostics show `STRIPE_SECRET_KEY missing or invalid`.
- Content automation is producing drafts, but almost nothing is media-ready or Metricool-ready.
- Coaching pages/entities exist, but the product/content layer is empty.
- GanozMix Direct has no real orders, expired/bad eBay auth, dead-letter product jobs, and false-live listing state.
- Base44 CLI deployment is still blocked by login/session timeout from PowerShell, although the authenticated Base44 connector can read app data.

## Proof files

- Public route audit JSON: `C:\Users\ganno\Documents\Codex\gannon-waye-music-pr-work\review-shots\site-audit-1783674026358\site-audit.json`
- Authenticated admin route audit JSON: `C:\Users\ganno\Documents\Codex\gannon-waye-music-pr-work\review-shots\admin-auth-audit-1783674223975\admin-auth-audit.json`
- Coaching/resilience document inventory: `C:\Users\ganno\Documents\Codex\gannon-waye-music-pr-work\review-shots\business-assets-audit\coaching-resilience-document-hits-clean.csv`

## Local build/test status

- `npm run build`: passed.
- `npm run lint`: passed.
- Public local pages tested at `http://127.0.0.1:5180`:
  - `/` passed.
  - `/music` passed.
  - `/store` passed.
  - `/contact` passed.
  - `/mum?access=soniagarden2026` passed.
  - `/tiktok-platform-review` passed.
- Authenticated local admin routes passed using the local mock admin token:
  - `/admin`
  - `/admin/mum`
  - `/admin/mum-tribute-studio`
  - `/admin/coaching-command`
  - `/admin/coaching-programs`
  - `/admin/coaching-content-library`
  - `/admin/metricool-command`
  - `/admin/tiktok-review`
  - `/admin/tiktok-platform-review`
  - `/admin/store-orders`
  - `/admin/orders`
  - `/admin/payment-diagnostics`

## Mum's Garden / Without You Here

Status: locally renders and private access route works.

Observed:

- `/mum?access=soniagarden2026` renders with opening H1: “She meets us in the sky first.”
- `/admin/mum` renders when authenticated locally.
- Two audio requests for `Amazing Grace` and `Ave Maria` showed `ERR_ABORTED` during screenshot capture. This may be browser autoplay/screenshot timing, but should be manually play-tested before launch.
- The current direction uses exact photos/tribute artwork rather than an unapproved deepfake-style Sonia avatar.

Launch blockers:

1. Confirm every tribute image is approved and free of grave/coffin/blur/double issues.
2. Confirm audio files play from the hosted Base44/CDN environment.
3. Confirm guestbook/family upload submissions go to approval before public display.
4. Deploy/sync the current local code to Base44 once CLI/login is fixed.

## HeyGen / AI twin

Status: Gannon assets already exist in HeyGen.

Recorded in `AVATAR-GANNON-WAYE.md`:

- Primary group: `6c33e7e3542c4466a17ef46c74e9ac58`
- Primary digital-twin look: `646da572f3284a1fa6bff984d6f3471c`
- Primary private voice: `f7ffebd851b74bd1ad83d83a1087b2f4`

Do not create duplicate Gannon avatars unless Gannon requests a replacement.

Do not create a lifelike Sonia/Mum avatar or voice clone until exact assets, consent wording, and tribute labelling are explicitly approved.

API key setup is documented in:

`C:\Users\ganno\Documents\Codex\gannon-waye-music-pr-work\docs\HEYGEN_API_KEY_SETUP.md`

## Music / content automation

Status: idea engine is running, publishing engine is not ready.

Base44 findings:

- ApprovalQueue has many pending daily social drafts and daily money opportunities.
- ContentCalendarPost has many `draft` records.
- Recent posts have:
  - `media_status: not_started`
  - `metricool_ready: false`
  - no `public_media_url`

Meaning:

The system is generating content ideas, but not turning them into approved visual assets and scheduled posts. The next upgrade should connect the pipeline:

Pressmaster or Codex idea → script → approved media → HeyGen/avatar or cover-art motion export → caption → approval → Metricool scheduling.

## Store / merch

Status: product records exist, but checkout/payment reliability is blocked.

Findings:

- 9 merch products found.
- Several active products have `stock_quantity: 0`, including CD/tee/tote style items.
- Payment diagnostics contain five open critical records saying `STRIPE_SECRET_KEY missing or invalid`.
- Thea Elsworth’s real shipped order exists:
  - Order ID: `6a1b33200908eb6a636c3ebf`
  - Status: `shipped`
  - Tracking number: missing
  - Items: `"Respect Is Earned" Hoodie — Dark Grey` XL and `Respect Is Earned Coffee Mug`
- The duplicate recovered Thea order is correctly marked duplicate/do-not-ship.

Fix priority:

1. Rotate/confirm Stripe secret and Base44 secret configuration.
2. Resolve open `PaymentDiagnostic` rows after Stripe is confirmed.
3. Hide or mark zero-stock products correctly.
4. Add tracking or “shipped without tracking” wording to the Thea fulfillment email/draft.

## Coaching / mindset business

Status: framework exists, offer is not client-ready.

Base44 findings:

- `CoachingLead`: 1 lead/request record.
- `CoachingWorkbook`: 0 records.
- `CoachingResource`: 0 records.
- `CoachingIntake`: 0 records.
- Coaching pages render locally under authenticated admin routes.

Useful local source documents found:

- Resilience Fitness packages and pricing documents.
- Online Coaching Benefits.
- Client Goal Setting Suggestion Template.
- Client coach check-in schedule.
- Foundational Lifts Course Client Booklet and pricing.
- Service agreements/contracts.
- Training programs and client program templates.
- Counselling/psychology/mindfulness reading materials.

Do not use publicly without review:

- Client-specific files.
- Court/legal documents.
- Relationship/counselling documents involving third parties.
- Any document containing private health, legal, financial, or relationship information.

Recommended client-ready build:

1. Create 3 public-safe offers: Self Respect Reset, Resilience Foundations, Creative Breakthrough Coaching.
2. Create one free lead magnet workbook from the Resilience Fitness template material.
3. Create intake + consent flow with “coaching is not therapy” and crisis support disclaimers.
4. Create admin-only client dashboard and appointment workflow.
5. Add video/module placeholders only after scripts are approved.

## GanozMix Direct / dropshipping

Status: not operational as a marketplace business yet.

Findings:

- Original app `GanozMix Direct` contains the real product state.
- Copy app product table is empty.
- Product table contains 42 records, mostly `draft` / `DRAFT`.
- Only one product showed `status: active`, but it had `lifecycle_state: DRAFT` and no live marketplace URL.
- Listings table has only 2 records:
  - one fake/test listing
  - one old zero-sales eBay-style listing
- Orders table has 0 records.
- eBay store token expired on 2026-07-08.
- ErrorLog shows repeated `syncOrders` failures: `INVALID_TOKEN_TYPE` and eBay HTTP 401.
- JobQueue has 27 dead-letter extraction/enrichment jobs.
- WeeklyDigestDraft records are draft-only and `email_sent: false`.

Root cause:

GanozMix Direct has product ideas and records, but the marketplace connection and job pipeline are broken. “Active” or `listed_on` flags are not reliable proof of live listings.

Best next product to action:

Magnetic Cable Organiser (Bamboo).

Why:

- Hero product potential: true.
- Estimated margin: 42.1%.
- Low return risk.
- No legal risk.
- High social content potential.
- Clean practical problem/solution fit.

Shortest path:

1. Reconnect eBay with OAuth Bearer token.
2. Clear/resolve dead-letter test jobs.
3. Manually verify supplier URL, landed cost, shipping time, and returns.
4. Build one listing template and one short Reel/TikTok proof video.
5. Publish only after approval and URL verification.

## Computer access/security

Status: no active remote-control tool found in the checks run, but local profile/account hardening is needed.

Findings:

- Current user: `desktop-hv0aslq\ganno`.
- Gannon is the only enabled local administrator besides the disabled built-in Administrator account.
- Victor De Mauro and `victo` accounts are enabled but normal Users, not Administrators.
- Victor De Mauro last logon: 2026-06-19 09:19.
- `victo` last logon: Never.
- Both Victor accounts show `Password required: No`.
- Remote Desktop is disabled.
- RemoteRegistry, TermService, WinRM were stopped/disabled in the earlier inspection.
- No active SMB sessions or open SMB files were found.
- No obvious AnyDesk/TeamViewer/RustDesk/ScreenConnect/VNC/LogMeIn-style remote process was found.
- Microsoft Defender is enabled with real-time protection on and no current threats listed.
- Network profile is Public, but File and Printer Sharing firewall rules are enabled even for Public. This is the main local network exposure found.

Recommended hardening before deleting profiles:

1. Confirm Google Drive migration/archive is complete for required files.
2. Disable Victor De Mauro and `victo` accounts before deletion if you want immediate lockout.
3. Disable File and Printer Sharing inbound rules unless you need LAN sharing/printers.
4. Keep RDP/WinRM/RemoteRegistry disabled.
5. Run a full Defender scan.
6. Change Microsoft/Google/Base44/Stripe/HeyGen/TikTok passwords and enable MFA.
7. Reboot router/modem, update firmware if available, change Wi-Fi password, and remove unknown devices from the modem admin panel.

## Private phone / Brazil calling

Goal: private business phone operations without showing a public personal number.

Safe architecture:

- Public site shows contact form / request-a-call only.
- Website stores lead/call requests in Base44.
- Admin-only call dashboard logs outbound calls.
- A compliant VoIP provider handles outbound calling.
- No public number is shown unless Gannon explicitly approves.

Do not try to bypass telecom registration or spoof caller ID. Use verified/provider-owned caller ID only.

## Deployment blocker

Base44 CLI still times out from PowerShell:

```powershell
npx base44 whoami
```

The Base44 connector can inspect data, but source deployment/sync through CLI is still not confirmed. Do not assume Base44 has the latest local code until CLI login/deploy or editor sync succeeds.

## Priority order from here

1. Fix Stripe secret/payment diagnostics.
2. Complete Base44 deployment/sync for Mum’s Garden and current site code.
3. Reconnect eBay OAuth for GanozMix.
4. Approve and produce one HeyGen/Gannon 15-second test video.
5. Turn one content draft into an approved media-ready post and schedule it.
6. Build the first coaching lead magnet/workbook using public-safe Resilience Fitness material.
7. Harden Windows accounts/firewall after archive/migration confirmation.
