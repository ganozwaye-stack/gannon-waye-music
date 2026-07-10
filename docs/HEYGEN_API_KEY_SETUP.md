# HeyGen API Key Setup

Use the HeyGen API key only as a private server-side secret.

Do not:

- Paste the key into chat.
- Commit the key to GitHub.
- Put the key in any `VITE_` environment variable.
- Store the key in front-end code, browser code, or public Base44 records.

## Local Windows setup

Set the key as a Windows user environment variable:

```powershell
[Environment]::SetEnvironmentVariable("HEYGEN_API_KEY", "PASTE_YOUR_KEY_HERE", "User")
```

Then restart PowerShell, Codex, or the local development server before using it.

For a temporary PowerShell session only:

```powershell
$env:HEYGEN_API_KEY = "PASTE_YOUR_KEY_HERE"
```

## Base44 setup

Once Base44 CLI login is working, store the key as a Base44/server secret, not as a public variable:

```powershell
npx base44 secrets set HEYGEN_API_KEY="PASTE_YOUR_KEY_HERE"
```

If the CLI login is unavailable, add the same secret through the Base44 app secret/settings screen.

## Current avatar source of truth

The project already has private Gannon HeyGen avatar and voice assets recorded in:

```text
AVATAR-GANNON-WAYE.md
```

Use those IDs for approved private test videos. Do not create duplicate avatars unless Gannon approves a replacement.

## Sonia / Mum avatar rule

Do not create or upload a lifelike Sonia/Mum avatar or voice clone until Gannon has explicitly approved:

1. The exact photo/video/audio asset.
2. The consent/ethics wording.
3. Whether the result is a clearly labelled tribute, illustrated guide, or original-voice memory clip.

The safer default for Mum's Garden is exact approved photos, Gannon narration, and clearly labelled original voice clips if available.
