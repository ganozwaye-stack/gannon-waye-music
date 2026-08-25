# Agent work queue — determinate jobs

Governing rule: **AgentMemory `6a8cdad2747214aea505a1e9`** (Agent Operating Constitution, permanent, importance 10). Load it before acting. If it will not load, take no external action.

Every job on this page is **determinate** — its correctness can be checked without a single customer. That is the whole point. There is no conversion data in this business yet (3 live payments ever, 1 external customer, 0 automatic captures), so optimisation work is forbidden under Rule 1. Determinate work is not the small pile. **It is the pile currently blocking revenue.**

Each job below states its acceptance test. If an agent cannot meet the test, the job stays open and the agent says so. "I could not verify this" is a passing answer. Inventing a result is not.

---

## How a job runs

```
specialist drafts
   ↓  cites evidence (record id / resolving URL / source + timestamp)
second specialist cross-checks   ← different agent, same field
   ↓
Deego reviews against gates      ← publication gate, colour count, evidence rule, risk flags
   ↓
passes every gate?  →  Deego acts within its approval budget
fails any gate?     →  Deego escalates to Gannon with the specific failure named
```

Deego does not forward things Gannon cannot act on. A queue item that reaches him must have a decision attached to it.

---

## COMMERCE — supplier and product verification

**C-1 · Verify every supplier URL resolves.**
Walk `SupplierProduct` (6 records) and `MerchProduct` (17). For each, confirm the supplier link returns 200 and the product on the page matches the record.
*Accept:* every record has a URL that resolved, with the check timestamp. Dead links flagged, not guessed at.

**C-2 · Complete the landed-cost fields.**
Every product candidate needs: supplier URL, product image from that URL, landed cost, AU shipping cost and time, stock status, platform fee assumption, projected unit margin.
*Accept:* no record reaches the approval queue with a blank in that set. Missing data keeps it at `research`.

**C-3 · Audit the 13 shipping rules.**
`shippingOptimisationAudit` raises a daily high-severity issue that "Local Pickup — Cd" undercharges by $7. There are five Local Pickup rules where $0 is correct.
*Accept:* a written determination of whether the auditor is misfiring on pickup rules. If it is, fix the auditor, not the rate.

**C-4 · Reconcile MerchProduct against what physically exists.**
9 active, 17 total, 8 inactive. Which have stock on hand, and how many?
*Accept:* a count per SKU, sourced from Gannon, not estimated.

---

## CATALOGUE — release and rights hygiene

**R-1 · Gate-check every Release record.**
Run all 17 against the publication policy (`6a87d73640f72b7c78831411`). Report per record which of the six gates pass and which fail.
*Accept:* a six-column table. No song is described as "nearly approved" — a gate passes or it does not.

**R-2 · Cover art audit.**
15 of 17 records point `artwork_url` at the homepage hero image instead of real artwork.
*Accept:* a list of which releases have genuine art and which are placeholders. Set Free's real cover exists and Gannon holds it.

**R-3 · Title normalisation.**
`Set Free` is the confirmed title. The Lyric record `6a3aa17c5f2267d730b5a824` reads "Set Freee". Sweep every entity for title variants of every song.
*Accept:* one canonical title per song, every variant listed with its record id.

**R-4 · Duplicate release records.**
Three "Because of You" records exist — Original, Radio Edit, Brazilian Portuguese. The BP record is marked private, deletion pending.
*Accept:* a merge or keep recommendation per record. No deletions.

---

## DESIGN — enforcement, not creation

**D-1 · Colour-count enforcement.**
Every `DeegoDesignAsset` must be 1 or 2 colours. This is a schema constraint, not a preference.
*Accept:* zero records at `needs_approval` with `colour_count` outside 1–2.

**D-2 · Song-gate enforcement on designs.**
Any design quoting a lyric inherits that song's gate status. Blocked song, blocked design.
*Accept:* zero approved designs referencing an ungated release.

**D-3 · Image requirement.**
No approval-queue entry without `image_url`. This is the fix for "the merch approval page has no pictures".
*Accept:* every queued design renders a thumbnail.

---

## SYSTEMS — reconciliation and cleanup

**S-1 · Function inventory.** All 121: last invocation, caller, and whether another function already does the job. Four buckets — keep, merge, never invoked, duplicate. Evidence per row. **No deletions.**

**S-2 · Registry reconciliation.** 235 `AgentRegistry` rows against 41 definition files in `base44/agents/`. Rows with no matching file → `inactive`. Retire `seedAgentRegistry` so it cannot re-inflate.

**S-3 · Alert source attribution.** Every open `RiskAlert` and `SystemHealthIssue`: which agent or function created it, and is the source still running.

**S-4 · Duplicate media index.** Four iCloud folders and a "Ready to Post" directory where 7 of 10 files are copies of one clip. Hash-index, report, **delete nothing** — quarantine only, per the Drive-first storage rule.

---

## CONTENT — drafting, never publishing

**T-1 · Draft against cleared songs only.** Thank You and Without You Here are the only two anywhere near clear, and both have open gate questions. Everything else is evergreen with no song title.

**T-2 · Dignity gate every piece before it queues.** Named purpose before any use of lived experience. No third-party identification. No trauma as bait.

**T-3 · Never publish.** Draft, queue, wait. `tools_blocked` on every content agent includes public posting, upload submission and paid boost. That block is enforced in the action path, not in the prompt.

---

## What unlocks optimisation

Rule 1 relaxes **per channel**, on evidence, recorded in AgentMemory:

| Channel | Unlock threshold |
|---|---|
| Store | 30 completed orders, or 30 days of measured traffic |
| eBay | 30 completed orders |
| Social | 30 days of measured reach and click-through |

Until a channel crosses its line, agents working on it do determinate work only. When it crosses, the unlock is written to memory with the evidence that justified it — and only that channel opens.

The reason for the threshold is not caution. Below roughly 30 outcomes, the difference between two options is noise, and an agent optimising noise will produce a confident recommendation that is worse than doing nothing — and nobody will be able to tell it apart from a good one.
