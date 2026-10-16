import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CalendarDays, ExternalLink, Radio, Video } from 'lucide-react';
import { safePublicUrl, safeEmbedUrl } from '@/lib/liveUrls';

function formattedSchedule(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-AU', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Australia/Melbourne',
  });
}

export default function Live() {
  const { data: settingsArr = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['public-livestream-settings'],
    queryFn: () => base44.entities.SiteSettings.list(),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });

  const settings = Array.isArray(settingsArr) ? settingsArr[0] || {} : {};
  const enabled = settings.live_stream_enabled === true;
  const status = settings.live_stream_status || 'offline';
  const isLive = enabled && status === 'live';
  const isScheduled = enabled && status === 'scheduled';
  const playerUrl = isLive ? safeEmbedUrl(settings.live_stream_embed_url) : '';
  const chatUrl = isLive ? safeEmbedUrl(settings.live_stream_chat_url) : '';
  const tiktokUrl = safePublicUrl(enabled && settings.live_stream_tiktok_url || settings.tiktok_url, ['tiktok.com']);
  const facebookUrl = safePublicUrl(settings.facebook_url, ['facebook.com']);
  const title = enabled && settings.live_stream_title || 'Gannon Waye Live';
  const schedule = enabled ? formattedSchedule(settings.live_stream_scheduled_at) : '';

  if (isLoading) {
    return (
      <section data-testid="live-hub" className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center" role="status" aria-live="polite">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="font-body text-xs text-muted-foreground mt-4 tracking-widest uppercase">Loading LIVE</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section data-testid="live-hub" className="min-h-[70vh] px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Gannon Waye Live</h1>
        <p role="alert" className="mt-4">LIVE status is temporarily unavailable. Please try again.</p>
        <button type="button" onClick={() => refetch()} className="mt-4 underline">Try again</button>
      </section>
    );
  }

  return (
    <section data-testid="live-hub" className="min-h-[75vh] px-4 md:px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-muted-foreground/50'}`} />
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">
              {isLive ? 'Live now' : isScheduled ? 'Scheduled' : 'Currently offline'}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold gradient-gold-text">{title}</h1>
          {enabled && settings.live_stream_provider && (
            <p className="font-body text-sm text-muted-foreground">Broadcast via {settings.live_stream_provider}</p>
          )}
          {schedule && (
            <p className="font-body text-sm text-foreground flex items-center justify-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" /> {schedule} Melbourne time
            </p>
          )}
        </header>

        {playerUrl ? (
          <section className="rounded-2xl overflow-hidden border border-primary/25 bg-black shadow-2xl">
            <div className="aspect-video">
              <iframe
                src={playerUrl}
                title={title}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-border/40 bg-card/60 px-6 py-16 text-center">
            <Radio className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl text-foreground">
              {isScheduled ? 'The next LIVE is being prepared' : isLive ? 'The broadcast is opening now' : 'No broadcast is live right now'}
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
              {isScheduled
                ? 'Come back at the scheduled time or open TikTok and Facebook below.'
                : isLive
                  ? 'The public player has not appeared yet. Use the platform buttons below while it connects.'
                  : 'Follow Gannon on TikTok and Facebook so you do not miss the next music, story or coaching LIVE.'}
            </p>
          </section>
        )}

        {chatUrl && (
          <section className="rounded-2xl overflow-hidden border border-border/40 bg-card/60">
            <iframe
              src={chatUrl}
              title="LIVE chat"
              className="w-full h-[520px]"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </section>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-border/40 bg-card/60 p-5 hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <Video className="w-5 h-5 text-primary" />
                <span>
                  <span className="font-display text-lg text-foreground block">Watch on TikTok</span>
                  <span className="font-body text-xs text-muted-foreground">@gann0nwaye</span>
                </span>
              </span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          )}

          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-border/40 bg-card/60 p-5 hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <Video className="w-5 h-5 text-primary" />
                <span>
                  <span className="font-display text-lg text-foreground block">Watch on Facebook</span>
                  <span className="font-body text-xs text-muted-foreground">Gannon Waye</span>
                </span>
              </span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          )}
        </section>

        <p className="font-body text-[11px] text-muted-foreground/70 text-center max-w-2xl mx-auto">
          Recorded music may be interrupted by platform copyright systems. Live sessions remain subject to TikTok and Facebook music rules.
        </p>
      </div>
    </section>
  );
}
