# Gannon Waye Music — Agent Rules

## Project mission

Build and protect the Gannon Waye Music ecosystem: the public artist website, music release pages, merch experiences, content workflow, and Sonia Waye’s private pre-launch memorial page at `/mum`.

The work should feel healing, premium, cinematic, truthful, and emotionally safe. It must support Gannon’s music and business without turning intimate memorial content into a hard sales page.

## Brand voice

- Honest, direct, warm, grief-aware, resilient, spiritual without being preachy.
- Music is framed as healing and strength, not fame-chasing.
- Copy should sound like Gannon: plain-spoken, heartfelt, protective, and powerful.
- Do not invent family history, quotes, lyrics, eulogy text, or Sonia’s words.

## Coding standards

- Follow the existing Vite + React + Tailwind + Base44 structure.
- Keep components focused and reusable.
- Prefer real assets and approved media over placeholders.
- Use semantic HTML, accessible labels, keyboard-friendly controls, and `prefers-reduced-motion` where motion may be intense.
- Do not add heavy animation or autoplay behaviour that makes the memorial page feel unsafe or gimmicky.

## Testing commands

- Install: `npm install`
- Local dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Type check if supported: `npm run typecheck`

## Deployment commands

- Build first: `npm run build`
- Base44 deploy only after approval: `npx base44 deploy -y`
- Do not deploy, publish, sync, post, email, or schedule anything publicly without Gannon’s final approval.

## Media asset locations

- Mum page images: `public/images/mum/`
- Mum memory lane images: `public/images/mum/memory-lane/`
- Mum audio/voice notes: `public/audio/mum/`
- Music artwork: `public/images/music/`
- Pressmaster/video export assets may be staged outside the app until approved.

## Mum memorial page requirements

- Primary route: `/mum`
- Private review route aliases: `/mum-garden`, `/mum-garden-preview`, `/admin/mum`
- Family/friends upload route: `/family/sonia-upload?invite=family`
- Admin review route: `/admin/family-uploads`
- The page must begin in a peaceful blue sky with Sonia as an angelic presence, then scroll down into the garden.
- It must clearly state that “Without You Here” was written in Gannon’s loungeroom, not in a garden.
- Use exact Sonia/family photos only. Do not create fake family members or swap people into images.
- Do not use grave, coffin, funeral-room, or harsh black funeral imagery on the public memorial experience.
- Service-card and newspaper content should be softened into respectful copy unless Gannon explicitly approves showing the scans.
- The guestbook must save submissions as pending and private by default.

## AI twin requirements

- Gannon’s AI twin is not complete until the identity photo set, clear speaking footage, consent, voice clone, avatar test, script templates, captions, backgrounds, exports, and human approval workflow are all approved.
- No generated public audio or avatar video should be published without Gannon’s review.
- Sonia’s voice must use original recordings only unless the family explicitly approves a future synthetic direction. Do not present generated speech as Sonia.

## Approval rules

- Before posting publicly: ask Gannon for final approval.
- Before sending email: ask Gannon for final approval.
- Before changing live product pricing, payments, DNS, domains, billing, or connected platform settings: ask Gannon for final approval.
- Before deleting or trashing files/data/profiles: ask Gannon for final approval.
- Before publishing family memories: confirm consent and Gannon approval.

## Security rules

- Never hardcode passwords, API keys, tokens, cookies, private keys, or session secrets.
- Do not ask Gannon to paste secrets into chat.
- Use Base44/GitHub/platform secret stores or `.env.local` files that are not committed.
- Keep memory submissions private until reviewed.
