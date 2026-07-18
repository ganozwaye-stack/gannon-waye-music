# Launch Readiness Status

Updated: 18 July 2026

Deploy target: `gannonwaye.com`

## Verdict

Code state: ready for deploy.

Public launch state: not a full "good to go" until the correct Base44 project is linked/deployed and a live checkout proof is approved.

## Completed Today

- Added a tracked public Base44 app-id fallback so future builds do not ship with `appId = null`.
- Fixed mum tribute image stability:
  - copied four recovered local mum-gallery images into `public/images/mum-gallery`
  - replaced those remote URLs with local paths
  - added graceful gold "Memory Held" fallbacks for unavailable tribute photos
  - removed the known stale `c6dfcbbd2_CopyofIMG_5500.png` request from the 3D memory wall
- Fixed checkout persistence:
  - checkout no longer clears cart/details before redirecting to Stripe
  - cancel page now truthfully preserves cart/details
  - success page clears cart/details only after a Stripe `session_id` return
- Verified:
  - `npm run build` passes
  - `npm run lint` passes
  - local preview media check for `/mum` and `/without-you-here` has no bad media requests
  - no-payment cart flow passes from product page to checkout review

## Browser Test Evidence

Local preview tested on `http://127.0.0.1:4173`.

- Add Journal Bundle to cart: pass
- Cart details form: pass
- Checkout review page: pass, total shown as `$71.95 AUD`
- Cancel page keeps cart/details: pass
- Success page with `session_id` clears cart/details: pass
- `/mum` and `/without-you-here` media requests: no bad media requests after the fix

No live Stripe checkout session was created.

## Current Live-Site Finding

The currently deployed live bundle at `https://gannonwaye.com` is still making Base44 calls to:

`/api/apps/null/...`

That means the live build was produced without a Base44 app id. The code fix is ready, but the live site needs a new deploy before this is corrected publicly.

## Deploy Blocker

`npx base44 whoami` is authenticated as `ganozwaye@gmail.com`.

Attempting to link the local clone to the historic app id failed:

`App with ID "69eb7905ca6eb4180010f794" not found or not available for linking.`

So I did not deploy. I also did not push entities, functions, agents, connectors, auth, GanozMix schemas, or any data.

## Still Needs Gannon Or Correct Account Access

- Confirm the correct Base44 project/app id that owns `gannonwaye.com`, or log into the Base44 account that can link/deploy it.
- Approve a live checkout proof test after deploy.
- Approve any file deletion, app uninstall, OneDrive offline download, eBay reconnect, GanozMix publish/import, or supplier/marketplace spend.

## Safe Next Actions

- Commit and push this branch.
- Link this clone to the correct Base44 app once confirmed.
- Deploy site only with `npx base44 site deploy -y`.
- Retest `https://gannonwaye.com` for:
  - no `/api/apps/null` requests
  - store add-to-cart
  - checkout review
  - cancel/success cart behavior
  - mum tribute images

## Cleanup Status

Duplicate deletion is not approved yet. The candidate files still need OneDrive to make them available offline and then pass hash verification.

Google Drive canonical save path remains:

`My Drive > Gannon Waye - Master Files > 00_Inbox - To Sort`

Local staging path remains:

`C:\Users\ganno\Documents\Gannon Waye - To Upload To Google Drive`

GanozMix remains review-only. No eBay reconnect, no publishing, no supplier order, and no Gannon Waye Music store/payment crossover.
