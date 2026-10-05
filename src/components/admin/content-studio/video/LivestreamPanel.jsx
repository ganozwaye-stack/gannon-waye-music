import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Radio, Save, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ALLOWED_EMBED_HOSTS, safeEmbedUrl, safePublicUrl } from '@/lib/liveUrls';

function isSafeEmbedUrl(url) {
  return !url || Boolean(safeEmbedUrl(url));
}

const STATUS_OPTIONS = [
  { value: 'offline', label: 'Offline', color: 'bg-secondary text-muted-foreground' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'live', label: 'Live 🔴', color: 'bg-red-500/20 text-red-400' },
  { value: 'ended', label: 'Ended', color: 'bg-secondary text-muted-foreground' },
];

export default function LivestreamPanel() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: settingsArr, isLoading, isError, refetch } = useQuery({
    queryKey: ['site-settings-livestream'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const settings = settingsArr?.[0];

  const [form, setForm] = useState(null);

  // Initialize form when settings load
  useEffect(() => {
    if (!isLoading && !isError && !form) {
      const current = settings || {};
      setForm({
        live_stream_enabled: current.live_stream_enabled || false,
        live_stream_status: current.live_stream_status || 'offline',
        live_stream_provider: current.live_stream_provider || '',
        live_stream_title: current.live_stream_title || '',
        live_stream_scheduled_at: current.live_stream_scheduled_at || '',
        live_stream_embed_url: current.live_stream_embed_url || '',
        live_stream_chat_url: current.live_stream_chat_url || '',
        live_stream_tiktok_url: current.live_stream_tiktok_url || '',
        live_stream_instagram_url: current.live_stream_instagram_url || '',
      });
    }
  }, [settings, form, isLoading, isError]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings) {
        return base44.entities.SiteSettings.update(settings.id, data);
      } else {
        return base44.entities.SiteSettings.create(data);
      }
    },
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ['site-settings-livestream'] });
      qc.invalidateQueries({ queryKey: ['public-livestream-settings'] });
      // Create admin notification
      await base44.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'info',
        title: 'Livestream settings updated',
        summary: `Status: ${form?.live_stream_status} | Enabled: ${form?.live_stream_enabled}`,
        source: 'LivestreamCommand',
        requires_action: false,
      });
      toast({ title: 'Livestream settings saved ✓' });
    },
    onError: () => toast({ title: 'Livestream settings could not be saved. Please try again.', variant: 'destructive' }),
  });

  const handleSave = () => {
    if (form?.live_stream_embed_url && !isSafeEmbedUrl(form.live_stream_embed_url)) {
      toast({ title: 'Invalid embed URL. Use a public HTTPS player from YouTube, Facebook, Vimeo, StreamYard, or Restream.', variant: 'destructive' });
      return;
    }
    if (form?.live_stream_chat_url && !isSafeEmbedUrl(form.live_stream_chat_url)) {
      toast({ title: 'Invalid chat URL — must be HTTPS from an allowed provider', variant: 'destructive' });
      return;
    }
    if (form?.live_stream_tiktok_url && !safePublicUrl(form.live_stream_tiktok_url, ['tiktok.com'])) {
      toast({ title: 'Use a public HTTPS TikTok link.', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(form);
  };

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  if (isError) {
    return <div role="alert">Livestream settings could not be loaded. <button type="button" onClick={() => refetch()} className="underline">Try again</button></div>;
  }

  if (isLoading || !form) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  const embedUrlValid = !form.live_stream_embed_url || isSafeEmbedUrl(form.live_stream_embed_url);
  const chatUrlValid = !form.live_stream_chat_url || isSafeEmbedUrl(form.live_stream_chat_url);

  return (
    <div className="space-y-6">
      <p className="font-body text-sm text-muted-foreground">Control the public /live page — embed URL must be public HTTPS only</p>

      {/* Security banner */}
      <div className="bg-primary/5 border border-primary/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="font-body text-sm text-primary">
          <strong>Never paste stream keys, RTMP URLs, or private dashboard links here.</strong>{' '}
          Only paste the public embed URL from YouTube/Vimeo/StreamYard "Share &rarr; Embed" section.
          Allowed hosts: {ALLOWED_EMBED_HOSTS.join(', ')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enable / Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Radio className="w-4 h-4 text-primary" /> Stream Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => update('live_stream_enabled', !form.live_stream_enabled)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${form.live_stream_enabled ? 'bg-primary' : 'bg-secondary'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.live_stream_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="font-body text-sm text-foreground">Enable /live page</span>
              <Badge className={form.live_stream_enabled ? 'bg-green-500/20 text-green-400 border-0' : 'bg-secondary text-muted-foreground border-0'}>
                {form.live_stream_enabled ? 'Public' : 'Hidden'}
              </Badge>
            </label>

            <div>
              <label className="font-body text-xs text-muted-foreground block mb-2">Stream Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => update('live_stream_status', opt.value)}
                    className={`px-3 py-1.5 rounded-lg font-body text-xs font-semibold border transition-all ${
                      form.live_stream_status === opt.value
                        ? `${opt.color} border-primary/40`
                        : 'bg-secondary text-muted-foreground border-border/30 hover:border-primary/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Provider</label>
              <input
                type="text"
                value={form.live_stream_provider}
                onChange={e => update('live_stream_provider', e.target.value)}
                placeholder="YouTube, Facebook, Vimeo, StreamYard…"
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              />
            </div>

            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Stream Title</label>
              <input
                type="text"
                value={form.live_stream_title}
                onChange={e => update('live_stream_title', e.target.value)}
                placeholder="e.g. Thank You — Release Day Live"
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              />
            </div>

            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Scheduled At</label>
              <input
                type="datetime-local"
                value={form.live_stream_scheduled_at ? form.live_stream_scheduled_at.slice(0, 16) : ''}
                onChange={e => update('live_stream_scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              />
            </div>
          </CardContent>
        </Card>

        {/* URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><ExternalLink className="w-4 h-4 text-primary" /> Embed URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">
                Stream Embed URL <span className="text-destructive">*</span>
              </label>
              <input
                type="url"
                value={form.live_stream_embed_url}
                onChange={e => update('live_stream_embed_url', e.target.value)}
                placeholder="https://www.youtube.com/embed/XXXXXXXXX"
                className={`w-full bg-secondary/50 border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none ${
                  embedUrlValid ? 'border-border/40 focus:border-primary/40' : 'border-destructive/60 focus:border-destructive'
                }`}
              />
              {!embedUrlValid && (
                <p className="font-body text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Must be HTTPS from {ALLOWED_EMBED_HOSTS.join(', ')}
                </p>
              )}
              {embedUrlValid && form.live_stream_embed_url && (
                <p className="font-body text-xs text-green-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> URL looks safe
                </p>
              )}
              <p className="font-body text-[10px] text-muted-foreground/50 mt-1">
                YouTube: Share → Embed → copy the src URL. Facebook: use the public Facebook video plugin URL, never the Live Producer dashboard URL.
              </p>
            </div>

            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Chat Embed URL (optional)</label>
              <input
                type="url"
                value={form.live_stream_chat_url}
                onChange={e => update('live_stream_chat_url', e.target.value)}
                placeholder="https://www.youtube.com/live_chat?v=XXXXXXXXX"
                className={`w-full bg-secondary/50 border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none ${
                  chatUrlValid ? 'border-border/40 focus:border-primary/40' : 'border-destructive/60 focus:border-destructive'
                }`}
              />
              {!chatUrlValid && (
                <p className="font-body text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Must be HTTPS from an allowed provider
                </p>
              )}
            </div>

            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">TikTok Live Stream URL (optional)</label>
              <input
                type="url"
                value={form.live_stream_tiktok_url || ''}
                onChange={e => update('live_stream_tiktok_url', e.target.value)}
                placeholder="https://www.tiktok.com/@gann0nwaye/live"
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              />
            </div>

            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Instagram Live Stream URL (optional)</label>
              <input
                type="url"
                value={form.live_stream_instagram_url || ''}
                onChange={e => update('live_stream_instagram_url', e.target.value)}
                placeholder="https://www.instagram.com/gann0nwaye/live"
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              />
            </div>

            {/* Preview */}
            {form.live_stream_enabled && form.live_stream_status === 'live' && embedUrlValid && form.live_stream_embed_url && (
              <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-3">
                <p className="font-body text-xs text-green-400 font-semibold mb-1">✓ /live will show stream player</p>
                <a href="/live" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline flex items-center gap-1">
                  Open /live <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {form.live_stream_enabled && form.live_stream_status !== 'live' && (
              <div className="bg-secondary/30 border border-border/30 rounded-xl p-3">
                <p className="font-body text-xs text-muted-foreground">
                  /live will show the waiting screen (status is "{form.live_stream_status}")
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button
        type="button"
        onClick={handleSave}
        disabled={saveMutation.isPending || !embedUrlValid || !chatUrlValid}
        className="gradient-gold-button border-0 gap-2"
      >
        <Save className="w-4 h-4" />
        {saveMutation.isPending ? 'Saving…' : 'Save Livestream Settings'}
      </Button>

      {/* Platform setup guide */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-5 pb-5 space-y-4">
          <div>
            <p className="font-body text-sm text-primary font-semibold mb-1">TikTok and Facebook LIVE setup</p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              Your website can display a public player and link viewers to each platform. It cannot grant TikTok LIVE eligibility,
              start a broadcast, or receive TikTok stream keys. Those controls remain inside TikTok LIVE Studio and Facebook Live Producer.
            </p>
          </div>

          <ol className="font-body text-xs text-muted-foreground leading-relaxed list-decimal pl-5 space-y-1.5">
            <li>Open TikTok LIVE Studio on the Windows computer and select a portrait scene.</li>
            <li>Add Camera, Window Capture or Full Screen Capture, then enable microphone and system audio in the mixer.</li>
            <li>Open Facebook Live Producer in a separate browser tab and choose Screen Share, or connect approved streaming software.</li>
            <li>Use headphones, test both audio meters, and keep the music below the microphone.</li>
            <li>Paste only the public player URL above. Save as Scheduled first. Change the status to Live only when the broadcast has started.</li>
          </ol>

          <div className="flex flex-wrap gap-2">
            <a href="https://www.tiktok.com/studio/download?download_source=creator_hub" target="_blank" rel="noopener noreferrer">
              <Button type="button" size="sm" variant="outline" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> TikTok LIVE Studio
              </Button>
            </a>
            <a href="https://www.facebook.com/live/producer" target="_blank" rel="noopener noreferrer">
              <Button type="button" size="sm" variant="outline" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Facebook Live Producer
              </Button>
            </a>
            <a href="/live" target="_blank" rel="noopener noreferrer">
              <Button type="button" size="sm" variant="outline" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Preview public LIVE page
              </Button>
            </a>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="font-body text-xs text-amber-300 font-semibold">Music rights check</p>
            <p className="font-body text-[11px] text-muted-foreground mt-1 leading-relaxed">
              A distributor fingerprint can mute your own recording even when you own it. Test privately where the platform allows,
              keep proof of ownership available, and do not paste stream keys or account dashboard links into this page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
