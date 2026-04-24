import React from 'react';
import { Music, ExternalLink } from 'lucide-react';

const SOCIAL_ICONS = {
  instagram_url: { label: 'Instagram', icon: '📷' },
  facebook_url: { label: 'Facebook', icon: '📘' },
  twitter_url: { label: 'X / Twitter', icon: '𝕏' },
  tiktok_url: { label: 'TikTok', icon: '🎵' },
  youtube_url: { label: 'YouTube', icon: '▶️' },
  spotify_url: { label: 'Spotify', icon: '🎧' },
  apple_music_url: { label: 'Apple Music', icon: '🍎' },
};

export default function SocialLinks({ settings, className = '' }) {
  if (!settings) return null;

  const links = Object.entries(SOCIAL_ICONS)
    .filter(([key]) => settings[key])
    .map(([key, info]) => ({ url: settings[key], ...info }));

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map(link => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-secondary/50 hover:bg-primary/10 hover:border-primary/40 transition-all font-body text-sm text-foreground/80 hover:text-primary"
        >
          <span className="text-sm">{link.icon}</span>
          {link.label}
        </a>
      ))}
    </div>
  );
}