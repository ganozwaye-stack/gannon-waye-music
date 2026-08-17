# Codex Handoff: Too Lost Distribution + iCloud Ingestion Setup

This document is the task brief for Codex (or another coding agent with repo + secret access) to wire up the two external integrations the Publish Single workflow depends on. Base44's in-chat agent cannot run these directly because they require external account credentials and/or a local machine runner.

---

## 1. Too Lost Distribution (full API integration)

**Goal:** When a single is published via the `publishSingleWorkflow` backend function, push the release metadata + audio to Too Lost automatically (instead of logging a manual task).

**Current state:**
- `publishSingleWorkflow` already sets `is_current_single`, `is_published`, and creates an `AdminNotification` "Too Lost distribution" task.
- It reads `secrets.get('TOO_LOST_API_TOKEN')`. If absent, it logs a manual task. If present, it returns `distroStatus: 'token_present_push_pending'` and does NOT yet push (the push code is stubbed pending the real API shape).

**What Codex needs to do:**
1. Obtain the Too Lost API documentation and a valid API token from the Too Lost distributor account.
2. Set the secret in the Base44 app dashboard (Settings -> Environment Variables / Secrets):
   - `TOO_LOST_API_KEY` (or reuse `TOO_LOST_API_TOKEN`)
3. Document the Too Lost endpoints Codex discovers into `docs/TOO_LOST_API_REFERENCE.md` (auth header, create-release endpoint, upload-audio endpoint, required fields).
4. Implement the push inside `base44/functions/publishSingleWorkflow/entry.ts` (replace the stubbed branch where `distroStatus === 'token_present_push_pending'`). Keep it inside `waitUntil(...)` so the user response is not blocked.
5. Add a `tooLostPush` shared helper in `base44/shared/tooLostClient.ts` (auth, create release, upload audio) so other functions can reuse it.
6. Return the token name + any sub-credentials to the Base44 agent by updating this file's "Result" section below.

**Acceptance:**
- A published single creates a real Too Lost release draft (or submission) without manual portal work.
- If the push fails, an `AdminNotification` of severity `high` is created with the error.

---

## 2. iCloud Photo/Video Ingestion (content harvesting)

**Goal:** Automatically organize new photos/videos from an iCloud library into the `SourceVideo` / `MediaLibrary` / `GalleryImage` entities for the Reel Factory and Gallery.

**Why a local runner:** A browser-based app cannot scan a local iCloud folder (sandbox security). This must run on Gannon's Mac as a scheduled script.

**What Codex needs to do:**
1. Write a Node.js watcher script at `tools/icloud-watcher/watch.js` that:
   - Watches the local iCloud Photos download folder (configurable path).
   - On new media: uploads to Base44 via `UploadFile` (POST to the app's file upload integration) and creates a `SourceVideo` (for video) or `GalleryImage` (for photo) record via the Base44 REST API.
   - Tags files with topic keywords + taken date.
2. Authenticate the script with a shared secret `ICLOUD_INGEST_KEY` (set in Base44 secrets) passed as a header to a new backend function `icloudIngest` that accepts the upload + creates the entity. (Do not expose the Base44 service token in the script.)
3. Add a `base44/functions/icloudIngest/entry.ts` handler that:
   - Validates the `ICLOUD_INGEST_KEY` header.
   - Accepts `file` (multipart) + metadata.
   - Uploads via `UploadFile` and creates the correct entity record.
4. Document the cron/launchd schedule in `tools/icloud-watcher/README.md` (e.g. run every 15 minutes).
5. Return the secret name + the script path to the Base44 agent by updating the "Result" section below.

**Acceptance:**
- New iCloud media appears as `SourceVideo` / `GalleryImage` records within ~15 minutes of capture, no manual upload.

---

## Result (fill in after completion)

- Too Lost:
  - Secret name(s) set: `________`
  - API reference doc path: `docs/TOO_LOST_API_REFERENCE.md`
  - Push implemented in: `publishSingleWorkflow/entry.ts` (branch: `token_present_push_pending`)
- iCloud:
  - Secret name set: `ICLOUD_INGEST_KEY`
  - Watcher script path: `tools/icloud-watcher/watch.js`
  - Ingest handler: `base44/functions/icloudIngest/entry.ts