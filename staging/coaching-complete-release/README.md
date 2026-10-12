# Complete coaching frontend patch

Known baseline: 61b2d851273c88712b3c91ef6bdbd4f38a7284e9
This is a tested review patch on that exact historical commit. It is NOT a verified production baseline. Do not publish it against an unknown deployed revision.

## Result

Gannon Waye Group appears below the baseline's original music hero. The public /coaching story now renders the seven approved paragraphs, original six-cover fan, Golden Key mark, held journal previews and A$99/45-minute availability enquiry. Contact provides the specific enquiry composer; homepage/footer accurately describe paused email signup. Existing A$198 three appointments and A$850 ten total are retained.

Only the exact public story and workbook-preview routes are opened. Legacy programmes, intake/resources and old coaching aliases still redirect to Contact. The private registration form remains hard-closed in every build; direct requestSubmit cannot send. Journal price selection is local preview only with Purchase disabled and no ownership/checkout/download endpoint calls. No paid interiors, purchase return page or unproved backend integration is included.

## Scope and validation

19 source files, seven existing public PNG assets, four targeted specs and three review/verification support files. Full list and asset hashes are in coaching-release-manifest.json. Every other tracked baseline path is unchanged. Hero components, store, API/auth implementation, analytics, platform flags, backend, dependencies, index.html and workflows are byte-preserved.

Production build and required prebuild gates passed. 27 distinct browser cases passed on desktop Chromium, phone and tablet, using the isolated production build: nine paid-offer/contact/held-book cases, three homepage cases, three forced-submit registration hold cases and twelve route/admin/signup/preview security cases. First run passed24 and three route cases had an ambiguous page/footer heading locator; the locator was scoped to level1 and those three passed on rerun. No application change was needed for that correction. Logs are packaged; no browser screenshots uploaded or included.

The scope/asset/hold/mailto-injection boundary checker passed. No live provider, account, order, payment, email, registration or broadcast was exercised. Safari and the full inherited baseline suite were not run; the inherited security spec has a pre-existing duplicate test title, left unchanged outside this focused patch.

## Reproduce

1. Use an isolated checkout of baseline61b2d851273c88712b3c91ef6bdbd4f38a7284e9.
2. Run git apply --check complete-coaching-release.patch, then git apply --index complete-coaching-release.patch.
3. Run npm ci --ignore-scripts --no-audit --no-fund and node scripts/verify-coaching-complete-boundary.mjs.
4. Run npm run build and serve the built output locally. Install the existing locked Playwright browser if needed.
5. Point BASE_URL to that local preview, set LIVE=1 and PRODUCTION_HOLD=1, and run the four manifest specs on chromium, mobile-chrome and tablet-chrome.

LIVE=1 here skips starting Vite and points tests to the explicitly supplied local BASE_URL; it never means a public broadcast or live payment. Keep preview API mutations blocked as in the specs.

## Hard release blocker

Existing public bundle index-DWA51fl4.js cannot be mapped to a source commit via the exposed metadata. Three historical rebuilds did not byte-match under reproduced settings. Obtain the actual published source/version-to-commit mapping plus its public build settings, then rebase this complete narrow patch and run the same checks before requesting publication approval. Do not substitute all current draft files or publish mixed HEAD.

The approved original Knowing Your Worth version4/34pages and its hash remain local and unchanged. This patch neither uploads nor activates it. The current held catalogue is preview copy, not proof that the later review manuscripts are approved for sale.
