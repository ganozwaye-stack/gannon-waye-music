Add this to GitHub as AGENTS.md
# Gannon Waye AI Agent Operating Rules

## Source of truth

Live site: https://gannonwaye.com  
Base44 app ID: 69eb7905ca6eb4180010f794  
Base44 editor: https://app.base44.com/apps/69eb7905ca6eb4180010f794/editor  
GitHub branch: main  

## Correct social handles

Instagram: @gann0nwaye  
TikTok: @gann0nwaye  
YouTube: @gannonwayeofficial  

Wrong handle: @gannonwaye  

Agents must never replace @gann0nwaye or @gannonwayeofficial with @gannonwaye.

Correct links:

```text
https://www.instagram.com/gann0nwaye
https://www.tiktok.com/@gann0nwaye
https://www.youtube.com/@gannonwayeofficial
Release mode

THANKYOU by Gannon Waye is OUT NOW.

All public copy, campaigns, agents, prompts, CTAs and templates must use post-release language:

OUT NOW
STREAM NOW
AVAILABLE NOW
LISTEN NOW
WATCH NOW
SHOP THE COLLECTION
JOIN THE JOURNEY

Remove active campaign references to:

coming soon
pre-save
presave
upcoming release
out tomorrow
countdown
not released yet
release day soon
stream soon
Music links

Spotify track:

https://open.spotify.com/track/6xHQX9Yc2pcfRzVxdPmRHp

Spotify embed:

https://open.spotify.com/embed/track/6xHQX9Yc2pcfRzVxdPmRHp?utm_source=generator

Do not invent Apple, YouTube, TikTok, Amazon or TIDAL links. Use verified links or route to /music.

Safety rule

Do not spend money, subscribe, launch paid ads, refund, discount, change prices, change payment settings, delete records, expose private data, publish risky content, or commit Gannon to anything without owner approval.

Required verification

Before marking complete:

npm run build

Run scans for:

@gannonwaye
pre-save
presave
coming soon
upcoming release
out tomorrow
countdown
not released yet

Run Playwright from the dedicated configured test folder.

Do not claim live completion unless changes are published to the real Base44 production app and verified on https://gannonwaye.com.


---

# 3. Paste this into Base44

```text
URGENT LIVE BASE44 FIX — CORRECT SOCIAL HANDLES, RELEASE MODE, NOTIFICATIONS, TESTS, PUBLISH

You are working on the real live Gannon Waye Base44 production app.

Do not work only on an ejected copy.
Do not mark complete unless the real live site is published and verified.

REAL PRODUCTION DETAILS:
- Live domain: https://gannonwaye.com
- Base44 app ID: 69eb7905ca6eb4180010f794
- Editor: https://app.base44.com/apps/69eb7905ca6eb4180010f794/editor

==================================================
CRITICAL CORRECTION — SOCIAL HANDLES
==================================================

Previous instructions that said to replace @gann0nwaye or @gannonwayeofficial with @gannonwaye were WRONG.

Correct source of truth:

Instagram:
@gann0nwaye
https://www.instagram.com/gann0nwaye

TikTok:
@gann0nwaye
https://www.tiktok.com/@gann0nwaye

YouTube:
@gannonwayeofficial
https://www.youtube.com/@gannonwayeofficial

Wrong handle:
@gannonwaye

Action:
Replace wrong Instagram/TikTok/YouTube usage of @gannonwaye with the correct platform-specific handles above.

Do not replace @gann0nwaye with @gannonwaye.
Do not replace @gannonwayeofficial with @gannonwaye.

Update and verify:
- Footer.jsx
- Community.jsx
- ContactGannon.jsx
- GiftProgressTracker.jsx
- HomeEmailSignup.jsx
- InstagramFeed.jsx
- TourTracker.jsx
- Live.jsx
- FAQSection.jsx
- shared email signatures
- campaign prompts
- social caption templates
- Metricool profile mappings
- Metricool scheduled post templates
- social post generator defaults
- social link config files
- database-configured public copy
- admin social settings
- Playwright tests

Footer requirement:
- Instagram links to https://www.instagram.com/gann0nwaye and displays @gann0nwaye
- TikTok links to https://www.tiktok.com/@gann0nwaye and displays @gann0nwaye
- YouTube links to https://www.youtube.com/@gannonwayeofficial and displays @gannonwayeofficial
- Facebook should only appear if there is a verified official Facebook URL. If unverified, hide from public footer and keep internal status as Needs Verification.

Metricool:
Audit all connected social profiles and scheduled campaigns.
If Metricool contains @gannonwaye for Instagram or TikTok, change to @gann0nwaye.
If Metricool contains @gannonwaye for YouTube, change to @gannonwayeofficial.
If Metricool connection cannot be edited because credentials/API are missing, create an urgent OwnerNotification: "Metricool social handles need owner verification".

==================================================
THANKYOU RELEASE MODE
==================================================

THANKYOU by Gannon Waye is officially OUT NOW.

Replace active public/current campaign wording:

Remove:
- coming soon
- pre-save
- presave
- upcoming release
- out tomorrow
- countdown
- release day soon
- not released yet
- stream soon
- orders open soon
- June 10 release copy
- any current CTA saying the single has not released

Use:
- OUT NOW
- STREAM NOW
- AVAILABLE NOW
- LISTEN NOW
- WATCH NOW
- SHOP THE COLLECTION
- JOIN THE JOURNEY
- THANKYOU OUT NOW
- Stream THANKYOU Now

Do not change archived historical posts unless they are currently shown as active campaign copy.

Update:
- Home
- Music
- Store
- Community
- Contact
- Live
- Videos
- Lyrics
- THANKYOU/release pages
- ThankYouSingle
- ThankYouHeroBanner
- ThankYouCampaignSection
- ThankYouStorySection
- LyricsModal
- LyricsPage empty states
- FAQSection
- store fallback text
- signup sections
- email templates
- shared email signature
- agent prompts
- campaign generator functions
- Metricool scheduled campaign copy

==================================================
MUSIC LINKS
==================================================

Create or update central music link config.

Spotify track:
https://open.spotify.com/track/6xHQX9Yc2pcfRzVxdPmRHp

Spotify embed:
https://open.spotify.com/embed/track/6xHQX9Yc2pcfRzVxdPmRHp?utm_source=generator

Add Spotify embed to:
- Music page
- THANKYOU single component
- any release landing page

For Apple Music, YouTube, TikTok, Amazon Music and TIDAL:
Use verified existing URLs only.
If exact URLs are missing, route to /music or the existing smart link.
Do not invent fake URLs.

==================================================
OWNER NOTIFICATION SYSTEM
==================================================

Create or verify entity:
OwnerNotification or SystemNotification

Fields:
- title
- message
- type
- priority
- source
- related_entity
- related_entity_id
- action_url
- status
- created_date
- read_at
- requires_owner_action
- risk_level

Create or verify:
- /admin/notifications
- notifications badge in admin header
- notifications section in /admin/command-centre
- notification creation helper/function
- notification audit logging

Create notifications for:
- new merch sale
- paid checkout completed
- checkout failed
- checkout expired
- Stripe webhook failure
- refund detected
- chargeback/dispute
- low stock
- product missing price/cost/delivery/margin
- product unavailable but promoted publicly
- store conversion spike
- supporter signup
- contact form message
- business enquiry
- collaboration enquiry
- customer support issue
- viral traction detected
- playlist support detected
- engagement spike
- conversion spike
- platform API disconnect
- Metricool disconnect
- TikTok disconnect
- Spotify link/embed failure
- Gmail/Drive/Sheets/Calendar disconnect
- backend function error
- public route broken
- admin route broken
- any action needing owner approval

Owner email for urgent notifications:
ganozwaye@gmail.com

Only send owner email if email integration is connected and safe.
Do not send fake purchases, refunds or live financial actions.

==================================================
INTEGRATION STATUS
==================================================

Create/update integrations panel.

Check and display:
- Stripe
- Gmail
- Google Drive
- Google Sheets
- Calendar
- Airtable
- Notion
- Slack
- Metricool
- TikTok
- YouTube
- Instagram/Facebook where available
- Spotify
- Base44 functions
- Webhooks
- Email notifications
- GitHub

Use statuses:
- Connected
- Needs credentials
- Needs owner approval
- Testing
- Live
- Error
- Disabled

Do not expose secret values.
Only show whether required secrets exist.

==================================================
STRIPE / WEBHOOK
==================================================

Verify Stripe without changing prices or payment settings.

Use active production webhook:
https://api.base44.app/api/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter

Do not use failing endpoint:
https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter

Verify subscribed events:
- checkout.session.completed
- checkout.session.expired
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded

Verify secret names exist only:
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- OPENAI_API_KEY
- METRICOOL_API_TOKEN
- TIKTOK_CLIENT_KEY
- TIKTOK_CLIENT_SECRET

If missing, create OwnerNotification with Needs Credentials.

==================================================
TIKTOK REVIEW
==================================================

Correct TikTok handle:
@gann0nwaye
https://www.tiktok.com/@gann0nwaye

Verify TikTok Developer site verification status.

DNS TXT needed if still not verified:
Type: TXT
Host/Name: @
Value: tiktok-developers-site-verification=YXTHpYcOkBnwfD0ht8YGfQqNZ2d30qRO

If DNS or TikTok Developer Portal access is needed, create OwnerNotification with exact action steps.

==================================================
AI AGENTS
==================================================

Switch all relevant agents/prompts/functions to:
RELEASE OPTIMISATION MODE

Prioritise:
- streams
- saves
- shares
- playlist additions
- comments
- UGC creation
- community growth
- merch sales
- store conversions
- email signups
- founding supporter signups
- algorithmic reach
- viral reach

Update:
- music_orchestrator
- release_launch_agent
- generateContentPost
- generateReleaseSprint
- social caption tools
- Metricool tools
- campaign planners
- Command Centre recommendations
- Launch War Room
- Creative Studio
- Marketing Centre
- Social Command
- Content Performance dashboard

Remove instructions to drive pre-saves or countdowns.

==================================================
PLAYWRIGHT + TESTING
==================================================

Run tests from the dedicated configured folder only:
tiktokfix/src/gannonwaye-playwright-pack

Set:
BASE_URL=http://localhost:5173

Run:
npx playwright test

Add/update tests that assert:
- Instagram is @gann0nwaye and links to instagram.com/gann0nwaye
- TikTok is @gann0nwaye and links to tiktok.com/@gann0nwaye
- YouTube is @gannonwayeofficial and links to youtube.com/@gannonwayeofficial
- @gannonwaye does not appear as a public social handle
- Music page shows OUT NOW / STREAM NOW
- Spotify embed exists
- Store loads
- Cart route exists
- Notifications route loads
- Admin routes are private when unauthenticated
- No public pre-save copy
- No public coming-soon copy for THANKYOU
- No dead CTAs
- Footer social links are correct

==================================================
BUILD + SCANS
==================================================

Run:
npm run build

Run scans for:
- @gannonwaye
- pre-save
- presave
- coming soon
- upcoming release
- out tomorrow
- countdown
- not released yet
- June 10
- stream soon

Important:
@gannonwaye may appear only if it is part of a test proving it is absent or an internal audit note. It must not appear as a live public social handle.

==================================================
PUBLISH
==================================================

If build/tests pass:
Publish the real live Base44 production app.

After publish verify:
- https://gannonwaye.com
- https://gannonwaye.com/music
- https://gannonwaye.com/store
- https://gannonwaye.com/community
- https://gannonwaye.com/contact
- /admin/command-centre
- /admin/agent-registry
- /admin/notifications
- /admin/site-health
- /admin/stripe-live-report
- /admin/webhook-health

==================================================
FINAL REPORT REQUIRED
==================================================

Return:

DONE:
IN PROGRESS:
BLOCKED:
NEEDS OWNER ACTION:
NEEDS CREDENTIALS:
BUILD RESULT:
PLAYWRIGHT RESULT:
STALE COPY SCAN RESULT:
SOCIAL HANDLE SCAN RESULT:
METRICOOL STATUS:
STRIPE/WEBHOOK STATUS:
NOTIFICATION SYSTEM STATUS:
LIVE PUBLISH STATUS:
LIVE VERIFICATION LINKS:

Do not say complete unless the live production site is published and verified.
# Gannon Waye AI Agent Operating Rules

## Source of truth

Live site: https://gannonwaye.com  
Base44 app ID: 69eb7905ca6eb4180010f794  
Base44 editor: https://app.base44.com/apps/69eb7905ca6eb4180010f794/editor  
Repository: gannon-wayne-music / gannon-waye-music  
Primary branch: main  

## Permanent correction: social handles

The correct social handles are:

Instagram: @gann0nwaye  
TikTok: @gann0nwaye  
YouTube: @gannonwayeofficial  

The wrong handle is:

@gannonwaye  

Agents must never replace @gann0nwaye or @gannonwayeofficial with @gannonwaye.

Agents must do the opposite:

- replace incorrect Instagram @gannonwaye with @gann0nwaye
- replace incorrect TikTok @gannonwaye with @gann0nwaye
- replace incorrect YouTube @gannonwaye with @gannonwayeofficial

Correct public URLs:

```text
https://www.instagram.com/gann0nwaye
https://www.tiktok.com/@gann0nwaye
https://www.youtube.com/@gannonwayeofficial

If Facebook is unverified, hide it from the visible public footer and mark it internally as Needs Verification.

Metricool and social scheduling rule

Before scheduling, publishing, or generating campaign copy, check social profiles against the correct handles:

Instagram must be @gann0nwaye
TikTok must be @gann0nwaye
YouTube must be @gannonwayeofficial

If Metricool or any scheduler contains @gannonwaye as the active profile for Instagram, TikTok, or YouTube, flag it as wrong and create an owner notification.

Do not publish or schedule to a wrong handle.

Current campaign truth

THANKYOU by Gannon Waye is OUT NOW.

All public copy, campaigns, agents, prompts, CTAs, banners, templates, captions, email signatures, dashboards, and content generators must use post-release language.

Use:

OUT NOW
STREAM NOW
AVAILABLE NOW
LISTEN NOW
WATCH NOW
SHOP THE COLLECTION
JOIN THE JOURNEY
THANKYOU OUT NOW
Stream THANKYOU Now

Remove active/current campaign references to:

coming soon
pre-save
presave
upcoming release
out tomorrow
countdown
not released yet
release day soon
stream soon
orders open soon
June 10

Archived historical posts may keep old wording only if they are clearly archived and not being displayed as current active campaign copy.

Music links

Spotify track:

https://open.spotify.com/track/6xHQX9Yc2pcfRzVxdPmRHp

Spotify embed:

https://open.spotify.com/embed/track/6xHQX9Yc2pcfRzVxdPmRHp?utm_source=generator

Do not invent Apple Music, YouTube Music, TikTok, Amazon Music or TIDAL links.

Use verified links only. If a verified platform link is missing, route safely to /music or the existing smart-link page.

Base44 production rule

Always distinguish between:

local/ejected code
GitHub repository code
copied/staging Base44 apps
the real live production Base44 app

Do not claim a change is live unless it has been applied to the real production Base44 app and published.

The real live production details are:

Live site: https://gannonwaye.com
Base44 app ID: 69eb7905ca6eb4180010f794
Base44 editor: https://app.base44.com/apps/69eb7905ca6eb4180010f794/editor

Known deployment issue:

Base44 CLI may be able to eject/read the app, but direct production deploy/entity push may not update the original live app if the app was not created as a CLI Backend Platform app.

If CLI deployment is blocked or appears to target a copied app:

prepare the patch locally
commit it to GitHub
run build/tests
create a Base44 editor implementation prompt
apply through the live Base44 editor/AI workflow
publish in Base44
verify the live site at https://gannonwaye.com
Do-Not-Spend-Or-Lose rule

Do not perform any action without owner approval if it could:

spend money
subscribe to a paid tool
launch paid ads
issue refunds
offer discounts
reduce prices
change Stripe or payment settings
change invoices
change subscriptions
create financial risk
create legal risk
expose private data
delete important records
weaken legal/financial/business position
commit Gannon or the business to an agreement
publish risky public statements
damage reputation or income

Low-risk actions may run automatically:

audit
search
draft
patch code
run tests
update safe copy
fix wrong links
create reports
create internal notifications
create dashboards
verify routes
verify public links
prepare Base44 prompts
prepare GitHub commits
Required owner notifications

Create or verify an owner notification system for:

new merch sale
paid checkout completed
checkout failed
checkout expired
Stripe webhook failure
refund detected
chargeback/dispute
low stock
product missing price
product missing cost
product missing delivery cost
product missing margin
product unavailable but promoted publicly
store conversion spike
supporter signup
contact form message
business enquiry
collaboration enquiry
customer support issue
viral traction detected
playlist support detected
engagement spike
conversion spike
platform API disconnect
Metricool disconnect
TikTok disconnect
Spotify embed or link failure
Gmail disconnect
Google Drive disconnect
Google Sheets disconnect
Calendar disconnect
backend function error
public route broken
admin route broken
any action needing owner approval

Owner urgent email:

ganozwaye@gmail.com

Only send urgent owner emails if the email integration is connected and safe.

Do not send fake purchases, refunds, or live financial actions.

Integration status labels

Every integration must be displayed with one of these statuses:

Connected
Needs credentials
Needs owner approval
Testing
Live
Error
Disabled

Check:

Stripe
Gmail
Google Drive
Google Sheets
Calendar
Airtable
Notion
Slack
Metricool
TikTok
YouTube
Instagram/Facebook where available
Spotify
Base44 functions
Webhooks
Email notifications
GitHub

Do not expose secret values. Only show whether required secrets exist.

Stripe and webhook rule

Verify Stripe without changing prices or payment settings.

Use active production webhook:

https://api.base44.app/api/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter

Do not use the failing /api/v2/ endpoint:

https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter

Required Stripe webhook events:

checkout.session.completed
checkout.session.expired
payment_intent.succeeded
payment_intent.payment_failed
charge.refunded

Required secret names:

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY
METRICOOL_API_TOKEN
TIKTOK_CLIENT_KEY
TIKTOK_CLIENT_SECRET

Only verify whether the secrets exist. Never print secret values.

TikTok rule

Correct TikTok handle:

@gann0nwaye
https://www.tiktok.com/@gann0nwaye

If TikTok Developer site verification is not complete, check whether this DNS TXT record is needed:

Type: TXT
Host/Name: @
Value: tiktok-developers-site-verification=YXTHpYcOkBnwfD0ht8YGfQqNZ2d30qRO

If DNS or TikTok Developer Portal access is needed, create an owner notification with the exact steps.

AI agents mode

All relevant AI agents, prompts, functions, dashboards, and campaign generators must operate in:

RELEASE OPTIMISATION MODE

Priorities:

streams
saves
shares
playlist additions
comments
UGC creation
community growth
merch sales
store conversions
email signups
founding supporter signups
algorithmic reach
viral reach
fan engagement
audience growth
revenue growth
brand positioning

Update:

music_orchestrator
release_launch_agent
generateContentPost
generateReleaseSprint
social caption tools
Metricool tools
campaign planners
Command Centre recommendations
Launch War Room
Creative Studio
Marketing Centre
Social Command
Content Performance dashboard

Remove instructions to drive pre-saves or countdowns.

Required scans

Before marking complete, run scans for wrong social handles:

@gannonwaye
instagram.com/gannonwaye
tiktok.com/@gannonwaye
youtube.com/@gannonwaye

Important:

@gannonwaye may appear only in internal audit notes, tests proving absence, or this AGENTS.md file. It must not appear as a live public social handle.

Run scans for stale release wording:

pre-save
presave
coming soon
upcoming release
out tomorrow
countdown
not released yet
release day soon
stream soon
orders open soon
June 10
Required tests

Before marking complete, run:

npm run build

Run Playwright from the dedicated configured test folder if present:

tiktokfix/src/gannonwaye-playwright-pack

Use:

BASE_URL=http://localhost:5173
npx playwright test

Playwright should verify:

home loads
music page shows OUT NOW / STREAM NOW
Spotify embed exists
store loads
cart route exists
Instagram is @gann0nwaye
TikTok is @gann0nwaye
YouTube is @gannonwayeofficial
@gannonwaye does not appear as a public social handle
no public pre-save copy
no public coming-soon copy for THANKYOU
notifications route loads
admin routes stay private when unauthenticated
no dead CTAs
footer social links are correct
Final report format

Every agent or coding assistant must return:

DONE:
IN PROGRESS:
BLOCKED:
NEEDS OWNER ACTION:
NEEDS CREDENTIALS:
BUILD RESULT:
PLAYWRIGHT RESULT:
STALE COPY SCAN RESULT:
SOCIAL HANDLE SCAN RESULT:
METRICOOL STATUS:
STRIPE/WEBHOOK STATUS:
NOTIFICATION SYSTEM STATUS:
LIVE PUBLISH STATUS:
LIVE VERIFICATION LINKS:
NEXT EXACT ACTION:

Do not say complete unless the real live site is published and verified at:

https://gannonwaye.com

After pasting it, click **Commit changes** again. Then open `AGENTS.md` from the file list and check the first handle section says:

```text
Instagram: @gann0nwaye
TikTok: @gann0nwaye
YouTube: @gannonwayeofficial
Wrong handle: @gannonwaye
