# PR #41 CI comparison and release readiness

Reviewed 6 October 2026, Melbourne time. Original PR head: `208bb1eeb7be0c6b031d1822191cc35f11c1e769`. Current main: `ef7b2a78bbde56fff5bea4a99852d5302bf35fc6`. The PR was open and draft, with no review comments, at inspection. Only five files differed originally.

## Recommendation

The original CI failures are pre-existing, but the original hub is not ready to ship unchanged. The fixes in this branch address the duplicate test title, unresolved scanner action, stale store selectors, checkout obstruction, and four independently reviewed hub defects. The candidate hub needs its own passing runtime checks. A green build is not approval to deploy the whole frontend.

**Release blocker:** `src/config/storeStatus.js` sets `STORE_CRASHED=true` in both main and the original PR. This replaces `/store`, `/store/cart`, `/store/cart-details` and `/store/checkout` with the crash page. Production tests on October 4 and 5 instead found a working product grid. Deploying current source would close the store. The history contains deliberate false/true toggles on October 4 (`6ab6d537`, then `7451b38f`) but no rationale. Resolve the intended store state before a whole-site deployment. Do not silently flip this flag or deploy around a failed gate.

The live SiteSettings read returned enabled=false, status=offline, and no player, chat, title or schedule. Saved profile destinations are TikTok `https://www.tiktok.com/@gann0nwaye` and Facebook `https://www.facebook.com/gann0nwaye`. Publishing the hub does not start a stream. Platform eligibility and an actual public player remain separate requirements.

## Every failed job compared

| Check | Current main, October 4 | Original PR, October 5 | Attribution |
| --- | --- | --- | --- |
| Build & Playwright Tests | Build passed; collection stopped on duplicate `/admin/dashboard` title | Same | Pre-existing test definition |
| Security & Coaching Lock Tests | Same duplicate title; no security assertions ran | Same | Pre-existing test definition |
| Secret Scanning & Credentials Check | `trufflesecurity/trufflehog-actions` repository cannot resolve | Same | Pre-existing workflow error; not evidence of a discovered secret |
| Store & Cart Tests | 12 failed, 48 passed | Same 12 failed, 48 passed | Pre-existing production UI/test drift, not candidate execution |
| CodeQL Security Scan | Passed | Passed | No failed CodeQL check |

Sources: [main all checks](https://github.com/ganozwaye-stack/gannon-waye-music/actions/runs/37171881079), [main store checks](https://github.com/ganozwaye-stack/gannon-waye-music/actions/runs/37171881021), [PR all checks](https://github.com/ganozwaye-stack/gannon-waye-music/actions/runs/37283668553), [PR store checks](https://github.com/ganozwaye-stack/gannon-waye-music/actions/runs/37283668558).

## All 12 store failures

Each row below fails on desktop Chromium, mobile Chrome and tablet Chrome, giving four tests times three projects. The failed titles and reasons match on main and PR.

| Spec and original line | Exact failing condition | Minimal correction |
| --- | --- | --- |
| `store-load.spec.js:8` | Missing `locked-storefront-stage` | Check the existing `locked-storefront-world-image` instead. Do not restore the removed stage. |
| `store-load.spec.js:21` | `product-card` count 3 succeeds, then `world-product-card` expects 3 but gets 0 | Assert the existing product cards carry product IDs; retain the three-product requirement. This is not an empty catalogue. |
| `store-load.spec.js:36` | Waits for accessible name `M (4)` | Use `^Select size M(?:, \d+ in stock)?$`, matching the actual aria-label and avoiding a fixed inventory count. Keep size-required and add-success assertions. |
| `cart.spec.js:102` | Checkout click intercepted by toast, then fixed desktop marquee; fixed mobile navigation also shares the bottom area | Position checkout above the bottom navigation/ticker and raise it above their z-40 layer. Keep the real click and URL assertion; never use forced clicks to mask the problem. |

The stage and extra world sections were intentionally removed in commit `258c699d91bbb0e24115eb8f703961e6f048c0fc`, which records the owner's requested hero followed by product grid. No change to artwork, its URL, checksum, product records, prices or stock is needed.

## Exact CI fixes

`security.spec.js`: remove the second `/admin/dashboard` element from `ADMIN_ROUTES`; retain one assertion for each actual route. Collection now completes locally.

`.github/workflows/all-tests.yml`: replace the nonexistent action with the official TruffleHog repository, pinned to verified tag v3.96.0 commit `6f3c981e7b77f235fd2702dd74af25fc4b72bf11`, set scanner `version: '3.96.0'`, retain `fetch-depth: 0` and `--only-verified`. The [pinned action](https://github.com/trufflesecurity/trufflehog/blob/6f3c981e7b77f235fd2702dd74af25fc4b72bf11/action.yml) resolves its scan range for push and PR events itself. Do not set identical base/head refs or disable the job.

Production Store & Cart and Security workflows explicitly use `LIVE=1` and `BASE_URL=https://gannonwaye.com`. Their step labels now disclose this. They remain production checks. A separate Candidate Live Hub Tests job targets localhost and tests candidate source on three viewports. It does not replace or disable the existing full suite. The build job also receives the canonical public app ID and base URL; otherwise Vite warns its API calls will fail.

## Genuine original PR defects fixed

1. Disabled broadcast metadata appeared publicly despite the admin toggle saying Hidden. The UI now gates title, provider, schedule and dedicated stream destination; the generic offline hub and profile links remain available. This is a UI publication gate, not a change to the existing SiteSettings data permissions.
2. Waiting viewers never refreshed: global focus refetch was disabled and the public query had no interval. The hub now refreshes every 15 seconds and on focus, and admin save invalidates its query.
3. PublicLayout already supplied `main`; Live added another. Live now uses a section and the regression asserts one main plus a rendered hub heading.
4. Host-only iframe validation accepted Facebook Live Producer and credential-bearing URLs. Admin and public page now share player-path validation, reject credentials and non-HTTPS URLs, and constrain labelled platform destinations. Dashboard rejection and accepted URL forms have executable tests.

The admin form also now loads defaults when settings are absent, exposes read/save errors, and the public hub exposes an unavailable state rather than asserting offline on fetch failure.

## Validation and remaining limits

Local checks: URL tests passed 3/3; changed hub files passed ESLint; the 294 original Chromium test definitions collected after duplicate removal; the added candidate suite collects 18 cases across three projects. Canonical no-deploy acceptance and build were run with the explicit public app configuration. Browser execution locally was blocked because the downloaded Chromium archive was invalid; no local browser pass is claimed. GitHub CI is the runtime gate.

The full local suite will expose further baseline issues after collection is repaired, including store tests against the explicit crash state and stale assertions elsewhere (for example, the older public route test expects two products). These must not be described as new livestream regressions or fixed by weakening gates. Production checkout positioning cannot reflect this branch until a safe release is made.

Deployment remains blocked on the intended store state, successful relevant runtime validation, and an authenticated deployment session. The Base44 CLI in this execution environment requested login. No account credentials were entered, no broadcast was started, and no merge or deployment occurred during this review.
