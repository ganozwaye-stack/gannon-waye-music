# Gannon Waye Music Base44 App

This repository contains the Gannon Waye Music website and Base44 app code.

## Current priority

The current launch priority is Sonia Waye’s private pre-launch memorial page:

- Main memorial route: `/mum`
- Preview aliases: `/mum-garden`, `/mum-garden-preview`
- Family/friends upload link: `/family/sonia-upload?invite=family`
- Admin upload review: `/admin/family-uploads`
- Admin page review: `/admin/mum`

The `/mum` page is intentionally gated for pre-launch review. Family/friend uploads remain open for submissions, and all submissions are private/pending until approved.

## Local setup

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
npm run lint
```

If the project supports type checks in the current checkout:

```bash
npm run typecheck
```

## Base44

The Base44 config lives in `base44/config.jsonc`. Build before deployment:

```bash
npm run build
npx base44 deploy -y
```

Do not deploy without Gannon’s final approval.

## Media locations

- Mum images: `public/images/mum/`
- Mum memory-lane images: `public/images/mum/memory-lane/`
- Mum audio: `public/audio/mum/`
- Music artwork: `public/images/music/`

## Important content rule

“Without You Here” was written in Gannon’s loungeroom, not in a garden. Mum’s Garden is the memorial destination and emotional world around the song.

## Project docs

- `AGENTS.md`
- `CONTENT_WORKFLOW.md`
- `BRAND_GUIDE.md`
- `MUM_MEMORIAL_PAGE_SPEC.md`
- `AI_TWIN_VIDEO_REQUIREMENTS.md`
- `INTEGRATIONS_CHECKLIST.md`
- `SECURITY_AND_APPROVAL_RULES.md`
