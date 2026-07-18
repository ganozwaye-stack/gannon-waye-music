export const SPOTIFY_ARTIST_URL = 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz';

export const WITHOUT_YOU_HERE_COVER = '/images/mum/without-you-here-current-cover.png';

export function getReleaseArtwork(release) {
  if (!release) return null;
  if (release.title === 'Without You Here') return WITHOUT_YOU_HERE_COVER;
  return release.artwork_url || null;
}
