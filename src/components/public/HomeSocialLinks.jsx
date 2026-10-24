const NETWORKS = [
  ['youtube_url', 'YouTube', 'youtube'],
  ['instagram_url', 'Instagram', 'instagram'],
  ['facebook_url', 'Facebook', 'facebook'],
  ['tiktok_url', 'TikTok', 'tiktok'],
  ['spotify_url', 'Spotify', 'spotify'],
  ['apple_music_url', 'Apple Music', 'apple'],
];

// Verified official URLs (source: https://linktr.ee/gann0nwaye) so these links
// never render empty when a Business Profile Settings field is unset.
const OFFICIAL_FALLBACKS = {
  youtube_url: 'https://www.youtube.com/@gannonwayeofficial',
  instagram_url: 'https://www.instagram.com/gann0nwaye',
  facebook_url: 'https://www.facebook.com/gann0nwaye',
  tiktok_url: 'https://www.tiktok.com/@gann0nwaye',
  spotify_url: 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz',
  apple_music_url: 'https://music.apple.com/au/artist/gannon-waye/6771583117',
};

function NetworkLogo({ network }) {
  if (network === 'youtube') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="5" fill="#ff0033" /><path d="m10 8 6 4-6 4Z" fill="white" /></svg>;
  if (network === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="home-instagram" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#ffcd57" /><stop offset=".48" stopColor="#e1306c" /><stop offset="1" stopColor="#833ab4" /></linearGradient></defs><rect x="1" y="1" width="22" height="22" rx="6" fill="url(#home-instagram)" /><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="white" strokeWidth="1.7" /><circle cx="12" cy="12" r="3.3" fill="none" stroke="white" strokeWidth="1.7" /><circle cx="16.8" cy="7.3" r="1" fill="white" /></svg>;
  if (network === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.5" fill="#1877f2" /><path d="M13.7 23V13h3.4l.5-4h-3.9V7c0-1.1.4-1.7 1.9-1.7h2V1.7c-.7-.1-1.8-.2-3-.2-3 0-5 1.8-5 5.1V9H6.3v4h3.3v10Z" fill="white" /></svg>;
  if (network === 'tiktok') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x=".5" y=".5" width="23" height="23" rx="6" fill="#111" /><path d="M14 4v10.3a3.4 3.4 0 1 1-3-3.4" fill="none" stroke="#25f4ee" strokeWidth="2.8" transform="translate(-.65 .55)" /><path d="M14 4c.3 3 2 4.6 5 4.9M14 4v10.3a3.4 3.4 0 1 1-3-3.4" fill="none" stroke="#fe2c55" strokeWidth="2.8" transform="translate(.65 -.1)" /><path d="M14 4c.3 3 2 4.6 5 4.9M14 4v10.3a3.4 3.4 0 1 1-3-3.4" fill="none" stroke="white" strokeWidth="2.1" /></svg>;
  if (network === 'spotify') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.5" fill="#1ed760" /><g fill="none" stroke="#102517" strokeLinecap="round"><path d="M5 8.5c5-1.5 10-1.1 14 1" strokeWidth="2" /><path d="M6 12c4-1.2 8.7-.8 12 1" strokeWidth="1.8" /><path d="M7 15.5c3.5-.9 6.5-.6 10 1" strokeWidth="1.6" /></g></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="home-apple-music" x2="0" y2="1"><stop stopColor="#fa586a" /><stop offset="1" stopColor="#e63056" /></linearGradient></defs><rect x=".5" y=".5" width="23" height="23" rx="5.5" fill="url(#home-apple-music)" /><path d="M10 16V7l8-1.5v9" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round" /><path d="m10 9 8-1.5" stroke="white" strokeWidth="1.8" /><ellipse cx="7.8" cy="16.5" rx="2.8" ry="2" transform="rotate(-20 7.8 16.5)" fill="white" /><ellipse cx="15.8" cy="15" rx="2.8" ry="2" transform="rotate(-20 15.8 15)" fill="white" /></svg>;
}

export default function HomeSocialLinks({ settings = {} }) {
  const links = NETWORKS.map(([key, label, network]) => [key, label, network, settings[key] || OFFICIAL_FALLBACKS[key]])
    .filter(([, , , url]) => {
      try { return new URL(url).protocol === 'https:'; } catch { return false; }
    });
  if (!links.length) return null;
  return <nav className="home-social-links" aria-label="Keep in touch with Gannon">
    <p>We can also keep in touch on</p>
    <div>{links.map(([key, label, network, url]) => <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Gannon Waye on ${label}`}>
      <NetworkLogo network={network} /><span>{label}</span>
    </a>)}</div>
  </nav>;
}