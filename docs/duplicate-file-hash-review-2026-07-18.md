# Duplicate File Hash Review

Updated: 18 July 2026

Scope: read-only duplicate check. No files were deleted, moved, or renamed.

Raw report:

- `docs/duplicate-hash-check-2026-07-18.csv`

## Result

Several large files have matching names and matching sizes across canonical folders and `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found`.

However, SHA-256 hash verification was blocked because OneDrive returned:

`The cloud file provider exited unexpectedly.`

So none of these files are confirmed duplicates yet.

## Checked Pairs

| Label | Size A | Size B | Status |
| --- | ---: | ---: | --- |
| `MyZip.zip` | 1.589GB | 1.589GB | Hash blocked by cloud provider |
| `Apple ProRes 4444(1)_1.mov` | 1.023GB | 1.023GB | Hash blocked by cloud provider |
| `ScreenRecording_03-10-2026 14-35-00_1.MP4` | 0.743GB | 0.743GB | Hash blocked by cloud provider |
| `ScreenRecording_03-10-2026 14-53-38_1` | 0.724GB | 0.724GB | Hash blocked by cloud provider |
| `20121110231931.mpg` | 0.652GB | 0.652GB | Hash blocked by cloud provider |
| `BWV bodycam duplicate` | 0.473GB | 0.473GB | Hash blocked by cloud provider |

## Interpretation

These are strong duplicate candidates because sizes match exactly, but they cannot be approved for deletion until at least one of these happens:

- OneDrive is fully running and the files are marked "Always keep on this device".
- The files are opened successfully from both locations.
- A hash comparison completes successfully.
- Gannon manually confirms the `Lost and Found` copy is redundant.

## Next Safe Step

In File Explorer, right-click the duplicate candidate files or the parent folders and choose "Always keep on this device", then rerun the hash check.

Do not delete any `Lost and Found` copy yet.
