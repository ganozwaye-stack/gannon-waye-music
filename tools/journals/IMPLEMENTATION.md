# Paid journals: staged implementation and activation requirements

Current source: base44/shared/journalCommerce.js; tests/journals/commerce.test.mjs;
tools/journals/handlers.candidate.ts. The candidate is NOT an active Base44 function.
No journal checkout, private file import, access permission change or Stripe charge has been performed.

## Asset handoff
Provide a consumer-safe Library package containing:
- Six original PDFs, stable journal IDs/slugs, titles and immutable approved version.
- Six approved cover images separate from interiors.
- Exactly one actual question per journal, its PDF/page reference and approved public wording.
- Gannon-approved personal origin/purpose and reader-benefit copy per journal.
- File manifest identifying the definitive PDF and cover for each ID.
No invented origins, questions, credentials or promises.
Do not send public download URLs as the private asset registry.

## Existing capabilities and risks
- Base44 SDK supports UploadPrivateFile -> file_uri and CreateFileSignedUrl.
- Google Calendar is already active; scheduling account and availability are not chosen.
- CoachingWorkbook has zero records and publicly readable file_url. Keep that field empty.
- MerchOrder permits public creation. Its paid status CANNOT grant journal access.
- Current merchandise checkout is restricted to physical approved owned stock. Do not relax it.
- Existing signed Stripe verification remains untouched.

## Proposed purchase/delivery path
Use the same Stripe account, a dedicated journal checkout policy and approved fixed prices
(990 cents individual; 4900 cents for exactly all six). No shipping, consultation gate or
coaching approval applies. Use existing app sign-in solely to bind purchases/downloads
to a purchaser identity, not to enrol a purchaser in coaching.

A backend-only immutable catalogue contains approved version, six private file URIs and
PDF SHA-256s. The public catalogue contains covers, descriptions and one actual sample only.
Never expose private URIs in a public entity, frontend source, error or response.

Checkout derives price, book ID and purchaser metadata on the server and uses an
idempotency key for retries. Downloads independently retrieve the Stripe Checkout Session
AND PaymentIntent/latest charge every time; require exact buyer ID/email, store policy,
AUD, positive exact price, successful paid status, correct mode and catalogue version.
Refunded, partly refunded, disputed, unpaid and expired payments are denied.
Only entitled PDF bytes are proxied, with no-store and an approved integrity hash.
A server-side signed URL exists briefly but is never sent to the browser.

Retain immutable catalogue snapshots for prior sold versions; do not silently replace
or drop a paid version when releasing new evidence/files. The current prototype accepts
one supplied snapshot. A production registry must resolve a session's version from the
server's retained approved snapshots before enabling multiple versions.

## Checks before enabling sales
1. Privately import the original PDFs; verify unchanged hashes.
2. Prove direct anonymous and unrelated-user object access fails.
3. Prove an unpaid account cannot call the file-signing integration for another file.
4. Verify account sign-in and purchase binding with two actual test accounts.
5. Verify Stripe TEST checkout, cancellations, retry idempotency, individual vs bundle,
   refunds/disputes and download denial. Do not use real charges.
6. Verify browser PDF download uses authenticated functions.fetch and that responses/logs
   contain no internal URI or signed URL.
7. Verify purchase recovery and duplicate processing with a durable session reference,
   rechecking Stripe rather than trusting MerchOrder.
8. Keep sales disabled unless ALL checks pass.

Permission decision: no existing RLS/OAuth grants were changed. If checks 2 or 3 reveal
that Base44 private storage/signing is accessible to unpaid users, improving that
integration/permission boundary requires parent/user approval before any change.
The existing publicly readable CoachingWorkbook schema must not carry interiors.
Do not broaden it or remove unrelated permissions silently.

## Coaching configuration
Confirmed: A$99 per 45-minute session; paid two-way initial consultation, no obligation
after session one. Once only, session two paid and session three complimentary;
first three total A$198, normal full rate from session four. Package checkout is disabled.
Calendar account, actual availability, buffers, cancellation terms and booking locking
remain pending. Reservation must be atomic and expire on failed/cancelled payment;
confirmation only follows server-verified payment. Do not offer invented slots.

## Publication
Coaching story/navigation source is saved. Only this approved honest page is public-route
eligible. Legacy intake/programme/resource routes remain held. A checkpoint is not a
production publish. No dedicated publish tool is exposed in the current tool set.
Do not use the paid builder to circumvent that limitation.
