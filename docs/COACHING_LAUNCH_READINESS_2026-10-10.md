# Coaching launch readiness — 9 am handoff
Verified 2026-10-10 21:24 UTC. Prepared for the next requested 9 am checkpoint; no future execution or delivery scheduled.

## Decisions and current draft
Latest delegated instruction preserves TWO separate offers:
- Paid initial consultation: A$99 / 45 minutes. This remains a paid two-way consultation; do not rename it free.
- Optional free clarity call: 15 minutes, separate from paid appointments and not counted in the paid-session offer. No configured booking route or confirmed availability found in the coaching source. Do not advertise a working booking button until a real approved destination and schedule are verified.
Paid introduction remains two paid sessions and complimentary third, A$198 total. Ten-session package remains A$850 for ten total appointments, not eleven.
Existing public draft src/pages/Coaching.jsx accurately describes paid consultation and booking being prepared. It does not currently describe the optional free clarity call.
Older src/pages/admin/coaching/CoachingSalesFunnel.jsx describes a 30-minute free discovery call. This is superseded by the latest delegated 15-minute optional clarity-call requirement; source is retained pending coordinated edit rather than silently treating it as current policy.
No newer owner decision on under-18 intake was supplied or found. DOB validation is not admission approval. Do not infer adult-only or guardian-consent handling.

## Reviewable copy proposal (not integrated/published)
"If you would like a brief conversation before deciding, an optional free 15-minute clarity call is being prepared. It is separate from the paid A$99, 45-minute initial consultation and does not count as a coaching session. Booking details and availability will be confirmed when this option opens."
Use only after Gannon confirms this matches the intended offer. No clinical treatment, diagnosis or outcome promise added.

## Completed work preserved
Golden Key bottom-left design checkpoint 6aca2e1d19b66bc58fa5cf31 / commit 1985dc380789221674363eabe42bd3cb5f1c5ad1 is retained; no layout redo.
Prior 15 staged checkout type errors were fixed; no repeat refactor, package upgrade or backend activation.
Review PDF Library libfile_0e9d419323c48191ac6bf05c2ad99621 version 7 remains the current visual review. No duplicate PDF/design created.

## New no-network evidence
Run: node scripts/test-coaching-launch-readiness.mjs
- Four closed/incomplete configurations return 503 before SDK construction (unset flags, missing policy approval, false policy approval, missing abuse secret).
- Independent stale-read replica fixture produces TWO saved leads for one submission ID. Characterizes a dependency on peer visibility/atomic uniqueness; does not claim the hosted database was tested or is necessarily eventually consistent.
- Changing x-forwarded-for in local fixture permits another attempt after burst cap. Separate handler/process fixture permits another five attempts. Ingress trust and shared replica limit remain required.
- Staged receipt read RLS is role:admin without owner allowlist. Source gap; current hosted receipt RLS not tested, schema not deployed by this task.
Harness blocks all network and mocks SDK, data and configuration. No real lead, booking, transaction, email or analytics event is created. Harness exit 0 means checks behaved as expected; it DOES NOT mean launch blockers passed.

## Exact dependencies for remaining tests
1. Owner must decide under-18 policy and its review/consent flow before enabling intake. Do not set COACHING_MINOR_INTAKE_POLICY_APPROVED to bypass this.
2. Approved isolated hosted test environment containing synthetic private lead/receipt fixtures, deployed staged endpoints/schemas, and access to existing authenticated OWNER and NON-OWNER test sessions plus anonymous requests and service role through supported runtime. No new credential, login or permission grant made here. Current no-production-record constraint prevents a real existing private-record test. Do not use a nonexistent record denial as evidence.
   Acceptance: anonymous and non-owner reads/updates denied on an ACTUAL known synthetic fixture; exact owner reads succeed; only validated submission handler performs expected service writes. Receipt policy scope must be reviewed and approved, not silently broadened or changed.
3. Database/platform-supported atomic uniqueness or transactional idempotency, plus approved isolated multi-worker race tests. Receipt schema currently has no declared unique submission ID. Test same-ID and different-ID contact quota concurrency across workers; recover interrupted reservation safely without duplicate leads.
4. Trusted ingress that strips/verifies forwarded headers and enforces shared rate/body limits. Test forged header, multiple workers and contact quota without live records.
5. Free clarity call: owner-approved existing scheduling destination, calendar/timezone/availability, cancellation handling and access verification. Current AppointmentScheduler expectations are not proof of a configured booking service. No account/provider connection/terms accepted.
6. Payment activation separately needs approved isolated Stripe TEST-mode configuration and signed-event/payment/receipt tests. Packaging mocks are not Stripe-origin receipts. No paid transaction permitted in this task.
7. Isolated production-build browser hold tests after any integration; existing browser binaries/system dependencies are absent from this cold sandbox. Earlier 12 visual checks and build remain evidence for unchanged design, not fresh acceptance of a newly integrated booking/backend.

## Smallest remaining launch sequence and conditional forecast
A. Parent/Gannon resolves under-18 treatment and confirms free-call scheduling destination, availability and separation from paid consultation. Agree whether launch is informational-only or actually accepting leads/bookings.
B. In authorized isolated hosted test environment, close receipt owner-access gap with reviewed policy; implement proven atomic idempotency and shared trusted-ingress abuse controls; run role/fixture and multi-worker acceptance tests.
C. Connect approved free 15-minute booking and paid 45-minute paths separately; verify no free call generates a payment/paid-session count. Keep journal purchases independent. Run isolated production-build and test-mode capture checks.
D. Parent approves deployment and explicit gate activation only after evidence above. This worker does not publish.
By next 9 am: reviewable visual page and this evidence can be handed off now. An informational-only release can be considered by the parent while intake/checkout remain closed and free booking is clearly unavailable. A functioning intake/free-call/paid-checkout launch has NO defensible fixed completion time until A/B dependencies are supplied and acceptance passes. No automatic activation at 9 am.
