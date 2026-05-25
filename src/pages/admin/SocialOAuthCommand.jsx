import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, Shield, Copy, Zap } from 'lucide-react';

const OAUTH_PLATFORMS = [
  {
    name: 'TikTok',
    icon: '🎵',
    status: 'built_needs_live_test',
    authType: 'OAuth 2.0 (PKCE)',
    redirectUri: 'https://gannonwaye.com/tiktok-callback',
    scopes: ['user.info.basic', 'video.upload'],
    tokenStorage: 'KnowledgeVault (server-side only)',
    secretsRequired: ['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET'],
    secretsSet: [true, true],
    flow: 'Admin clicks Connect → popup opens TikTok → creator authorises → code sent to /tiktok-callback → backend exchanges code → token stored in KnowledgeVault',
    testUrl: 'https://gannonwaye.com/admin/tiktok-platform-review',
    blockers: ['Must be live-tested on gannonwaye.com (not Base44 preview)', 'Client secret may need rotation', 'Developer review pending'],
    canAgentPrepare: true,
    agentCannotDo: 'Complete real OAuth (Gannon must click Connect in browser)',
  },
  {
    name: 'Instagram / Meta',
    icon: '📸',
    status: 'not_built',
    authType: 'OAuth 2.0 (Meta)',
    redirectUri: 'https://gannonwaye.com/meta-callback (not yet built)',
    scopes: ['instagram_basic', 'pages_show_list', 'instagram_content_publish'],
    tokenStorage: 'Not yet built',
    secretsRequired: ['META_APP_ID', 'META_APP_SECRET'],
    secretsSet: [false, false],
    flow: 'Create Meta app → add Instagram product → configure OAuth redirect → build /meta-callback route → store token server-side',
    testUrl: 'https://developers.facebook.com/apps/',
    blockers: ['Meta developer app not created', 'Redirect URI not built', 'Instagram Professional account must be linked to a Facebook Page', 'Meta app review required for each permission beyond basic'],
    canAgentPrepare: true,
    agentCannotDo: 'Create Meta developer app, complete OAuth, or submit Meta review',
  },
  {
    name: 'YouTube / Google',
    icon: '▶️',
    status: 'partial_via_connector',
    authType: 'OAuth 2.0 (Google)',
    redirectUri: 'Managed by Base44 Google connector',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    tokenStorage: 'Base44 connector token store',
    secretsRequired: ['Google OAuth connector (authorized)'],
    secretsSet: [true],
    flow: 'Google OAuth connector already authorized → add YouTube API scope → enable YouTube Data API v3 in Google Cloud → build backend function using getConnection("googlecalendar" pattern)',
    testUrl: 'https://console.cloud.google.com/',
    blockers: ['YouTube Data API not enabled in Google Cloud', 'youtube.readonly scope not added to connector', 'No YouTube backend function built yet'],
    canAgentPrepare: true,
    agentCannotDo: 'Enable YouTube API in Google Cloud Console (Gannon must do this)',
  },
  {
    name: 'X / Twitter',
    icon: '𝕏',
    status: 'not_built',
    authType: 'OAuth 2.0 (PKCE)',
    redirectUri: 'https://gannonwaye.com/x-callback (not yet built)',
    scopes: ['tweet.read', 'users.read'],
    tokenStorage: 'Not yet built',
    secretsRequired: ['X_CLIENT_ID', 'X_CLIENT_SECRET'],
    secretsSet: [false, false],
    flow: 'Create X developer app → enable OAuth 2.0 → build /x-callback route → store token server-side → build read-only feed viewer',
    testUrl: 'https://developer.x.com/',
    blockers: ['X developer app not created', 'No backend function', 'No callback route'],
    canAgentPrepare: true,
    agentCannotDo: 'Create X developer account or app (Gannon must do this)',
  },
  {
    name: 'Pinterest',
    icon: '📌',
    status: 'not_built',
    authType: 'OAuth 2.0',
    redirectUri: 'https://gannonwaye.com/pinterest-callback (not yet built)',
    scopes: ['boards:read', 'pins:read'],
    tokenStorage: 'Not yet built',
    secretsRequired: ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET'],
    secretsSet: [false, false],
    flow: 'Create Pinterest developer app → sandbox test → build /pinterest-callback → store token → build board/pin viewer',
    testUrl: 'https://developers.pinterest.com/',
    blockers: ['Pinterest developer app not created', 'No backend function or callback route'],
    canAgentPrepare: true,
    agentCannotDo: 'Create Pinterest developer app or complete OAuth',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    status: 'not_built',
    authType: 'OAuth 2.0',
    redirectUri: 'https://gannonwaye.com/linkedin-callback (not yet built)',
    scopes: ['r_liteprofile', 'w_member_social'],
    tokenStorage: 'Not yet built',
    secretsRequired: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'],
    secretsSet: [false, false],
    flow: 'Create LinkedIn developer app → configure OAuth → build /linkedin-callback → build approval-gated post composer',
    testUrl: 'https://developer.linkedin.com/',
    blockers: ['LinkedIn developer app not created'],
    canAgentPrepare: true,
    agentCannotDo: 'Create LinkedIn app or complete OAuth (Gannon must do this)',
  },
  {
    name: 'SoundCloud',
    icon: '☁️',
    status: 'not_built',
    authType: 'OAuth 2.0',
    redirectUri: 'https://gannonwaye.com/soundcloud-callback (not yet built)',
    scopes: ['non-expiring'],
    tokenStorage: 'Not yet built',
    secretsRequired: ['SOUNDCLOUD_CLIENT_ID', 'SOUNDCLOUD_CLIENT_SECRET'],
    secretsSet: [false, false],
    flow: 'Register SoundCloud app → OAuth → fetch track list → admin UI',
    testUrl: 'https://developers.soundcloud.com/',
    blockers: ['SoundCloud developer app not registered'],
    canAgentPrepare: true,
    agentCannotDo: 'Register SoundCloud app or complete OAuth',
  },
  {
    name: 'Spotify for Artists',
    icon: '🎧',
    status: 'manual_only',
    authType: 'N/A (no public API)',
    redirectUri: 'N/A',
    scopes: [],
    tokenStorage: 'N/A',
    secretsRequired: [],
    secretsSet: [],
    flow: 'Manual login to Spotify for Artists → export data → paste into admin',
    testUrl: 'https://artists.spotify.com/',
    blockers: ['Spotify for Artists has no public API for automated data access'],
    canAgentPrepare: false,
    agentCannotDo: 'Access Spotify for Artists data automatically (no public API exists)',
  },
  {
    name: 'Apple Music for Artists',
    icon: '🍎',
    status: 'manual_only',
    authType: 'N/A (no public API)',
    redirectUri: 'N/A',
    scopes: [],
    tokenStorage: 'N/A',
    secretsRequired: [],
    secretsSet: [],
    flow: 'Manual login to Apple Music for Artists → export analytics → paste into admin',
    testUrl: 'https://artists.apple.com/',
    blockers: ['Apple Music for Artists has no public API for automated analytics'],
    canAgentPrepare: false,
    agentCannotDo: 'Access Apple Music for Artists data automatically (no public API exists)',
  },
];

const statusColors = {
  built_needs_live_test: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  not_built: 'bg-red-500/20 text-red-300 border-red-500/30',
  partial_via_connector: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  manual_only: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  connected: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const statusLabels = {
  built_needs_live_test: 'Built — Needs Live Test',
  not_built: 'Not Built',
  partial_via_connector: 'Partial (Base44 Connector)',
  manual_only: 'Manual Only',
  connected: 'Connected',
};

export default function SocialOAuthCommand() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(OAUTH_PLATFORMS[0]);

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); };

  const createAlert = useMutation({
    mutationFn: (p) => base44.entities.AdminNotification.create({
      notification_type: 'system',
      severity: p.status === 'not_built' ? 'warning' : 'info',
      title: `OAuth not complete: ${p.name}`,
      summary: `Blockers: ${p.blockers.join('; ')}`,
      source: 'SocialOAuthCommand',
      requires_action: true,
      linked_route: '/admin/social-oauth-command',
    }),
    onSuccess: () => toast({ title: 'Alert sent to Business Attention Centre' }),
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/social-platform-parity"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Social OAuth Command</h1>
            <p className="text-sm text-muted-foreground mt-1">Every OAuth flow, token, redirect URI, and secret for all social platforms — in one place.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Live/Partial', OAUTH_PLATFORMS.filter(p => ['built_needs_live_test', 'partial_via_connector', 'connected'].includes(p.status)).length, 'text-yellow-400'],
          ['Not Built', OAUTH_PLATFORMS.filter(p => p.status === 'not_built').length, 'text-red-400'],
          ['Manual Only', OAUTH_PLATFORMS.filter(p => p.status === 'manual_only').length, 'text-blue-400'],
          ['Secrets Set', OAUTH_PLATFORMS.filter(p => p.secretsSet.every(Boolean)).length, 'text-green-400'],
        ].map(([label, count, color]) => (
          <Card key={label}><CardContent className="p-4">
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {OAUTH_PLATFORMS.map(p => (
            <Card key={p.name} className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.name === p.name ? 'border-primary/60' : ''}`} onClick={() => setSelected(p)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <p className="font-semibold text-sm">{p.name}</p>
                  </div>
                  <Badge className={statusColors[p.status] || 'bg-secondary text-muted-foreground border-border'} style={{fontSize: '10px'}}>
                    {statusLabels[p.status] || p.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selected && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">{selected.icon} {selected.name} — OAuth Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Auth Type</p><p>{selected.authType}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><Badge className={statusColors[selected.status] || 'bg-secondary text-muted-foreground border-border'}>{statusLabels[selected.status]}</Badge></div>
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground">Redirect URI</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-xs bg-secondary rounded px-2 py-1 flex-1">{selected.redirectUri}</code>
                    {selected.redirectUri !== 'N/A' && selected.redirectUri !== 'Managed by Base44 Google connector' && (
                      <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => copy(selected.redirectUri)}><Copy className="w-3 h-3" /></Button>
                    )}
                  </div>
                </div>
              </div>

              {selected.scopes.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Required Scopes</p>
                  <div className="flex flex-wrap gap-1">{selected.scopes.map(s => <Badge key={s} variant="outline" className="text-xs font-mono">{s}</Badge>)}</div>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">Token Storage</p>
                <p>{selected.tokenStorage}</p>
              </div>

              {selected.secretsRequired.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Secrets Required</p>
                  <div className="space-y-1">
                    {selected.secretsRequired.map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        {selected.secretsSet[i] ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <AlertTriangle className="w-3 h-3 text-red-400" />}
                        <Badge variant="outline" className="text-xs font-mono">{s}</Badge>
                        <span className="text-xs text-muted-foreground">{selected.secretsSet[i] ? 'Set ✓' : 'NOT SET'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">OAuth Flow</p>
                <p className="text-xs bg-secondary/50 rounded p-2">{selected.flow}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-400" /> Blockers</p>
                <ul className="space-y-0.5">{selected.blockers.map((b, i) => <li key={i} className="text-xs text-red-300/80">• {b}</li>)}</ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 text-green-400">Agent can prepare</p>
                  <p className="text-xs">{selected.canAgentPrepare ? 'Yes — setup guide, backend function structure, redirect URI, scope list' : 'No'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 text-red-400">Agent cannot do</p>
                  <p className="text-xs">{selected.agentCannotDo}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a href={selected.testUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />{selected.status === 'manual_only' ? 'Open Dashboard' : 'Developer Portal'}</Button>
                </a>
                <Button variant="outline" size="sm" onClick={() => createAlert.mutate(selected)}><Zap className="w-3 h-3 mr-1" />Create Blocker Alert</Button>
                <Button variant="outline" size="sm" onClick={() => copy(`${selected.name} OAuth\nStatus: ${statusLabels[selected.status]}\nRedirect: ${selected.redirectUri}\nScopes: ${selected.scopes.join(', ')}\nBlockers:\n${selected.blockers.map(b => '• ' + b).join('\n')}`)}>
                  <Copy className="w-3 h-3 mr-1" />Copy OAuth Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}