import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Radio, Save, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ALLOWED_EMBED_HOSTS = ['youtube.com', 'youtu.be', 'vimeo.com', 'streamyard.com', 'restream.io'];

function isSafeEmbedUrl(url) {
  if (!url) return true; // empty is ok
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    return ALLOWED_EMBED_HOSTS.some(h => u.hostname === h || u.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

const STATUS_OPTIONS = [
  { value: 'offline', label: 'Offline', color: 'bg-secondary text-muted-foreground' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'live', label: 'Live 🔴', color: 'bg-red-500/20 text-red-400' },
  { value: 'ended', label: 'Ended', color: 'bg-secondary text-muted-foreground' },
];

export default function LivestreamCommand() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: settingsArr, isLoading } = useQuery({
    queryKey: ['site-settings-livestream'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const settings = settingsArr?.[0];

  const [form, setForm] = useState(null);

  // Initialize form when settings load
  useEffect(() => {
    if (settings && !form) {
      setForm({
        live_stream_enabled: settings.live_stream_enabled || false,
        live_stream_status: settings.live_stream_status || 'offline',
        live_stream_provider: settings.live_stream_provider || '',
        live_stream_title: settings.live_stream_title || '',
        live_stream_scheduled_at: settings.live_stream_scheduled_at || '',
        live_stream_embed_url: settings.live_stream_embed_url || '',
        live_stream_chat_url: settings.live_stream_chat_url || '',
        live_stream_tiktok_url: settings.live_stream_tiktok_url || '',
        live_stream_instagram_url: settings.live_stream_instagram_url || '',
      });
    }
  }, [settings, form]);

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
  });

  const handleSave = () => {
    if (form?.live_stream_embed_url && !isSafeEmbedUrl(form.live_stream_embed_url)) {
      toast({ title: 'Invalid embed URL — must be HTTPS from YouTube, Vimeo, or StreamYard', variant: 'destructive' });
      return;
    }
    if (form?.live_stream_chat_url && !isSafeEmbedUrl(form.live_stream_chat_url)) {
      toast({ title: 'Invalid chat URL — must be HTTPS from an allowed provider', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(form);
  };

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  if (isLoading || !form) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  const embedUrlValid = !form.live_stream_embed_url || isSafeEmbedUrl(form.live_stream_embed_url);
  const chatUrlValid = !form.live_stream_chat_url || isSafeEmbedUrl(form.live_stream_chat_url);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Admin</p>
        <h1 className="font-display text-3xl gradient-gold-text">Livestream Command</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Control the public /live page — embed URL must be public HTTPS only</p>
      </div>

      {/* Security banner */}
      <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="font-body text-sm text-amber-400">
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
                placeholder="YouTube, Vimeo, StreamYard…"
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
                YouTube: Share → Embed → copy src="…" URL only
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
                placeholder="https://www.tiktok.com/@gannonwaye/live"
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              />
            </div>

            <div>
              <label className="font-body text-xs text-muted-foreground block mb-1">Instagram Live Stream URL (optional)</label>
              <input
                type="url"
                value={form.live_stream_instagram_url || ''}
                onChange={e => update('live_stream_instagram_url', e.target.value)}
                placeholder="https://www.instagram.com/ganozwaye/live"
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
        onClick={handleSave}
        disabled={saveMutation.isPending || !embedUrlValid || !chatUrlValid}
        className="gradient-gold-button border-0 gap-2"
      >
        <Save className="w-4 h-4" />
        {saveMutation.isPending ? 'Saving…' : 'Save Livestream Settings'}
      </Button>

      {/* TikTok manual action notice */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-4 pb-4">
          <p className="font-body text-sm text-amber-400 font-semibold mb-1">⚠ TikTok Live — Manual Action Required</p>
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            TikTok Live streaming cannot be configured by agents. Gannon must go live directly from the TikTok app.
            To embed a TikTok live stream here, copy the YouTube/Restream re-broadcast URL if you are simulcasting.
            Agents cannot control TikTok OAuth pages or TikTok Live sessions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}