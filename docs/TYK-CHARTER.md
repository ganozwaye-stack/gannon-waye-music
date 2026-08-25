# Thanking You Kindly — the charter

**Set in stone, 25 August 2026.** Supersedes every earlier instruction it contradicts.
Every agent reads this before acting. Nothing here is advisory.

Governed by the Agent Operating Constitution at `https://gannonwaye.com/agent-rules.txt`.
This document adds to it and never overrides it.

---

## PART 0 — A problem to fix before ownership means anything

The live `AgentRegistry` shows the registry has been **seeded twice**. Two cohorts exist,
created minutes apart, with overlapping roles:

```
Master Orchestrator          6a0768683ce7c2c9645049ef   AND   6a076867a327dc997c4b6e95
Risk Assessment Engine       6a0768683ce7c2c9645049f0
Risk Assessment Agent                                          6a076867a327dc997c4b6e99
Approval Queue Manager       6a0768683ce7c2c9645049f1
Approval Gateway Agent                                         6a076867a327dc997c4b6e97
Release Campaign Planner     6a0768683ce7c2c9645049b7   AND   6a076867a327dc997c4b6e65
Music Video Concept Agent    6a0768683ce7c2c9645049a7   AND   6a076867a327dc997c4b6e5a
Influencer Outreach Agent    6a0768683ce7c2c9645049bb   AND   6a076867a327dc997c4b6e68
Merch Design Agent           6a0768683ce7c2c9645049a9
Merchandise Designer Agent                                     6a076867a327dc997c4b6e59
```

Two agents both believe they are Master Orchestrator. Two run approvals. Two assess risk.
That is not a naming annoyance — it means no instruction has a single owner, and two
agents can approve, route or block the same thing without either knowing.

**Rule 0. Until the duplicate cohort is retired, no agent may act on an instruction
addressed to a role held by two agents.** Deego names the specific record ID, not the
role name. Retiring the duplicate cohort is the first job in Part 5.

---

## PART 1 — Chain of command

```
GANNON            approves. the only human. the only source of approval.
   ^
DEEGO             assembles, checks, escalates. never approves, never publishes.
   ^
THE FLEET         produce work. report to Deego. never reach Gannon directly.
```

1. **No agent contacts Gannon directly.** Everything arrives through the approval queue
   or through Deego's briefing. One inbox, one voice.
2. **Deego cannot approve.** Not for small things, not when Gannon is asleep, not when
   something is time-sensitive. Deego's job is to make the decision easy, never to make it.
3. **An agent that cannot complete a job stops and says so.** It does not substitute a
   guess, and it does not hand a half-finished packet to the queue.

---

## PART 2 — The catalogue. One product, many listings.

```
PRODUCT   the thing that physically exists
   owning_business : thanking_you_kindly    <- always. TYK holds all stock.
     |
     +-- LISTING - storefront: thankingyoukindly    own price, own words
     +-- LISTING - storefront: gannonwaye           own price, own words
     +-- LISTING - storefront: ebay_au              own price, own words

ORDER     references BOTH listing_id and product_id
   storefront   : where it sold        -> reporting only
   fulfilled_by : thanking_you_kindly  -> always. TYK ships everything.
```

1. **Stock lives once.** Only `Product` holds `stock_on_hand`. A listing never carries
   its own count. Duplicating a Product row to get an item onto a second shopfront is
   forbidden — that single act would break every report in the business.
2. **One business, two shopfronts.** One Stripe account, one ledger. Revenue by storefront
   is a **filter**, never a transfer. No internal invoices, no inter-company anything.
3. **TYK fulfils everything.** If it sold on gannonwaye.com, TYK still packs it.
4. **`eligible_for_gannonwaye` defaults to false.** A sourced dropship item can never
   drift onto the artist site by accident.
5. **An item reaches gannonwaye.com only if** it is Gannon's own material, any song it
   references has actually been released, and it carries the brand correctly. Missing
   data means blocked, not cleared.

**Brand separation.** TYK does not look like Gannon Waye Music. The artist brand is
near-black, gold, austere — right for a memorial page, wrong for a shop. TYK is warm
cream, plain, unfussy. **The gold is the only thing they share.**

---

## PART 3 — THE REEL STANDARD

**Foundational. Applies to every short-form social reel, every time, without being asked.**
Not to YouTube. Not to film clips. Those are briefed individually, per video.

An agent that delivers a reel not meeting this spec has not delivered a reel.

### 3.1 Format

```
Aspect ratio      9:16, always
Resolution        1080 x 1920
Frame rate        match source; 30fps if source is mixed
Duration          under 90s. under 30s converts better
Codec             H.264, MP4
```

### 3.2 Captions — burned in, never optional

Most people watch with sound off. Gannon's content is someone talking — silent and
uncaptioned it is a stranger's face doing nothing.

```
Style             bold sans, heavy weight, high contrast
Per line          2 to 4 words. never a full sentence
Position          middle third of the frame
Safe zones        keep clear of the bottom 320px and the right 120px —
                  platform UI covers both
Accuracy          transcribed from the actual audio, then read back.
                  a wrong caption on a grief line is worse than no caption
```

### 3.3 The look — cinematic, and still him

```
Skin              subtle smoothing only. pore texture must survive.
                  if the skin reads as plastic it is too much — take it back.
Lighting          lift the shadows, recover blown highlights, even out
                  exposure across the clip
Grade             gentle contrast S-curve, warm the highlights slightly,
                  cool the shadows slightly, very light vignette
Stabilise         if handheld and shaky. leave it if the movement is the point
Sharpen           last, and lightly
```

**The craft rule that matters most.** Gannon's material is about grief, leaving, and being
treated badly. Heavy retouching reads as cheap and kills the thing that makes the content
work — that a real person is telling you something true. Enhance the footage, never
resurface the man. **If he does not look like himself, it has failed**, however clean it is.

### 3.4 Audio

```
Vocal             enhanced and forward. peaks between -6 and -3 dBFS
Music bed         under the vocal, around -18 to -20 dBFS.
                  never fights the voice. if you notice the music, it is too loud
Noise             reduce room noise and hum before anything else
Ends              no abrupt cut. short fade or a clean beat
```

### 3.5 Fixed by this rule

Nobody re-decides aspect ratio, captions, skin treatment, grade or audio balance per reel.
They are settled. What varies is the content, the hook and the cut — nothing else.
**A reel does not go to the approval queue for a look decision.**

---

## PART 4 — THE PRODUCT APPROVAL PACKET

**One approval. Everything in it. One decision.**

A packet is **not permitted to enter the approval queue** unless every field below is
filled. An agent that cannot fill a field says so and holds the packet — it never sends
a partial one.

### 4.1 What every packet contains

**The product**
```
Name
Photographs           real images or mockups. a packet with no picture is not a packet
Description           the copy that would actually appear on the listing
Which storefront(s)   TYK only, or TYK + gannonwaye
Stock position        on hand, made to order, or not yet sourced
```

**The money — every line, no rounding**
```
Base cost             verified, from the actual supplier or POD account
Shipping cost         what it costs to send
Platform fee          eBay ~13% + fixed, Stripe, whichever applies
Landed cost           the three above, added up
Sell price
Profit per unit       in dollars
Margin                as a percentage
```

**No price is valid unless it is derived.** Price = verified cost + verified shipping +
platform fee + margin. A number that felt right is not a price, and a packet carrying one
is rejected at the gate, not at Gannon's desk.

**The marketing campaign — in the same packet**
```
Marketing reel        built to the Reel Standard in Part 3. actually made, not described
Hook                  the first three seconds, written out
Captions              per platform, in the voice
Posting schedule      what goes out, where, when
Who it's for          the buyer, named. "everyone" is not an answer
```

**The gate**
```
Song referenced       which song, or none
Release status        released / unreleased — from the Release record, not memory
Gate status           cleared / blocked. blocked if unknown
Brand check           two colours, silver sets up, gold pays off, one mark per piece
```

### 4.2 What Gannon sees

One screen. Images at the top, money in the middle, campaign below, and four actions:

```
[ Approve ]   [ Approve & schedule ]   [ Request changes ]   [ Decline ]
```

**Request changes must take a free-text reason** — the most valuable data in this system,
because it is what teaches the fleet his taste. Capture it every time. If he has nothing
to say, "just no" is a complete and legitimate answer and gets recorded as such, never
blocked for being short.

Every action carries a human user ID and a timestamp. Approval attaches to a **version**,
not to a product — any edit after approval sends it back to pending and pauses anything
in flight.

---

## PART 5 — Who is doing what

| Job | Owner | ID | Status |
|---|---|---|---|
| Merch design, briefs, mockups | `deego_merch_design_hub_operator` | `6a8560ca5627af58cdae9ac7` | active |
| Reels — drafts, captions, packs | `deego_content_production_controller` | `6a84393203f10135539f9488` | **testing** |
| Hooks and short-form copy | Caption & Hook Writer | `6a0768683ce7c2c9645049ab` | active |
| Campaign structure | Release Campaign Planner | `6a0768683ce7c2c9645049b7` | active · **dup** |
| Brand enforcement, visual | Visual Identity Guardian | `6a0768683ce7c2c9645049a6` | active |
| Brand enforcement, voice | Brand Voice Guardian | `6a076867a327dc997c4b6e57` | active |
| Ad creative | Ad Creative Agent | `6a0768683ce7c2c9645049b8` | active |
| Approval routing | Approval Queue Manager | `6a0768683ce7c2c9645049f1` | active · **dup** |
| Risk gate on every action | Risk Assessment Engine | `6a0768683ce7c2c9645049f0` | active · **dup** |
| Parking blocked work | `deego_approval_parking_controller` | `6a84392f3871e1acf027b365` | **testing** |
| Vault storage and versioning | Knowledge Vault Librarian | `6a0768683ce7c2c9645049f2` | active |
| Top-level routing | Master Orchestrator | `6a0768683ce7c2c9645049ef` | active · **dup** |

Rows marked **dup** have a twin holding the same role. Until Part 0 is resolved, address
these by ID, never by role name.

**Order of work:**

```
1.  Retire the duplicate cohort          nothing is trustworthy until this is done
2.  Give the two testing agents a first job, then flip them to active
3.  Build the Product Approval Packet    Part 4. gates everything commercial
4.  Load the Reel Standard as memory     Part 3, importance 10, permanent
5.  Catalogue split                      owning_business + Listing, per Part 2
6.  Rename ganozmix_direct -> thanking_you_kindly   LAST. destructive. separate approval.
```

Step 6 does not begin until 1 through 5 are done.

---

## PART 6 — Still blocking, and honestly

- **No print-on-demand account exists.** Confirmed with the Base44 superagent and Deego.
  Until one is opened no base cost can be verified, which means **no packet can pass
  Part 4's money section for any product not already in Gannon's possession.** Opening
  one is the highest-leverage determinate job in the system.
- **One real customer order exists.** Thea Elsworth, $90.48, 29 May, hoodie + mug. The
  two $0.99 sessions are owner tests. Any agent reporting more is reading tests as sales.
- **The domain is `gannonwaye.com`.** With a Y. Do not "correct" it from a photograph.
