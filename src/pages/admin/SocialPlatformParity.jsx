import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Clock, ExternalLink,
  WifiOff, Shield, Zap, Eye
} from 'lucide-react';

const PLATFORMS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    group: 'Video',
    connectionStatus: 'needs_live_test',
    oauthStatus: 'built_needs_live_test',
    devAppStatus: 'pending_review',
    postingAbility: 'draft_only',
    analyticsAbility: 'none',
    commentsAbility: 'none',
    webhookAbility: 'built_unused',
    reviewRequired: true,
    agentAssigned: 'Social Content Agent',
    credentials: ['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET'],
    scopes: ['user.info.basic', 'video.upload'],
    implemented: ['OAuth flow built', 'Callback route at /tiktok-callback', 'Draft upload via PULL_FROM_URL', 'Token stored server-side only', 'Approval-gated UI'],
    notImplemented: ['Live OAuth test on gannonwaye.com not confirmed', 'Developer review demo not submitted', 'analytics/insights', 'comments', 'webhooks active'],
    manualActions: ['Rotate client secret in TikTok Developer Portal', 'Update TIKTOK_CLIENT_SECRET env var', 'Confirm redirect URI: https://gannonwaye.com/tiktok-callback', 'Record demo video showing real OAuth + draft upload', 'Submit app for TikTok Developer Review'],
    nextAction: 'Live-test OAuth on gannonwaye.com, then submit developer review demo',
    route: '/admin/tiktok-platform-review',
    docsUrl: 'https://developers.tiktok.com/doc/overview/',
    lastTest: 'Not confirmed outside Base44 preview',
    sourceChain: 'TikTok Developer Portal → OAuth → /tiktok-callback → KnowledgeVault token → tiktokOAuth function → admin draft UI → Approval Queue → creator publishes in TikTok',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    group: 'Meta',
    connectionStatus: 'not_connected',
    oauthStatus: 'not_built',
    devAppStatus: 'not_created',
    postingAbility: 'none',
    analyticsAbility: 'none',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: true,
    agentAssigned: 'Social Content Agent',
    credentials: ['META_APP_ID', 'META_APP_SECRET'],
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list'],
    implemented: ['Platform card and readiness docs'],
    notImplemented: ['Meta developer app', 'OAuth flow', 'Instagram Graph API connection', 'Professional account link', 'Posting', 'Analytics', 'Comments/DMs'],
    manualActions: ['Create Meta developer app at developers.facebook.com', 'Connect Instagram Professional account to Facebook Page', 'Add redirect URI', 'Request minimum scopes', 'Submit app for Meta review'],
    nextAction: 'Create Meta developer app and connect Instagram Professional account',
    docsUrl: 'https://developers.facebook.com/products/instagram/apis/',
    lastTest: 'Never tested',
    sourceChain: 'Meta Developer App → Facebook Page → Instagram Professional Account → OAuth → Graph API → Approval Queue → creator approves → post',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    group: 'Meta',
    connectionStatus: 'not_connected',
    oauthStatus: 'not_built',
    devAppStatus: 'not_created',
    postingAbility: 'none',
    analyticsAbility: 'none',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: true,
    agentAssigned: 'Social Content Agent',
    credentials: ['META_APP_ID', 'META_APP_SECRET'],
    scopes: ['pages_read_engagement', 'pages_manage_posts'],
    implemented: ['Platform card and readiness docs'],
    notImplemented: ['Meta developer app', 'Page OAuth', 'Page post scheduling', 'Insights/analytics', 'Comments'],
    manualActions: ['Use same Meta app as Instagram', 'Connect Facebook Page', 'Request Pages permissions', 'Build approval-gated Page post composer', 'Submit for Meta review'],
    nextAction: 'Create Meta app (shared with Instagram)',
    docsUrl: 'https://developers.facebook.com/docs/pages-api/',
    lastTest: 'Never tested',
    sourceChain: 'Meta App → Facebook Page OAuth → Approval Queue → post/schedule',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    group: 'Video',
    connectionStatus: 'partial',
    oauthStatus: 'google_connector_authorized',
    devAppStatus: 'google_cloud_needed',
    postingAbility: 'none',
    analyticsAbility: 'read_only_pending',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: false,
    agentAssigned: 'Social Content Agent',
    credentials: ['GOOGLE_OAUTH (via connector)'],
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    implemented: ['Google OAuth connector authorized', 'Google Calendar and Drive connected'],
    notImplemented: ['YouTube Data API enabled', 'Channel video list', 'Upload workflow', 'Analytics fetch', 'Comments'],
    manualActions: ['Enable YouTube Data API in Google Cloud Console', 'Add youtube.readonly scope to OAuth connector', 'Test channel video list fetch', 'Build video list UI in admin'],
    nextAction: 'Enable YouTube Data API v3 in Google Cloud Console',
    docsUrl: 'https://developers.google.com/youtube/v3',
    lastTest: 'Never tested',
    sourceChain: 'Google Cloud → YouTube Data API → OAuth connector → backend function → admin UI',
  },
  {
    id: 'spotify',
    name: 'Spotify for Artists',
    icon: '🎧',
    group: 'Streaming',
    connectionStatus: 'manual_only',
    oauthStatus: 'no_public_api',
    devAppStatus: 'manual_only',
    postingAbility: 'none',
    analyticsAbility: 'manual_export',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: false,
    agentAssigned: 'Music Distribution Agent',
    credentials: [],
    scopes: [],
    implemented: ['Artist profile claim reminder', 'Manual dashboard link', 'Playlist pitching checklist in Sync Licensing Command'],
    notImplemented: ['Live API connection (Spotify for Artists has no public API)', 'Auto-analytics sync', 'Streaming data fetch'],
    manualActions: ['Log into Spotify for Artists dashboard', 'Export monthly listener/stream data', 'Paste stats into admin manually', 'Submit pitch via Spotify Playlist Pitching tool', 'Claim artist profile via distributor'],
    nextAction: 'Claim artist profile via Too Lost/TuneCore after release delivery',
    docsUrl: 'https://artists.spotify.com/',
    lastTest: 'Manual only — no API available',
    sourceChain: 'Spotify for Artists dashboard → manual export → admin KnowledgeVault → performance tracking',
  },
  {
    id: 'apple',
    name: 'Apple Music for Artists',
    icon: '🍎',
    group: 'Streaming',
    connectionStatus: 'manual_only',
    oauthStatus: 'no_public_api',
    devAppStatus: 'manual_only',
    postingAbility: 'none',
    analyticsAbility: 'manual_export',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: false,
    agentAssigned: 'Music Distribution Agent',
    credentials: [],
    scopes: [],
    implemented: ['Artist profile claim reminder', 'Manual dashboard link'],
    notImplemented: ['Live API (Apple Music for Artists has limited/no public API)', 'Streaming data auto-sync'],
    manualActions: ['Claim artist profile via Apple Music for Artists', 'Export plays/listeners data', 'Upload to admin manually', 'Set up Shazam artist profile'],
    nextAction: 'Claim profile after first release is live on Apple Music',
    docsUrl: 'https://artists.apple.com/',
    lastTest: 'Manual only — no API available',
    sourceChain: 'Apple Music for Artists → manual export → admin tracking',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: '☁️',
    group: 'Audio',
    connectionStatus: 'not_connected',
    oauthStatus: 'not_built',
    devAppStatus: 'not_created',
    postingAbility: 'none',
    analyticsAbility: 'none',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: false,
    agentAssigned: 'Music Distribution Agent',
    credentials: ['SOUNDCLOUD_CLIENT_ID', 'SOUNDCLOUD_CLIENT_SECRET'],
    scopes: ['non-expiring'],
    implemented: ['Platform card'],
    notImplemented: ['SoundCloud API connection', 'Track listing', 'Profile analytics'],
    manualActions: ['Create SoundCloud developer app', 'Request API access', 'Connect artist profile', 'Add track URLs to admin releases'],
    nextAction: 'Register SoundCloud developer app for basic track listing',
    docsUrl: 'https://developers.soundcloud.com/',
    lastTest: 'Never tested',
    sourceChain: 'SoundCloud API → track list → admin release links',
  },
  {
    id: 'bandcamp',
    name: 'Bandcamp',
    icon: '🎸',
    group: 'Audio',
    connectionStatus: 'manual_only',
    oauthStatus: 'no_public_api',
    devAppStatus: 'manual_only',
    postingAbility: 'none',
    analyticsAbility: 'manual_export',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: false,
    agentAssigned: 'Music Distribution Agent',
    credentials: [],
    scopes: [],
    implemented: ['Manual profile link in site'],
    notImplemented: ['Bandcamp API (no public automation API)', 'Sales sync', 'Fan data export'],
    manualActions: ['Manage Bandcamp store manually', 'Link Bandcamp profile from gannonwaye.com', 'Export sales data for manual reconciliation'],
    nextAction: 'Add Bandcamp profile URL to site settings',
    docsUrl: 'https://bandcamp.com/',
    lastTest: 'Manual only — no public API',
    sourceChain: 'Bandcamp artist page → manual link → gannonwaye.com',
  },
  {
    id: 'x',
    name: 'X / Twitter',
    icon: '𝕏',
    group: 'Text',
    connectionStatus: 'not_connected',
    oauthStatus: 'not_built',
    devAppStatus: 'not_created',
    postingAbility: 'none',
    analyticsAbility: 'none',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: false,
    agentAssigned: 'Social Content Agent',
    credentials: ['X_CLIENT_ID', 'X_CLIENT_SECRET'],
    scopes: ['tweet.read', 'users.read'],
    implemented: ['Platform card'],
    notImplemented: ['X developer app', 'OAuth 2.0 flow', 'Read/write integration'],
    manualActions: ['Create X developer app', 'Enable OAuth 2.0', 'Request read scopes first', 'Build approval-gated tweet composer before write scopes'],
    nextAction: 'Defer until Meta/TikTok are live',
    docsUrl: 'https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code',
    lastTest: 'Never tested',
    sourceChain: 'X Developer Portal → OAuth → read feed → Approval Queue → tweet composer',
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: '🧵',
    group: 'Text',
    connectionStatus: 'not_connected',
    oauthStatus: 'not_built',
    devAppStatus: 'not_created',
    postingAbility: 'none',
    analyticsAbility: 'none',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: true,
    agentAssigned: 'Social Content Agent',
    credentials: ['META_APP_ID', 'META_APP_SECRET'],
    scopes: ['threads_basic', 'threads_content_publish'],
    implemented: ['Platform card'],
    notImplemented: ['Threads API (uses same Meta app as Instagram)', 'OAuth', 'Post publishing'],
    manualActions: ['Use same Meta app after Instagram is connected', 'Add Threads scopes to Meta app', 'Build approval-gated Threads composer'],
    nextAction: 'Build after Instagram Meta app is created',
    docsUrl: 'https://developers.facebook.com/docs/threads',
    lastTest: 'Never tested',
    sourceChain: 'Meta App (shared) → Threads API → Approval Queue → post',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    group: 'Professional',
    connectionStatus: 'not_connected',
    oauthStatus: 'not_built',
    devAppStatus: 'not_created',
    postingAbility: 'none',
    analyticsAbility: 'none',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: true,
    agentAssigned: 'Social Content Agent',
    credentials: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'],
    scopes: ['r_liteprofile', 'w_member_social'],
    implemented: ['Platform card'],
    notImplemented: ['LinkedIn developer app', 'OAuth 2.0', 'Post publishing', 'Profile analytics'],
    manualActions: ['Create LinkedIn developer app', 'Request OpenID + post scopes', 'Build approval-gated LinkedIn composer'],
    nextAction: 'Defer until artist business use case for LinkedIn is clear',
    docsUrl: 'https://developer.linkedin.com/',
    lastTest: 'Never tested',
    sourceChain: 'LinkedIn Developer App → OAuth → post composer → Approval Queue',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    group: 'Visual',
    connectionStatus: 'not_connected',
    oauthStatus: 'not_built',
    devAppStatus: 'not_created',
    postingAbility: 'none',
    analyticsAbility: 'none',
    commentsAbility: 'none',
    webhookAbility: 'none',
    reviewRequired: true,
    agentAssigned: 'Social Content Agent',
    credentials: ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET'],
    scopes: ['boards:read', 'pins:read'],
    implemented: ['Platform card'],
    notImplemented: ['Pinterest developer app', 'OAuth', 'Board/pin read', 'Pin creation'],
    manualActions: ['Create Pinterest developer app', 'Use sandbox for testing', 'Build approval-gated pin composer', 'Submit for Pinterest review'],
    nextAction: 'Defer until release artwork pin strategy is defined',
    docsUrl: 'https://developers.pinterest.com/',
    lastTest: 'Never tested',
    sourceChain: 'Pinterest Developer App → OAuth → board/pin read → Approval Queue → publish',
  },
];

const statusColor = {
  needs_live_test: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  not_connected: 'bg-red-500/20 text-red-300 border-red-500/30',
  partial: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  manual_only: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  connected: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const statusLabel = {
  needs_live_test: 'Needs Live Test',
  not_connected: 'Not Connected',
  partial: 'Partial',
  manual_only: 'Manual Only',
  connected: 'Connected',
};

export default function SocialPlatformParity() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(PLATFORMS[0]);
  const [groupFilter, setGroupFilter] = useState('All');

  const groups = ['All', ...Array.from(new Set(PLATFORMS.map(p => p.group)))];
  const filtered = groupFilter === 'All' ? PLATFORMS : PLATFORMS.filter(p => p.group === groupFilter);

  const createAlert = useMutation({
    mutationFn: (platform) => base44.entities.AdminNotification.create({
      notification_type: 'system',
      severity: platform.connectionStatus === 'not_connected' ? 'warning' : 'info',
      title: `${platform.name}: ${platform.nextAction}`,
      summary: `Platform parity check: ${platform.connectionStatus}. Agent: ${platform.agentAssigned}`,
      source: 'SocialPlatformParity',
      requires_action: true,
      linked_route: '/admin/social-platform-parity',
    }),
    onSuccess: () => toast({ title: 'Alert created in Business Attention Centre' }),
  });

  const createHealth = useMutation({
    mutationFn: (platform) => base44.entities.SystemHealthIssue.create({
      system_area: 'integrations',
      issue_title: `${platform.name} not connected`,
      severity: platform.reviewRequired ? 'warning' : 'info',
      detected_by: 'SocialPlatformParity',
      recommended_fix: platform.nextAction,
      status: 'open',
      requires_approval: platform.reviewRequired,
      risk_type: 'public_content',
      last_checked: new Date().toISOString(),
    }),
    onSuccess: () => toast({ title: 'System Health issue created' }),
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Social Platform Parity Engine</h1>
            <p className="text-sm text-muted-foreground mt-1">Every social platform audited to TikTok-standard readiness. {PLATFORMS.length} platforms tracked.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/social-oauth-command"><Button variant="outline" size="sm">OAuth Command</Button></Link>
          <Link to="/admin/social-review-readiness"><Button variant="outline" size="sm">Review Readiness</Button></Link>
          <Link to="/admin/social-analytics-command"><Button variant="outline" size="sm">Analytics</Button></Link>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Connected', PLATFORMS.filter(p => p.connectionStatus === 'connected').length, 'text-green-400', CheckCircle2],
          ['Needs Live Test', PLATFORMS.filter(p => p.connectionStatus === 'needs_live_test').length, 'text-orange-400', AlertTriangle],
          ['Not Connected', PLATFORMS.filter(p => p.connectionStatus === 'not_connected').length, 'text-red-400', WifiOff],
          ['Manual Only', PLATFORMS.filter(p => p.connectionStatus === 'manual_only').length, 'text-blue-400', Eye],
        ].map(([label, count, color]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold mt-2 ${color}`}>{count}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TikTok live test warning */}
      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-300 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-orange-200">TikTok live validation required</p>
            <p className="text-orange-100/80 mt-1">TikTok OAuth and draft upload must be tested on gannonwaye.com, not Base44 preview. Until confirmed live, TikTok status remains "Needs Live Test".</p>
            <div className="flex gap-2 mt-2">
              <Link to="/admin/tiktok-platform-review"><Button size="sm" className="gradient-gold-button">Open TikTok Review</Button></Link>
              <Link to="/admin/tiktok-recording-studio"><Button variant="outline" size="sm">Recording Studio</Button></Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {groups.map(g => (
          <Button key={g} size="sm" variant={groupFilter === g ? 'default' : 'outline'} onClick={() => setGroupFilter(g)}>{g}</Button>
        ))}
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {filtered.map(p => (
            <Card key={p.id} className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.id === p.id ? 'border-primary/60' : ''}`} onClick={() => setSelected(p)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.icon}</span>
                    <p className="font-semibold text-sm">{p.name}</p>
                  </div>
                  <Badge className={statusColor[p.connectionStatus] || 'bg-secondary text-muted-foreground border-border'}>
                    {statusLabel[p.connectionStatus] || p.connectionStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.nextAction}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selected && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl">{selected.icon}</span> {selected.name}
                </CardTitle>
                <Badge className={statusColor[selected.connectionStatus] || 'bg-secondary text-muted-foreground border-border'}>
                  {statusLabel[selected.connectionStatus]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {/* Capability grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  ['Posting', selected.postingAbility !== 'none', selected.postingAbility],
                  ['Analytics', selected.analyticsAbility !== 'none', selected.analyticsAbility],
                  ['Comments', selected.commentsAbility !== 'none', selected.commentsAbility],
                  ['Webhooks', selected.webhookAbility !== 'none', selected.webhookAbility],
                ].map(([label, enabled, detail]) => (
                  <div key={label} className={`rounded-lg p-2 text-center border ${enabled ? 'border-green-500/30 bg-green-500/10' : 'border-border bg-secondary/30'}`}>
                    {enabled ? <CheckCircle2 className="w-3 h-3 text-green-400 mx-auto mb-1" /> : <WifiOff className="w-3 h-3 text-muted-foreground mx-auto mb-1" />}
                    <p className="text-xs font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground truncate">{detail === 'none' ? 'Not available' : detail}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">OAuth Status</p>
                  <p className="font-medium">{selected.oauthStatus.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Developer App</p>
                  <p className="font-medium">{selected.devAppStatus.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Review Required</p>
                  <p className="font-medium">{selected.reviewRequired ? 'Yes — external app review needed' : 'No'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Agent Assigned</p>
                  <p className="font-medium">{selected.agentAssigned}</p>
                </div>
              </div>

              {selected.credentials.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Credentials Required</p>
                  <div className="flex flex-wrap gap-1">{selected.credentials.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                </div>
              )}

              {selected.scopes.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Required Scopes</p>
                  <div className="flex flex-wrap gap-1">{selected.scopes.map(s => <Badge key={s} variant="outline" className="text-xs font-mono">{s}</Badge>)}</div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Implemented</p>
                  <ul className="space-y-0.5">{selected.implemented.map(i => <li key={i} className="text-xs text-green-300/80">• {i}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-400" /> Not Yet Implemented</p>
                  <ul className="space-y-0.5">{selected.notImplemented.map(i => <li key={i} className="text-xs text-yellow-300/80">• {i}</li>)}</ul>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Manual Actions Required</p>
                <ul className="space-y-1">{selected.manualActions.map((a, idx) => <li key={idx} className="text-xs flex items-start gap-1.5"><span className="text-primary font-bold">{idx + 1}.</span> {a}</li>)}</ul>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Test Result</p>
                <p className="text-xs">{selected.lastTest}</p>
              </div>

              <div className="rounded-lg border border-border/50 p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Source Chain</p>
                <p>{selected.sourceChain}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.route && <Link to={selected.route}><Button variant="outline" size="sm">Open App Page</Button></Link>}
                {selected.docsUrl && <a href={selected.docsUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Docs</Button></a>}
                <Button variant="outline" size="sm" onClick={() => createAlert.mutate(selected)}><Zap className="w-3 h-3 mr-1" />Create Alert</Button>
                <Button variant="outline" size="sm" onClick={() => createHealth.mutate(selected)}><Shield className="w-3 h-3 mr-1" />System Health</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}