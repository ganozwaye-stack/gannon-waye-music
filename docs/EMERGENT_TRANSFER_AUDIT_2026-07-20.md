# Emergent Transfer Audit

Date: 2026-07-20

## Current Source Of Truth

- Active repo: `C:\Users\ganno\Documents\Codex\gannon-waye-music-pr-work`
- Git remote: `https://github.com/ganozwaye-stack/gannon-waye-music.git`
- Base44 app: `Gannon Waye Music`
- Base44 app id: `6a1d91c28109c1a7274f350a`
- Base44 auth checked: logged in as `ganozwaye@gmail.com`

## Audit Result

This is not a simple static site migration. The current Base44 system contains:

- 65 public routes
- 280 admin routes
- 77 local entity schemas
- 96 local backend function folders
- 33 local agent definitions
- 7 connector configs: Airtable, Gmail, Google Calendar, Google Drive, Google Sheets, Notion, Slack

Base44 remote currently reports:

- 50 deployed functions
- no configured secrets returned by `npx base44 secrets list`

That means the frontend can move today, but backend/payment/social automation parity needs staged verification.

## Today Transfer Scope

Move these to Emergent first:

- Public home page
- Music page
- Current single handling
- Store landing, product grid, cart screens, checkout screens as staged UI
- Mum sky foyer and Sonia's Garden private preview route
- Contact, lyrics, videos, community and email-preference pages
- Admin shell only for owner review: Today, Approvals, Content, Revenue, Store, Integrations, Agents, QA

Keep these locked or staged:

- Stripe checkout until live keys, webhook URL and test order are confirmed in Emergent
- Metricool/TikTok scheduling until approval gate is rebuilt
- Coaching public routes until separately approved
- Sonia voice/avatar output until exact family-approved result exists
- Memorial photos/submissions until Gannon approves exact assets

## Required Emergent Setup

1. Create or open the Emergent project.
2. Connect GitHub repo `ganozwaye-stack/gannon-waye-music`.
3. Use build command `npm run build`.
4. Use output directory `dist`.
5. Add environment variables only after verifying exact names and values.
6. Deploy to an Emergent preview URL first.
7. Test routes and forms.
8. Only after approval, point `gannonwaye.com` DNS to the Emergent deployment.

## Go Live Gate

Do not switch production DNS until:

- Store checkout completes a low-value live test.
- Order record appears in the target database.
- Receipt/webhook path is confirmed.
- Email capture works.
- `/mum` and `/mum/garden` follow the approved memorial rules.
- Public coaching pages are private/404/locked.
- Admin routes are owner-only.
- Approval Queue exists and blocks unapproved publishing.
- At least three THANKYOU merch posts are ready in approval queue.

## Current Validation

- `npx eslint src/pages/Store.jsx --quiet` passed.
- `npm run build` passed.
- Known local warning only: `VITE_BASE44_APP_BASE_URL` is not set.
- Store visual check passed: neon `GANNON WAYE` sign is visible under the menu.
- Mum preview check passed: no public voice-note section/buttons, no cart/footer intrusion, private timed `Without You Here` preview remains.
