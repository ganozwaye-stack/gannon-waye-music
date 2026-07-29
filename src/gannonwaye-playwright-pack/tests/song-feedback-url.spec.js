/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

test('Spotify link validation accepts only the three approved exact hosts', async () => {
  const { isApprovedSpotifyUrl } = await import('../../lib/spotifyUrl.js');

  for (const value of [
    'https://spotify.com/track/123',
    'https://open.spotify.com/track/123',
    'https://www.spotify.com/au/',
    'http://open.spotify.com/artist/123',
  ]) expect(isApprovedSpotifyUrl(value)).toBe(true);

  for (const value of [
    'https://spotify.com.evil.example/track/123',
    'https://evilspotify.com/track/123',
    'https://example.com/?next=spotify.com',
    'https://artists.spotify.com/',
    '/spotify.com/track/123',
    'spotify.com/track/123',
    'not a url',
    '',
  ]) expect(isApprovedSpotifyUrl(value)).toBe(false);
});
