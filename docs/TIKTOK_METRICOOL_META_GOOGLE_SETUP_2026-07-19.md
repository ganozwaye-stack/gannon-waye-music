# Social And Drive Integration Setup

Date: 2026-07-19

## Current Build Position

The local project already has:

- TikTok OAuth and draft upload functions.
- Metricool config validation, media normalisation, scheduling and performance import functions.
- ApprovalQueue and ContentCalendarPost entities.
- Social schedule pages that block visual platforms without approved public media.
- Google Drive content-production folders for raw media, drafts, approvals, scheduling and archive.

## TikTok

Official docs: https://developers.tiktok.com/products/content-posting-api/

Current repo direction: use TikTok Content Posting API as draft/inbox upload, not direct publish.

Needed from Gannon:

- TikTok Developer account access.
- App client key and client secret saved in Base44/Emergent secret storage, not chat.
- Redirect URI: `https://gannonwaye.com/tiktok-callback`.
- Scopes: `user.info.basic` and `video.upload`.
- App review evidence showing the approval flow before upload.

Approval rule:

- Direct publish is disabled as the default model.
- TikTok draft upload can happen only after an ApprovalQueue item is approved and a public video URL exists.

## Metricool

Official docs: https://help.metricool.com/basic-guide-for-api-integration-r97af

Needed from Gannon:

- Confirm Metricool plan includes API access.
- Save `METRICOOL_API_TOKEN`, `METRICOOL_USER_ID` and `METRICOOL_BLOG_ID` in Base44/Emergent secret storage.
- Run diagnostics before scheduling.

Approval rule:

- Metricool scheduling accepts approved ContentCalendarPost records only.
- Visual platforms need approved public media before scheduling.

## Instagram And Facebook

Official docs: https://developers.facebook.com/documentation/instagram-platform/content-publishing

Fast path:

- Use Metricool for scheduling Instagram/Facebook once the Metricool connection works.

Developer path:

- Meta developer app.
- Facebook Page linked to Instagram Business/Creator account.
- App review for the required Instagram Graph API permissions.
- Public HTTPS media URLs for reels/images.

Approval rule:

- No direct publish from the app until Meta permissions and the approval flow are verified.

## YouTube Shorts

Official docs: https://developers.google.com/youtube/v3/docs/videos/insert

Fast path:

- Prepare YouTube Shorts packages and upload manually or through Metricool first.

Developer path:

- Google Cloud project.
- YouTube Data API enabled.
- OAuth consent configured.
- Channel connected.
- Quota reviewed.

Approval rule:

- Uploads require Gannon approval and a final MP4 in Drive.

## Google Drive

Official docs: https://developers.google.com/workspace/drive/api/guides/manage-uploads

Current source of truth:

`G:\My Drive\Gannon Waye Music\Content Production`

Needed:

- Drive OAuth/API connection or a connected Drive tool in the target platform.
- Folder ids for each content-production subfolder.
- Resumable uploads for large video files.

Approval rule:

- Drive can receive raw files and edited exports automatically.
- Drive should not delete or move source files out of archive without verified backup.

## CapCut

Practical current setup:

- Use CapCut as the editor.
- Generate CapCut prompts and preset instructions from the dashboard.
- Export MP4 back to Drive.

Automation note:

- Do not make CapCut the core automation dependency until an official, reliable rendering/API path is confirmed. The safe near-term model is prompt-assisted CapCut editing plus Drive export.
