import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Radio, Music, Instagram, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ALLOWED_EMBED_HOSTS = ['youtube.com', 'youtu.be', 'vimeo.com', 'streamyard.com', 'restream.io'];

function isSafeEmbedUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    return ALLOWED_EMBED_HOSTS.some(h => u.hostname === h || u.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

function OfflineScreen({ settings }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg"
      >
        <div className="w-20 h-20 rounded-full bg-secondary/50 border border-border/40 flex items-center justify-center mx-auto mb-6">
          <Radio className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Live Stream</p>
        <h1 className="font-display text-4xl text-foreground mb-4">
          {settings?.live_stream_status === 'scheduled' ? 'Coming Soon' : 'Nothing On Right Now'}
        </h1>
        {settings?.live_stream_title && (
          <p className="font-body text-lg text-foreground/70 mb-2">{settings.live_stream_title}</p>
        )}
        {settings?.live_stream_scheduled_at && settings?.live_stream_status === 'scheduled' && (
          <div className="flex items-center justify-center gap-2 mb-6 text-primary">
            <Calendar className="w-4 h-4" />
            <span className="font-body text-sm">
              {new Date(settings.live_stream_scheduled_at).toLocaleString('en-AU', {
                dateStyle: 'long', timeStyle: 'short',
              })}
            </span>
          </div>
        )}
        <p className="font-body text-sm text-muted-foreground mb-8">
          Follow on socials to be notified the moment Gannon goes live.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://www.tiktok.com/@gann0nwaye" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
              TikTok @gann0nwaye
            </Button>
          </a>
          <a href="https://www.instagram.com/gann0nwaye" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
              <Instagram className="w-3 h-3 mr-1" /> @gann0nwaye
            </Button>
          </a>
          <a href="https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
              <Music className="w-3 h-3 mr-1" /> Spotify
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function Live() {
  const { data: settingsArr } = useQuery({
    queryKey: ['site-settings-live'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const settings = settingsArr?.[0];

  const isLive = settings?.live_stream_enabled && settings?.live_stream_status === 'live';
  const hasEmbed = isSafeEmbedUrl(settings?.live_stream_embed_url);
  const hasChatEmbed = isSafeEmbedUrl(settings?.live_stream_chat_url);

  if (!settings?.live_stream_enabled || !isLive || !hasEmbed) {
    return <OfflineScreen settings={settings} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-body text-xs text-red-400 font-semibold tracking-widest uppercase">Live</span>
          </div>
          <span className="font-display text-lg text-foreground">{settings.live_stream_title || 'Gannon Waye — Live'}</span>
        </div>
        {settings.live_stream_provider && (
          <span className="font-body text-xs text-muted-foreground">{settings.live_stream_provider}</span>
        )}
      </div>

      {/* Stream */}
      <div className={`flex flex-col md:flex-row flex-1 gap-0`}>
        <div className={`flex-1 aspect-video md:aspect-auto`}>
          <iframe
            src={settings.live_stream_embed_url}
            className="w-full h-full min-h-[56vw] md:min-h-[500px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Gannon Waye Live Stream"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          />
        </div>
        {hasChatEmbed && (
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border/40">
            <iframe
              src={settings.live_stream_chat_url}
              className="w-full h-64 md:h-full"
              title="Live Chat"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-border/40 text-center">
        <p className="font-body text-xs text-muted-foreground">
          Gannon Waye — Independent artist · <a href="https://gannonwaye.com" className="text-primary hover:underline">gannonwaye.com</a>
        </p>
      </div>
    </div>
  );
}