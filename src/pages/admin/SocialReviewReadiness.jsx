import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, AlertTriangle, ExternalLink, Camera, Shield, Zap } from 'lucide-react';

const REVIEW_PLATFORMS = [
  {
    name: 'TikTok',
    icon: '🎵',
    reviewType: 'TikTok Developer Review',
    reviewStatus: 'not_submitted',
    reviewUrl: 'https://developers.tiktok.com/',
    readiness: 35,
    blockers: [
      'Live OAuth test on gannonwaye.com not confirmed',
      'Client secret not rotated',
      'Demo video not recorded',
      'App description may reference disallowed features',
      'Redirect URI must match exactly: https://gannonwaye.com/tiktok-callback',
    ],
    requiredDemos: [
      'Real TikTok OAuth flow starting from gannonwaye.com',
      'TikTok OAuth returns to gannonwaye.com/tiktok-callback',
      'Connected account status shown (no token visible)',
      'Draft upload using video.upload API',
      '"Draft uploaded / Awaiting creator review" confirmation',
      'Admin dashboard approval gate visible',
      'Nothing auto-posts publicly',
      'Creator must publish manually from TikTok Drafts',
    ],
    doNotShow: ['Base44 editor', 'Codex chat', 'Client secret or API keys', 'Customer data', 'ChatGPT or AI chat', 'Payment data'],
    appDescription: 'Official Gannon Waye creator workflow tool. The system enables the authorised creator to connect their TikTok account via Login Kit, prepare video drafts in a private admin dashboard, and upload drafts via the Content Posting API for personal review and manual publishing. No auto-publishing. No third-party account management.',
    safeScopes: ['user.info.basic', 'video.upload'],
    removeScopes: ['video.list', 'video.publish', 'user.info.stats', 'Share Kit', 'Webhooks'],
    agentCanPrepare: 'Setup checklist, recording script, app description draft, scope review',
    agentCannotDo: 'Submit developer review (Gannon must do this in TikTok Developer Portal)',
    route: '/admin/tiktok-review',
    studioRoute: '/admin/tiktok-recording-studio',
  },
  {
    name: 'Instagram / Meta',
    icon: '📸',
    reviewType: 'Meta App Review',
    reviewStatus: 'not_started',
    reviewUrl: 'https://developers.facebook.com/apps/',
    readiness: 0,
    blockers: [
      'Meta developer app not created',
      'Instagram Professional account not linked to Facebook Page',
      'No OAuth flow built',
      'No screen recording possible until flow exists',
      'Each permission must be demonstrated in a recording',
    ],
    requiredDemos: [
      'Login with Instagram Professional account',
      'App requesting only the scopes listed in Meta review',
      'Each permission being used visibly in the app UI',
      'No auto-posting or automated engagement shown',
    ],
    doNotShow: ['Any user\'s private messages', 'Auto-posting flows', 'Bulk posting', 'Third-party accounts'],
    appDescription: 'Official Gannon Waye Music creator tool for the authorised Instagram Professional account. Connects for profile insights, media listing, and draft/manual publishing workflow. No automated posting, no third-party account management, no bulk operations.',
    safeScopes: ['instagram_basic', 'pages_show_list'],
    removeScopes: ['messaging scopes', 'ads management', 'business management until needed'],
    agentCanPrepare: 'Setup guide, app description draft, permission justifications',
    agentCannotDo: 'Create Meta app, complete OAuth, submit Meta review',
    route: '/admin/social-distribution-readiness',
  },
  {
    name: 'Facebook / Meta',
    icon: '👥',
    reviewType: 'Meta App Review (same app as Instagram)',
    reviewStatus: 'not_started',
    reviewUrl: 'https://developers.facebook.com/',
    readiness: 0,
    blockers: [
      'Meta developer app not created',
      'Facebook Page not connected',
      'Pages permissions not requested',
      'No demo recording possible',
    ],
    requiredDemos: [
      'Facebook Page management in app UI',
      'Post composer with approval gate',
      'Page insights view',
    ],
    doNotShow: ['Ads management', 'Auto-posting', 'Third-party Page management'],
    appDescription: 'Official Gannon Waye Music creator tool for the authorised Facebook Page. Connects for Page insights and approval-gated post scheduling. No automated posting, no ads, no third-party management.',
    safeScopes: ['pages_read_engagement', 'pages_show_list'],
    removeScopes: ['ads scopes', 'business management', 'pages_manage_ads'],
    agentCanPrepare: 'Permission justifications, UI wireframe for Pages composer',
    agentCannotDo: 'Create Meta app or submit review',
    route: '/admin/social-distribution-readiness',
  },
  {
    name: 'YouTube',
    icon: '▶️',
    reviewType: 'No external review required (Google OAuth)',
    reviewStatus: 'not_applicable',
    reviewUrl: 'https://console.cloud.google.com/',
    readiness: 20,
    blockers: [
      'YouTube Data API not enabled in Google Cloud',
      'youtube.readonly scope not in connector',
      'No YouTube backend function built',
    ],
    requiredDemos: [
      'Channel video list displayed in admin',
      'Secure Google OAuth flow via connector',
    ],
    doNotShow: ['Upload flow until it is fully built and approval-gated'],
    appDescription: 'N/A — YouTube requires no external app review for read scopes.',
    safeScopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    removeScopes: ['https://www.googleapis.com/auth/youtube (upload) until upload flow is built'],
    agentCanPrepare: 'Backend function structure using Google connector',
    agentCannotDo: 'Enable YouTube API in Google Cloud Console',
    route: null,
  },
  {
    name: 'Pinterest',
    icon: '📌',
    reviewType: 'Pinterest Developer Review',
    reviewStatus: 'not_started',
    reviewUrl: 'https://developers.pinterest.com/',
    readiness: 0,
    blockers: ['No Pinterest developer app', 'No OAuth flow', 'No UI to demo'],
    requiredDemos: ['Board/pin read from authorised Pinterest account', 'Pin composer with approval gate'],
    doNotShow: ['Ads', 'Third-party account management'],
    appDescription: 'Official Gannon Waye Music creator tool for the authorised Pinterest account. Creates pins for release artwork, merch, and music content. No automated bulk posting.',
    safeScopes: ['boards:read', 'pins:read'],
    removeScopes: ['ads:read', 'ads:write', 'billing'],
    agentCanPrepare: 'Setup guide and scope justifications',
    agentCannotDo: 'Create Pinterest app or submit review',
    route: null,
  },
];

const readinessColor = (r) => r >= 75 ? 'text-green-400' : r >= 40 ? 'text-yellow-400' : 'text-red-400';
const readinessBg = (r) => r >= 75 ? 'bg-green-500' : r >= 40 ? 'bg-yellow-500' : 'bg-red-500';

export default function SocialReviewReadiness() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(REVIEW_PLATFORMS[0]);

  const createAlert = useMutation({
    mutationFn: (p) => base44.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: p.readiness < 50 ? 'high' : 'warning',
      title: `${p.name} review not ready (${p.readiness}% complete)`,
      summary: `Blockers: ${p.blockers.slice(0, 2).join('; ')}`,
      source: 'SocialReviewReadiness',
      requires_action: true,
      linked_route: '/admin/social-review-readiness',
    }),
    onSuccess: () => toast({ title: 'Alert created' }),
  });

  const createHealth = useMutation({
    mutationFn: (p) => base44.entities.SystemHealthIssue.create({
      system_area: 'integrations',
      issue_title: `${p.name} developer review not submitted`,
      severity: p.readiness < 50 ? 'critical' : 'warning',
      detected_by: 'SocialReviewReadiness',
      recommended_fix: p.blockers[0] || p.agentCannotDo,
      status: 'open',
      requires_approval: true,
      risk_type: 'public_content',
      last_checked: new Date().toISOString(),
    }),
    onSuccess: () => toast({ title: 'System Health issue created' }),
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/social-platform-parity"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Social Review Readiness</h1>
            <p className="text-sm text-muted-foreground mt-1">Developer app review status for every social platform that requires external approval.</p>
          </div>
        </div>
      </div>

      {/* Readiness overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {REVIEW_PLATFORMS.map(p => (
          <Card key={p.name} className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.name === p.name ? 'border-primary/60' : ''}`} onClick={() => setSelected(p)}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.icon}</span>
                  <p className="font-semibold">{p.name}</p>
                </div>
                <span className={`text-sm font-bold ${readinessColor(p.readiness)}`}>{p.readiness}%</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${readinessBg(p.readiness)}`} style={{ width: `${p.readiness}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{p.reviewType}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">{selected.icon} {selected.name} — Review Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${readinessBg(selected.readiness)}`} style={{ width: `${selected.readiness}%` }} />
                </div>
                <span className={`font-bold ${readinessColor(selected.readiness)}`}>{selected.readiness}%</span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-400" /> Blockers</p>
                <ul className="space-y-0.5">{selected.blockers.map((b, i) => <li key={i} className="text-xs text-red-300/80">• {b}</li>)}</ul>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Camera className="w-3 h-3 text-yellow-400" /> Required in Demo Recording</p>
                <ul className="space-y-0.5">{selected.requiredDemos.map((d, i) => <li key={i} className="text-xs">• {d}</li>)}</ul>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Do NOT show in demo</p>
                <ul className="space-y-0.5">{selected.doNotShow.map((d, i) => <li key={i} className="text-xs text-red-300/70">✗ {d}</li>)}</ul>
              </div>

              <div className="flex flex-wrap gap-2">
                <a href={selected.reviewUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Developer Portal</Button>
                </a>
                {selected.route && <Link to={selected.route}><Button variant="outline" size="sm">App Page</Button></Link>}
                {selected.studioRoute && <Link to={selected.studioRoute}><Button variant="outline" size="sm"><Camera className="w-3 h-3 mr-1" />Recording Studio</Button></Link>}
                <Button variant="outline" size="sm" onClick={() => createAlert.mutate(selected)}><Zap className="w-3 h-3 mr-1" />Alert</Button>
                <Button variant="outline" size="sm" onClick={() => createHealth.mutate(selected)}><Shield className="w-3 h-3 mr-1" />Health</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Scope & App Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1 text-green-400">Safe scopes to request</p>
                <div className="flex flex-wrap gap-1">{selected.safeScopes.map(s => <Badge key={s} variant="outline" className="text-xs font-mono">{s}</Badge>)}</div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 text-red-400">Remove / do not request</p>
                <div className="flex flex-wrap gap-1">{selected.removeScopes.map(s => <Badge key={s} className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">{s}</Badge>)}</div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">App description (copy-ready)</p>
                <p className="text-xs bg-secondary/50 rounded p-2 leading-relaxed">{selected.appDescription}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground text-green-400">Agent can prepare</p>
                  <p className="text-xs">{selected.agentCanPrepare}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground text-red-400">Agent cannot do — Gannon must</p>
                  <p className="text-xs">{selected.agentCannotDo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}