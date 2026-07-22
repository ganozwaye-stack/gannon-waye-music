# Launch Next Approvals

Updated: 18 July 2026

Deploy target: `gannonwaye.com`

Launch target: 20 July 2026

## Done

- `gannonwaye.com` was deployed through Base44 and smoke-checked after the launch site updates.
- Store launch scope is accepted as Base44/current state, with final checkout/payment test still pending.
- Current code now includes the public Base44 app-id fallback needed to prevent `/api/apps/null/...` requests in the next deployed build.
- Mum tribute image handling has been hardened with recovered local images and graceful gold fallback cards for unavailable old Base44 media.
- Checkout persistence has been fixed locally: cart/details are no longer cleared before Stripe redirect, cancel preserves them, and success clears them after a `session_id` return.
- Local no-payment browser test passed from product page to cart details to checkout review, then cancel/success cart persistence checks.
- GanozMix has been moved into safe review mode locally.
- GanozMix source data has been exported into sanitized JSON and CSV cleanup snapshots.
- GanozMix Drive folder now contains:
  - beginning audit
  - overnight start handoff
  - sanitized source JSON
  - sanitized cleanup CSV
  - Magnetic Cable Organiser first product review pack
- First GanozMix product proof pack is prepared for Magnetic Cable Organiser (Bamboo).

## Needs Gannon Review

- Review the site visually on phone and desktop before the public push.
- Approve the final cover/face correction direction before Adobe/Photoshop work continues.
- Confirm whether the new Apple motion artwork should use the v4 emergency files or wait for proper vertical outpaint.
- Review the Magnetic Cable Organiser pack and decide:
  - reject
  - keep researching
  - build private listing draft
  - bundle into a desktop reset kit
- Approve any live checkout/payment test.
- Approve any eBay OAuth reconnect.
- Approve any live GanozMix entity push/import.
- Approve any deletion/offload of large local files.

## Blocked Until External Login Or Approval

- Base44 live deployment is blocked until this local clone is linked to the correct Base44 project. `npx base44 site deploy -y` failed because no `base44/.app.jsonc` is configured, and linking to historical app id `69eb7905ca6eb4180010f794` was not available to the logged-in account.
- Adobe re-auth and cover-face correction.
- eBay OAuth reconnect for GanozMix.
- Live Stripe/checkout proof test.
- Any real supplier order or paid marketplace action.
- Deleting or moving large local files that may be user-important.
- Final DNS/domain adjustments if Base44 prompts for domain ownership or records.

## Safe Work I Can Continue

- Keep cleaning GanozMix product candidates from the sanitized snapshot.
- Build review packs for the next 3-5 product opportunities.
- Improve `/admin/ganozmix` as a review dashboard without publishing controls.
- Prepare a Google Drive filing map and duplicate/offload recommendation list.
- Keep documenting exactly what is in OneDrive, Google Drive, repo, and Base44.
- Improve public website copy, spacing, gold styling, and route smoke checks.
- Prepare launch communications drafts that remain unpublished until approved.

## Do Not Do Without Approval

- Do not delete files.
- Do not reconnect eBay.
- Do not publish listings.
- Do not send customer, fan, or press messages.
- Do not change live Stripe/checkout settings beyond a controlled approved test.
- Do not place supplier orders.
- Do not push GanozMix entities to live Base44 until the review model is accepted.

## Recommended Morning Sequence

1. Review the live website visually.
2. Approve or reject the Adobe/cover face direction.
3. Approve the final checkout/payment test.
4. Review the Magnetic Cable Organiser pack.
5. Decide whether GanozMix stays in product research mode or gets a private listing-draft build.
6. Approve a storage cleanup batch, starting with obvious archives only after confirming contents.
