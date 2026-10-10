# Coaching interest and website aggregates — unpublished review

Canonical app: 69eb7905ca6eb4180010f794. No publication, backend activation, live intake, customer messages, payments or analytics enablement is authorized by this draft.

## What is implemented

/coaching retains the exact seven approved paragraphs and selected portrait. The latest owner instruction centers the two-line Poppins title (uppercase 500-weight gold main line; 400-weight, modestly smaller body-colour subtitle), reuses the exact Navbar/FanChatWidget gold gradient, adds matching short dividers and places both choices before the story. No substitute fan artwork or cover images has been produced.

/coaching -> Enquire about Coaching reveals the short interest form. Required: first name (80), last name (80), date of birth (valid calendar date, not future), mobile (8–15 digits, max30), email (254) and the free-text support message (1000). Consent to contact is explicit. No appointment or payment is promised. Journals remain independent.

Frontend submission uses one UUID per form attempt, an in-flight guard and a matching saved receipt before success. Production submission requires VITE_COACHING_INTEREST_ENABLED=true; it defaults closed. Development can exercise mocked receipts. No actual leads were submitted in these tests.

The staged submitCoachingInterest endpoint validates on the server, checks body size/honeypot, applies a process-local burst guard and a secret HMAC contact fingerprint for daily limits. It is closed unless COACHING_INTEREST_OPEN=true, COACHING_MINOR_INTAKE_POLICY_APPROVED=true and COACHING_ABUSE_HASH_SECRET is configured. None was configured by this work.

CoachingLead is the canonical private lead record; the prior direct double save to CoachingIntake + CoachingLead is removed. Private lead RLS is owner-email + admin role; anonymous creation is blocked. A new minimal CoachingSubmissionReceipt ledger holds UUID/hash/completion/lead ID, not DOB, phone, email or message, allowing service retries without broad lead-read access. Retry of a completed receipt returns the same receipt. A pending/ambiguous save remains pending rather than creating a new lead. Owner-only reconciliation can confirm exactly one saved lead. Concurrent mock attempts create one lead; actual platform races/unique constraints remain unverified.

Existing /admin/coaching-hub lead management now uses coachingOwnerInbox with authenticated owner checks. Contact details, DOB and message are shown only there; none enters the aggregate query/response. Legacy CoachingIntake data is not duplicated or migrated.

Shared analytics.js, the existing App tracker position and the existing /admin/social-analytics-command page are reused. No new tracking SDK. Events are counts with allowlisted page/target labels, no raw URLs, identity, form contents or journal answers. Explicit test marker and admin traffic are excluded. Native CTA capture plus a short throttle avoids duplicate handlers; query choices on the same page do not inflate page views. Existing nonsensitive signup events are retained with page-only properties. The existing PostHog instance has automatic capture, session recording, automatic pageleave/referrer/campaign capture disabled; existing persistence settings are unchanged.

The first-party WebsiteEvent endpoint/schema and owner aggregate backend are staged. VITE_FIRST_PARTY_ANALYTICS_ENABLED and WEBSITE_ANALYTICS_OPEN default closed; no live counts or historical coverage is claimed. Owner statistics use UTC date ranges, useful labels, receipt/event/order deduplication, marked sample/admin exclusions and a separate coaching-interest count. Contacts are email acknowledgements, not confirmed inbox delivery. /bookings currently redirects home and the bookingSystem helper has no active public caller; do not claim a working booking form from the historical helper.

Attribution stores first/last recorded session sources, source/medium/campaign only. No raw referrer URL or persistent visitor ID, no cross-device or causal claim. Allowlisted UTM fields survive the cart/checkout request. Staged createCheckoutSession sanitizes metadata server-side; staged shared capture writes attribution + payment_verified only after the existing verified-paid caller checks. MerchOrder staged schema restricts create to admin/service. Stats require payment_verified=true, canonical Stripe IDs and store policy, so unmarked historical or client-created rows are omitted. No historical orders were relabeled or queried for customer identities.

Refunded orders contribute zero known net revenue. Partial refunds require a verified AUD amount; absent amounts are flagged/incomplete, not guessed. Existing duplicate/revenue-excluded owner test orders are excluded. Outbound music clicks are distinct from actual streams. TooLost production analytics/current OAuth was not verified in this implementation; this is not a streams dashboard.

## Deployment and review boundaries

Backend files live under staging/, outside base44/functions. A builder write attempted bundling and rejected the cross-directory import; failed entry files were moved out of deployable directories. Function-local policy copies are tested identical to the shared source. Staged checkout uses a local shipping helper. Shared paid-order capture must be packaged through the existing verified webhook + verifyCheckoutSession callers together; backend bundle and Stripe verification regression checks are required before any rollout.

Before opening intake: owner defines under-18 admission/consent/review handling; implement the chosen policy (validation currently imposes no age-admission rule). The adult preview is usable locally; live endpoint remains closed for everyone. Verify owner/non-owner/anonymous and service-role RLS against an isolated authorized environment, body/rate trust boundaries, replica concurrency and ambiguous-save recovery. No legal consent/retention policy has been invented.

Before enabling aggregates: deploy/test schemas and guarded functions as one reviewed change, retain all production holds, and obtain parent publication/activation approval. No stored synthetic events, live submissions, customer messages or real charges are part of testing.

## Local checks

- node scripts/test-coaching-interest.mjs
- node scripts/test-website-analytics.mjs
- Isolated Chromium desktop/phone/tablet Playwright: coaching-interest, website-analytics and Coaching landing checks.
- Production hold spec against an isolated local Vite production build.
- npm run build and existing safety guards.

Safari is not verified: isolated WebKit is absent. Full Coaching purchase/navigation suite passed earlier; latest changes keep purchases held.

## Fan and visual review

PUBLIC_JOURNALS currently has six null coverImageUrl values. No verified approved cover set was found in source/public assets. The supplied fan layout parameters can be applied as faithful CSS once genuine matching cover bytes are available; no asset transfer bypass or old-cover substitution occurred.

Current photo is preserved but remains subdued beneath the approved scrim. The latest centered title/top choices improve hierarchy. Any further portrait prominence or early fan insertion needs the actual approved asset set and bounded visual review; no rewriting of the agreed story is implied.
