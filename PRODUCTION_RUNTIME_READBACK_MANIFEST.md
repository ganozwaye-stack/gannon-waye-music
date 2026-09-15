# Production Runtime Readback Manifest

This is a non-executing owner checklist. It creates no records, invokes no functions, sends no messages, publishes nothing, and changes no connector or authentication setting.

Use it after source acceptance has passed and only with the owner present.

## Purpose

A site deployment and a backend deployment are separate facts. Do not treat either one as proof of the other. Record a dated readback for each before calling the release safeguards live.

## 1. Canonical binding and no-deploy acceptance

1. Open the canonical app in the Base44 editor and confirm its ID matches `base44/.app.jsonc`.
2. From the reviewed repository, run:

   ```bash
   npm run test:acceptance
   ```

3. Stop if the binding check, behavioural tests, source checks, or build fails. Fix and rerun before proceeding.

## 2. Guarded site deployment

Only after explicit action-time approval, run:

```bash
npm run deploy:site
```

This command runs the full no-deploy acceptance and deployment-truth preflight before the hosted-site command. It is site-only.

Read back and record:
- the deployment receipt/version shown by the canonical owner session;
- the public domain response;
- public release visibility and guard behaviour;
- that no release, message, social post, payment, or connector action occurred as a side effect.

Do not use a broad deployment command as a substitute for the specific backend review below.

## 3. Backend resource readback

In the canonical Base44 editor, inspect the deployed/current version of these exact resources before declaring the safeguards live.

### Release control entities

- `Release`
- `ReleasePublicationApproval`
- `ReleaseEmailDraft`
- `ReleaseEmailSendReceipt`

### Release control functions and shared controls

- `publishSingleWorkflow`
- `prepareReleaseEmailDraft`
- `updateReleaseEmailDraft`
- `rejectReleaseEmailDraft`
- `sendReleaseEmailDraft`
- `submitNewRelease`
- `generateReleaseLaunchPacket`
- `publishDueReleases`
- `postReleaseToSocial`
- `notifyFansReleaseStatus`
- `notifySubscribersNewRelease`
- `releaseCalendarSync`
- `base44/shared/releaseControl.ts`
- `base44/release-action-policy.json`

Confirm the deployed functions match the reviewed source and retain their manual approval and no-automatic-action protections.

### Internal receipt lane

- `DeegoExecutionCommand`
- `DeegoExecutionTask`
- `DeegoTaskEvent`
- `deegoInternalDispatcher`
- `base44/functions/deegoInternalDispatcher/policy.ts`
- `base44/shared/deegoReceiptIntegrity.js`
- `src/components/admin/DeegoSupervisorDesk.jsx`

Confirm one same-key internal test can produce an accepted command, one task, and the expected ordered receipt events with zero external-effect fields. Do not run it until the exact test fixture and expected zero-effect result are agreed by the owner.

### Workflows to inspect

- `Auto-Post New Release to Instagram`
- `Publish Due Releases (Midnight)`
- `Notify Subscribers on New Release`
- `Release Status Update → Fan Email`
- `Sync release date to Google Calendar`
- `Weekly Release Calendar Sync`
- `Deego Heartbeat  -  Every 30 Minutes`
- `Agent Intelligence Loop  -  Every 4 Hours`
- `Agent Self-Improvement — Daily Review`
- `Deego Morning Brief — 6am`
- `Deego Report → Master Spreadsheet`

All except the spreadsheet workflow must remain on their safety holds. The spreadsheet workflow is a separately approved exception: do not trigger it during the internal receipt test.

### Connector and access readback

Review only, without changing scopes or connections:
- Gmail
- Instagram
- Google Sheets

Record their status and the expected scope. Stop if an unexpected connection, expanded scope, or unrecognised account appears.

## 4. Completion record

For each completed step, retain:
- date/time and owner present;
- canonical app ID;
- source commit/checkpoint;
- site deployment receipt/version, if applicable;
- backend resource versions/readback;
- test fixture, result, and exact receipt IDs, if an internal test is run;
- any stop condition or unresolved difference.

## Stop conditions

Stop and do not proceed if:
- the canonical app ID differs;
- a deployment/version receipt is missing;
- source and deployed resources differ;
- a held workflow is enabled unexpectedly;
- a connector or account is unexpected;
- any planned test could send, publish, pay, delete, submit, or contact someone;
- the owner is not present for the action.

Until every applicable readback is recorded, the correct status is source-ready, not runtime-proven.
