# Lyrics Archive Import Report

**Date:** 2026-06-23
**Mode:** Private archive only
**Operator:** Base44 (artist brand cleanup mode)

## Summary

- **Total songs stored:** 17
- **All marked private:** Yes (is_published = false for all)
- **All marked not approved for publishing:** Yes (publishing_status = not_approved, publishing_safe = false)
- **No lyrics published publicly:** Confirmed
- **No public lyric pages created:** Confirmed
- **Not indexed:** Confirmed
- **Not added to sitemap:** Confirmed

## Songs Stored

| # | Title | Version Status | Needs Source | Sensitive Flag | Unresolved Wording |
|---|-------|---------------|-------------|----------------|-------------------|
| 1 | Will You Even Listen | needs_source | Yes | No | No |
| 2 | Without You Here | draft | No (has draft lyrics) | Yes | Yes |
| 3 | I'm Still Here | needs_source | Yes | No | No |
| 4 | I've Been Set Free | needs_source | Yes | No | No |
| 5 | Thankyou | needs_source | Yes | No | No |
| 6 | Because of You | needs_source | Yes | No | No |
| 7 | Broken Inside | sensitive_review | Yes | Yes | No |
| 8 | Stand By Me Now | needs_source | Yes | No | No |
| 9 | Killing Both Our Hearts | sensitive_review | Yes | Yes | No |
| 10 | I Found Me | needs_source | Yes | No | No |
| 11 | So Arrogant | sensitive_review | Yes | Yes | No |
| 12 | Letting Go | sensitive_review | Yes | Yes | No |
| 13 | You're My Mum | sensitive_review | Yes | Yes | No |
| 14 | All I Ever Wanted | needs_source | Yes | No | No |
| 15 | Unexpected | needs_source | Yes | No | No |
| 16 | One Day | needs_source | Yes | No | No |
| 17 | Run | needs_source | Yes | No | No |

## Without You Here — Special Notes

- Signature lyric stored: "Your last breath took mine away / There's not much more I have to say"
- Written on Mother's Day, 10 May 2026 at 12:30am
- Tribute to Gannon's late mother, Sonia Katisa Waye (1961–2022)
- Two unresolved lyric lines flagged for Gannon confirmation
- Full lyrics to be sourced from the uploaded Word document only
- Do not use AI-generated lyrics
- Do not use press release copy as lyrics

## Thankyou — Special Notes

- Lyrics source required
- Do not invent lyrics
- Search only approved sources if instructed later

## Entity Schema Updates

The Lyric entity has been updated with the following private archive fields:
- copyright_year
- version_status (draft, ready_for_review, needs_source, sensitive_review, publish_later, approved)
- draft_notes
- publishing_status (not_approved, approved, published)
- approval_status (pending, approved, rejected)
- source
- needs_review
- contains_explicit_language
- contains_unresolved_wording
- contains_sensitive_content
- publishing_safe

## RLS Update

The Lyric entity read permissions have been updated so that only published lyrics (is_published = true) are readable by the public. All unpublished lyrics are admin-only. Since all 17 records have is_published = false, they are all private.

## Admin Page

The Lyrics Archive admin page at /admin/lyrics-archive has been updated with:
- Tab filtering: All, Draft, Ready for Review, Needs Source, Sensitive Review, Publish Later
- Search by title, lyrics text, or notes
- Export to CSV
- Full edit form with all private archive fields
- Sensitivity and review flags displayed in list view

## Next Actions for Gannon

1. Paste the full lyrics text for each song (16 songs need lyrics source)
2. Upload the Without You Here Word document with full lyrics
3. Confirm the 2 unresolved lyric lines for Without You Here
4. Review songs flagged for sensitive content (6 songs)
5. Review all songs for spelling, grammar, and unresolved wording
6. Approve songs for publishing only when ready (set publishing_safe = true and is_published = true)