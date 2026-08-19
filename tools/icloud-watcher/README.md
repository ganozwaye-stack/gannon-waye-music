# iCloud Watcher

Uploads downloaded iCloud Photos media into the Gannon Waye Base44 app through `icloudIngest`.

Safety rules:

- It never deletes, moves, renames, or edits originals.
- It dedupes uploaded files by SHA-256 hash and file size.
- It skips files modified in the last 60 seconds so partially downloaded iCloud files are not uploaded.
- It requires `ICLOUD_INGEST_KEY`; the same value must be set in Base44 secrets.

Required environment:

```env
BASE44_APP_URL=https://gannonwaye.base44.app
ICLOUD_WATCH_DIR=C:\Users\ganno\iCloudPhotos\Photos
ICLOUD_INGEST_KEY=PASTE_THE_SAME_VALUE_SET_IN_BASE44_SECRETS
```

Manual dry run:

```powershell
$env:BASE44_APP_URL='https://gannonwaye.base44.app'
$env:ICLOUD_WATCH_DIR='C:\Users\ganno\iCloudPhotos\Photos'
$env:ICLOUD_INGEST_KEY='paste-secret-here'
$env:ICLOUD_DRY_RUN='true'
node tools\icloud-watcher\watch.js
```

Manual upload run:

```powershell
$env:ICLOUD_DRY_RUN='false'
node tools\icloud-watcher\watch.js
```

Suggested Windows Scheduled Task:

- Program: `node`
- Arguments: `C:\path\to\tools\icloud-watcher\watch.js`
- Start in: the app/project folder
- Trigger: every 15 minutes
- Run only when network is available

Production readiness checklist:

1. Deploy `icloudIngest` to Base44.
2. Set Base44 secret `ICLOUD_INGEST_KEY`.
3. Set the same key in the local watcher environment.
4. Run dry-run.
5. Run one live upload against a small image.
6. Confirm records appear in `SocialAsset` and either `GalleryImage` or `SourceVideo`.
