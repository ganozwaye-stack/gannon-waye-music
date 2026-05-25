import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, BarChart3, AlertTriangle, ExternalLink, Zap, TrendingUp, Eye } from 'lucide-react';

const ANALYTICS_PLATFORMS = [
  {
    name: 'TikTok',
    icon: '🎵',
    analyticsStatus: 'not_available_yet',
    apiSupport: 'user.info.stats scope not requested (deliberately excluded)',
    metrics: ['Views', 'Likes', 'Comments', 'Shares', 'Followers gained', 'Profile views'],
    howToGet: 'Request user.info.stats scope AFTER TikTok developer review passes for current scopes. Only add after it can be demonstrated.',
    manualAlternative: 'Check TikTok Creator Centre dashboard manually',
    agentRole: 'Can interpret exported data and generate insights report. Cannot access analytics API until scope is approved.',
    nextAction: 'Wait for TikTok developer review approval. Do not add user.info.stats now.',
    dashboardUrl: 'https://www.tiktok.com/creator-centre/analytics',
    risk: 'Adding stats scope before review could slow TikTok approval.',
  },
  {
    name: 'Instagram',
    icon: '📸',
    analyticsStatus: 'not_built',
    apiSupport: 'instagram_manage_insights scope (requires Meta app review)',
    metrics: ['Reach', 'Impressions', 'Engagement rate', 'Follower demographics', 'Story views', 'Reel plays'],
    howToGet: 'Complete Meta developer app setup → connect Instagram Professional → request instagram_manage_insights after base permissions are approved',
    manualAlternative: 'Check Instagram Insights in the app manually',
    agentRole: 'Can prepare analytics report template. Cannot access until Meta OAuth and insights permission are set up.',
    nextAction: 'Build Meta developer app first, then add insights scope after base review',
    dashboardUrl: 'https://www.instagram.com/',
    risk: 'Requesting insights before base permissions are reviewed may slow Meta approval.',
  },
  {
    name: 'Facebook',
    icon: '👥',
    analyticsStatus: 'not_built',
    apiSupport: 'pages_read_engagement, read_insights (requires Meta app review)',
    metrics: ['Page reach', 'Post engagement', 'Fan growth', 'Video views', 'Click-through rates'],
    howToGet: 'Meta developer app → Facebook Page → pages_read_engagement → read_insights',
    manualAlternative: 'Check Facebook Page Insights manually',
    agentRole: 'Can format Page insights report. Cannot access until Meta OAuth complete.',
    nextAction: 'Build Meta developer app (shared with Instagram)',
    dashboardUrl: 'https://www.facebook.com/',
    risk: 'Page insights require the page to be connected and permissions approved.',
  },
  {
    name: 'YouTube',
    icon: '▶️',
    analyticsStatus: 'planned_via_connector',
    apiSupport: 'YouTube Analytics API (separate from Data API)',
    metrics: ['Views', 'Watch time', 'Subscribers gained', 'Revenue (if monetized)', 'Traffic sources', 'Demographics'],
    howToGet: 'Enable YouTube Analytics API in Google Cloud → add analytics scope to Google connector → build backend function',
    manualAlternative: 'Check YouTube Studio analytics manually',
    agentRole: 'Can prepare analytics summary from fetched data. Cannot access until YouTube Analytics API is enabled.',
    nextAction: 'Enable YouTube Data API v3 first, then add Analytics API',
    dashboardUrl: 'https://studio.youtube.com/',
    risk: 'Analytics quota is separate from Data API quota.',
  },
  {
    name: 'Spotify for Artists',
    icon: '🎧',
    analyticsStatus: 'manual_export_only',
    apiSupport: 'No public API for Spotify for Artists analytics',
    metrics: ['Monthly listeners', 'Streams', 'Saves', 'Playlist adds', 'Listener cities', 'Audience age/gender'],
    howToGet: 'Log into Spotify for Artists → export CSV → paste data into admin KnowledgeVault or tracking sheet',
    manualAlternative: 'Spotify for Artists dashboard at artists.spotify.com',
    agentRole: 'Can interpret exported CSV data and generate performance report. Cannot access automatically.',
    nextAction: 'After release goes live: export monthly listener data and record in admin',
    dashboardUrl: 'https://artists.spotify.com/',
    risk: 'No automation possible — Spotify for Artists analytics are dashboard-only.',
  },
  {
    name: 'Apple Music for Artists',
    icon: '🍎',
    analyticsStatus: 'manual_export_only',
    apiSupport: 'No public API for Apple Music for Artists analytics',
    metrics: ['Plays', 'Listeners', 'Shazams', 'Streams by country', 'Song purchases'],
    howToGet: 'Log into Apple Music for Artists → export data → paste into admin',
    manualAlternative: 'Apple Music for Artists dashboard at artists.apple.com',
    agentRole: 'Can format exported data into performance report.',
    nextAction: 'Claim artist profile, then export data monthly',
    dashboardUrl: 'https://artists.apple.com/',
    risk: 'Manual only. No automation API exists.',
  },
  {
    name: 'SoundCloud',
    icon: '☁️',
    analyticsStatus: 'not_built',
    apiSupport: 'SoundCloud API has basic stats endpoints',
    metrics: ['Plays', 'Downloads', 'Likes', 'Comments', 'Followers'],
    howToGet: 'Register SoundCloud developer app → OAuth → /me/tracks → stats per track',
    manualAlternative: 'SoundCloud creator dashboard',
    agentRole: 'Can display play/like counts if API is connected. Cannot access until app is registered.',
    nextAction: 'Register SoundCloud developer app',
    dashboardUrl: 'https://soundcloud.com/',
    risk: 'SoundCloud API rate limits may apply for higher volume requests.',
  },
  {
    name: 'PostHog (Website)',
    icon: '📊',
    analyticsStatus: 'configured',
    apiSupport: 'PostHog JS SDK integrated in app',
    metrics: ['Page views', 'Session counts', 'Button clicks', 'Checkout funnel', 'Drop-off points', 'Conversion rates'],
    howToGet: 'PostHog is already in the codebase. POSTHOG_API_KEY env var may need setting for server-side queries.',
    manualAlternative: 'PostHog cloud dashboard',
    agentRole: 'Analytics Agent can interpret PostHog events and generate funnel reports.',
    nextAction: 'Set POSTHOG_API_KEY secret to enable server-side PostHog queries',
    dashboardUrl: 'https://app.posthog.com/',
    risk: 'PostHog data should not include PII without consent.',
  },
];

const statusColor = {
  not_available_yet: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  not_built: 'bg-red-500/20 text-red-300 border-red-500/30',
  planned_via_connector: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  manual_export_only: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  configured: 'bg-green-500/20 text-green-300 border-green-500/30',
};
const statusLabel = {
  not_available_yet: 'Not Available Yet',
  not_built: 'Not Built',
  planned_via_connector: 'Planned via Connector',
  manual_export_only: 'Manual Export Only',
  configured: 'Configured',
};

export default function SocialAnalyticsCommand() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(ANALYTICS_PLATFORMS[0]);

  const createAlert = useMutation({
    mutationFn: (p) => base44.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: `${p.name} analytics: ${statusLabel[p.analyticsStatus]}`,
      summary: `Next action: ${p.nextAction}`,
      source: 'SocialAnalyticsCommand',
      requires_action: p.analyticsStatus === 'not_built',
      linked_route: '/admin/social-analytics-command',
    }),
    onSuccess: () => toast({ title: 'Alert created' }),
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/social-platform-parity"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Social Analytics Command</h1>
            <p className="text-sm text-muted-foreground mt-1">Analytics availability, API support, and agent roles — every platform tracked.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Configured', ANALYTICS_PLATFORMS.filter(p => p.analyticsStatus === 'configured').length, 'text-green-400'],
          ['Manual Export', ANALYTICS_PLATFORMS.filter(p => p.analyticsStatus === 'manual_export_only').length, 'text-blue-400'],
          ['Not Built', ANALYTICS_PLATFORMS.filter(p => p.analyticsStatus === 'not_built').length, 'text-red-400'],
          ['Planned', ANALYTICS_PLATFORMS.filter(p => ['planned_via_connector', 'not_available_yet'].includes(p.analyticsStatus)).length, 'text-yellow-400'],
        ].map(([label, count, color]) => (
          <Card key={label}><CardContent className="p-4">
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {ANALYTICS_PLATFORMS.map(p => (
            <Card key={p.name} className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.name === p.name ? 'border-primary/60' : ''}`} onClick={() => setSelected(p)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <p className="font-semibold text-sm">{p.name}</p>
                  </div>
                  <Badge className={statusColor[p.analyticsStatus] || 'bg-secondary text-muted-foreground border-border'} style={{fontSize: '10px'}}>
                    {statusLabel[p.analyticsStatus]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selected && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">{selected.icon} {selected.name} — Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div><p className="text-xs text-muted-foreground">API Support</p><p>{selected.apiSupport}</p></div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Available Metrics</p>
                <div className="flex flex-wrap gap-1">{selected.metrics.map(m => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}</div>
              </div>

              <div><p className="text-xs text-muted-foreground mb-1">How to access analytics</p><p className="text-xs bg-secondary/50 rounded p-2">{selected.howToGet}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Manual alternative</p><p className="text-xs">{selected.manualAlternative}</p></div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 text-primary">Agent role</p>
                <p className="text-xs">{selected.agentRole}</p>
              </div>

              {selected.risk && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-2 text-xs text-yellow-200">
                  <AlertTriangle className="w-3 h-3 inline mr-1" /> {selected.risk}
                </div>
              )}

              <div><p className="text-xs text-muted-foreground mb-1">Next action</p><p className="text-xs font-medium">{selected.nextAction}</p></div>

              <div className="flex flex-wrap gap-2">
                <a href={selected.dashboardUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Open Dashboard</Button>
                </a>
                <Button variant="outline" size="sm" onClick={() => createAlert.mutate(selected)}><Zap className="w-3 h-3 mr-1" />Create Alert</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}