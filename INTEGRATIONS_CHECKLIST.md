# Integrations Checklist

## Connected or prepared in code

- Base44 app: configured via `base44/config.jsonc`.
- Base44 SDK: used by the website for entities and file upload.
- Sonia memory submissions: `base44/entities/SoniaMemorySubmission.jsonc`.
- Family upload review: `/admin/family-uploads`.
- Local fallback: enabled for preview/dev when Base44 auth is unavailable.

## Needs live confirmation before use

- GitHub repository and pull request flow.
- Google Drive media library for photos, lyrics, brand files, and artwork.
- Gmail for approved outbound emails only.
- Google Calendar for release/post schedules.
- HeyGen for future avatar/video generation.
- Pressmaster for draft generation and publishing workflow.
- Canva/design storage for artwork source files.
- Metricool or scheduler for social posting.
- TikTok, Instagram, Facebook, YouTube, Threads, and X authentication.
- Netlify/Base44 hosting publication.
- Shopify/store system if keepsakes become live products.

## Approval guardrails

- No public posting without Gannon approval.
- No email sends without Gannon approval.
- No marketplace sync or product publication without Gannon approval.
- No DNS/domain/billing/payment changes without Gannon approval.
- No secrets in chat or committed files.

## 2026-07-10 HeyGen/TikTok status

- HeyGen app connector is reachable, but no private avatar looks were found.
- HeyGen CLI is not installed locally.
- No memorial media was uploaded to HeyGen during this pass.
- TikTok review package is documented in `TIKTOK_REVIEW_SUBMISSION_PACKAGE.md`.
- HeyGen memorial/video package is documented in `HEYGEN_REAL_LIFE_VERSION_PLAN.md`.
