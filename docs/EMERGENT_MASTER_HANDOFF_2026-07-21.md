# Gannon Waye Music - Emergent Master Handoff

Date: 2026-07-21
Production domain: `gannonwaye.com`
GitHub: `ganozwaye-stack/gannon-waye-music`
Current local source branch: `feature/sonia-foyer-16x9-emergent-2026-07-21`

## Mission

Launch the Gannon Waye artist site in Emergent without losing the approved Base44 visual identity, public content, store, private operating system, approval controls or Sonia memorial continuity. Preserve the current premium Emergent homepage work. Import source-controlled features intentionally rather than replacing the Emergent project wholesale with old Base44 code.

This document is a verified project summary. It is not a dump of private conversations, passwords, API keys, browsing history or unrelated personal material.

## Owner Direction

- Brand feeling: cinematic, bold, emotionally direct, premium and truthful.
- Palette: black, warm cream and antique metallic gold. No bright yellow.
- Typography: Poppins-style wordmark/body system plus an elegant high-contrast display face for song titles and emotional quotes. Keep the Base44 hierarchy and restraint.
- Public site should be visual and concise. Avoid long empty scrolls and disconnected page-sized sections.
- Gannon's story, music, current release and immediate actions must be clear within the first two screenfuls.
- No fake statistics, invented biography, altered family faces or unapproved memorial imagery.
- No spending, publishing, deletion, payment-mode switch or legal commitment without explicit owner approval.

## Production Launch Scope

### Public now

- `/` artist homepage
- `/music`
- `/lyrics` and approved lyric detail pages
- `/store` plus product, cart and checkout routes
- `/community`
- `/videos`
- `/contact`
- `/email-preferences`
- `/back-this`
- legal pages and checkout result pages

### Private or withheld

- `/mum` and `/mum/garden` remain gated until the release decision.
- Coaching and systems-manager sales pages remain private or return 404 until separately approved.
- Secret/unreleased songs must not appear in public navigation, sitemap, search metadata or APIs.
- `Will You Even Listen`, `Set Free`, `Because of You`, `So Arrogant` and `I'm Still Here` remain hidden unless Gannon explicitly changes release status.

## Music And Player Rules

- Public artist name on every player: `Gannon Waye`.
- `Thankyou` is the released debut single and should use Spotify where available.
- `Without You Here` releases 31 July 2026.
- Until release, the approved internal preview is 3:46 to 4:35. The same start/end behavior must apply everywhere it appears.
- Pressing play must start audio. It must not navigate, jump to lyrics or only open the feedback form.
- Feedback may appear after playback begins. Required fields are rating out of 5, favourite thing about the song, and what inspires the visitor about Gannon's music and story.
- After release, replace the internal preview with the official Spotify player/link without changing the visual hierarchy.

## Homepage Direction

- Preserve the approved Base44 composition and the current Emergent premium upgrades.
- Hero hierarchy: `GANNON WAYE`, singer-songwriter-storyteller, `NEXT SINGLE`, `Without You Here`, the staggered lyric quote, compact release/player feature and visible `Worth Seeing Now` strip.
- The story follows immediately after the hero strip.
- Keep the new Emergent three-panel launch room:
  1. The Song - Thankyou artwork - Listen Now
  2. The Story - cinematic story image - Read the Story
  3. The Merch - cinematic merch image - Shop the Collection
- Keep the four-item trust strip, but verify every claim against the real fulfillment and Stripe setup before production.

## Store Direction

- The neon Gannon Waye retail-room image is the clean first store view.
- The fixed navigation may sit over the top edge, but must not cover the neon name.
- Do not put a marketing headline, feature copy or hotspot clutter over the store image.
- Keep the nine-product catalog and real cart/checkout path.
- Product artwork must use the approved Base44 assets and prices until a deliberate catalog change is approved.
- The 10% 1800RESPECT statement must be traceable in order records and reporting before it is promoted as a checkout fact.

## Sonia Memorial Rules

- Sonia is the central focus.
- No graves, funeral rooms, coffins, blurred photos or random people presented as Sonia.
- Do not use altered, generated or face-replaced Sonia imagery as a factual family photo.
- Exact original family photos may be gently framed, color-balanced and sharpened without changing faces.
- Younger Sonia gets a dedicated younger-years sequence.
- Memory Lane runs chronologically down the sides, with meaningful story/music moments in the centre.
- Tattoo imagery stays together as one private-review feature.
- Favourite things use real approved sources: her children, gold jewellery, coffee/garden, flowers, perfume and the song written for her.
- Voice notes and generated Sonia voice/avatar material remain private and unpublished without exact-result family approval.
- Memorial content must never be used as sales content without explicit item-level approval.

### Foyer implementation status

- True 16:9 foyer stage.
- The story concept is approved: Sonia remains present while Pa enters from the left and joins her.
- The current rendered video is a layout and motion reference only. Its Sonia likeness is not approved for public release and must be replaced after exact-frame review.
- Single minimal `Enter garden` control.
- Assets:
  - `public/images/mum/foyer/sonia-sky-opening.jpg`
  - `public/images/mum/foyer/sonia-and-pa-sky.png`
  - `public/images/mum/foyer/sonia-and-pa-16x9.mp4`
  - `public/images/mum/foyer/sonia-and-pa-16x9-poster.jpg`
- The iCloud animation was downloaded and reframed into a true 1920x1080 H.264 review master. It must remain private until the replacement likeness is approved. The final public foyer may autoplay muted and use an approved widescreen poster when reduced motion is preferred or video playback is unavailable.
- Source component: `src/pages/MumTribute.jsx`, function `MumSkyFoyer`.

## Admin And Operating System

Keep the owner-only top-level information architecture:

1. Today
2. Approvals
3. Content
4. Revenue
5. Store
6. Integrations
7. Agents
8. QA

Every number must drill into source records. Every draft title must open its copy, media, approval state and next action. Integration cards use only: not connected, needs credentials, testing, live or error.

## Base44 Audit Facts

- 183 pending approval records were found: 134 from `DailyDraftEngine`, 49 from `TrendEngine`.
- The backlog is stale and must not be imported as active content.
- Live Base44 agent configurations: 20.
- GitHub agent definitions: 33.
- GitHub-only definitions: 13.
- Live `AgentRegistry` records: 0.
- The apparent 200-agent total came from overlapping static catalogs of 94 and 118 definitions; it was not 200 running agents.
- All Emergent agents start disabled and require tested permissions plus the human approval gate before activation.
- Keep `generateDailyDrafts` and `autonomousTrendEngine` disabled until deduplication, expiry and approval-source linkage pass QA.

Transfer source:

- `docs/BASE44_APPROVAL_AGENT_MIGRATION_AUDIT_2026-07-21.md`
- `docs/EMERGENT_AGENT_TRANSFER_MANIFEST_2026-07-21.json`
- `base44/agents/*.jsonc`

## Integrations And Safety

- Stripe: never paste live secret keys into chat, source code or GitHub. Configure them in Emergent secret storage only.
- Run TEST mode first. A real-card LIVE transaction requires explicit owner approval because it spends money.
- Webhook production target: `https://gannonwaye.com/api/stripe/webhook`.
- TikTok remains draft-only until OAuth/app review is complete and the approval gate proves unapproved posts cannot upload or publish.
- Metricool must reject unapproved content.
- Google Drive remains content-production source of truth; public assets needed at runtime belong in deployed storage/CDN rather than local-only paths.
- Admin routes require owner authentication, not a client-side visual lock.
- Mum's Garden production access must use a server-side gate. Do not expose a production PIN in frontend source.

## Emergent Status To Verify

Emergent reported the following on 2026-07-21. Treat each as a claimed status until production QA reconfirms it:

- Premium homepage hero and launch-room staging live in preview.
- Trust and safety strip live in preview.
- Music order and three lyric pages complete.
- Store has nine products and neon hero.
- Mum route gated with no grave imagery.
- Owner admin shell complete.
- Stripe TEST purchase, webhook and order proven.
- Backend tests reported 48/48 passing.

Preview reported by Emergent:
`https://168c1c8a-2191-4acd-9fca-f227ad4052aa.preview.emergentagent.com`

## Cutover Gate

Do not switch `gannonwaye.com` until all are true:

- Production build loads without console errors.
- Desktop and mobile hero layouts have no overlap or clipped text.
- Music play controls actually play.
- Checkout uses the intended Stripe mode and creates the correct order.
- Email capture stores consent and supports preferences/unsubscribe.
- Mum routes remain private.
- Coaching and secret music routes remain unavailable publicly.
- Admin is owner-only.
- Approval Queue blocks unapproved publishing.
- TikTok and Metricool remain disabled or approval-gated.
- Domain, HTTPS, canonical URL, Open Graph image, sitemap and 404 behavior pass.
- A rollback target is recorded before DNS changes.

## Immediate Emergent Actions

1. Preserve the current Emergent preview as a restorable checkpoint.
2. Pull the dedicated Sonia foyer commit/branch supplied by Codex and merge only the Mum foyer component/assets.
3. Run the production build and route smoke tests.
4. Re-test the preview player and feedback timing.
5. Verify every trust-strip claim against live system evidence.
6. Save the finished Emergent project back to GitHub on a separate branch or PR.
7. Present the final deploy cost/credit impact to Gannon before clicking paid deployment.
8. After explicit approval, deploy, link `gannonwaye.com`, then run post-deploy checkout, email, privacy and playback checks.

## Verified Exit Repository

Base44's export repository exists and is publicly readable:

`https://github.com/ganozwaye-stack/gannonwaye-exit-plan`

Verified contents include the entity schema export, secret-name checklist, connectors, backend-function inventory, agent inventory, route map, automations, design system, migration roadmap, Emergent setup guide, architecture notes, data-migration guide and parity checklist. The secrets document contains environment-variable names and instructions only; no secret values are exported.

This export is reference documentation, not proof of migrated runtime parity. Do not assume its counts, functions or routes are live in Emergent until implemented and tested.

The export currently documents 111 entities, 115 backend functions, 32 agent definitions, 13 secret names, 6 connectors and 59 public routes. These are export inventory counts only. They do not mean those items are connected, enabled or production-ready in Emergent.

## Stripe Status Verified In Emergent

The Emergent Payments screen currently shows:

- Test-payment instructions available.
- `Claim your Sandbox` still incomplete.
- `Make payments Live` still incomplete.

Therefore Stripe is not yet fully connected for live payments. Do not describe live keys as configured. Gannon must complete the Stripe account claim/KYC and live-app installation in the browser. No keys should be pasted into chat or committed to GitHub.

## Mum Video Transfer

Use `docs/MUM_VIDEO_AUDIT_2026-07-21.md` as the approval manifest. Only approved public assets should enter the Emergent runtime. Private funeral/burial recordings, unrelated clips, duplicates and uncertain identity footage remain outside the public project.

The replacement foyer brief is: 16:9, Sonia remains in the sky for the full sequence, Pa enters slowly from the left, wings move gently, clouds drift slowly, and the final frame holds them together for the garden entrance. Preserve Sonia's real face by compositing approved real photographs rather than regenerating her identity.
