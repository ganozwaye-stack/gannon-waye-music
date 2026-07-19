# Emergent Parity Transfer Plan

Date: 2026-07-19

## Transfer Goal

Move the public Gannon Waye Music website and the private operating dashboard into Emergent with full parity, cleaner navigation, better clickable drill-downs and an approval-first automation system.

## Bring Over

- Public pages for music, store, merch, supporter/back-this flow, memorial pages, community, contact and email preferences.
- Admin dashboard, notification bell, approval queue, social schedule queue, Metricool command, revenue command, orders, subscribers, product/merch management and QA.
- Agent definitions for revenue, merch, content, video intake, scripting/captions, performance learning, Metricool, research and approval gate.
- Stripe/order workflows only after secrets and webhook endpoints are confirmed in the target environment.
- Google Drive content-production source-of-truth folder paths and naming rules.
- TikTok draft upload/OAuth workflow, but keep it draft-only until app review and explicit approval.
- Email capture on music, memorial, merch and store pages.

## Do Not Bring Over

- Dead routes, duplicate pages and confusing admin links that do not lead anywhere useful.
- Fake/demo stats unless marked as sample data.
- Any hidden auto-publish behaviour.
- Public coaching pages. Coaching stays private until approved.
- Hardcoded secrets, local-only file paths as public URLs, stale schedule dates or unverified payment settings.
- Memorial content used as sales content unless Gannon explicitly approves the individual draft.

## What Must Be Better Than Base44

- Every number is clickable and drills down to source records.
- Pending approvals open the actual pending list.
- Revenue amounts open the exact orders, campaign source, products and transaction proof.
- Draft titles open the draft, caption, media path, approval state and next action.
- The private dashboard has fewer top-level sections: Today, Approvals, Content, Revenue, Store, Integrations, Agents, QA.
- Each external integration has a status card: not connected, needs credentials, testing, live, error.
- No ambiguous buttons like "publish" unless it truly publishes and requires confirmation.

## Emergent Build Checklist

1. Recreate public routes and visual brand.
2. Recreate admin/private routes.
3. Import Base44 entity schemas.
4. Recreate agent definitions and safety rules.
5. Recreate backend functions or replace them with Emergent equivalents.
6. Connect Google Drive as source of truth.
7. Connect Metricool API if the account plan supports API access.
8. Connect TikTok OAuth after developer app review.
9. Connect Meta/Instagram/Facebook either through Metricool or Meta app review.
10. Connect YouTube through Google OAuth/API or schedule manually first.
11. Run route QA, checkout QA, approval QA, email capture QA and privacy QA.
12. Only then switch DNS / production publishing.

## Cutover Gate

Do not replace the live site until:

- Store checkout works.
- Email capture works.
- Coaching public routes return 404 or private lock.
- Approval Queue works.
- Metricool scheduling refuses unapproved posts.
- TikTok can only upload approved drafts or remains disabled.
- Admin dashboard is owner-only.
- At least three THANKYOU merch posts are ready in the approval queue.
