// Shared fail-closed contract for public Release readers.
// Mirrors the Release entity's anonymous read RLS. Approval actor/time remain
// private audit fields and are validated by owner-only backend workflows.
export const PUBLIC_RELEASE_FILTER = Object.freeze({
  is_published: true,
  publishing_safe: true,
  status: 'released',
  public_release_approval_status: 'approved',
});

export function isPublicRelease(release) {
  return Boolean(
    release
      && release.is_published === true
      && release.publishing_safe === true
      && release.status === 'released'
      && release.public_release_approval_status === 'approved',
  );
}

export function onlyPublicReleases(releases = []) {
  return releases.filter(isPublicRelease);
}
