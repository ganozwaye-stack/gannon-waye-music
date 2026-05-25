import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CheckCircle2, AlertTriangle, Zap, Shield, FileText } from 'lucide-react';

const CONTENT_PLATFORMS = [
  {
    name: 'TikTok',
    icon: '🎵',
    contentAbility: 'Draft upload only (approval-gated)',
    postingFlow: 'Admin uploads MP4 via PULL_FROM_URL → stored as private draft → creator reviews in TikTok app → creator publishes manually',
    approvalGated: true,
    autoPostingEnabled: false,
    postTypes: ['Short video (draft only)'],
    captionGeneration: 'LLM-generated in TikTokDraftUpload component',
    contentQueue: 'Pending approval in Approval Queue before upload',
    platformLimit: '10 min video, 60s for standard feed. Draft upload is 4K supported.',
    agentRole: 'Prepares caption, hashtags, timing recommendation. Cannot upload without Gannon approval.',
    testStatus: 'Built — not confirmed live outside Base44 preview',
    nextAction: 'Live-test draft upload with real public MP4 URL on gannonwaye.com',
    route: '/admin/tiktok-recording-studio',
  },
  {
    name: 'Instagram',
    icon: '📸',
    contentAbility: 'Not built — Meta app required first',
    postingFlow: 'Create Meta app → connect Instagram Professional → OAuth → build approval-gated post/reel composer → Gannon approves → publish',
    approvalGated: true,
    autoPostingEnabled: false,
    postTypes: ['Feed post', 'Reel', 'Story (manual only)'],
    captionGeneration: 'Agent can prepare caption/hashtags, human approves before post',
    contentQueue: 'Not yet built',
    platformLimit: 'Stories 15s, Reels 60s-90s for best reach, Feed image max 10MB',
    agentRole: 'Prepare captions, hashtags, posting time recommendation. Cannot post without Gannon approval and Meta OAuth setup.',
    testStatus: 'Not built',
    nextAction: 'Create Meta developer app',
    route: '/admin/social-distribution-readiness',
  },
  {
    name: 'Facebook',
    icon: '👥',
    contentAbility: 'Not built — Meta app required first',
    postingFlow: 'Create Meta app → connect Facebook Page → OAuth → build approval-gated page post composer',
    approvalGated: true,
    autoPostingEnabled: false,
    postTypes: ['Page post', 'Scheduled post', 'Link share'],
    captionGeneration: 'Agent can prepare post copy, human approves',
    contentQueue: 'Not yet built',
    platformLimit: 'Page post up to 63,206 chars, image up to 30MB',
    agentRole: 'Prepare page post copy. Cannot post without Gannon approval and Meta OAuth setup.',
    testStatus: 'Not built',
    nextAction: 'Build after Meta app is created (shared with Instagram)',
    route: '/admin/social-distribution-readiness',
  },
  {
    name: 'YouTube',
    icon: '▶️',
    contentAbility: 'None yet — read-only planned via Google connector',
    postingFlow: 'Enable YouTube Data API → build channel video list UI → (upload requires separate scope + approval gate)',
    approvalGated: true,
    autoPostingEnabled: false,
    postTypes: ['Video (manual upload only for now)', 'YouTube Shorts'],
    captionGeneration: 'Agent can prepare video title, description, tags',
    contentQueue: 'Not yet built',
    platformLimit: 'Default quota: 10,000 units/day. Upload = 1600 units.',
    agentRole: 'Prepare video metadata. Cannot upload without YouTube Data API enabled and Gannon approval.',
    testStatus: 'Not built',
    nextAction: 'Enable YouTube Data API in Google Cloud Console',
    route: null,
  },
  {
    name: 'Spotify for Artists',
    icon: '🎧',
    contentAbility: 'Manual only — playlist pitching',
    postingFlow: 'Log into Spotify for Artists → submit pitch via Pitch a Song tool → track pitch status manually',
    approvalGated: false,
    autoPostingEnabled: false,
    postTypes: ['Pitch to editorial playlists (manual)'],
    captionGeneration: 'Agent can prepare pitch notes and track metadata',
    contentQueue: 'Tracked manually in admin KnowledgeVault or Sync Licensing Command',
    platformLimit: 'One pitch per unreleased song, submitted 7 days before release',
    agentRole: 'Prepare pitch notes, reminder checklist, and track metadata. Cannot submit pitch.',
    testStatus: 'Manual only — no API',
    nextAction: 'Submit pitch 7 days before next release via Spotify for Artists',
    route: '/admin/sync-licensing-command',
  },
  {
    name: 'Apple Music for Artists',
    icon: '🍎',
    contentAbility: 'Manual only — profile and canvas',
    postingFlow: 'Log into Apple Music for Artists → update artist image → check claim status',
    approvalGated: false,
    autoPostingEnabled: false,
    postTypes: ['Artist profile (manual)', 'Motion artwork canvas'],
    captionGeneration: 'N/A',
    contentQueue: 'Manual only',
    platformLimit: 'Profile updates are manual; no API for automation',
    agentRole: 'Remind Gannon of profile update tasks. Cannot update profile.',
    testStatus: 'Manual only — no API',
    nextAction: 'Claim artist profile after first release goes live on Apple Music',
    route: null,
  },
  {
    name: 'SoundCloud',
    icon: '☁️',
    contentAbility: 'Not built — API registration needed',
    postingFlow: 'Register SoundCloud app → OAuth → track list → eventually upload if approved',
    approvalGated: true,
    autoPostingEnabled: false,
    postTypes: ['Audio track (manual upload for now)'],
    captionGeneration: 'Agent can prepare track title and description',
    contentQueue: 'Not yet built',
    platformLimit: 'Free plan limited. SoundCloud Go+ required for unlimited uploads.',
    agentRole: 'Prepare track metadata. Cannot upload without SoundCloud API setup.',
    testStatus: 'Not built',
    nextAction: 'Register SoundCloud developer app',
    route: null,
  },
  {
    name: 'Bandcamp',
    icon: '🎸',
    contentAbility: 'Manual only — no public API',
    postingFlow: 'Manual upload via Bandcamp artist dashboard → set price → link from gannonwaye.com store',
    approvalGated: false,
    autoPostingEnabled: false,
    postTypes: ['Album', 'Track', 'Merch', 'Name-your-price'],
    captionGeneration: 'Agent can prepare album description and track notes',
    contentQueue: 'Manual only',
    platformLimit: 'No automation API. All management is manual.',
    agentRole: 'Prepare release descriptions and pricing strategy. Cannot publish to Bandcamp.',
    testStatus: 'Manual only — no public API',
    nextAction: 'Add Bandcamp profile URL to site settings and link from store',
    route: null,
  },
];

export default function SocialContentReadiness() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(CONTENT_PLATFORMS[0]);

  const createAlert = useMutation({
    mutationFn: (p) => base44.entities.AdminNotification.create({
      notification_type: 'system',
      severity: p.testStatus === 'Not built' ? 'warning' : 'info',
      title: `${p.name} content readiness: ${p.testStatus}`,
      summary: `Next action: ${p.nextAction}`,
      source: 'SocialContentReadiness',
      requires_action: true,
      linked_route: '/admin/social-content-readiness',
    }),
    onSuccess: () => toast({ title: 'Alert created' }),
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/social-platform-parity"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Social Content Readiness</h1>
            <p className="text-sm text-muted-foreground mt-1">Content posting ability, approval gates, and agent role — every social platform.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Posting Available', CONTENT_PLATFORMS.filter(p => p.contentAbility.includes('draft') || p.contentAbility.includes('manual')).length, 'text-green-400'],
          ['Not Built', CONTENT_PLATFORMS.filter(p => p.testStatus === 'Not built').length, 'text-red-400'],
          ['Auto-Posting', CONTENT_PLATFORMS.filter(p => p.autoPostingEnabled).length, 'text-blue-400'],
          ['Approval-Gated', CONTENT_PLATFORMS.filter(p => p.approvalGated).length, 'text-primary'],
        ].map(([label, count, color]) => (
          <Card key={label}><CardContent className="p-4">
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-200">Auto-posting is disabled on all platforms. Every post requires Gannon approval before it reaches any social platform. This is enforced at the Approval Queue level.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {CONTENT_PLATFORMS.map(p => (
            <Card key={p.name} className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.name === p.name ? 'border-primary/60' : ''}`} onClick={() => setSelected(p)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <p className="font-semibold text-sm">{p.name}</p>
                  </div>
                  <Badge className={p.testStatus === 'Not built' ? 'bg-red-500/20 text-red-300 border-red-500/30' : p.testStatus.includes('live') ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'} style={{fontSize: '10px'}}>
                    {p.testStatus === 'Not built' ? 'Not Built' : p.testStatus.includes('live') ? 'Needs Live Test' : 'Manual Only'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.contentAbility}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selected && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">{selected.icon} {selected.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-2 flex-wrap">
                <Badge className={selected.approvalGated ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-secondary text-muted-foreground border-border'}>
                  {selected.approvalGated ? 'Approval-Gated ✓' : 'No Approval Gate'}
                </Badge>
                <Badge className={selected.autoPostingEnabled ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}>
                  {selected.autoPostingEnabled ? '⚠ Auto-posting ON' : 'Auto-posting OFF ✓'}
                </Badge>
              </div>

              <div><p className="text-xs text-muted-foreground">Content ability</p><p>{selected.contentAbility}</p></div>
              <div><p className="text-xs text-muted-foreground">Posting flow</p><p className="text-xs bg-secondary/50 rounded p-2">{selected.postingFlow}</p></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Post types available</p>
                  <ul>{selected.postTypes.map(t => <li key={t} className="text-xs">• {t}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Caption generation</p>
                  <p className="text-xs">{selected.captionGeneration}</p>
                </div>
              </div>

              <div><p className="text-xs text-muted-foreground mb-1">Platform limits</p><p className="text-xs">{selected.platformLimit}</p></div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 text-primary">Agent role</p>
                <p className="text-xs">{selected.agentRole}</p>
              </div>
              <div><p className="text-xs text-muted-foreground mb-1">Next action</p><p className="text-xs font-medium">{selected.nextAction}</p></div>

              <div className="flex flex-wrap gap-2">
                {selected.route && <Link to={selected.route}><Button variant="outline" size="sm">Open Page</Button></Link>}
                <Button variant="outline" size="sm" onClick={() => createAlert.mutate(selected)}><Zap className="w-3 h-3 mr-1" />Create Alert</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}