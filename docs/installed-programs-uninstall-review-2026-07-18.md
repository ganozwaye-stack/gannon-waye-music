# Installed Programs Uninstall Review

Updated: 18 July 2026

Scope: read-only audit. Nothing has been uninstalled.

Raw inventory:

- `docs/installed-programs-audit-raw-2026-07-18.csv`

## Verdict

Uninstalling programs will not solve the main storage pressure. The biggest recoverable wins are still large media files, old archives, and duplicate-looking files in OneDrive/`Lost and Found`.

That said, there are a few program cleanup candidates if Gannon confirms they are not used.

## Largest App Entries Found

| App | Approx Size | Initial Decision |
| --- | ---: | --- |
| Microsoft Edge | 2.64GB | Do not remove; Windows/browser dependency. |
| Microsoft Edge WebView2 Runtime | 2.63GB | Do not remove; many apps depend on it. |
| Adobe Acrobat (64-bit) | 2.54GB | Keep for now; Adobe work is active. |
| Copilot | 1.99GB | Optional review candidate if unused. |
| Cursor | 1.03GB | Keep if coding work continues here. |
| Visual Studio Code | 0.90GB | Keep if coding work continues here. |
| Overtune | 0.78GB | Review if unused. |
| Canva desktop | 0.65GB | Review if web Canva is enough. |
| OneDrive | 0.55GB | Keep; needed during transfer. |
| Antigravity | 0.49GB | Review if unused. |
| Chrome | 0.46GB | Keep unless Edge is preferred and Chrome is unused. |
| MuseScore Studio 4 | 0.41GB | Review if unused. |
| Warp | 0.37GB | Review if unused. |
| Shutter Encoder | 0.36GB | Keep if video/audio conversion is needed. |
| Mixxx | 0.34GB | Review if unused. |
| Notion | 0.33GB | Review if web Notion is enough. |

## Safe To Consider Uninstalling After Review

Only remove these if Gannon says they are not actively used:

- Copilot
- Overtune
- Canva desktop app
- Antigravity
- Warp
- Mixxx
- Notion desktop app
- MuseScore Studio / MuseHub / MuseFX if not used for music notation
- Audacity duplicate versions: keep one stable version only
- CapCut if not used for current content
- Epson utilities if no Epson printer/scanner is actively used
- Old audio plugins if not used in REAPER or other DAWs:
  - Neutone FX
  - Blazio SA-10
  - gFractor
  - AutoFilter

## Do Not Touch Without Specific Reason

- Microsoft Edge
- Microsoft Edge WebView2 Runtime
- Microsoft OneDrive
- Microsoft Visual C++ Redistributables
- .NET runtimes
- Intel Management Engine components
- Git
- Cursor / VS Code while website work is active
- Adobe Creative Cloud / Acrobat while cover and artwork work is active
- Apple Application Support if iPhone/iTunes/iCloud tools are used
- REAPER while music work is active
- Python components unless we are deliberately cleaning the dev stack
- Dell SupportAssist OS Recovery/Remediation unless Gannon approves Dell utility cleanup

## Better First Cleanup Wins

1. Verify and clean `OneDrive\Desktop\Google Drive (Not synced)\Lost and Found`.
2. Hash-check duplicate-looking large files before deletion.
3. Move finished video exports and old archives to Google Drive.
4. Delete only approved duplicate/archive files.
5. Then uninstall unused apps if more space is needed.

## Next Safe Step

Create a short approval list of 5-10 apps for Gannon to tick yes/no, then uninstall only confirmed items manually or through Windows Settings.
