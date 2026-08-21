
/**
 * Parses a Spotify URL to extract the embed type and ID.
 * Supports track, album, artist, and playlist URLs.
 * Returns null if the URL is not a valid Spotify link.
 */
function parseSpotifyUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/spotify\.com\/(track|album|artist|playlist)\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return { type: match[1], id: match[2] };
}

/**
 * SpotifyPlayer — embeds a Spotify player iframe from a spotify_link URL.
 * Falls back to a fallbackUrl (e.g. a known album ID) if the primary link is missing.
 */
export default function SpotifyPlayer({ spotifyLink, fallbackUrl, height = 352, className = '' }) {
  const parsed = parseSpotifyUrl(spotifyLink) || parseSpotifyUrl(fallbackUrl);

  if (!parsed) return null;

  const embedSrc = `https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator`;

  return (
    <div className={className}>
      <iframe
        data-testid="embed-iframe"
        style={{ borderRadius: '12px' }}
        src={embedSrc}
        width="100%"
        height={height}
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}