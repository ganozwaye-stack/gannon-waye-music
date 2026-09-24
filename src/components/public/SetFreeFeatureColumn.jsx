import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { MERCH_DROP_AT } from '@/config/merchDrop';

// Set Free feature column: direct links to the major platforms, socials
// (from Site Settings) and the store's new merch drop. Left aligned.
const ARTWORK = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e2c44c509_image.png';

const PLATFORMS = [
  { label: 'Spotify', url: 'https://open.spotify.com/track/6TzrIFIkFu5HNyZGM4RmqG' },
  { label: 'Apple Music', url: 'https://music.apple.com/au/album/set-free/6810393345?i=6810393349' },
  { label: 'All Platforms', url: 'https://too.fm/setfree_gannonwaye' },
];
const SOCIALS = { instagram_url: 'Instagram', tiktok_url: 'TikTok', facebook_url: 'Facebook', youtube_url: 'YouTube', twitter_url: 'X' };
const PILL = 'inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 font-body text-[11px] tracking-wider uppercase transition-colors';

function Pills({ title, items }) {
  if (!items.length) return null;
  return (
    <div className="mt-4">
      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">{title}</p>
      <div className="flex flex-wrap justify-start gap-2">
        {items.map((i) => (
          <a key={i.label} href={i.url} target="_blank" rel="noopener noreferrer" className={PILL}>
            {i.label} <ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SetFreeFeatureColumn({ settings = {} }) {
  const dropped = Date.now() >= MERCH_DROP_AT;
  const socials = Object.entries(SOCIALS).filter(([k]) => settings[k]).map(([k, label]) => ({ label, url: settings[k] }));

  return (
    <div className="rounded-2xl border border-primary/30 bg-card/40 px-5 py-5 text-left">
      <p className="font-body text-[10px] tracking-[0.35em] uppercase gradient-gold-glow mb-3">Feature · Out Now</p>
      <div className="flex items-center gap-4">
        <img src={ARTWORK} alt="Set Free cover art, Gannon Waye" className="w-20 h-20 rounded-lg object-cover border border-primary/30 flex-shrink-0" />
        <div>
          <h3 className="font-body text-2xl tracking-[0.12em] uppercase gradient-gold-text">Set Free</h3>
          <p className="font-body text-xs text-muted-foreground mt-1">Gannon Waye · Single · 4:05</p>
        </div>
      </div>
      <Pills title="Listen" items={PLATFORMS} />
      <Pills title="Follow" items={socials} />
      <Link to="/store" className="mt-5 flex items-center justify-between gap-3 rounded-xl gradient-gold-button px-4 py-3">
        <span className="text-left">
          <span className="block font-body text-[10px] tracking-[0.25em] uppercase opacity-80">{dropped ? 'Just dropped' : 'Today · 5pm AEST'}</span>
          <span className="block font-body text-sm font-semibold tracking-wider uppercase">{dropped ? 'New merch out now' : 'New merch drops 5pm today'}</span>
        </span>
        <ArrowRight className="w-4 h-4 flex-shrink-0" />
      </Link>
    </div>
  );
}