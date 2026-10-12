# Read-only production reconciliation, 12 October 2026

## Release decision: NOT READY FOR PUBLICATION

The nine-file patch is a tested increment against an unpublished draft baseline, not a complete patch against verified production. Do not ask Gannon to approve its deployment yet. No production source, provider configuration, permission, payment or paid asset was changed.

Proposed user-visible changes remain:
- Gannon Waye Group beneath the music hero with clear coaching/journal-preview/music choices.
- A$99, 45-minute initial coaching consultation and an accurately labelled availability enquiry.
- Existing A$198 introductory three appointments and A$850 ten total.
- Contact discovery and consistent temporarily paused email-signup copy.
- Existing artist identity, approved story and journal-cover presentation preserved.

## What is known about production

Current public bundle /assets/index-DWA51fl4.js: 6,094,577 bytes; SHA-256 2e8d92939e2821370453a19431fd2b7f0bd0204442e398a6d0a31fef24b3872d. No source-map comment; .map request failed. Group/paid-offer/journal-return route/new book hold text and music-activity route are absent. Previous actual browser checks show live coaching redirecting Contact, while existing store reaches customer details. This is not proof of checkout completion.

Public app settings endpoint returns the canonical app ID and public_settings, without a deployed commit. Base44 app metadata lists names/IDs/storage source, not deployment revisions. GitHub main combined status has no deployment context. PR41 remains draft, head a31478d, base ef7b2a78, not merged; it is a livestream change, not a production provenance record.

Three historical source trees rebuilt successfully in temporary directories with their matching locked dependencies; no working source modified:
- 61b2d851: index-CIs6EozI.js, 6,105,011 bytes, hash 487743cd40d60d540dacf9ef666b7b4379f101c448777813fbe21ab16131bbd9.
- ec0e4993: index-CVboTo3N.js, 6,041,297 bytes, hash d0830366b093b85035ff70c37c6c15a38212acd552d44836be0f90088d02ef07.
- 92da94f8: index-CVhOqbyk.js, 6,042,358 bytes, hash 24b1a0b4d7ce59ab43b367e7c37a64b1d8030e0bb809fedc09a7ede755e44640.

None byte-matches under the reproduced build conditions. This does not prove none was production's source: original build settings may differ. No candidate is asserted as deployed. SDK locks differ between historical/draft source, another reason not to infer provenance from today's successful build.

## Exact separation blockers

git apply --check rejects the nine-file patch in all three trees, exit1, at src/pages/Home.jsx, src/pages/Coaching.jsx and src/pages/ContactGannon.jsx.

The patch omits the prerequisite src/App.jsx route restoration from 3d04d54a, 9 October: replace the old COACHING_PUBLIC_LAUNCH_ENABLED conditional that redirected /coaching/* to Contact with the approved public story /coaching route, a workbook-preview redirect, and continued fallback holds for legacy programmes/intake/resources. Live behaviour still matches the earlier redirect.

Current Coaching rendering also depends on the new OriginalJournalFan JSX/CSS, JournalShelf, CoachingGiftSet, held JournalPurchasePanel, publicJournalCatalogue, journalBasket and revised CoachingIntakeForm/coachingInterestPolicy. The production-built interest form hold must accompany that page rather than expose the old intake flow.

Dependency analysis against historical candidate61b2 identified37 changed reachable modules, including unrelated unpublished homepage preview/hero and analytics changes. It is an inventory, not a proposed37-file release. Copying entire current Home/Coaching files would silently carry those dependencies. A narrow release must surgically port the intended change onto a verified deployed base, preserve its existing hero, and include only required safe coaching/story/cover dependencies.

Required next engineering evidence: published Base44 version-to-source mapping (or a verified production source export with original build settings), then a rebased dependency-complete patch and production-built route/hold checks. There is no exposed authenticated deployment-history read tool and interactive desktop access is unavailable. No credential/new project/user payment question is needed to describe this blocker. General homepage publication permission should be requested only for the resulting complete, reviewable change.

## Approved original private recovery completed

Knowing Your Worth original Library item, version4, recovered with the current supported Library helper. Python on Windows lacked os.setxattr; unchanged helper ran through a verified native NTFS extended-attribute compatibility wrapper. Native metadata round-trip and final identity/version readback passed. No helper metadata was skipped.

Local file: approved-original-knowing/Knowing Your Worth.pdf
Exact Library/file identity and full integrity data: approved-original-knowing/identity-and-integrity.json
Bytes3,242,483; PDF magic verified; pypdf page count34; SHA-256 starts45611420d4fa22f9.
The file itself and full identity/integrity manifest remain local. No public/paid upload or document edit. Signed transfer JSON removed after successful recovery.

This is the approved original general coaching/personal-reflection edition, white writing areas. Later current Knowing review is a separate item/version5 and is not substituted or described as approved.

## Existing configuration dependencies narrowed read-only

Known active checkout source references STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY. Only literal environment reference names were inspected; no environment value or credential read. Therefore staging's Stripe binding name is no longer an unknown/new-key request. Actual function runtime mode/access and existing test-mode availability still need safe provider verification; the current connected account remains live-only.

Existing JournalPurchase/JournalCheckoutAttempt schema metadata already confirms all client CRUD denied. No new public entity/permission is required. Five staged adapters remain default closed and passed native Deno/security fixtures.

Remaining paid-delivery dependencies are the approved original's private upload URI plus verified hash/immutable catalogue binding, actual signed-storage-host verification using an authorized private test asset, and isolated authenticated provider/index/storage deployment tests. A Library local path is not a Base44 private URI. No authorized existing private copy of this edition was established, so no URL or server catalogue location was invented.

No browser screenshot uploaded to Library, no deployment/new payment/OAuth/security change, and no broadcast occurred.
