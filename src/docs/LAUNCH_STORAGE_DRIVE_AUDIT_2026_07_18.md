# Launch, Storage, and Google Drive Audit - 18 July 2026

## Current Position

- Deploy target: `gannonwaye.com`
- Target go-live date: 20 July 2026
- Public site branch: `upgrade/base44-emergent-migration`
- Base44 account check: logged in as `ganozwaye@gmail.com`
- Google Drive connector: authenticated
- Google Drive Desktop: running as `GoogleDriveFS`
- OneDrive Desktop: running as `OneDrive`
- Local Google Drive mount: `G:\My Drive`
- Canonical Drive root: `G:\My Drive\Gannon Waye - Master Files`

## Drive System Decision

Use `Gannon Waye - Master Files` as the master filing system. Do not create another top-level archive unless there is a very specific reason.

Existing useful lanes:

- `00_System - Filing Control`
- `00_Inbox - To Sort`
- `01_Gannon Waye Music`
- `02_Mum - Sonia Memorial`
- `03_Websites - Apps - Code`
- `04_Content - Social Media`
- `05_Merch - Store - Products`
- `06_Business - Coaching - Mindset`
- `07_Admin - Legal - Finance`
- `08_Family - Personal`
- `09_Health - Fitness - PT`
- `10_Device Imports - iPhone - Camera`
- `90_Archives - Old Imports`
- `99_System Backups - Do Not Edit`

New lanes created during this audit:

- `03_Websites - Apps - Code / Launch - gannonwaye.com - 2026-07-20`
- `05_Merch - Store - Products / 05_Base44 Store - Live Scope Approved`
- `98_Delete Review - Needs Gannon Approval`
- `03_Websites - Apps - Code / Base44 - GanozMix Direct / 01_Audit - Current State`
- `03_Websites - Apps - Code / Base44 - GanozMix Direct / 02_Exports - Base44 eBay Products`
- `03_Websites - Apps - Code / Base44 - GanozMix Direct / 03_Errors - Tokens - Dead Letter Logs`
- `03_Websites - Apps - Code / Base44 - GanozMix Direct / 04_Approval Queue - Do Not Publish Automatically`

## What Can Go To Google Drive

- Photos, videos, cover art, PSD/Canva/Figma exports, raw creative assets.
- Audio masters, stems, demos, release notes, lyric sheets, press assets.
- Base44 exports, CSV/JSON snapshots, audit docs, launch screenshots.
- Store product images, product copy, pricing exports, supplier notes, order reports.
- Legal/admin PDFs, receipts, invoices, contracts, unless they contain credentials.

## What Should Stay Local Or In GitHub

- Active source code should live in Git/GitHub, with only release snapshots or docs copied to Drive.
- Current working dev folders can stay local until deployed and committed.
- `node_modules`, build folders, cache folders, and generated artifacts should not be archived to Drive.
- Large active video editing projects can stay local only while actively editing, then final exports/raws should move to Drive.

## What Should Not Go To Drive

- API keys, OAuth tokens, `.env` secrets, Stripe secrets, Adobe tokens, eBay tokens, Base44 credentials.
- Browser profiles, app caches, npm caches, temp folders, logs with secrets.
- Duplicate `node_modules`, `.vite`, `dist`, `.next`, build caches.
- Unverified private payment/customer data unless stored in a controlled admin/export folder with a clear purpose.

## Disk Pressure

Current C drive was below 1.5 GB free during audit, which blocks npm installs and production builds.

Largest confirmed local/storage items:

- `C:\Users\ganno\Documents\Victor_Complete_Evidence_Production.zip` - 16.18 GB
- `C:\Users\ganno\OneDrive` - 81.75 GB total
- `C:\Users\ganno\OneDrive\Documents` - 59.68 GB
- `C:\Users\ganno\OneDrive\Desktop` - 12.29 GB
- `C:\Users\ganno\.cache\codex-runtimes` - 1.41 GB
- `C:\Users\ganno\AppData\Local\Temp` - 0.19 GB

## Immediate Cleanup Candidates

Safe to clear after confirming no active Codex runtime depends on them:

- `C:\Users\ganno\.cache\codex-runtimes` - about 1.41 GB
- old temp files in `C:\Users\ganno\AppData\Local\Temp` - about 0.19 GB
- npm cache - small, about 0.07 GB

Needs Gannon review before delete:

- `Victor_Complete_Evidence_Production.zip` - very large and likely legal/evidence related.
- `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found` - contains many duplicate-looking large media files, but several may be legal, family, music, or evidence material.
- duplicate-looking `MUM SLIDESHOW PICTURES.mp4` exports.
- duplicate-looking `MyZip.zip`, `Apple ProRes 4444(1)_1.mov`, court screen recordings, WhatsApp archives, and old iPhone videos.

Do not delete:

- current website repo until committed, pushed, and deployed.
- `Without You Here` masters or cover assets.
- `Thank You` raw/final assets until release/press/store needs are clear.
- Base44 export/audit docs.
- legal/evidence files without explicit approval.

## Program Uninstall Candidates

Do not uninstall core launch tools before 20 July.

Keep for now:

- Google Drive
- Microsoft OneDrive
- Adobe Creative Cloud / Acrobat
- Git, GitHub Desktop, VS Code, Cursor
- Chrome/Edge
- Node/Python tooling currently used by site work
- REAPER, Audacity, Shutter Encoder, Canva, MuseScore if active for music/content

Review after launch:

- duplicate Audacity versions
- unused music plugins/apps
- old Epson utilities if not using printer/scanner
- Notion if Drive becomes the main archive
- duplicate terminal/code tools if they are not part of the workflow
- Python documentation/test-suite components if space matters

## What Needs Gannon Review

- Confirm whether the 16.18 GB evidence ZIP is backed up and can be moved/deleted locally.
- Review the `Lost and Found` folder before deletion.
- Confirm Adobe re-auth in the app/browser.
- Confirm the final `Without You Here` cover image uses the real face.
- Confirm store is intentionally staying live on Base44 for launch scope.
- Confirm final public homepage/merch/mum pages in browser before deploy.
- Confirm domain/DNS access for `gannonwaye.com`.
- Confirm payment/checkout path is active before announcing store sales.

## Launch Blockers

- Production build was repaired after clearing generated caches and reinstalling incomplete dependencies.
- Keep at least a few GB free so builds, deploys, and sync clients do not fail under disk pressure.
- Adobe requires reauthentication before cover work can continue in Adobe tooling.
- Base44 is audited as source-of-truth, but the capped entities still need paginated export later.
- Store launch scope is approved as Base44-backed; avoid rebuilding commerce before 20 July.
- Checkout/payment still needs a controlled live proof before any sales announcement.
- Public promo codes should not be advertised until a current live Base44 code is chosen and tested.

## Leadership Decision

Lead with the public launch first. GanozMix starts now as audit/rebuild planning, not live marketplace publishing.

Priority order:

1. Keep enough disk free for deploy tooling.
2. Commit/push site changes.
3. QA homepage, store, mum page, music CTAs, mobile.
4. Prove checkout/payment with one controlled live test.
5. Deploy to `gannonwaye.com`.
6. Leave Base44 store live for early revenue.
7. Start GanozMix as an approval-only review dashboard with no auto-publish.
