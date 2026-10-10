# Cross-agent handoff

Protocol lives in `AGENTS.md` §8. Read this before starting. Append to `## Log

### 2026-09-26 · ChatGPT · Music activity evidence monitor
Did: Added MusicActivity, MusicEvidenceSummary, MusicEvidenceDetail, MusicEvidenceSources, the read-only useMusicEvidence hook, source links, MusicEvidence schema, protected routes, sidebar entry and Dashboard summary. Changes at 2a58b6b4. No collector or scheduled alerts were enabled.
Found: Direct official HTTP reads at 2026-09-26T00:28Z show all three songs on Unearthed; Set Free Artist Pick; every track playedOn=[]. Apple returned 100/100 playlist songs with no Gannon Waye match; Spotify embed returned 100 with no match but no verified total. Latest 10 timestamped records per ABC station had no artist match; this is NOT complete historical coverage. Source URLs are in src/lib/musicMonitorSources.js. Build and all prebuild safety checks passed; storefront lock passed. Public /assets/index-DWA51fl4.js still does not contain /admin/music-activity.
Found: Base44 write_file/edit_file unexpectedly reset to and auto-committed/synced main despite the feature branch created before edits. Stopped native file writes once detected. No explicit git push main or production deploy was run. All collector file writes returned tool safety-status blocks and were not installed.
Left: NOT LIVE. Requires review of the committed UI, production deployment approval, authenticated collector, scheduled refresh, event persistence, notification delivery and read acknowledgement. Validate source parsers, provider permissions, polling/backfill windows, failure/stale states and duplicate suppression before enabling alerts. Private Spotify/Apple/YouTube/Too Lost reports are not connected. Never treat Artist Pick, a profile listing, review, blank field, stale page or incomplete playlist as airplay evidence. Do not promise per-stream or worldwide use alerts. No fake/test event was written to production.
For: Gannon and Deego engineering review. Review baseline-to-2a58b6b4 before any production deploy. Future code edits must use an isolated GitHub branch workflow rather than native Base44 file auto-sync.
` before finishing.
Seeded 24 Aug 2026 by Claude (Cowork session).

---

## RETRACTION — 25 Aug 2026 — phantom CD stock and fabricated prices

**The CD singles do not exist.** Earlier work — the eBay listing copy in the tonight
brief, and the "already has CD stock" note in the demand-test discussion — treated a
slim-case CD single and a signed deluxe CD as real inventory. Gannon has confirmed they
were display items only. There is no stock.

**Do not list, price, describe, or reference CD product in any channel.** Listing stock
that cannot be shipped is the exact conduct the ACCC penalised Mosaic Brands for — and it
was warned against in the same document that then listed it. Strike both CD listings.

**All merchandise prices asserted before 25 Aug are retracted.** See the correction block
in `docs/DEMAND-TEST.md`. No price is valid until base cost is read from the connected
POD account, AU production route. The maroon dressing gown is killed as a product — no
print-on-demand path, so it means inventory and sizing risk, which is the wrong shape
for a business with one sale.

**Confirmed real sales history: one order.** Thea Elsworth, $90.48, 29 May, hoodie + mug.
The two $0.99 sessions are owner tests, excluded from revenue, profit and inventory. Any
agent reporting more than one real order is reading test data as sales.

---

## OPEN

### O-1 · Stripe webhook has never delivered a purchase event · owner: Codex · CRITICAL

Read from the Stripe API directly on 24 Aug, live mode, `acct_1TRr2YEMr9QX7GBL`.

**Ruled out — do not re-test these.** Both webhook endpoints are `enabled`, and both subscribe to `checkout.session.completed`:

```
we_1TrdLiEMr9QX7GBLryEIahQn   enabled   created 10 Jul 2026
  url: https://gannonwaye.base44.app/functions/stripeWebhook
  events: checkout.session.completed, charge.dispute.created, charge.refunded,
          payment_intent.payment_failed, payment_intent.succeeded

we_1Tb5bZEMr9QX7GBLk37NUqlG   enabled   created 26 May 2026
  url: https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter
  events: 26 types, incl. checkout.session.completed and customer.created
```

**Live hypothesis — the URL on `we_1TrdLi`.** The two endpoints use different host patterns. `api.base44.app/api/v2/apps/{appId}/functions/{name}` is the canonical Base44 function route and is the only endpoint that has ever delivered anything into the app. `gannonwaye.base44.app/functions/{name}` has delivered nothing in the six weeks since creation. Verify whether that host routes to a function at all.

**Second lead, unresolved.** The only genuinely Stripe-delivered event on record is `evt_1TdylbClJA0hGwhH3MISh565` — account suffix `ClJA0hGwhH`. Every webhook endpoint and every real order carries `EMr9QX7GBL`. The two cancelled pre-orders also carry `ClJA0hGwhH` (`seti_1TXxLwClJA0hGwhH…`, `seti_1TXeziClJA0hGwhH…`). **Two Stripe accounts may be in play.** Confirm which account the storefront creates sessions on. Do not assume.

**Not evidence:** the `codex.integration.probe` row written 21 Aug (`6a87bbc76bf85eef5eb6e146`) is a synthetic record, not a delivered event.

**Closes when:** a live checkout produces a MerchOrder with no human intervening, evidenced by a `StripeEventLog` row whose `stripe_event_id` starts with `evt_` and whose source chain shows Stripe as origin.

### O-2 · A live payment was taken and never recorded · owner: Codex · CRITICAL

All 44 live checkout sessions pulled. Exactly three were ever paid:

| Session | Date | Amount | Payment intent | MerchOrder |
|---|---|---|---|---|
| `cs_live_b1NME9L…` | 29 May | $90.48 | `pi_3TcOQdEMr9QX7GBL1qalbneo` | created by hand, then duplicated |
| `cs_live_a1uszUsd0MuIDvFCIdOr1aZXdHueXHKDMQNSqGzDBcMAiNNEGwifEjH7VL` | 1 Jul | $0.99 | `pi_3ToHmFEMr9QX7GBL1LhkBZrX` | **none — no record anywhere** |
| `cs_live_a1Xqmlj…` | 10 Jul | $0.99 | `pi_3Trf2nEMr9QX7GBL0NkQRODl` | created by hand 35 min later |

The 1 July payment is one of Gannon's own $0.99 tests, so nobody is waiting on it. Recover it and mark `excluded_from_revenue`, `excluded_from_profit`, `excluded_from_inventory`, `do_not_ship`. It is also the second regression test for O-3.

### O-3 · Order creation is not idempotent · owner: Codex

One Stripe session produced two MerchOrders four minutes apart on 30 May (`6a1b33200908eb6a636c3ebf`, `6a1b33bba45c8aaa6e10cb01`) because `recoverStripeOrders` ran twice unguarded. Gate on the Stripe **session ID** via the existing `IdempotenceLog` entity. Use the 30 May double-book as the regression test.

### O-4 · 215 synthetic RiskAlerts still open · owner: Codex

Claude dismissed 500 on 21 Aug and hit a write limit. Remainder are all `SocialCommentMonitor` demo records; `BookingEnquiry` count is 0, confirming none are real leads.

```
entity: RiskAlert
query:  { "status": "open", "source_agent": "SocialCommentMonitor" }
update: { "$set": { "status": "dismissed" } }
```

Then deploy the source fix, which **already exists in the sandbox and has never reached production**: `socialCommentMonitor/entry.ts` contains a `demoAuthors` set and a `looksLikeBundledDemo` guard that returns `skipped: true` without writing records. The code is correct. Ship it.

### O-5 · Function cap blocks all new deploys · owner: Codex

121 functions deployed against a plan limit of 50. Consolidation audit with per-function evidence, **no deletions** until Gannon approves a named list. Or price the plan upgrade and put the number to him.

### O-6 · Agents do not read or write memory · owner: Codex

`AgentMemory` has the right schema and one excellent hand-written record (the release publication policy, `6a87d73640f72b7c78831411`). But agents never recall before acting and never write real lessons after. Auto-generated `AgentLearningRecord` entries currently read like *"Processed 11 tasks with 100% pass rate"* — a throughput metric, not a lesson. `success_score` and `failure_score` are null everywhere, so nothing can improve.

Build `recall(agentName, context)` and `remember(record)` in `base44/shared/`. `recall` always loads `is_permanent: true` AND `importance_score >= 9` records first as hard constraints — the publication policy lives there and a run that cannot assemble that tier must fail closed. `remember` rejects any lesson with no `linked_entities` evidence link. Nightly consolidation back-fills outcome scores and supersedes bad memories by editing the old record to point at its replacement, never deleting.

### O-7 · Sonia's Garden has drifted from the approved design · owner: Codex, then Gannon

The garden is built and routed. `/mums-garden` → `src/pages/MumsGarden.jsx`, with 15 components:

```
src/components/mums-garden/
  CinematicScene.jsx  MumGardenGallery.jsx  MemoryFrame.jsx
  GardenHotspots.jsx  FiligreeDivider.jsx   GoldDust.jsx
  scenes/ RealAustralianGarden · ArchwayScene · MemoriesAmongTrees
          MusicalConclusion · HeavenlyArrival · EnteringTheTrees
          BenchGarden · GardenScene · GardenRooms
```

Related pages that may overlap or conflict: `/remember-mum`, `/admin/mum`, `/admin/memorial`, `/admin/without-you-here`, `src/pages/MumTribute.jsx`, `src/pages/Memorial.jsx`, `src/pages/RememberMum.jsx`. There is also a Playwright spec at `src/gannonwaye-playwright-pack/tests/mum-tribute.spec.js`.

**Gannon's stated intent, in his words:** world images that carry you as you scroll; 3D imagery with picture frames; images inside the frames that behave as hotspots — they move on hover, and on click open into a memory, a quote from the song, or material from his mum's funeral or eulogy.

That description maps onto components that already exist (`GardenHotspots`, `MemoryFrame`, `CinematicScene`, `GoldDust`). So this is very likely **restoration, not a rebuild**.

**First task is archaeology, not code.** Walk the git history of `src/pages/MumsGarden.jsx` and `src/components/mums-garden/`. Find the commit range where the hotspot/frame interaction was working as described, and produce a diff summary of what changed since. Report before changing anything.

Claude cannot see Gannon's ChatGPT history where the approved version was described, and has not invented one. If the git history is inconclusive, the missing input is that conversation — ask Gannon to paste it rather than guessing at his intent.

**Handle with care.** `AGENTS.md` §2 forbids deleting memorial tribute data. This page is about his mother. Nothing here gets removed or overwritten without his explicit sign-off.

### O-8 · Product sourcing for micro-branded dropshipping · owner: Codex (Deego)

Gannon wants Deego sourcing product candidates continuously, starting with a thank-you / gifting line, and listing them for micro-branded dropshipping.

**Hard rule, make it a schema constraint not an instruction:** a candidate is not a candidate until every field is filled from a real source — direct supplier URL that resolves, product image from that URL, landed cost, shipping cost and time to AU, stock status, market proof (actual sales evidence, not a trend article), platform fee assumptions, projected unit margin. Anything missing stays `research` and never reaches the approval queue.

**Score on margin per hour of Gannon's time**, not margin. And every candidate needs a plausible answer to "where does the artwork go on this?" before it scores at all — a generic dropship product carries no message and will not sell against the artist story.

Known-good supplier research already done: Printful is the pick for AU (local fulfilment, real API, eBay/Amazon/TikTok Shop integrations). Prodigi does genuine metallic gold foil on prints and posters with no setup cost — the only route to foil, since no POD service will foil a garment. Embroidery is the garment alternative.

**Closes when:** 20 fully-evidenced candidates sit in the queue, each with a supplier URL that resolves and a margin Gannon can check.

### O-9 · Data hygiene · owner: Gannon, then Codex propagates

* **Merchandise URL — RETRACTED, no defect. Do not act on the earlier note.** An earlier entry in this file claimed the printed hoodie and mug read `GANNONWAVE.COM` and escalated it as a live defect. **That was wrong.** Claude misread the letterform in a product photo — in gold letterspaced caps at that size a `Y` and a `V` are easy to confuse. Gannon confirmed on 24 Aug and supplied the master URL asset, which reads **`WWW.GANNONWAYE.COM`**. The merchandise has always been correct. No print file needs changing, no domain needs registering, and no codebase audit is required — a scan already confirmed the `gannonwave` spelling appears nowhere in `src/` or `public/`. Canonical spelling is `gannonwaye.com`, which is what the merch already says.
* **Song title — RESOLVED.** Gannon confirmed 24 Aug: the title is **`Set Free`**. Not *I've Been Set Free* (that is the lyric doc's working header) and not *Set Freee* (a typo in Lyric record `6a3aa17c5f2267d730b5a824`). Correct the Lyric record and confirm the Release record and all distribution metadata read exactly `Set Free`. Cover art already reads SET FREE and is correct.
* **Cover art.** Set Free's finished cover art exists and Gannon holds it — it is not attached to the Release record. Same for the brand asset set (GW circle mark, GW heart mark, gold signature, URL bar). 15 of 17 Release records point `artwork_url` at `gannonwaye.com/images/home/gannon-waye-home-hero.png` — the homepage image, not cover art. Only *Without You Here* and *Thankyou* have real artwork attached. Set Free artwork exists and Gannon has it; it is not on the record.
* **Shipping rule.** `shippingOptimisationAudit` raises a daily high-severity issue that `"📍 Local Pickup — Cd"` undercharges by $7. The rule is named *Local Pickup*, where $0 is correct, and there are five pickup rules with the same shape. **Verify the auditor before applying the fix**, or the site starts charging postage on collection.

---

## CLOSED

### C-1 · Deego had no scheduler · closed 24 Aug

Was: no function anywhere wrote `DeegoAutomationRun`; 84 of 89 runs `blocked`; nothing since 19 Aug 12:15. Now: three `success` runs on 24 Aug at 00:20, 05:20 and 07:48, on a schedule, with no session open. Evidence: `6a8b8e3ef2ab26c4d617a665`, `6a8bd49e4c46690a86cb16b6`, `6a8bf742c682eec24ef21251`.

### C-2 · Approval queue was a graveyard · closed 24 Aug

Was: 34 items, 30 `needs_approval`, oldest 54 days, nothing ever approved. Now: 54 items with most of the backlog `complete`, including the 19 Aug campaign visuals. 18 still pending — that is normal queue depth, not a blockage.

---

## Log

### 2026-10-10 · Codex · Next 9 am coaching launch readiness
Did: Added scripts/test-coaching-launch-readiness.mjs and docs/COACHING_LAUNCH_READINESS_2026-10-10.md. No design/backend-policy/flag changes; prior Golden Key checkpoint and checkout type fixes retained.
Found: New no-network harness passes four closed/incomplete config checks before SDK. Stale peer fixture permits two leads; spoofed forwarded header and separate handler bypass per-process burst cap. Receipt source RLS admin-wide, owner-only not proven. Latest instruction specifies separate optional FREE 15-minute clarity call plus PAID A$99/45-minute consultation; older admin 30-minute discovery-call copy is superseded, no configured free booking found.
Left: Owner under-18 decision, verified existing scheduling destination/availability, isolated hosted synthetic-record owner/non-owner/anonymous/service tests, reviewed receipt policy, atomic uniqueness and shared ingress limits. No production data read or new login/credential/permission/paid transaction/publication; report includes exact dependencies and conditional next-9am forecast, not scheduled delivery.
For: Parent briefing and Gannon decisions; engineering after approved isolated acceptance environment exists.

### 2026-10-10 · Codex · Golden Key bottom-left supersedes top placement
Moved the existing membership figure below BOTH article columns in the Coaching newspaper container, grid row 2 column 1; phone follows all seven paragraphs. Actual desktop pixels inspected: badge left edge matches article at x128, below both prose columns. Desktop/phone/tablet membership geometry assertions passed. Service title, original six covers, metallic CSS, central contour, portrait and unchanged seven paragraphs retained. Education redistribution held at user request; column bottom difference previously 70.5px.
Existing circular logo choices found in original Drive sheet 11aURldvfxYMwV6tYeVKirKYBE95Kd2P0 / Library libfile_4bb2c3a7711c8191a0a64431739c07a9: 1 tree/head, 2 R/sun, 3 mountain/path. No selection/approval evidence, none inserted. Original sheet hash 7417f9db180dbdf468252e7c63bc9cfee599bbb3fadaf305574d3d7913af28df.
Unpublished preview app 69eb7905ca6eb4180010f794, /coaching. Intake, analytics, staged checkout/capture remain closed. Public anonymous denial against actual existing private records, replica uniqueness/abuse, under-18 policy remain unresolved; no live leads/payments/publication. This log supersedes earlier Golden Key top-placement instructions.

### 2026-10-10 staged checkout follow-up
Fixed all 15 createCheckoutSession strict Deno typing errors with confined annotations, explicit product narrowing, unknown-error handling and shipping input JSDoc. Two new isolated staged capture packages contain their local unchanged shared pipeline/analytics copies; live base44/functions and base44/shared remain unchanged. Three packages pass Deno 2.9.6 checks with pinned SDK 0.8.30 and Stripe 14.21.0. Esbuild independently bundles each function without parent-directory imports.
CHECKOUT_DRAFT_OPEN and VERIFIED_ORDER_CAPTURE_OPEN default closed before SDK/Stripe. No flags configured, deployment or activation. Mock harness passes missing live webhook signature, invalid reference, foreign-store currency/mode/policy/ABN, unpaid session, sanitized first/last attribution, canonical records, duplicate retry and incomplete metadata tests. All storage/processor/notification actions in-memory; deployed role/concurrency/replica tests remain unverified.
Read-only contents of all seven public CalendarEvent records reviewed: no coaching client names, DOB, intake or health details found in these records. They contain internal planning information, internal links and one walkthrough incorrectly classified as a gig. This is a confirmed public-record exposure of planning material; actual anonymous existing-record read was not attempted. No rows or permissions changed; public frontend renders title/location/calendar link while API schema makes full is_public rows readable. Coaching integration remains absent.
Exact prior rejected policy action/targets/reason recorded separately in docs/COACHING_POLICY_EDIT_REJECTION_2026-10-10.md. No rejected copy retry. Security policy hashes unchanged. Under-18 policy still undecided.

### 2026-10-10 original cover fan and independent verification
Latest owner refinement: books stay exactly in place. Same approved photo right-aligned (desktop 40% natural-aspect region, phone 55% background region); no image alteration. Desktop face clear of books, mobile portrait above fan. Three final viewport checks passed; source pixels reviewed. Final build and all prebuild safety guards passed.
Six original PNGs, reference and metadata hashes verified against SHA256SUMS. ZIP SHA256 7c0bcfa6b14bda05e2aaa224ac0288d540ffad0a6d10445637a42dbd455504af; Library libfile_41f5536eabf88191a7f74490306d4eb4. Windows DNS blocked download; unchanged official helper succeeded in canonical remote project. Public catalogue uses original cover bytes, static fan follows supplied geometry; reference and desktop/phone pixels inspected. Advert version 2 and interiors untouched.
36 Chromium desktop/phone/tablet checks passed (2.9m), covering fan decode/containment, exact approved story/style, journals/navigation/basket/release/payment holds, intake receipts/failures/validation, telemetry stripping/test exclusion. Two Node policy suites passed with mocks. Four staged intake/aggregate endpoints pass Deno type checking. Exact pinned checkout packages resolved; staged checkout still has 15 strict typing errors and payment capture call-site packaging remains pending.
Actual existing role metadata: two owner admins, one other user. CoachingLead owner RLS metadata present; receipt/events and four endpoints absent from hosted app. Anonymous valid nonexistent-ID SDK read returns zero, not an existing-record denial proof. Real multi-replica uniqueness and abuse/ingress trust unverified; limiter process-local. Under-18 decision pending. Production intake/analytics closed; no real leads/events/payments/emails or deployment.
Read-only calendar audit: 158 rows; 7 public (6 releases/1 gig), queried only ID/flags/types. Actual schema allows public is_public rows. Existing sync copies description/location/calendar links and classifies gig/release keywords public. TourTracker requests full public rows, displays title/location/link. Absence of historical sensitive text not proven. Future coaching must remain outside this sync; no integration added.
Automatic approval rejected broad security-policy-copy edits; no rejected edits applied. Read-only hashes proved existing copies identical. Confined TS/harness fixes accepted without security/account permission changes.


### 2026-10-10 — Final Coaching typography, private interest draft and aggregate analytics (unpublished)

- Latest exact owner direction: START WITH WHAT MATTERS TO YOU, Poppins 500, existing Navbar/FanChatWidget gradient-gold-text. Subtitle is Poppins 400, 20px/24px, normal foreground colour. Entire title centered; identical gold rules above/below; both choices immediately before the unchanged seven approved paragraphs. Original sunlit wallpaper/scrim and small Golden Key mark retained.
- /coaching -> Enquire about Coaching now reveals the required short form: first/last name, valid nonfuture DOB, mobile, email, 1000-character support message and explicit consent to contact. One canonical CoachingLead replaces the previous direct double save. In-flight guard, stable attempt UUID and matching saved receipt prevent false success. Pending/ambiguous saves remain pending; owner reconciliation is staged. Journal purchasing and calls remain independent.
- New production client hold defaults closed; local development tests use intercepted receipts. Backend functions are staged outside base44/functions and remain closed by environment gates. The builder rejected an attempted cross-directory backend import; failed entries were moved out of deployable directories. No endpoint activation/publication or real submissions occurred.
- Private lead RLS source restricts reading/updating/deleting to owner email + admin role; anonymous direct create is blocked. A minimal staged receipt ledger supports service retries without granting broad access to private lead details. Owner inbox backend denies anonymous/non-owner sessions. No intake details, DOB, contact IDs, messages or journal answers enter the aggregate query/response.
- Existing analytics helper/App tracker/owner social analytics page reused. Native CTA counters, page views, acknowledged contact emails, saved enquiry counters and separate lead totals added. Known tests/admin traffic excluded; same-page choices do not inflate page views. Existing PostHog automatic capture/session recording/background captures disabled; persistence/cookie configuration retained. First-party capture and dashboard backend are staged/closed, not live metrics.
- Session-only sanitized first/last source + allowlisted UTM source/medium/campaign pass through checkout. Server attribution overlay and protected payment_verified flag only follow verified paid capture. Historical rows without verification flag omitted. Duplicate/excluded owner orders omitted; refunded net revenue zero; unknown partial refund amounts flagged instead of guessed. Music clicks are not streams; TooLost production OAuth/analytics is not verified here.
- Verification: 18 latest form/analytics/centered-layout browser checks passed across Chromium desktop/phone/tablet; final uppercase/lighter/body-colour typography passed 3 more checks; local production intake hold passed all 3 viewports (button disabled and requestSubmit sends zero requests). Node tests cover invalid DOB, limits, receipt retries, pending and concurrent mock saves, owner denial/RLS source, privacy sanitization, date ranges, deduplication, payment verification and refund gaps. Earlier full 18 Coaching journal/navigation/payment-hold suite passed. No Safari claim: isolated WebKit absent.
- Publication prerequisites: decide/implement under-18 handling (no age-admission rule inferred); verify actual owner/non-owner/anonymous/service-role permissions, trusted ingress/replica rate limits, platform concurrency, receipt recovery and verified Stripe caller packaging in an isolated authorized environment. Parent deployment/activation approval still required. Adult preview works locally; endpoint remains closed to everyone.
- Fan remains absent: six canonical coverImageUrl values are null; no verified six-cover asset set found in source/public. Parent-supplied CSS fan geometry can be used after genuine matching covers become available. No download bypass, old-cover substitution or generated fan.
- Full review/deployment notes: staging/README-COACHING-AND-ANALYTICS.md. Same Library PDF updated with final desktop/phone page plus blank private form previews. No real public broadcast, payment, publication, spend, new OAuth scope or persistent permission grant.

### 2026-10-10 — Coaching gold hierarchy and compact polish (unpublished)

- Owner wording now appears as two Poppins 700 lines: Start with what matters to you / Coaching with Gannon Waye. Exact Primary Gold #F5D06E comes from src/pages/admin/BrandKit.jsx; scoped classes avoid changing global theme tokens.
- Higher body contrast, restrained gold rules, small 48px Golden Key membership element and stronger two choices; exact seven approved paragraphs and selected portrait pixels retained. No animation added or purchasing enabled.
- Full Coaching suite: 18 checks passed across Chromium desktop/phone/tablet. Six Safari checks could not launch because isolated WebKit is absent; no Safari claim. Build command returned zero; safety guards passed.
- Bounded read-only Downloads/Documents/Pictures and relevant media/upload folders search found duplicate membership PDFs plus a 1730x2541 scanned certificate review PNG, not a better standalone logo. No Bachelor of Psychological Studies folder found in searched scope. Clean 172px existing logo retained at 48px.
- Same Library preview PDF refreshed for review. Exact fanned-journal source remains blocked; no substitute generated and no transfer retry.
- Route QA: current /coaching choices lead to journals or coaching details/contact, not the new interest intake. Existing CoachingIntakeForm writes two records directly; old home interest form has only name/email. New required first/last name, DOB, mobile, email and short support text, server validation, saved receipt and private owner-only control remain next authorized implementation. Do not claim reel registration CTA ready live. Under-18 intake handling is an unresolved owner policy; purchases stay independent.
- Analytics remains read-only discovery; no deployment, live forms, payments or public release.

### 2026-10-10 · Codex desktop delegate · Golden Key membership preview element

Did: Added the original unedited 172x172 GKlogo.png at public/images/golden-key/GKlogo.png, rendered 48x48 beside the clear caption Lifetime Member, Golden Key International Honour Society in the Coaching education section. Exact revised story and all purchase holds remain unchanged.
Found: Original 7159-byte logo retrieved through authorized Drive access from 1yaZvf9RaqPV5cAUTd3DrihVJvEru462I and its pixels inspected. Parent verifier confirmed the LifetimeMembership certificate at Drive 1I_CSyAkcWXEizffNmVRsQxrQcVLHD-GK. Gannon explicitly requested the element and stated permission to use it; independent written logo-use permission was not located. No accreditation, certification, partnership or endorsement claim added.
Left: Unpublished preview only. Written permission evidence remains a release-review note, not a blocker to the owner-authorized preview. Exact fan image still awaits accessible original advert bytes. Website analytics and source-attribution work are the next authorized scope after preview delivery.
For: Parent thread for review and analytics handoff; no publication or paid service activation authorized.

### 2026-10-10 · Codex desktop delegate · Agreed revised Coaching story

Did: Replaced only the seven Coaching introduction paragraphs with the exact consolidated text approved by Gannon through the parent thread. Updated exact-copy assertions and responsive captures; retained the sunlit wallpaper, gradient, Poppins 700 heading, compact columns, journal/coaching choices, prices and all purchase holds.
Found: Desktop, phone and tablet landing checks passed against every supplied paragraph, loaded Poppins 700, wallpaper decode, no horizontal overflow, 18px body text, 44px choices and separate navigation. The prior full copy remains recoverable at checkpoint 6aca02f86e8a28cd75028bea, commit d1e2765111ef0882c1e5eb0bc7536ecf225dc662.
Left: Golden Key badge remains pending official asset and permission verification. Exact fan advert remains pending accessible original MP4. No withdrawn sister comparisons, percentage claims or universal clinical promises added. No publication, deployment, payment or release activation.
For: Parent thread and Gannon to review the same Library preview item; continue asset work only when sources are verified and available.

### 2026-10-10 · Codex desktop delegate · Coaching wallpaper and approved copy

Did: Changed src/pages/Coaching.jsx to use Gannon's selected window-light journal portrait as static hero wallpaper with directional dark overlay and bottom fade, based on src/pages/ReleaseDetail.jsx Thankyou treatment. Replaced the new heading with Poppins 700. Added only the owner's requested paragraph break after move forward; all remaining approved wording, prices, choices and purchase holds preserved. Extended coaching-journals.spec.js with exact seven-paragraph text, loaded Poppins 700, wallpaper asset and tap-target checks.
Found: The 3 October additional owner brand rules specify Poppins 400 body / 700 headings, superseding the older serif heading rule for this scope. Existing website PNG 94d50ca39_77B69334-B27B-44A8-9C21-F7216216A118.png is byte-identical to Drive source 1ftd0pb96wXeZcxXsXTsYf8oUcYy_rkRw, SHA-256 6cd8eb71e81f094e86b5c5278f385491314cab06857fef41df57b9d39358e5ae. Exact source pixels inspected; no new portrait generated or uploaded. Full Coaching suite passed 18 checks across desktop, phone and tablet.
Left: Exact fanned-journal advert still pending accessible source bytes. Supported desktop Library materialization and one bounded retry failed; no existing original found in readable Downloads/workspace or relevant ZIP inventories. Source video Library libfile_4849c68cb85c81919a99d827dc0d8353 version 1. No publication, deployment, payment activation or asset substitution.
For: Parent thread for preview review and source-video placement; continue with the exact original MP4 once accessible locally.

### 2026-09-25 · ChatGPT via Base44 connector · Carry The Message owner artwork directions

Did:      Saved docs/CARRY_MESSAGE_HANDOFF_2026_09_25.md on feature/carry-message-handoff-20260925. Consolidated all 20 source references, the owner's placement/edit directions, supplier evidence and the private website preparation brief. This is a documentation handover, not completed design work or a dispatched supplier order.
Found:    The source board identifies the blue heart as 13. Owner says 02 is the inside neck label, 12 is general gratitude rather than necessarily the track, and 08 is the same design family as 06. DropSHIRT documents manual customer delivery and separately charged extra prints/label rebranding. Prodigi lists AU calendar fulfilment but its page conflicts between 2026 prose and 2027 SKU labels. Relevant primary URLs and the exact source filename map are in the handover.
Left:     No original images attached or transferred; no background edits or print exports made; no supplier orders, pricing changes, live product writes or website deployment. Entity schema access returned upstream_forbidden. Production readiness remains open. Bracelets are deferred. The unchanged boutique world remains locked. Review the current branch and do not merge without owner approval.
For:      Base44 or the implementing designer to recover exact originals, complete 09/14 separation and 15/16 composite first, and return supplier matched proofs and quotes. Do not reassign this sprint to Claude while he is on the film clip. No worker execution or completion is implied by this log entry.


### 2026-09-17 · Base44 · music queue player, home hero, CI repair

Did:      Added a song queue to the shared player (`src/lib/playerStore.js`: playQueue, addToQueue, next, prev, playAt, removeAt) and rebuilt `GlobalPlayerDock.jsx` as a music player with previous/next, a queue list and an inline lyrics panel for the current song. New `SpotifyEmbed.jsx` uses Spotify's IFrame API so the queue advances when a track ends (falls back to a plain embed if the API script is blocked). Music page gained Play all, Play and Queue buttons. Removed the bottom centre `SocialProofTicker` popup and the now unused `LyricsOverlay`. Home hero rearranged: welcome write up wide on the left top, Without You Here beneath it, Set Free narrow on the right with the countdown running vertically down its left side (`SetFreeCountdown` gained a `vertical` prop). CI: Playwright now runs from the repo root on the Chromium projects only, TruffleHog checks out full history without a base ref, store/security jobs set LIVE=1, and the missing `security.spec.js` and `coaching-private-lock.spec.js` were written (14 tests, all pass locally).

Found:    Every check on PR #38 also fails on `main` before this branch. Causes: Playwright was run from `src/gannonwaye-playwright-pack` whose config deliberately throws; the WebKit project ran on CI with only Chromium installed; two referenced spec files did not exist; TruffleHog diffed against a ref a shallow checkout does not have. Separately, `store-load.spec.js` expects `locked-storefront-stage`, `world-product-card` and an `M (4)` size button that the current store does not render (4 of 20 store/cart tests fail locally). Only one public Release exists (Without You Here) so the queue holds one song today; there is no audio file field on Release, playback is via the approved Spotify link.

Left:     `store-load.spec.js` drift against the world locked store was not touched: changing the store is forbidden by the storefront lock and rewriting the spec needs Gannon's call on what the store should assert. Full `all-tests` Playwright suite (34 specs) was not run end to end.

For:      Gannon to decide whether `store-load.spec.js` should be aligned to the current store or the store's test hooks restored.

### 2026-09-01 · Codex · Set Free release and merchandise staging

Did:      Verified the private Drive source folder Set Free 2026 GW. Corrected Lyric record 6a3aa17c5f2267d730b5a824 to the canonical title Set Free, refreshed its text from Drive file 1YiTQeuQTIdXKJDZmpB7XLl0RogeGhY9A, linked it to Release 6a538a537c7842081551d561, and kept every publication gate closed. Linked 11 other existing Lyric records to exact Release records. Added three one or two colour printable Set Free SVG drafts and DeegoDesignAsset records 6a96fa3d63802e058e7b7133 through 6a96fa3d63802e058e7b7135. Expanded DeegoDesignAsset with placement, image, colour count and song gate fields. Build passed.

Found:    Drive folder 17uBBq7MaMHpR-ghjt7O9o7Eh4cs8DcSc contains private MP3 Set Free 1.7 (2), official artwork and lyrics, but no mastered WAV. Set Free remains scheduled for 18 September 2026, private, pending approval and sensitive lyric review. Four lyric records remain unlinked because no exact Release exists or the title conflicts: You’re My Mum, All I Ever Wanted, One Day and Run Away. eBay Australia permits third party fulfilment only from pre purchased stock. TikTok Shop local Seller Center is not available to Australian sellers as of 1 September 2026.

Left:     No product, listing, lyric or release was published. No price changed. The three existing eBay listing drafts still contain retracted legacy prices and incomplete integer cent cost and floor evidence. The eBay token remains expired. Set Free needs a lossless distributor master, final mix and mastering credit confirmation, exact owner lyric approval, exact merchandise approval, and verified Australian print costs.

For:      Gannon for exact Set Free lyric and release approval, lossless master confirmation, design selection, supplier cost evidence and eBay reconnect. Next agent must keep generic product opportunities in research and must not route CJ order after sale fulfilment to eBay.

### 2026-08-24 · Claude (Cowork) · correction

Did:      Retracted the merchandise-URL defect in O-9. It was my error, not a real fault.
Found:    I misread `GANNONWAYE` as `GANNONWAVE` in a product photo and escalated it in this file as a confirmed defect on the best-selling product. Gannon supplied the master URL asset: it reads WWW.GANNONWAYE.COM. The merch was correct the whole time. Also confirmed: the song title is `Set Free`.
Left:     Nothing outstanding from this thread.
For:      Any agent that read the earlier note — ignore it. Do not change print files and do not register a domain.

### 2026-08-24 · Claude (Cowork)

Did:      Added §8 cross-agent handoff protocol to `AGENTS.md`. Created this file. Dismissed 500 synthetic RiskAlerts on 21 Aug (215 remain, see O-4). Produced merch design drafts and a system status board as Artifacts outside the repo.
Found:    O-1 (both webhook endpoints enabled and correctly subscribed — config theories dead; URL host pattern is the live lead; possible second Stripe account). O-2 (third paid session, 1 Jul, never recorded anywhere). O-7 (garden is built and routed — likely restoration not rebuild). Merchandise prints `GANNONWAVE.COM` while the system uses `gannonwaye.com`.
Left:     O-4 blocked on a write limit. O-1/O-2/O-3 need repo and deploy access this session did not have. O-7 needs git archaeology.
For:      Codex on O-1 through O-8. Gannon on O-9.

### 2026-08-24 · Claude (Cowork) · addendum

Did:      Nothing in code.
Found:    Gannon confirmed he owns gannonwaye.com only. The `GANNONWAVE.COM` on printed merchandise is therefore a genuine typo pointing at a domain he does not control. O-9 updated from open question to confirmed defect.
Left:     Print-file correction and codebase spelling audit not started.
For:      Codex — treat the merch URL as a live defect, not a data-hygiene nit.

### 2026-08-25 · Codex · Stripe, alerts, connectors, and deploy audit

Did:      Patched `stripeWebhook` to verify signatures, acknowledge non-order events without database waits, and keep paid checkout capture synchronous and idempotent. Recovered the 1 Jul internal $0.99 payment as MerchOrder `6a8c5ed283d0dd9d565aa305`, excluded from revenue, profit, inventory, donation, and fulfilment. Dismissed all 215 remaining synthetic SocialCommentMonitor alerts in one update and verified zero remain; the live demo guard returns `skipped: true`. Audited 123 source functions without deleting any. Verified the linked repository tracks no `dist/`, ignores it, and has no `dist/` history. Prepared least-privilege Google Drive, Gmail, and Docs reconnects and hardened Deego to require provider receipts.
Found:    The live Stripe account is `acct_1TRr2YEMr9QX7GBL`; both destinations belong to it. The primary custom-domain destination is routable. The secondary `/api/v2/` destination is obsolete and returns 405; the supported API form omits `/v2`. The 1 Jul completed event is `evt_1ToHmOEMr9QX7GBLYGdncJj0`. Live production still serves webhook v2 because the newest v3 checkpoint is staged but not published; CLI deployment is blocked by missing Base44 device authentication.
Left:     Publish the v3 checkpoint with action-time approval, replay a signed non-order event, replay `evt_1ToHmOEMr9QX7GBLYGdncJj0`, verify an exact Stripe-origin `StripeEventLog` and unchanged recovered order count, then run one fresh $0.99 checkout with payment confirmation. Complete Google Drive/Gmail/Docs OAuth consent and verify provider calls. Do not start function retirement until the named consolidation list is approved.
For:      Next verifier — do not call Stripe fixed until a fresh live checkout creates an order automatically and its real `evt_` row exists in `StripeEventLog`.

### 2026-08-30 · Codex · public store publication gate and Thanking You Kindly audit

Did:      Added a fail closed merchandise lifecycle to `MerchProduct`, restricted public reads to active live records, removed the hard coded fallback catalogue and Winter Bundle exposure, advanced the cart storage version, and made `createCheckoutSession` reload and validate every product before creating a Stripe session. Set all 17 merchandise records inactive and draft, then retired the two nonexistent CD records. Audited the Thanking You Kindly production app, corrected its false eBay ready state, separated marketplace catalogues, introduced listing level integer cent cost and floor fields, and consolidated eBay publishing behind owner approval.
Found:    The public store could display invented fallback stock and legacy prices whenever its data request was empty. Checkout accepted client supplied item data when a product lookup failed. Thanking You Kindly had a missing unsigned visitor route stop, six products with zero publication ready, five listings with none active, six product opportunities with none fully supplier verified, and an eBay token expired on 28 August 2026 despite the setup record saying connected.
Left:     No merchandise is live. Gannon must confirm stock or approve an Australian print provider, direct supplier pages, image matches, landed cost, shipping cost, retail floor, product copy and the exact listing. The owner must reconnect eBay. TikTok Shop needs seller account and API eligibility confirmation. Run the required live Stripe checkout verification from the previous entry before calling payments complete.
For:      The owner for supplier evidence, stock confirmation, eBay OAuth consent, TikTok seller access and exact listing approval. The next agent must keep Thanking You Kindly private and never restore the fallback catalogue.
