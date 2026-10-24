import { resolveOfficialLinks } from '@/config/officialLinks';

// Settings-driven social pill links, with Gannon's verified official hub URLs
// (https://linktr.ee/gann0nwaye) as fallback so nothing renders empty or with a
// guessed URL. Admin-recorded overrides in Business Profile Settings win.
const KEYS = [
  ['instagram_url', 'instagram', 'Instagram', '📷'],
  ['facebook_url', 'facebook', 'Facebook', '📘'],
  ['twitter_url', 'x', 'X / Twitter', '𝕏'],
  ['tiktok_url', 'tiktok', 'TikTok', '🎵'],
  ['youtube_url', 'youtube', 'YouTube', '▶️'],
  ['spotify_artist_url', 'spotify', 'Spotify', '🎧'],
  ['apple_music_url', 'apple_music', 'Apple Music', '🍎'],
];

export default function SocialLinks({ settings = {}, className = '' }) {
  const official = Object.fromEntries(resolveOfficialLinks(settings).map(l => [l.key, l.url]));

  const links = KEYS
    .map(([key, brand, label, icon]) => ({ url: settings[key] || official[brand], label, icon }))
    .filter(link => link.url);

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map(link => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Gannon Waye on ${link.label}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full gradient-gold-button hover:shadow-lg transition-all font-body text-sm border-0"
        >
          <span className="text-sm">{link.icon}</span>
          {link.label}
        </a>
      ))}
    </div>
  );
}