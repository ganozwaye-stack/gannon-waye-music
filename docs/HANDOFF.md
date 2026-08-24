# Cross-agent handoff

Protocol lives in `AGENTS.md` §8. Read this before starting. Append to `## Log` before finishing.
Seeded 24 Aug 2026 by Claude (Cowork session).

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
