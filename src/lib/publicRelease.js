// Shared filter for publicly visible releases.
// Mirrors the Release entity RLS read rule (data.is_published: true)
// so public pages and the lyric library share one source of truth.
export const PUBLIC_RELEASE_FILTER = { is_published: true };