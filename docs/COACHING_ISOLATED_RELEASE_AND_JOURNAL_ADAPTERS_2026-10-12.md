# Isolated review and staged book adapters, 12 October 2026

## Nine-file frontend review

Review artifact: GW-Coaching-Isolated-Review-2026-10-12.zip, SHA-256 92dbe2b3b8858605bb26eb7073d2b82fdc06e17954d99ec1fea9b051ece5c529. Six desktop/phone screenshots and exact nine-file patch/source/manifest/readme included. Local extracted gallery review.html added for convenient viewing.

Base draft d2fd2f771bd5244759dcc7676df4933ac94c49f0, selected source f53d9724ec3026f7d06ee80b8189452b1674ab5b. 77 insertions/6 deletions; no package change. Isolated build from clean base archive plus only listed files passed production/prebuild checks. Isolated built desktop and phone homepage→offer→contact enquiry passed with zero page errors/no horizontal overflow, all non-read calls blocked. Screenshots visually inspected. Existing music hero, journal/newsprint story preserved.

Important: source baseline is verified draft, NOT identified deployed revision. Live coaching still redirects Contact. Exact current published Git/deployment mapping unavailable in exposed Base44 tools. Do not claim publishing mixed HEAD releases only nine files. Recover deployed base and apply the narrow patch first. Additional permission is narrowly publishing this concrete homepage/coaching-enquiry/signup change after that reconciliation, not a blanket project/setup question. No credential/payment approval needed to review it.

## Protected delivery, code now completed independently

Five independently bundled, default-closed Deno adapters under staging/journal-commerce/functions: createJournalCheckout, getJournalPurchases, confirmJournalPurchase, cancelJournalCheckout, downloadJournal. They match existing held UI request names and snake-case request fields. Active base44/functions untouched. Existing JournalPurchase/JournalCheckoutAttempt live schema metadata was read and confirms all client CRUD false; no new entity grant required.

Node fixture suite scripts/test-staged-journal-adapters.mjs passed. Covers each real entrypoint's closed glue before SDK/env/provider access, isolated local import packaging, identical helper copies, authenticated exact-edition synthetic PDF bytes/no-store headers, foreign user/refund/amount/mode/unowned book, malformed/oversize request, absent/untrusted storage host, bounded stream, generic provider failures, server-owned identity/price, same pending-checkout reuse, paid checkout cannot be cancelled, confirmation/purchase index, incomplete provider list and unavailable index fail closed. No actual payment identifiers, paid book interiors or network requests.

Native Deno check passed for all five entries using cached pinned SDK/Stripe packages, no new install/upgrade:
deno check --no-config --no-lock --node-modules-dir=none --cached-only staging/journal-commerce/functions/*/entry.ts
node scripts/test-staged-journal-adapters.mjs

Staged policy permits one released exact edition with five held entries lacking private files. Bundle remains held. Original approved Knowing Your Worth is 34 pages/general coaching and personal reflection/white writing areas; not the later candidate's ACT framing. No original substitution, upload, activation or book publication performed.

Precise remaining dependencies:
- Parent's recovered approved original PDF/private upload URI/SHA-256 and release-provenance record; immutable server-only catalogue snapshot.
- Map the existing authorized runtime Stripe binding and correct mode; existing test-mode provider connection for real end-to-end verification, no new key/merchant/live owner charge.
- Actual Base44 synthetic/private file read probe to verify returned signed URL host, explicitly configure allowlist. No broad permissions or exposed signed link needed.
- Service-role index read/write/provider pagination smoke tests in isolated test environment.
- Review/deploy only five CLOSED adapters, real authenticated provider/storage tests, then enable the approved edition/frontend flags consistently under parent's existing narrow eligible-book publication authority.

No new OAuth, Drive write scope or secret extraction is required for this staging work. Storage uses the documented Core.CreateFileSignedUrl server-side after entitlement checks, returns PDF bytes. Stripe list/expire API sources:
https://docs.stripe.com/api/checkout/sessions/list
https://docs.stripe.com/api/checkout/sessions/expire

TikTok native setup remains blocked by verified Desktop Commander offline. No unsafe configuration bypass or recording/broadcast attempted.
