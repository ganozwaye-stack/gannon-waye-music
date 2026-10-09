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
or drop a paid version when releasing new evidence/files. The staged adapter resolves purchased versions from server-only
JOURNAL_PRIVATE_CATALOGUE_VERSIONS plus the current JOURNAL_PRIVATE_CATALOGUE.
Unknown or unavailable editions fail closed. All snapshots still need verified private
file URIs/hashes; never delete an edition already sold.

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
first three total A$198, normal full rate from session four. Approved ten-total 45-minute appointments cost A$850 including the introduction, with no extra eleventh appointment or stacking. Package checkout stays disabled until booking is configured and tested. Tailored between-session work requires an agreed scope and fee upfront; no extra fee or specialist service is configured.
Calendar account, actual availability, buffers, cancellation terms and booking locking
remain pending. Reservation must be atomic and expire on failed/cancelled payment;
confirmation only follows server-verified payment. Do not offer invented slots.

## Browser verification (2026-10-09)
All 12 root-config coaching-journals.spec.js browser checks passed across desktop,
Pixel 5 and tablet: six modal selections/one genuine question, Close and Back/reopen,
disabled Purchase/no journal API or Stripe requests, three titles A$29.70, explicit
six-title bundle A$49, unique basket entries and reset on reopening. Chromium and
Debian dependencies were extracted under /tmp, without system package installation.
41 pure commerce/recovery/basket tests pass. These are held-page/source checks,
not actual paid-account, Stripe/storage integration or live publication proof.

## Private recovery index (created; sales still held)
Candidate: tools/journals/purchase-index.schema.candidate.jsonc. Proposed new GW
JournalPurchase schema stores buyer_user_id, stripe_session_id, catalogue_version,
offer_id and verified_at. All client CRUD rules are false. Existing service-role backend
access would be used. No existing RLS/user role/OAuth/storage grant would be broadened.
Parent confirmed this exact restricted creation is within the authorized purchase
implementation. list_entity_schemas returned no existing JournalPurchase; the supported
create_entity_schema tool created it. Read-back verified all four CRUD rules false.
An administrative read returned zero records. An anonymous SDK-path GET returned
HTTP 200 with an empty list. With no test records this cannot prove populated-row
confidentiality or authenticated client CRUD denial; those runtime checks remain open.
base44/entities/JournalPurchase.jsonc mirrors the schema for durable source review.
No approval rejection occurred.
Records remain references only; Stripe is reverified for access.
Staged source now implements durable pending-session recovery and handler wiring;
actual deployment, persistence and authenticated integration remain held.

## Library transfer limitation
prepare_materialize returned six available transfers with expected PDF versions, no
warnings/unavailable items and no workspace_path. Destination hint was the Windows
workspace coaching-journal-assets directory. Actual consumer was the remote Linux
/tmp/gw-coaching-journals-20261009 directory because Windows execution failed.
The unchanged current official helper exists there and ran, but its HTTP GET returned
403, including an immediate fresh-transfer retry and a separate cover-only attempt.
A final bounded resolved-reference retry explicitly prepared the consumer-local Linux
destination /tmp/gw-coaching-journals-20261009/assets using exact returned file IDs,
filenames and Library IDs. All six expected versions were available; the unchanged
current official helper again returned HTTP 403 on the first PDF. Retries have stopped.
Cause is unknown; no evidence proves expiry or account authorization denial.
No raw download bypass occurred and no PDF bytes were imported.
The viewport screenshot was displayed in the conversation. A direct upload of its
remote path failed; a host-local SVG wrapper embedding the unchanged captured JPEG
was then created through native apply_patch. Library create succeeded as image/svg+xml,
65004 bytes: libfile_447f880a1ef08191a1d1d43cdf7bedba, version 0,
gw-coaching-bundle-viewport.svg. The required local metadata helper could not execute
because Windows exec-server still returned helper_unknown_error/setup refresh errors.
Library storage succeeded; host-local xattr persistence is unverified.

## Additional isolation investigation and handler contracts
The sandbox has no configured real E2E/test user credentials, browser storage states,
or BASE44_SERVICE_ROLE_KEY/BASE44_SERVICE_TOKEN/BASE44_API_KEY. Existing browser
admin tests use mock-admin-token, which cannot prove Base44 authentication or RLS.
Connected tools expose create/query/update entities but no record-delete action;
no service-role seed/delete context is available in the sandbox. No synthetic purchase
rows were created because deterministic cleanup could not be ensured.
Eight additional tests in tests/journals/contracts.test.mjs passed: deny-all schema,
source/candidate equality, adapter POST-only/authentication checks, server held flag,
price-confirmation guard, invalid bundles and safe error responses. The adapter is
bundled and executed with SDK/Stripe stubs; these are contracts, not live access tests.
Total: 49 static/policy/mock-contract checks passed, plus 12 held-page browser checks.

## Launch checklist (still blocked)
1. Resolve supported asset handoff; verify all six exact cover pixels, private PDFs and
   immutable hashes. Library correct-consumer HTTP 403 retries have stopped.
2. Obtain author decision for Healthy Boundaries and People-Pleasing exact current
   content and bounded production cleanup; retain both release holds and bundle hold
   until resolved. Parent reports no rewrite defects found across 47 reviewed pages;
   publication-review notes are author/editorial holds, not established legal rules.
   Choosing Yourself also carries author-review wording; do not silently approve it.
   Interiors are printable/annotatable PDFs, not interactive fillable forms.
3. Provide two real standard-user test sessions and a supported service-role seed/delete
   path for an isolated harmless sentinel row. Prove anonymous, owning-user and
   unrelated-user direct CRUD cannot access/change the populated index; verify backend
   recovery returns only the caller's Stripe-verified purchases, then delete the sentinel.
   Empty anonymous HTTP 200/list results are not populated-row isolation evidence.
4. Test private object and signing access with anonymous/unpaid/unrelated accounts.
   Keep URIs/signing server-only and full PDFs out of public entities/source/responses.
5. Source wiring is complete in the staged handler/entrypoints and purchase-return
   route. Before activation, create and verify the restricted JournalCheckoutAttempt
   candidate schema; confirm runtime service-role filter/upsert support, complete Stripe
   pagination and immutable edition registry. Deploy only in parent-coordinated test
   context and keep commerce/public/persistence activation flags held until proven.
6. Run actual Stripe TEST checkout/cancellation/retry/refund/dispute flows and authenticated
   purchased-file download. No real charges. Confirm amounts and identity/version binding.
7. Confirm author release, all security/payment tests and parent-coordinated activation
   before enabling sales. No page publication occurs in parallel with parent's editor work.
8. Coaching booking needs selected calendar, real availability/timezone/buffers, booking
   locking and cancellation/package terms before appointment payments become active.

## Publication
Coaching story/navigation source is saved. Only this approved honest page is public-route
eligible. Legacy intake/programme/resource routes remain held. A checkpoint is not a
production publish. No dedicated publish tool is exposed in the current tool set.
Do not use the paid builder to circumvent that limitation.
