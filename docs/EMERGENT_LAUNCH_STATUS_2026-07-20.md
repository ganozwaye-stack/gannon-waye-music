# Emergent Launch Status

Date: 2026-07-20

## Current Verdict

The site is transfer-ready as a staged Emergent preview, but not production-live ready until checkout, owner security, email capture, and approval gates are proven in the Emergent environment.

## Confirmed Done

- GitHub repo `ganozwaye-stack/gannon-waye-music` is public.
- Launch branch `launch/emergent-gannonwaye-2026-07-20` is pushed.
- Latest committed source includes the upgraded home hero and private `Without You Here` preview clip.
- Local lint and build have passed after the latest site work.
- Store route has the clean neon retail-room opening with product grid and cart flow underneath.
- Mum/Sonia memorial rules are documented and active for the staged build: no grave imagery, no public voice-note section, no random non-Sonia filler, no public generated Sonia voice/avatar without exact approval.
- Stripe profile has been claimed/live at the profile level.

## Still Incomplete Before Production Cutover

- Emergent must pull/rebuild the latest GitHub branch commit and confirm the preview is using the newest code.
- Stripe must be completed by the owner inside Stripe/Emergent: email, phone, identity, legal/business details, bank/payout, tax decision, live keys, and webhook secret.
- Store checkout needs a low-value live test order with proof that Stripe, order record, webhook, receipt, cancel, and refund paths work.
- Email capture must be tested on music, store, memorial, community/subscribe, and email-preference flows.
- Admin dashboard must be owner-only in Emergent, not just visually hidden.
- Approval Queue must block unapproved Metricool/TikTok/social publishing.
- Public coaching routes must be locked, private, or 404 until approved.
- At least three THANKYOU merch/social posts need to be ready in the approval queue before public push.
- GitHub dependency/security alerts need cleanup before treating the stack as competition-grade.

## Upgrade Direction

- Make the home page more immediately emotional: next single title, hook quote, cover/player, story summary, backing/subscription paths, and a premium gold cinematic brand system.
- Keep `Without You Here` audio as a timed private preview until release; after release, swap public music players to Spotify embeds/links.
- Split Mum's memorial into a sky foyer entry page and Sonia's Garden journey page.
- Use feature moments instead of long centered page blocks: cover art, garden sections, memories, favourite things, tattoo scrapbook, younger-years tribute, lyrics, and family-approved photos.
- Replace Base44 messiness with cleaner Emergent navigation and clickable proof: every dashboard number opens the source records.
- Keep automations approval-first: draft, review, approve, then schedule or publish.

## Owner Needed For

- Stripe private verification and payout details.
- Copying live secret keys directly into Emergent, never into chat or GitHub.
- Final Mum image approvals and any funeral speech/personal memory text that is not already located in Drive/repo.
- Domain/DNS approval when the preview passes QA.
- Final approval of public memorial content, especially anything involving Sonia voice/avatar, family photos, or private grief material.

## Recommended Next Order

1. Pull/rebuild Emergent from `launch/emergent-gannonwaye-2026-07-20`.
2. Verify the home page, store, Mum foyer/garden, music player, and mobile layout on the Emergent preview.
3. Complete Stripe owner verification and add Emergent payment environment variables.
4. Run checkout, email capture, admin-lock, approval-gate, and public-route QA.
5. Patch security/dependency alerts.
6. Point `gannonwaye.com` to the approved Emergent deployment.

