# Build order — 24 August 2026

Authored by Claude for Codex. Gannon wants all of this today. Read `AGENTS.md` §8 and `docs/HANDOFF.md` first; this file is the work order, HANDOFF.md is the evidence.

Build in the order given. Items 1 and 2 unblock everything else.

---

## 0. Chain of command — the rule every item below inherits

Gannon set this today and it is not negotiable:

- **Specialist agents are automated, but they report to Deego.** No specialist takes an external action directly.
- **Deego is their boss.** Work flows: specialist drafts → cross-checked by another specialist in that field → Deego reviews against the gates → only then does it reach Gannon.
- **Deego escalates to Gannon only when the item genuinely needs him.** If it passes every gate and every cross-check, Deego already knows what to do and acts within its approval budget.
- **Automation level never overrides approval.** An agent can be fully automated and still be forbidden from sending, spending, publishing or contacting anyone.

Encode this as `reports_to` and `cross_checked_by` on AgentRegistry, and enforce it in the action path — not in prose.

---

## 1. Stripe — do not stop until an `evt_` lands

Highest priority. Nothing else earns money until this is true.

**Ruled out already, do not re-test:** both endpoints are `enabled` and both subscribe to `checkout.session.completed`.

```
we_1TrdLiEMr9QX7GBLryEIahQn   enabled   created 10 Jul
  url: https://gannonwaye.base44.app/functions/stripeWebhook          ← has NEVER delivered
we_1Tb5bZEMr9QX7GBLk37NUqlG   enabled   created 26 May
  url: https://api.base44.app/api/v2/apps/69eb…/functions/stripeIntelligenceRouter
                                                                      ← the only one that ever has
```

**Step 1.** Verify whether `gannonwaye.base44.app/functions/{name}` routes to a function at all. The canonical Base44 route is the `api.base44.app/api/v2/apps/{appId}/functions/{name}` shape. If the first host does not resolve to a function, that single wrong URL explains the entire history and the fix is re-pointing the endpoint.

**Step 2.** Confirm which Stripe account the storefront creates sessions on. The only genuinely delivered event, `evt_1TdylbClJA0hGwhH3MISh565`, carries account suffix `ClJA0hGwhH`. Every endpoint and every real order carries `EMr9QX7GBL`. The cancelled pre-orders also carry `ClJA0hGwhH`. Two accounts may be in play. Verify, do not assume.

**Step 3.** Recover the lost payment. `cs_live_a1uszUsd0MuIDvFCIdOr1aZXdHueXHKDMQNSqGzDBcMAiNNEGwifEjH7VL`, 1 Jul, $0.99, `pi_3ToHmFEMr9QX7GBL1LhkBZrX`. No MerchOrder exists. Mark it `excluded_from_revenue`, `excluded_from_profit`, `excluded_from_inventory`, `do_not_ship`.

**Step 4.** Idempotency. Gate order creation on the Stripe **session id** through `IdempotenceLog`. Regression tests: the 30 May double-book (`6a1b33200908eb6a636c3ebf` / `6a1b33bba45c8aaa6e10cb01`) and the step 3 recovery.

**Done means:** a live checkout produces a MerchOrder with nobody touching it, evidenced by a StripeEventLog row whose `stripe_event_id` starts with `evt_` and whose source chain shows Stripe as origin. The `codex.integration.probe` row from 21 Aug is synthetic and does not close this.

---

## 2. Function cap — 121 against 50

Blocks every deploy, including the ones below. Do this second.

Audit all 121. For each: last invocation timestamp, caller, and whether another function already does the job. Produce `docs/function-audit-2026-08-24.md` with four buckets — **keep**, **merge into X**, **never invoked**, **duplicate of Y** — with evidence per row.

**Do not delete anything.** Gannon approves a named list first. Retirement means removing the deployment, not deleting source.

Expect heavy consolidation in the `openAI*` family (seven functions), the `notifyAdmin*` family (five), and the `metricool*` family (five). Those three families alone are ~17 functions that are probably 5.

---

## 3. Alerts — deploy the guard, then route by urgency

**3a.** Deploy the guard that already exists and has never shipped: `socialCommentMonitor/entry.ts` contains the `demoAuthors` set and the `looksLikeBundledDemo` check. The code is correct. Ship it.

**3b.** Clear the remainder:

```
entity: RiskAlert
query:  { "status": "open", "source_agent": "SocialCommentMonitor" }
update: { "$set": { "status": "dismissed" } }
```

**3c.** Build alert routing, which Gannon specified today:

- **Urgent → email to Gannon immediately.** Urgent means: money at risk, a customer waiting, a live security issue, or a legal deadline. Nothing else.
- **Non-urgent → auto-expire after 7 days.** Add `expires_at` to RiskAlert and SystemHealthIssue, defaulted to created + 7 days for anything not urgent. A daily job closes expired records with `status: "auto_expired"`.
- **An alert that re-fires resets its own clock** — a recurring problem must not silently expire.
- Never auto-expire anything with `severity: critical` or `risk_type: financial`.

---

## 4. Approval queue — images, inline decisions, real deep links

Gannon's exact complaint: the merch approval page is a wall of text, and clicking an item takes him to another queue instead of the thing itself.

**4a. Build `DeegoDesignAsset`** (blocking — the merch agent cannot show a picture without it):

```
title              string, required
product_name       string
campaign           string
placement          enum: hoodie_back | hoodie_front_chest | tee_front | tee_chest
                         mug_wrap | tote_front | poster | hang_tag | sticker | other
image_url          string   ← REQUIRED before needs_approval. Without this the record is useless.
source_assets      string[] which of Gannon's own files were used
headline_silver    string
headline_gold      string
sub_line           string
colour_count       number   must be 1 or 2
lyric_source       string   which song, blank if none
song_gate_status   enum: not_applicable | blocked | cleared
status             enum: brief | mockup | needs_approval | approved | rejected | in_production | live
rejection_reason   string
approved_by        string
approved_at        datetime
print_file_url     string   production file, separate from the mockup
```

Hard rules in the schema, not in a prompt: cannot reach `needs_approval` without `image_url`; cannot reach `needs_approval` with `colour_count` outside 1–2; cannot reach `approved` while `song_gate_status = blocked`.

**4b. Every ApprovalQueueItem gets:**

- a **thumbnail** rendered from `related_link` or the linked DeegoDesignAsset `image_url`. No image, no queue entry.
- **Approve** and **Decline** buttons inline on the card — decision without leaving the page.
- Decline opens a required free-text reason. That reason is the highest-signal training data in the system; write it to the learning loop.

**4c. Deep links must land on the thing.** Add `target_route` to ApprovalQueueItem, resolved from the linked entity — `/admin/merch/{id}`, `/admin/releases/{id}`, `/admin/content-studio/{id}`. Clicking the card body opens `target_route`, not another queue. If `target_route` cannot be resolved, the item does not get created — that is the bug that produced the current dead-end links.

There are 18 items pending, oldest 28 June. Backfill `target_route` and thumbnails on all of them.

---

## 5. Agent memory — lessons that persist

`recall()` and `remember()` in `base44/shared/`.

**`recall(agentName, context)`** returns a bounded pack, in this order:

1. **Tier 1, always, never truncated:** every record with `is_permanent: true` AND `importance_score >= 9`. These are constraints, not suggestions — the release publication policy lives here. If Tier 1 cannot be assembled, the run **fails closed** and takes no external action.
2. **Tier 2:** records matching the run's `linked_entities` or `tags`, ranked by `importance_score × confidence_score × recency`.
3. **Tier 3:** the agent's own last N lessons where `failure_score > 0` — its own mistakes first.

**`remember(record)`** refuses to write a lesson that is only a count or a pass rate. A valid lesson names what was attempted, what happened, what changes, and carries a `linked_entities` reference to the record it acted on. No evidence link, no memory.

**Close the outcome loop.** Every AgentAction gets an outcome stamp when its result is known. A nightly pass back-fills `success_score` / `failure_score` on the memory that informed it, promotes memories that predicted well, and supersedes ones that predicted badly by editing the old record to point at its replacement. Never delete.

**Wire it in:** `recall()` at the top of every agent run, `remember()` at the bottom. An agent that does not call both is not finished.

Seed data exists — four agents were given real evidence-bearing `last_output` values on 24 Aug. Use those as the format reference.

---

## 6. Deego everywhere — the floating companion

Gannon wants Deego present on every admin page, not a destination he has to navigate to.

- A persistent floating panel, bottom-right, mounted at the **app shell level** so it survives route changes. It must not remount or lose conversation state when he navigates.
- Collapsed: a small gold GW mark. Expanded: the chat.
- **Route-aware.** Deego receives the current route and the focused record id, so on `/admin/merch/{id}` he already knows which product is on screen and Gannon never has to say which one he means.
- Draggable, position persisted per user. Never covers the primary action button on any page.
- Keyboard: a single shortcut toggles it.
- Unread badge when Deego has something waiting.

Use the existing orchestrator-chat logic; this is a container and mounting change, not a new agent.

---

## 7. Manual merch design, in the site

Gannon wants to make designs himself, next to Deego, without leaving the admin.

Build `/admin/merch-designer`:

- Garment picker: hoodie back, hoodie chest, tee front, tee chest, mug, tote — each rendering the correct print area (hoodie back is 12×16in; the chest mark is 4×4in).
- Two text fields, **silver line** and **gold line**, locked to the brand system so it cannot be got wrong.
- Oswald semibold caps for display; Poppins for the sub-line and URL. Colours from tokens only, no free colour picker.
- Toggle: gold rule, signature, URL band.
- Live colour-count readout that turns red above 2.
- **Save** writes a `DeegoDesignAsset` with a rendered `image_url` and status `mockup`. **Send to approval** moves it to `needs_approval`, which is where item 4 picks it up.
- Deego's floating panel is present, route-aware, and can be asked to write the lines.

---

## 8. Order of build

1. Stripe (item 1) — nothing earns until this lands
2. Function cap audit (item 2) — unblocks deploys for everything below
3. Alert guard + routing (item 3)
4. DeegoDesignAsset + approval queue images and deep links (item 4)
5. Agent memory (item 5)
6. Floating Deego (item 6)
7. Merch designer (item 7)

Items 3–7 all need deploys, so item 2 gates them. If the cap cannot be cleared today, host new logic inside functions that are already deployed rather than creating new ones — that is how the Deego heartbeat was fixed and it worked.

Append your entry to `docs/HANDOFF.md` under `## Log` when you finish, per `AGENTS.md` §8.
