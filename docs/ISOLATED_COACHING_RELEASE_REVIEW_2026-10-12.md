# Isolated coaching/homepage review

Prepared 12 October 2026. Review only, not a public deployment.

Patch: gw-coaching-isolated-release.patch
Base source: d2fd2f771bd5244759dcc7676df4933ac94c49f0
Selected draft source: f53d9724ec3026f7d06ee80b8189452b1674ab5b
Exactly 9 frontend files, 77 additions, 6 removals. files.json records the paths.

Contains Group homepage feature, A$99/45-minute availability enquiry and accurate paused signup copy. Preserves artist/music hero and previous newspaper/journal content. Excludes QAFailureReport, Stripe/webhook code, protected book delivery, social queue, tracker removal, all backend/schema/dependency changes.

Built from a clean archive of the base source plus ONLY those nine files. Required prebuild guards and production build passed. Desktop and phone used that built isolated output: homepage → paid offer → specific contact enquiry, zero page errors, no horizontal overflow. All non-read API requests blocked, no message/payment/booking sent. Six screenshots in this folder show exactly that isolated built output. Source files are included separately from the patch.

IMPORTANT: base source is a verified draft baseline, not an independently established current deployed Git revision. The live site still redirects coaching to Contact and uses an older bundle. Applying this patch to the current entire mixed app and clicking Publish would also release unrelated draft work. The exact production-base commit/deployment mapping must be recovered, then these nine file changes cherry-picked/applied and checked before a narrow release is described as ready.

Additional approval required: permission to publish this concrete homepage/coaching-enquiry/signup change after its production base is reconciled. It introduces enquiry only, not direct paid booking. No extra approval needed for this reversible review, screenshots, patch or isolated checks. Paid booking terms/availability are not prerequisites for publishing an accurately labelled availability enquiry; they are prerequisites for direct confirmed bookings/payment.

Protected delivery is a separate staged package at staging/journal-commerce with its own closed adapters and tests. It is not included here.

## Subsequent read-only reconciliation: NO GO as a production release
The nine-file increment fails to apply to three reconstructed historical candidates and excludes the prerequisite 9 October public story route restoration and new coaching render dependencies. No reconstructed bundle byte-matches production under reproduced settings. Do not seek publication approval for this incomplete patch. Exact evidence and closed private-file dependencies: docs/PRODUCTION_BASE_RECONCILIATION_2026-10-12.md.
