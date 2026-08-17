# Gannon Waye Music — Memory Vault (canonical instructions)

This file is the single source of truth for rules every agent (Base44 in-chat agent, Codex, Deego, and any installed Base44 agents) must follow when working on this app. Keep it short, declarative, and current. Every new chat should begin by reading this file.

## 1. House style
- Never use the em dash. Use commas, colons, or the middot.
- Wordmark "Gannon Waye" uses font-black (900).
- Hero portraits anchor the subject to the right-hand viewport edge at ~50% opacity over the dark background.
- Celestial/cloud imagery for closed or upcoming sections.
- Slow, cinematic drifting motion for hero background layers.
- Cover art comes from each release's `artwork_url` (database). Never hardcode per-song cover overrides.
- "Current single" = the Release with `is_current_single: true`. Set via Admin -> Releases.

## 2. Brand voice
- Survivor-led, emotionally honest, no toxic positivity.
- 10% of all support goes to 1800RESPECT.
- Independent, heart-first, voice and guitar first.

## 3. Release workflow (standardized template)
- One click: Admin -> Releases -> "Publish Single" runs `publishSingleWorkflow`:
  - Promotes release to Home hero (`is_current_single`), publishes it.
  - Song page `/release/:id` and Current Single page `/current-single` update from the flag.
  - Generates 3 merch drafts (apparel, accessory, poster) with emotional hook + write-up + CTA.
  - Creates a fan bundle offer + a VIP promo code.
  - Logs a Too Lost distribution task (manual until `TOO_LOST_API_TOKEN` set).
- Fan new-release emails fire automatically via the `notifySubscribersNewRelease` entity automation on `is_published`.

## 4. Merch rules (non-negotiable)
- A merch product is NOT listable until `profit_margin_percent >= 50`.
- Approval requires: title, cost of ordering, delivery cost, cost price total, sale price, write-up, CTA, emotional hook.
- Margin = (sale - cost - delivery - fee) / sale. Fee = sale * 3.5%.
- Use `base44/shared/marginMath.ts` for all margin math.
- Geo-routing (future): POD supplier chosen by customer delivery country (nearest facility).

## 5. Approval gating
- All AI-generated content (reels, social posts, merch, agent actions) requires manual approval before publishing.
- Reels route to the Reel Factory dashboard for review.

## 6. Secrets policy
- Do NOT store credentials Gannon has not explicitly approved. Approved secrets are listed in the Base44 dashboard.
- Too Lost + iCloud setup is handled by Codex via `docs/CODEX_HANDOFF_TOOLOST_ICLOUD.md`.

## 7. Data separation
- Gannon Waye Music (artist) and GanozMix Direct (dropshipping/system) data stay strictly separate.

## 8. Public navigation
- Home, Music, Lyrics, Store, Press, Subscribe, Contact. No clutter.
- All headings, buttons, and content elements on public pages must be clickable and navigate to relevant source/detail screens.