# Mum’s Garden Memorial Page Spec

## Route and privacy

- Main route: `/mum`
- Current state: private pre-launch review behind the preview gate.
- Family upload route: `/family/sonia-upload?invite=family`
- Admin review route: `/admin/family-uploads`

## Purpose

Mum’s Garden is a tribute memorial site for Sonia Katisa Waye. It is a place where people can spend time with her memory, learn about her life, listen to “Without You Here,” leave memories, and move gently from heaven into her garden and through her story.

## Required page journey

1. Full-screen blue-sky opening with Sonia as an angelic presence.
2. Scroll transition from sky into garden.
3. Welcome invitation.
4. About Sonia / service-card facts softened into respectful copy.
5. Gannon’s letter and lyric-led emotional path.
6. “Without You Here” song section with cover art and clear loungeroom-writing correction.
7. Songs sung for Sonia: Ave Maria and Amazing Grace.
8. Exact photo gallery and memory-lane gallery.
9. Sonia Garden Guide/avatar section, clearly labelled and launch-safe.
10. Quiet comfort room.
11. Visitor memory wall and family upload link.
12. Gentle keepsake bridge only near the end.
13. Footer/closing reflection.

## Copy rule

Use family-approved words from the service card, eulogy, Gannon’s memories, and Gannon’s lyrics only. If exact text is not approved, write softly around it and flag it for review.

## Safety rule

All memory submissions default to:

- `approval_status: pending`
- `is_public: false`
- review required before publication

## Missing before public launch

- Final approved Sonia sky hero image with no children in the image.
- Final approved public photo list.
- Confirmed full eulogy/letter excerpts.
- Confirmed streaming URL for “Without You Here.”
- Final consent wording for family/friends.
## 2026-07-10 website blending update

- The gated Mum page is blended into the website through `/mum`.
- The Music page now links "Without You Here" to Mum's Garden.
- The footer now includes Mum's Garden as a gated destination.
- Family contributions remain separate at `/family/sonia-upload?invite=family`.
- Admin review remains separate at `/admin/family-uploads`.
- A HeyGen readiness card is present on the page, but it is review-locked and does not activate a generated Sonia avatar.
