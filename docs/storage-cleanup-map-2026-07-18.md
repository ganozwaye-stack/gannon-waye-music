# Storage Cleanup Map

Updated: 18 July 2026

Scope: audit only. Nothing has been deleted, moved, or offloaded by this map.

## Current Disk Snapshot

- C: free space: about 21.12GB
- C: used space: about 915.25GB
- New Apple motion artwork folder size: about 0.61GB

## Largest Checked Areas

| Area | Approx Size | Notes |
| --- | ---: | --- |
| `C:\Users\ganno\OneDrive\Documents` | 59.09GB | Main storage pressure. Music, court/evidence, old-computer archives, and study files. |
| `C:\Users\ganno\OneDrive\Desktop` | 12.29GB | Contains `Google Drive (Not synced)\Lost and Found`, likely a migration/duplicate bucket. |
| `C:\Users\ganno\Documents` | 1.57GB | Lighter local area. Current generated Apple motion artwork lives here. |
| `C:\Users\ganno\Downloads` | 0.01GB | Not a meaningful cleanup target right now. |
| `C:\Users\ganno\Desktop` | 0.01GB | Not a meaningful cleanup target right now. |

## Largest Current Files Found

| Approx Size | File |
| ---: | --- |
| 4.08GB | `OneDrive\Documents\Music\2026\Thankyou\Video Clip\raw footage\IMG_1872.MOV` |
| 2.03GB | `OneDrive\Documents\Old Computer\2017-03-22 Iphone 6splus Update March 2017\...` |
| 1.74GB | `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found\IMG_0662.MOV` |
| 1.60GB | `OneDrive\Documents\Music\2026\Thankyou\MUM SLIDESHOW PICTURES.mp4` |
| 1.59GB | `OneDrive\Documents\Old Computer\The Voice Season 7\MyZip.zip` |
| 1.59GB | `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found\MyZip.zip` |
| 1.24GB | `OneDrive\Documents\Bachelor of Psychological Studies HONOURS\Professional Orientation\...` |
| 1.22GB | `OneDrive\Documents\Old Computer\HiSuite\ROM\Maya-L02C346B122\full\update.zip.dbk` |
| 1.02GB | `OneDrive\Documents\Music\2026\Thankyou\Video Clip\Thankyou video Topaz.mov` |
| 1.02GB | `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found\Apple ProRes 4444(1)_1.mov` |
| 1.02GB | `OneDrive\Documents\Music\2026\Thankyou\(0) ARTWORK Official\Apple ProRes 4444(1)_1.mov` |

## Duplicate-Looking Candidates

These need review before deletion because names and sizes suggest duplicates, but content/hash comparison has not yet been approved.

- `MyZip.zip`
  - `OneDrive\Documents\Old Computer\The Voice Season 7\MyZip.zip`
  - `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found\MyZip.zip`
- `Apple ProRes 4444(1)_1.mov`
  - `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found\Apple ProRes 4444(1)_1.mov`
  - `OneDrive\Documents\Music\2026\Thankyou\(0) ARTWORK Official\Apple ProRes 4444(1)_1.mov`
- Multiple court/bodycam and screen-recording files appear both in `Lost and Found` and structured court folders.

## What Can Go To Google Drive

Good Google Drive candidates:

- Finished cover artwork and Apple motion artwork deliverables.
- Launch/audit markdown files.
- CSV/JSON cleanup snapshots.
- Old project archives that are not actively edited.
- Video exports and raw footage that are already backed up and do not need local editing.
- Read-only evidence bundles after Gannon confirms sensitivity and folder destination.

Keep local or in active synced work folders:

- Current repo working copy.
- Active music project sessions being edited.
- Files needed by Adobe, video editors, DAWs, or current website work.
- Anything with unresolved legal/evidence sensitivity until reviewed.

Do not upload casually:

- `.env` files, API keys, tokens, OAuth exports, secrets.
- `node_modules`, build caches, `.cache`, temp render folders.
- Raw legal/evidence files to broad/shared folders without review.
- Duplicate dumps before deciding which copy is canonical.

## What Can Probably Be Removed Later, After Review

- `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found` after confirming every file has a canonical copy in OneDrive or Google Drive.
- Duplicate old-computer archives after hash comparison.
- Old generated motion artwork v1/v3 attempts if v4 or a later final is accepted.
- Local temp video dependency folder after motion artwork delivery is complete:
  - `%TEMP%\codex-video-deps`

## Do Not Remove Yet

- Any music session files, stems, raw vocals, or DAW project folders.
- Any court/evidence/legal folders.
- Any active Gannon Waye website repo or Base44 project folder.
- Any Adobe/cover source file before the cover is final.
- Any file in `Lost and Found` until duplicate/hash verification is complete.

## Keeping OneDrive And Google Drive Stable During Transfer

- Keep both desktop sync apps signed in and running.
- Do not move active project folders while builds or uploads are running.
- Use a staged folder strategy:
  - `01_INBOX_TO_SORT`
  - `02_ACTIVE_PROJECTS`
  - `03_MUSIC_RELEASES`
  - `04_WEBSITE_AND_STORE`
  - `05_GANOZMIX`
  - `06_LEGAL_PRIVATE`
  - `99_ARCHIVE_REVIEW_BEFORE_DELETE`
- Prefer copy-then-verify before deletion:
  - copy to Google Drive
  - verify file count and sample open
  - optionally hash compare
  - only then ask Gannon for delete approval

## Next Safe Step

Run hash comparison on the duplicate-looking files in `Lost and Found`, then create a delete/offload approval list. Do not delete anything automatically.
