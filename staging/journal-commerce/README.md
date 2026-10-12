# Staged protected journal adapters

This directory is a review package. Nothing has been copied into base44/functions, deployed, invoked against providers, enabled or charged.

Five independently bundled Deno entrypoints match the held frontend contract: createJournalCheckout, getJournalPurchases, confirmJournalPurchase, cancelJournalCheckout, downloadJournal. Each contains its own local helper modules so the Base44 function packager needs no parent-directory shared imports. Identical helper copies are checked by the test script.

releaseConfig.js defaults enabled=false before SDK/auth/Stripe/index/file access. Backend-only JournalPurchase and JournalCheckoutAttempt schema metadata has been verified present with all client create/read/update/delete denied. Supplied staged schema copies do not require creating new public entities.

## What is implemented and tested

Authenticated Base44 request identity; bounded JSON request; canonical origin; server-only exact-edition catalogue snapshots; server-owned amount/offer; existing ownership and unpaid-checkout recovery; buyer-wide Stripe idempotency; complete bounded Checkout Sessions pagination; safe unpaid cancellation; fresh provider verification of identity/mode/amount/refund/dispute before download. Service-role indexes are references only, never entitlement.

Private adapter calls SDK Core.CreateFileSignedUrl only after payment checks, uses a 60-second internal URL, explicitly configured HTTPS storage host and no redirects, fetches at most 25MB with a timeout, verifies PDF magic/hash and returns bytes with attachment/no-store/nosniff headers. No signed URL, file URI, customer data or provider errors leak into the HTTP response.

Staged catalogue validation permits one approved original with five held entries lacking private assets. It does not invent file locations for unreleased editions. Six-book bundle remains disabled until every exact edition is released.

Run: node scripts/test-staged-journal-adapters.mjs. Five entrypoint default-closed glue fixtures and HTTP/storage/index/provider fixture tests pass. No actual book interiors, keys, sessions or network requests used. Deno native dependency checking is separately recorded in the handoff; a fixture pass is not native provider/deployment proof.

## Exact remaining configuration/verification

1. Owner-approved original Knowing Your Worth is general coaching/personal reflection, 34 pages, white writing areas. Do not describe it as the current candidate's ACT-framed revision. Obtain the exact approved file from parent's recovered release evidence, upload privately under existing Base44 authorization, record byte SHA-256 and exact file_uri in server-only catalogue; retain immutable edition snapshot and release provenance. This package contains none of those paid bytes.
2. Map stripeKeyEnv to the EXISTING authorized runtime Stripe binding, verify the merchant/mode through a safe provider call, use an existing test-mode connection for a real isolated provider test. Never ask for keys, rotate them or create a new merchant. Test mode not available through current connector; staged liveMode defaults false.
3. PrivateDownloadHosts must contain the exact host actually returned by Core.CreateFileSignedUrl for an authorized synthetic/private test asset. Empty or unexpected host fails closed. This avoids broad external fetch permissions and exposing the temporary URL.
4. Verify service-role index filter/create/update and provider pagination in the isolated test environment. Failed/partial lookups block another checkout. References may duplicate under concurrent index writes; session ID deduplication and Stripe buyer-wide idempotency prevent duplicate charges. No claim of atomic unique index was made.
5. Review/deploy ONLY these five closed adapters; then run real authenticated test-mode paid/pending/refunded/wrong-buyer/integrity/download cases. Parent's narrow approved book-publication authority covers eligible listings, not unrelated app deployment. Enable only the approved edition, gate frontend flags and matching catalogue consistently after successful delivery verification.

No new OAuth scopes, Drive write access, secret extraction or live charge is needed for the completed source/fixture work. Base44 private storage APIs were verified from the SDK skill; Stripe list/expire semantics verified in official docs:
https://docs.stripe.com/api/checkout/sessions/list
https://docs.stripe.com/api/checkout/sessions/expire
