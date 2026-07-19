# Gannon Waye Systems Success Plan

Status date: 2026-07-13  
Purpose: turn the current Gannon Waye ecosystem into one approval-gated money, music, content, coaching, memorial, and operations system.

## Executive verdict

The system is close enough to start producing daily assets, but it is not yet clean enough to let automations run freely.

The right operating model is:

1. Pressmaster / ChatGPT / Codex create ideas, scripts, captions, and plans.
2. Google Drive stores the approved source files, scripts, artworks, voice notes, exports, and proof.
3. HeyGen creates approved Gannon avatar videos only after the script is approved.
4. Canva creates static/social design variants from approved artwork and templates.
5. CapCut edits motion reels manually or semi-manually from shot lists.
6. Base44 is the private command centre, website, order system, approval queue, and business dashboard.
7. Metricool/native platforms schedule or post only after Gannon approval.
8. GitHub stores the code and protects the live site from random drift.

Nothing should publish, send, spend, invite, delete, or change live pricing without approval.

## Evidence checked this pass

- Base44 CLI login works: `ganozwaye@gmail.com`.
- Google Drive connector profile works: `ganozwaye@gmail.com`.
- Local repo: `C:\Users\ganno\Documents\Codex\gannon-waye-music-pr-work`
- GitHub remote: `https://github.com/ganozwaye-stack/gannon-waye-music.git`
- Current branch: `upgrade/gwm-command-centre-v2`
- Latest commit: `550b827 Fix Stripe checkout configuration safeguards`
- Local Base44 inventory:
  - 31 agents
  - 96 functions
  - 75 entities
  - connectors configured locally: Airtable, Gmail, Google Calendar, Google Drive, Google Sheets, Notion, Slack
- Build check: `npm run build` passes.
- Lint check: `npm run lint` passes.
- Typecheck: `npm run typecheck` fails due existing JS/Base44/UI typings.
- Local apps installed:
  - Canva
  - CapCut
  - GitHub Desktop
  - Google Drive Desktop
  - OneDrive
- Current shell did not expose HeyGen/Stripe/OpenAI/Metricool keys as environment variables. Keep secrets in Base44/connector secret storage, not in code.

## System audit table

| System | Current state | Main blocker | Next action |
|---|---|---|---|
| Base44 website/app | CLI login works; app has many agents/functions/entities; local build passes. | Need deploy/sync confirmation and route-by-route QA after latest local changes. | Deploy/sync after approval, then run admin/public QA checklist. |
| GitHub | Remote exists; branch has many uncommitted and untracked changes. | Dirty worktree means no clean release checkpoint. | Review diff, commit in logical chunks, push branch, then use GitHub as release proof. |
| ChatGPT / Codex | Strong planning, coding, audit, script, and prompt layer. | It should not be treated as publisher/payment operator without approvals. | Use Codex as build/operator layer and ChatGPT as idea/refinement layer. |
| Pressmaster | Defined as brand brain and content brain, not physical avatar tool. | Needs more source truth fed into it before it can sound exactly like Gannon. | Feed brand guide, song stories, Mum's Garden rules, coaching positioning, and content boundaries. |
| HeyGen | Gannon avatar/voice assets recorded locally: avatar look `646da572f3284a1fa6bff984d6f3471c`, voice `f7ffebd851b74bd1ad83d83a1087b2f4`. | Need approved scripts, test outputs, export presets, and secure API handling. | Produce one 15s and one 30s private test, then the This Is Me series after script approval. |
| Canva | Desktop app installed; social resizing workflow available; content-production Canva guides exist. | Needs exact approved design sources and template lockup. | Create master templates for 9:16, 1:1, 4:5, 16:9; keep originals unchanged. |
| CapCut | Desktop app installed; CapCut production guides and shot lists exist. | No direct automation connector; export is manual/semi-manual. | Use shot lists + approved audio timestamps; export 1080x1920 MP4 reels. |
| Google Drive | Connector works as `ganozwaye@gmail.com`; Google Drive Desktop mounted. | Needs final asset vault discipline: one naming system and approval subfolders. | Standardise Drive folders and save final exports there before scheduling. |
| Metricool/social scheduling | Base44 has Metricool functions and draft schedules. | Need token/profile validation and approval queue integration proof. | Validate connection; schedule only approved posts. |
| Instagram/TikTok/Facebook/YouTube | Content plans exist; TikTok developer review package exists. | Native APIs are partial/limited; publishing must remain approval/manual unless proven. | Use Metricool/native scheduler after approval; keep post proof screenshots/URLs. |
| Stripe/store | Checkout code has safeguards and user completed a checkout flow, but live reconciliation still needs proof. | Webhook/order/receipt/inventory reconciliation must be verified, not assumed. | Confirm webhook 2xx, order creation, email, inventory, and PaymentDiagnostic resolved. |
| Merch store | Products exist; creative assets and product cutouts exist. | Product/gallery polish and stock/price truth need final review. | Build premium merch gallery, verify stock/prices, create one clean paid offer. |
| Mum's Garden / Without You Here | Private route and story demo exist; sky/angel direction documented. | Final image approval, audio play test, guestbook approval gate, and route privacy must be checked. | Finish private draft, verify `/remember-mum`, remove bad images, keep no deepfake public. |
| Coaching / Skool | Admin pages and source docs exist; Skool selected at $9 plan. | Offer/product/module layer not client-ready. | Build 1 free lead magnet, 2 paid workbooks, 1 paid subscription, intake/consent flow. |
| GanozMix Direct | Product ideas exist; previous audit found marketplace/job issues. | eBay OAuth and listing pipeline not trustworthy. | Treat as paused until OAuth, supplier verification, and approval-gated listing workflow are repaired. |
| Laptop / archive / security | Archive work exists; Google Drive account verified. | File cleanup/offload must not happen until verification reports prove source/destination match. | Finish archive verification before deleting/offloading anything. |

## Top priorities, in order

### 1. Make the owner dashboard the daily source of truth

Goal: when Gannon opens the app, he sees exactly what to approve, create, fix, and earn from today.

Actions:

1. Confirm Base44 deploy/sync for the local dashboard changes.
2. Open `/admin`, `/admin/ask-gannon-os`, and `/admin/ai-twin-content-studio`.
3. Verify the dashboard shows:
   - today's tasks
   - approval queue
   - content pipeline
   - orders
   - Stripe/payment health
   - coaching/Skool state
   - HeyGen/content state
   - outside tool links
4. Add a real `OwnerTask` / `DailyTask` entity if not already live.
5. Require every AI-generated action to create a task or approval item.

### 2. Make one post production pipeline that actually ships

Goal: one post per day can move from idea to approved export to schedule without chaos.

Workflow:

1. Idea: Pressmaster or Codex.
2. Script: Codex/Pressmaster.
3. Brand check: Gannon Waye tone and truth rules.
4. Media: Google Drive approved folder.
5. Video: HeyGen if approved, otherwise CapCut/Canva.
6. Caption: generated and sharpened.
7. Export: saved to Google Drive.
8. Approval: Gannon signs off.
9. Schedule: Metricool/native.
10. Proof: post URL/screenshot saved back to Drive/Base44.

First post to action:

Use the `Without You Here / Mum's Garden` campaign because it ties together music, emotion, memorial page, and audience connection.

### 3. Make HeyGen useful without wasting credits

Goal: approve scripts before generation.

Actions:

1. Keep using the existing Gannon private avatar and voice.
2. Do not generate a duplicate Gannon avatar unless replacing the current one.
3. Create:
   - 15-second private test
   - 30-second private test
   - 3-minute This Is Me episode pilot
4. Save each export to Google Drive.
5. Mark each video:
   - draft
   - needs edit
   - approved
   - scheduled
   - published

### 4. Finish Mum's Garden as a private launch asset

Goal: a beautiful private memorial/release page ready for family review before public launch.

Actions:

1. Opening hero: Sonia in sky/angel artwork, blue sky, no children in hero.
2. Scroll transition: sky down into garden.
3. Journey sections:
   - meet Sonia
   - her life
   - family and memories
   - song/player for Without You Here
   - Gannon's note
   - memory upload link
4. Remove:
   - grave images
   - coffin images
   - blurred images
   - doubles
   - wrong/uncertain identity images
5. Keep guest submissions private until approved.
6. Memory upload route must be: `https://gannonwaye.com/remember-mum`
7. Do not launch a public lifelike Sonia talking avatar/voice clone unless the family approves exact usage and labelling.

### 5. Turn coaching/Skool into a real offer stack

Goal: start taking clients without overbuilding.

Recommended offer ladder:

1. Free: Resilience Reset starter guide.
2. Free: 7-day journal prompt challenge.
3. Paid low-ticket: Self Respect Reset workbook.
4. Paid low-ticket: Resilience Foundations journal/course.
5. Subscription: Gannon Waye Resilience / Skool community.
6. Higher-ticket: 1:1 mindset mentoring / life coaching package.

Required before launch:

1. About Gannon page/story.
2. What this is / what this is not.
3. Coaching is not therapy disclaimer.
4. Crisis/support redirect wording.
5. Intake questionnaire.
6. Payment path.
7. Welcome email.
8. First 2 modules uploaded.
9. Clear pricing and cancellation terms.

### 6. Stabilise commerce

Goal: checkout and order handling are boring, safe, and reliable.

Actions:

1. Verify Stripe webhook delivery is HTTP 2xx.
2. Confirm successful checkout creates:
   - order record
   - payment record/metadata
   - customer email
   - internal admin notification
   - inventory/profit update
3. Resolve stale PaymentDiagnostic rows only after proof.
4. Confirm discount codes work and cannot accidentally give away the whole store.
5. Add "test purchase proof" report with date, amount, product, order ID, Stripe session ID, and webhook proof.

### 7. Pause dangerous automation until it has brakes

Automation allowed now:

- draft scripts
- draft captions
- create task lists
- prepare Canva/CapCut instructions
- prepare HeyGen scripts
- save reports
- create approval queue items

Automation not allowed without explicit approval:

- send emails
- post socials
- publish products
- change prices
- spend ad money
- contact suppliers/customers
- invite Skool members
- delete files/profiles
- clone Sonia's voice or create public lifelike talking Sonia

## Coming-days plan

### Day 1: Control tower and revenue proof

Gannon:

1. Open Base44 admin.
2. Check `/admin`, `/admin/ask-gannon-os`, `/admin/ai-twin-content-studio`.
3. Approve whether the Owner Dashboard is the main daily cockpit.
4. Confirm Stripe checkout/order/webhook proof from the latest transaction.
5. Approve one content item to produce today.

AI/Codex:

1. Commit/sync local code in logical chunks.
2. Fix Tailwind content glob warning.
3. Create or finish `OwnerTask` entity/page if missing.
4. Connect approval queue into dashboard.
5. Create Stripe proof checklist/report.

Done when:

- Dashboard is live or deploy-ready.
- Stripe proof checklist exists.
- One content item is selected for production.

### Day 2: HeyGen pilot and daily content engine

Gannon:

1. Upload or approve the This Is Me script.
2. Choose the first setting/look.
3. Approve 15s and 30s test scripts.
4. Approve captions style.

AI/Codex:

1. Convert Gannon's script into 5-setting HeyGen scenes.
2. Generate HeyGen request payload or manual instructions.
3. Create CapCut edit plan.
4. Create Canva thumbnail/story/post variants.
5. Save every asset path/link into Google Drive and Base44.

Done when:

- One HeyGen test is generated privately.
- One Reel/Story is ready for approval.

### Day 3: Mum's Garden private release QA

Gannon:

1. Review final Mum's Garden private draft.
2. Approve/remove remaining images.
3. Approve guestbook wording.
4. Approve song/player section.
5. Share `/remember-mum` only with trusted family after route proof.

AI/Codex:

1. Confirm all Mum routes are private or correctly staged.
2. Confirm `gannonwaye.com/remember-mum` works.
3. Confirm guest submissions enter approval only.
4. Confirm sky hero is the opening screen.
5. Confirm no grave/coffin/blur/double images.

Done when:

- Family review link works.
- Page is private.
- Uploads require approval.

### Day 4: Coaching/Skool money setup

Gannon:

1. Approve business name/umbrella term.
2. Approve offer ladder.
3. Approve pricing.
4. Approve About Me story.
5. Approve first two free/paid resources.

AI/Codex:

1. Turn existing Resilience documents into public-safe workbook drafts.
2. Create Skool category/module structure.
3. Create Base44 coaching landing/admin pages.
4. Create Stripe products/prices only after approval.
5. Draft welcome/onboarding emails.

Done when:

- Skool has clean structure.
- One free lead magnet and one paid product are ready.

### Day 5: Store, merch, GanozMix, and reporting

Gannon:

1. Approve merch gallery direction.
2. Approve stock/pricing truth.
3. Decide whether GanozMix is paused or repaired.
4. Approve one daily money opportunity.

AI/Codex:

1. Create premium merch visual gallery.
2. Verify checkout paths.
3. Repair or document GanozMix OAuth/job blockers.
4. Create weekly owner report template.
5. Create daily "make money today" routine.

Done when:

- Store looks premium.
- One sellable offer is clean.
- GanozMix status is honest.

## Gannon's daily routine

Do these first, before opening ten tabs:

1. Open Base44 Owner Dashboard.
2. Approve/reject/edit the top approval items.
3. Pick one money action.
4. Pick one audience action.
5. Pick one system fix.
6. Record or approve one HeyGen/CapCut/Canva asset.
7. Save final export to Google Drive.
8. Schedule only after approval.
9. End day with:
   - what shipped
   - what earned
   - what is stuck
   - what needs Gannon tomorrow

## Immediate technical cleanup list

1. Fix Tailwind content glob warning in `tailwind.config`.
2. Decide whether to make `npm run typecheck` official or remove/fix until clean.
3. Clean Base44 client typings or relax JS typechecking.
4. Commit/push current branch after review.
5. Confirm Base44 deploy path.
6. Verify live route map.
7. Add a release checklist file for each launch.
8. Ensure all auto-send/post functions are approval-gated.

## Current launch blockers

1. Base44 latest local changes need deploy/sync proof.
2. Typecheck is failing.
3. Stripe live webhook/order/email reconciliation still needs proof.
4. HeyGen test outputs need approval.
5. Metricool token/profile scheduling proof needs validation.
6. Mum's Garden final images and guestbook wording need final approval.
7. Coaching/Skool offers need final pricing and module content.
8. GanozMix marketplace pipeline should remain paused until OAuth/listing/job issues are repaired.

## Decision rules

If a task can make money today and is safe, do it first.

If a task can publish or contact people, draft it but require approval.

If a task can break payments, orders, reputation, privacy, family tribute content, or legal/therapy claims, slow down and get proof first.

