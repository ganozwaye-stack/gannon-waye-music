# Lyrics Archive Import Report

**Date:** 2026-06-23
**Mode:** Private archive only
**Operator:** Base44 (artist brand cleanup mode)

## Summary

- **Total songs stored:** 17
- **Songs with lyrics stored:** 16 (all pasted lyrics saved exactly as supplied)
- **Songs needing source:** 1 (Thankyou — Gannon instruction: search online/video/YouTube, do not invent)
- **All marked private:** Yes (is_published = false for all)
- **All marked not approved for publishing:** Yes (publishing_status = not_approved, publishing_safe = false)
- **No lyrics published publicly:** Confirmed
- **No public lyric pages created:** Confirmed
- **Not indexed:** Confirmed
- **Not added to sitemap:** Confirmed

## Songs Stored

| # | Title | Lyrics Stored | Copyright | Version Status | Sensitive | Explicit | Unresolved |
|---|-------|:---:|---|---|:---:|:---:|:---:|
| 1 | Will You Even Listen | Yes | 2025 | draft | Yes | No | No |
| 2 | Without You Here | Yes | — | draft | Yes | No | No |
| 3 | I'm Still Here | Yes | 2026 | draft | Yes | No | Yes |
| 4 | I've Been Set Free | Yes | 2026 | draft | Yes | No | Yes |
| 5 | Thankyou | No | — | needs_source | No | No | No |
| 6 | Because of You | Yes | — | draft | Yes | No | Yes |
| 7 | Broken Inside | Yes | 2025 | draft | Yes | No | No |
| 8 | Stand By Me Now | Yes | 2025 | draft | Yes | No | Yes |
| 9 | Killing Both Our Hearts | Yes | 2025 | draft | Yes | No | No |
| 10 | I Found Me | Yes | 2025 | draft | Yes | No | No |
| 11 | So Arrogant | Yes | 2025 | draft | Yes | No | No |
| 12 | Letting Go | Yes | 2025 | draft | No | No | No |
| 13 | You're My Mum | Yes | — | draft | Yes | No | No |
| 14 | All I Ever Wanted | Yes | 2025 | draft | Yes | No | No |
| 15 | Unexpected | Yes | — | draft | No | Yes | No |
| 16 | One Day | Yes | — | draft | Yes | No | No |
| 17 | Run | Yes | 2017 | draft | No | No | No |

## Without You Here — Special Notes

- Full lyrics pasted and stored as the current private version
- Previously unresolved lines now resolved in this version:
  - Line 1: "now go and you'll be free but"
  - Line 2: "you were still trying to keep me here"
- Signature lyric confirmed: "Your last breath took mine away / There's not much more I have to say"
- Written on Mother's Day, 10 May 2026
- Tribute to Gannon's late mother, Sonia Katisa Waye (1961–2022)
- Needs Gannon approval before public publish

## Thankyou — Special Notes

- Lyrics source required
- Gannon instruction: "Search lyrics online or video. Or my website? Or YouTube. Video… don't make them up."
- Do not invent lyrics
- Search only approved sources if instructed later

## Spelling / Grammar Notes (not auto-corrected)

- **I'm Still Here:** "The your truth will set you free" — potential grammar issue, needs Gannon review
- **I've Been Set Free:** "Copywrite" in copyright line — misspelling in source, needs Gannon review
- **Because of You:** "dissapear" — should be "disappear", needs Gannon review
- **Stand By Me Now:** "thishurt" — should be "this hurt", needs Gannon review

## Sensitive Content Flags

Songs flagged for sensitive review (12 total):
- Will You Even Listen (emotional distress)
- Without You Here (grief/mother tribute)
- I'm Still Here (grief, self-harm reference)
- I've Been Set Free (abuse, narcissistic behavior)
- Because of You (abandonment, substance use)
- Broken Inside (mental health, paranoia)
- Stand By Me Now (emotional pain)
- Killing Both Our Hearts (emotional neglect, mental health)
- I Found Me (narcissistic abuse, "wishing you were dead")
- So Arrogant (emotional abuse, cruelty)
- You're My Mum (grief, loss of mother)
- All I Ever Wanted (heartbreak, betrayal)
- One Day (revenge, legal themes)

## Explicit Language Flags

- **Unexpected:** Contains "give me a fucking break" (repeated 8 times)

## Entity Schema

The Lyric entity includes these private archive fields:
- copyright_year, version_status, draft_notes, publishing_status, approval_status
- source, needs_review, contains_explicit_language, contains_unresolved_wording
- contains_sensitive_content, publishing_safe

## RLS

Unpublished lyrics are admin-only. All 17 records have is_published = false, so they are all private.

## Admin Page

The Lyrics Archive admin page at /admin/lyrics-archive includes:
- Tab filtering: All, Draft, Ready for Review, Needs Source, Sensitive Review, Publish Later
- Search by title, lyrics text, or notes
- Export to CSV
- Full edit form with all private archive fields
- Sensitivity, explicit, and review flags displayed in list view

## Next Actions for Gannon

1. Search for and paste the Thankyou lyrics (online, video, or YouTube — do not invent)
2. Review the 4 spelling/grammar notes (do not auto-correct — confirm with Gannon first)
3. Review the 12 songs flagged for sensitive content
4. Review the 1 song with explicit language (Unexpected)
5. Confirm Without You Here is ready for publishing (unresolved lines now resolved)
6. Approve songs for publishing only when ready (set publishing_safe = true and is_published = true)