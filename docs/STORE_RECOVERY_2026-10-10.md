# Store recovery and merchandise handoff — 10 October 2026

## Live result and scope
Canonical URL tested twice in a fresh isolated Codex Playwright browser: https://gannonwaye.com/store .
HTTP 200, three product cards, no page errors and no server 5xx responses. Anonymous MerchProduct request returns 200. The public page serves /assets/index-DWA51fl4.js, an older published bundle, with NO new store-checkout-notice. No deployment was run by this worker.
https://www.gannonwaye.com/store redirects to canonical URL with HTTP 200. https://gannonwaye.base44.app/store also returns HTML HTTP 200 (rendered app-domain state not independently browser-tested).
The reported HTTP500 was NOT reproduced on the fresh canonical live browser. Exact failing user tab URL/build/cache remains needed if it persists. Do not say this worker repaired a live server outage. Wavefront's separate503 was not tested or changed.

## Confirmed source defect
Source src/config/storeStatus.js had STORE_CRASHED=true. Store and transaction routes rendered StoreCrashed.jsx with fabricated HTTP500 heading, stack trace and static request ID 8f2a91c-000443-9271, and unsupported notification/order-safety claims.
History: emergency screen added ec0e4993 (25 Sep); switch briefly false at 6ab6d537 then true at 7451b38f (4 Oct). No source/handoff rationale proving an actual worker failure found.
This is a deliberate application emergency state, not evidence of an HTTP error or backend exception. Local Vite log had no related server exception.
Source and public bundle differ. This defect explains a possible preview/older-build screen; it is not a proven cause of the currently reported user tab failure.

## Small reversible draft repair
- src/config/storeStatus.js: restore catalogue rendering with STORE_CRASHED=false; separate STORE_CHECKOUT_HELD=true.
- src/App.jsx: preserve hold on /store/cart, /store/cart-details, /store/checkout whenever either hold flag is true.
- src/components/store/StoreCrashed.jsx: honest checkout hold and browse link; remove fabricated diagnostics and unsupported claims.
- src/pages/Store.jsx: clearly show checkout-held notice.
Product queries still require is_active:true, publication_status:live, is_stage_one_sale:true. Locked boutique artwork unchanged. No catalogue record, stock, retail price, supplier, rights, backend or permissions changed.
This is catalogue/diagnostic recovery, not activation of payments. Do NOT publish it as proof that sales checkout is ready.

## Verification
Storefront art lock and stage-one stock/shipping guards passed. Build exit0 and prebuild guards passed.
New tests: src/gannonwaye-playwright-pack/tests/store-recovery.spec.js.
Tests verify original boutique visible, three fixture sale cards, unchanged hoodie price, verified size selection and local add-to-cart; draft concept items absent from sale cards; all transaction routes held with zero createCheckoutSession calls.
Initial failure was an overbroad whole-body assertion: draft Set Free names legitimately appear in EXPRESSIONS OF INTEREST voting section. Corrected scope to purchasable product cards, retaining interest section. Final targeted viewport result recorded in HANDOFF.
Local tests use SDK fixtures; live catalogue browser verification separately used actual read-only records. All non-GET/HEAD/OPTIONS requests were aborted in live inspection. No transaction, booking, email or interest vote submitted. Live checkout visited with empty cart only; paid checkout success not tested.

## Actual live stage-one records (read-only; not a new physical count)
69f11d1fc43e13c61fe6b9d7 Respect Is Earned Hoodie: A$98, record stock14, S3/M4/L5/XL2.
69fbd261b760426cede1b7a3 Journal/Pen/Thermos Gift Box: A$59, record stock19.
6a9a945016c72a1e3c04935f Winter Writing & Comfort Bundle: A$119, record stock14.
All three are live/active/stage-one/owned_stock in current read. Do not add quantities across component bundles or infer new manufacturing inventory.

## Handoff to existing supplier/catalogue owner via parent
Do NOT create duplicate stock or publish/reprice these existing four draft records:
- 6ab62aa3d8fd19583d278750 Set Free Heart Hoodie: inactive/draft/POD/stock0, unverified cost. Existing note proposes DropSHIRT AS5102; supplier_url still historical Printify, no accepted artwork-specific quote. Neck-label service excludes fleece; no metallic hardware/foil/embroidery claim.
- 6ab62ab78fc714aee116819f Set Free Heart Tee: inactive/draft/POD/stock0, unverified cost. DropSHIRT AS5001 proposal, artwork6, duplicate8, neck-label2 needs legible proof. No accepted landed quote.
- 6ab62add8181fe5a5301db52 Set Free Heart Mug: inactive/draft/POD/stock0, unverified cost. OGO proposed, artwork18 selected in existing note; GST/landed price/Base44 fulfilment route still unresolved.
- 6ab629bf351fac6f864ddd7f Without You Here Hoodie: inactive/draft/POD/stock0, unverified cost, no supplier selected. Existing 7 Oct visual-approval note points to lyric/signature/.com image (not ornate-heart); DTF opacity/SKU/placement/cuff/landed cost/shipping/returns unresolved. Visual approval does not establish production/publication approval.
Current source SetFreeStoreBanner and MerchDropCountdown announce merch has dropped despite no Set Free live sale records. Flag for catalogue owner to reconcile approved copy versus actual readiness; owner-directed banner/art not silently replaced in this repair.
Parent must relay these exact records to the existing catalogue/supplier worker; no direct supplier message or order made here.

## Precise approval and forecast
Catalogue source repair is reviewable and reversible in the named checkpoint. Publishing ANY checkpoint needs fresh parent/Gannon approval; none granted here.
Activating actual payments is separate: review the emergency-hold reason, verify existing-stock inventory/fulfilment and current deployed checkout/shipping/capture/receipt path in an approved test environment, then approve transactional hold removal and deployment. No real payment permitted by current task.
Fresh live Store currently loads, so there is no proven ongoing canonical server500 to estimate. If user still sees500, obtain exact URL and current screen/build and recheck that route; do not blame Wavefront or promise a platform recovery time.
Draft catalogue repair can be reviewed now; sale readiness cannot be promised until the checkout evidence and explicit activation/publication approvals exist.
