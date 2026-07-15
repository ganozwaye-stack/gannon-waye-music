import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Publishes the Gannon Waye brand kit to a new GitHub repository for distribution to Codex, Pressmaster, and HeyGen.
// Creates a public repo 'gannonwaye-brand-kit' with structured brand asset files.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const githubToken = Deno.env.get('GITHUB_TOKEN');
    if (!githubToken) {
      return Response.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });
    }

    const headers = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'gannonwaye-brand-kit-publisher',
    };

    // Helper: safely parse JSON, fall back to text
    const safeJson = async (resp) => {
      const text = await resp.text();
      try { return JSON.parse(text); } catch { return { _raw: text }; }
    };

    // 1. Get the authenticated user to find the owner login
    const userResponse = await fetch('https://api.github.com/user', { headers });
    const userData = await safeJson(userResponse);
    const owner = userData.login;

    if (!owner) {
      return Response.json({
        error: 'Could not determine GitHub user. Check that GITHUB_TOKEN has the "repo" scope and is valid.',
        github_status: userResponse.status,
        github_response: userData,
      }, { status: 500 });
    }

    const repoName = 'gannonwaye-brand-kit';

    // 2. Check if repo already exists; create if not
    let repoUrl = `https://github.com/${owner}/${repoName}`;
    let repoCreated = false;

    const checkResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers });

    if (checkResponse.status === 404) {
      // Create the repo
      const createResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: repoName,
          description: 'Official Gannon Waye brand kit — colors, typography, voice guidelines, and assets for Codex, Pressmaster, and HeyGen',
          private: false,
          auto_init: true,
        }),
      });

      if (!createResponse.ok) {
        const errData = await safeJson(createResponse);
        return Response.json({ error: 'Failed to create repo', details: errData }, { status: 502 });
      }

      const repoData = await safeJson(createResponse);
      repoUrl = repoData.html_url;
      repoCreated = true;
    }

    // 3. Push brand kit files via the Contents API
    const files = [
      {
        path: 'README.md',
        content: `# Gannon Waye — Brand Kit

Official brand assets for **Gannon Waye** — singer, songwriter, storyteller based in Melbourne, Australia.

## Contents

- \`colors/tokens.json\` — Brand color tokens (HSL + hex)
- \`typography/fonts.md\` — Font families and usage
- \`voice/guidelines.md\` — Voice and tone guidelines
- \`bio/artist-bio.md\` — Full and short artist bios
- \`social/links.json\` — Official social and streaming links
- \`brand-manifest.json\` — Machine-readable brand manifest for AI tools

## Distribution

This kit is designed for consumption by:
- **Codex / AI Builders** — structured JSON tokens for consistent content generation
- **Pressmaster Twin** — voice guidelines and bio for press release generation
- **HeyGen Avatars** — color palette and typography for video avatar styling

## Usage

All assets are © Gannon Waye. For press, media, and partner use. Contact: gannonwayemusic@gmail.com
`,
      },
      {
        path: 'colors/tokens.json',
        content: JSON.stringify({
          brand: "Gannon Waye",
          colors: [
            { name: "Primary Gold", hex: "#F5D06E", hsl: "40 85% 58%", token: "--primary", usage: "CTAs, highlights, accents" },
            { name: "Deep Gold", hex: "#C9A84C", hsl: "40 75% 52%", token: "--accent", usage: "Gradient pairs, hover states" },
            { name: "Warm Gold", hex: "#FFE08A", hsl: "43 74% 66%", token: "--chart-4", usage: "Highlights, glows" },
            { name: "Background Dark", hex: "#0F1116", hsl: "220 15% 6%", token: "--background", usage: "Page backgrounds" },
            { name: "Card Dark", hex: "#161920", hsl: "220 12% 9%", token: "--card", usage: "Cards, panels" },
            { name: "Foreground", hex: "#EBE4D4", hsl: "40 20% 92%", token: "--foreground", usage: "Body text" },
            { name: "Muted Text", hex: "#7A7E88", hsl: "220 10% 50%", token: "--muted-foreground", usage: "Secondary text" },
            { name: "Border", hex: "#262A33", hsl: "220 10% 16%", token: "--border", usage: "Borders, dividers" },
          ],
          gradients: {
            gold: "linear-gradient(90deg, #c9a84c 0%, #f5d06e 40%, #ffe08a 50%, #f5d06e 60%, #c9a84c 100%)",
          },
        }, null, 2),
      },
      {
        path: 'typography/fonts.md',
        content: `# Typography

## Display / Headings
- **Font:** Playfair Display
- **CSS:** \`'Playfair Display', serif\`
- **Weights:** 400, 500, 600, 700 (italic available)
- **Usage:** Headlines, titles, artist name, hero text

## Body / UI
- **Font:** Inter
- **CSS:** \`'Inter', sans-serif\`
- **Weights:** 300, 400, 500, 600, 700
- **Usage:** Body text, UI labels, buttons, navigation

## Google Fonts Import
\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700&family=Inter:wght@300;400;500;600;700&display=swap');
\`\`\`
`,
      },
      {
        path: 'voice/guidelines.md',
        content: `# Voice & Tone Guidelines

## Tone
Warm, authentic, vulnerable, hopeful. Never salesy.

## Core Themes
- Self-worth
- Boundaries
- Grief
- Courage
- Choosing yourself

## Signature Phrases
- "This is choosing yourself."
- "More than music."
- "I made it through."

## What to Avoid
- Hype or urgency tactics
- False promises
- Toxic positivity
- Overly formal language

## Emoji Usage
Use 🤍 sparingly for warmth. Never in headlines.

## Artist Bio
Gannon Waye is a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to him — it's the language he uses to understand people, emotion, and the parts of life that don't always have words.

His debut single "Thank You" marks the beginning of a deeply personal catalog. His work explores self-worth, boundaries, grief, and the courage to choose yourself. This is more than music. This is choosing yourself.
`,
      },
      {
        path: 'bio/artist-bio.md',
        content: `# Artist Bio

## Short Bio
Gannon Waye is a Melbourne-based singer-songwriter exploring self-worth, grief, and the courage to choose yourself. Debut single "Thank You" out now.

## Full Bio
Gannon Waye is a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to him — it's the language he uses to understand people, emotion, and the parts of life that don't always have words.

His debut single "Thank You" marks the beginning of a deeply personal catalog. His upcoming single "Without You Here," releasing July 23, 2026, is a raw acoustic letter to his late mother — written on Mother's Day and produced by Will Henderson.

Gannon's work explores self-worth, boundaries, grief, and the courage to choose yourself. This is more than music. This is choosing yourself.

## Contact
- Email: gannonwayemusic@gmail.com
- Location: Melbourne, Australia
`,
      },
      {
        path: 'social/links.json',
        content: JSON.stringify({
          spotify: "https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz",
          apple_music: "https://music.apple.com/artist/gannon-waye",
          instagram: "https://instagram.com/gannonwaye",
          tiktok: "https://tiktok.com/@gannonwaye",
          press_contact: "gannonwayemusic@gmail.com",
        }, null, 2),
      },
      {
        path: 'brand-manifest.json',
        content: JSON.stringify({
          brand: "Gannon Waye",
          tagline: "This is choosing yourself.",
          description: "Melbourne-based singer-songwriter exploring self-worth, grief, and courage.",
          colors: {
            primary: "#F5D06E",
            accent: "#C9A84C",
            background: "#0F1116",
            foreground: "#EBE4D4",
          },
          fonts: {
            display: "Playfair Display",
            body: "Inter",
          },
          voice: {
            tone: "warm, authentic, vulnerable, hopeful",
            themes: ["self-worth", "boundaries", "grief", "courage", "choosing yourself"],
            signature_phrases: [
              "This is choosing yourself.",
              "More than music.",
              "I made it through.",
            ],
          },
          social: {
            spotify: "https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz",
            instagram: "https://instagram.com/gannonwaye",
            tiktok: "https://tiktok.com/@gannonwaye",
          },
          contact: "gannonwayemusic@gmail.com",
          version: "1.0.0",
          updated: new Date().toISOString(),
        }, null, 2),
      },
    ];

    let pushedCount = 0;
    let errors = [];

    for (const file of files) {
      // Check if file already exists
      const fileCheck = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${file.path}`, { headers });

      let sha = null;
      if (fileCheck.ok) {
        const fileData = await safeJson(fileCheck);
        sha = fileData.sha;
      }

      // Create or update the file (UTF-8 safe base64 encoding)
      const bytes = new TextEncoder().encode(file.content);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const contentBase64 = btoa(binary);

      const pushResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${file.path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `${repoCreated ? 'Initial' : 'Update'} brand kit: ${file.path}`,
          content: contentBase64,
          ...(sha ? { sha } : {}),
        }),
      });

      if (pushResponse.ok) {
        pushedCount++;
      } else {
        const errData = await safeJson(pushResponse);
        errors.push({ path: file.path, error: errData.message || errData._raw || 'Unknown error' });
      }
    }

    return Response.json({
      status: 'success',
      message: `Brand kit ${repoCreated ? 'created and' : 'updated —'} ${pushedCount}/${files.length} files pushed to GitHub.`,
      repo_url: repoUrl,
      owner: owner,
      repo_name: repoName,
      files_pushed: pushedCount,
      total_files: files.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});