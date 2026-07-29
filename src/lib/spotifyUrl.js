const APPROVED_SPOTIFY_HOSTS = new Set([
  'spotify.com',
  'open.spotify.com',
  'www.spotify.com',
]);

export function isApprovedSpotifyUrl(href) {
  if (typeof href !== 'string' || href.trim() === '') return false;

  try {
    const url = new URL(href);
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      APPROVED_SPOTIFY_HOSTS.has(url.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}
