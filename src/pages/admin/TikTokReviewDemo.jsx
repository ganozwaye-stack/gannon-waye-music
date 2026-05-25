import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, ChevronRight, ChevronLeft, Shield, Copy,
  ExternalLink, Webhook, Video, BarChart3, User, Upload, AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TikTokConnectionCard from '@/components/tiktok/TikTokConnectionCard';
import TikTokDraftUpload from '@/components/tiktok/TikTokDraftUpload';
import TikTokAnalytics from '@/components/tiktok/TikTokAnalytics';

const DEMO_STEPS = [
  {
    number: 1,
    title: 'App Overview',
    scope: null,
    icon: '🖥️',
    description: 'Show the Gannon Waye AI Operating System dashboard — the complete connected creator platform.',
    navPath: '/admin',
    navLabel: 'Open Dashboard',
    voiceover: 'This is the Gannon Waye Music AI Operating System. Every section of my business is connected and monitored from here.',
  },
  {
    number: 2,
    title: 'TikTok Login Kit',
    scope: 'Login Kit',
    icon: '🔑',
    description: 'Demonstrate the Login Kit integration — secure OAuth connection to the authorised TikTok creator account.',
    component: 'connection',
    voiceover: 'The platform connects to my authorised TikTok creator account using Login Kit. This is the official OAuth flow from TikTok.',
  },
  {
    number: 3,
    title: 'Connected Creator Account',
    scope: 'user.info.basic',
    icon: '👤',
    description: 'Show the connected TikTok creator account — display name, username, and authorised scopes.',
    component: 'connection',
    voiceover: 'Here you can see my connected TikTok account — the display name, username, and the specific permissions that have been authorised.',
  },
  {
    number: 4,
    title: 'AI Content Preparation',
    scope: null,
    icon: '✨',
    description: 'Show how AI prepares content drafts, captions, and hashtags — all awaiting manual creator approval before any upload.',
    navPath: '/admin/social-content',
    navLabel: 'Open Social Content Generator',
    voiceover: 'AI helps prepare content ideas, captions, and drafts. But nothing is automatically published — everything waits for my approval.',
  },
  {
    number: 5,
    title: 'Draft Preview & Approval',
    scope: null,
    icon: '📋',
    description: 'Every TikTok post goes through: Draft Created → Awaiting Review → Approved before any upload occurs.',
    component: 'upload',
    voiceover: 'Every piece of content goes through a mandatory approval queue. AI creates the draft, but I review and approve before anything moves forward.',
  },
  {
    number: 6,
    title: 'Upload Draft to TikTok',
    scope: 'video.upload',
    icon: '📤',
    description: 'After approval, the system uploads the video as a draft to the TikTok creator account using the Content Posting API (video.upload).',
    component: 'upload',
    voiceover: 'After I approve the draft, the system uploads it to my TikTok account — as a draft only. I still have to manually publish from within the TikTok app.',
  },
  {
    number: 7,
    title: 'Manual Approval State',
    scope: null,
    icon: '🔒',
    description: 'Show that no content auto-posts. The upload lands in TikTok Drafts. Creator must manually publish from within the TikTok app.',
    component: 'upload',
    voiceover: 'The platform is designed for creator workflow management — not spam automation, not bulk posting, not third-party account control. I always have final say.',
  },
  {
    number: 8,
    title: 'Analytics & Video List',
    scope: 'user.info.stats + video.list',
    icon: '📊',
    description: 'Show account statistics (user.info.stats) and recent TikTok videos (video.list) retrieved from the connected creator account.',
    component: 'analytics',
    voiceover: 'The platform can retrieve my account stats and video performance data — all displayed here for monitoring.',
  },
  {
    number: 9,
    title: 'Webhook & Sync Status',
    scope: 'Webhooks',
    icon: '🔗',
    description: 'Show the active webhook endpoint that receives TikTok event updates and syncs creator content status.',
    component: 'webhook',
    voiceover: 'The webhook endpoint receives real-time updates from TikTok about post status and account changes.',
  },
  {
    number: 10,
    title: 'Safety Controls Summary',
    scope: null,
    icon: '🛡️',
    description: 'Summarise all safety controls — manual approval required at every stage, no auto-posting, no bulk publishing.',
    component: 'safety',
    voiceover: 'To summarise the safety architecture: all content requires approval, nothing is auto-published, and this platform only connects to my own authorised creator account.',
  },
];

const PRODUCTS_AUDIT = [
  { name: 'Login Kit', implemented: true, scope: 'user.info.basic', step: 2, notes: 'OAuth flow + account status display' },
  { name: 'Content Posting API', implemented: true, scope: 'video.upload', step: 6, notes: 'Draft upload via tiktokUploadDraft function' },
  { name: 'Share Kit', implemented: false, scope: null, step: null, notes: 'NOT IMPLEMENTED — remove from submission' },
  { name: 'Webhooks', implemented: true, scope: null, step: 9, notes: 'tiktokWebhook function handles events' },
];

const SCOPES_AUDIT = [
  { scope: 'user.info.basic', keep: true, implemented: true, step: 3, notes: 'Shown via Login Kit connection card' },
  { scope: 'user.info.stats', keep: true, implemented: true, step: 8, notes: 'Shown via TikTok Analytics component' },
  { scope: 'video.list', keep: true, implemented: true, step: 8, notes: 'Shown via TikTok Analytics component' },
  { scope: 'video.upload', keep: true, implemented: true, step: 6, notes: 'Shown via Draft Upload component' },
  { scope: 'video.publish', keep: false, implemented: false, step: null, notes: 'NOT USED — platform uses drafts only (video.upload), remove from submission' },
];

const WEBHOOK_URL = 'https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/tiktokWebhook';

const SAFETY_CONTROLS = [
  'All TikTok posts require manual creator approval before upload',
  'Uploads go to TikTok Drafts — not published automatically',
  'Creator must manually publish from within the TikTok app',
  'No bulk posting, no auto-scheduling, no third-party accounts',
  'Only Gannon Waye\'s authorised creator account is connected',
  'OAuth tokens stored securely via service role — never exposed to frontend',
  'Client secret stored as environment variable — never visible in UI',
  'All upload events are logged in AdminNotification system',
  'Approval Queue must show status "Approved" before upload button is active',
];

const FULL_VOICEOVER = `"This is the Gannon Waye Music AI Operating System — a private creator workflow platform.

The platform connects to my authorised TikTok creator account using Login Kit and the official TikTok OAuth flow.

Here you can see my connected creator account — display name, username, and the specific permissions that have been authorised: user.info.basic, user.info.stats, video.list, and video.upload.

AI helps prepare content ideas, captions, and workflow recommendations. But nothing is automatically published — everything waits in an approval queue for my review.

Every piece of content goes through: Draft Created → Awaiting Review → Approved → Uploaded to Drafts → Ready for Creator Final Approval.

Only after I manually approve a draft does the system upload it to my TikTok account — and even then, it uploads as a draft only. I still have to open the TikTok app and manually publish.

The analytics section uses user.info.stats to show account performance and video.list to retrieve recent video data.

The webhook endpoint receives real-time updates from TikTok.

The platform is designed for creator workflow management — not spam automation, not bulk posting, and not third-party account control.

I always have final say over everything that goes live on my TikTok account."`;

export default function TikTokReviewDemo() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [tiktokStatus, setTiktokStatus] = useState({ connected: false });

  const currentStep = DEMO_STEPS[step];
  const copy = (text, label) => { navigator.clipboard.writeText(text); toast({ title: `${label} copied` }); };

  const renderStepComponent = () => {
    if (!currentStep.component) return null;

    if (currentStep.component === 'connection') {
      return <TikTokConnectionCard onStatusChange={setTiktokStatus} />;
    }
    if (currentStep.component === 'upload') {
      return <TikTokDraftUpload connected={tiktokStatus.connected} />;
    }
    if (currentStep.component === 'analytics') {
      return <TikTokAnalytics connected={tiktokStatus.connected} />;
    }
    if (currentStep.component === 'webhook') {
      return (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Webhook className="w-4 h-4 text-primary" /> Webhook Endpoint
              <Badge className="bg-green-500/20 text-green-300 text-xs">Deployed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Webhook Callback URL</p>
              <p className="text-xs text-primary font-mono break-all">{WEBHOOK_URL}</p>
              <Button size="sm" variant="ghost" className="h-6 text-xs mt-2 gap-1" onClick={() => copy(WEBHOOK_URL, 'Webhook URL')}>
                <Copy className="w-3 h-3" /> Copy URL
              </Button>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'GET /challenge', desc: 'Webhook verification — echoes TikTok challenge param', ok: true },
                { label: 'POST /events', desc: 'Receives TikTok event payloads, logs to AdminNotification', ok: true },
                { label: 'Security validation', desc: 'Returns HTTP 200 to TikTok for all events (prevents retry loops)', ok: true },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <a href="/admin/notifications" target="_blank">
                <Button size="sm" variant="outline" className="text-xs gap-1">
                  <ExternalLink className="w-3 h-3" /> View Webhook Logs
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      );
    }
    if (currentStep.component === 'safety') {
      return (
        <Card className="border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" /> Safety Controls — All Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {SAFETY_CONTROLS.map((ctrl, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80">{ctrl}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/20 text-primary text-xs">TikTok Developer Review</Badge>
            <Badge className="bg-green-500/20 text-green-300 text-xs">Demo Mode</Badge>
          </div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">TikTok Review Demo</h1>
          <p className="text-muted-foreground text-sm mt-1">Guided 10-step demo for TikTok App Review submission</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/tiktok-recording-studio">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Video className="w-3 h-3" />Recording Studio</Button>
          </Link>
          <Link to="/admin/tiktok-review">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Full Audit</Button>
          </Link>
        </div>
      </div>

      {/* Step Navigator */}
      <div className="flex gap-1.5 flex-wrap">
        {DEMO_STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all border ${i === step ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
            <span>{s.icon}</span>
            <span className="hidden sm:inline">{s.number}. {s.title}</span>
            <span className="sm:hidden">{s.number}</span>
          </button>
        ))}
      </div>

      {/* Current Step */}
      <Card className="border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentStep.icon}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/20 text-primary text-xs">Step {currentStep.number} / {DEMO_STEPS.length}</Badge>
                  {currentStep.scope && (
                    <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">{currentStep.scope}</Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-0.5">{currentStep.title}</CardTitle>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
                <ChevronLeft className="w-3 h-3" /> Prev
              </Button>
              <Button size="sm" className="gap-1" onClick={() => setStep(s => Math.min(DEMO_STEPS.length - 1, s + 1))} disabled={step === DEMO_STEPS.length - 1}>
                Next <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed">{currentStep.description}</p>

          {/* Voiceover cue */}
          <div className="border border-primary/20 bg-primary/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Voiceover Cue</p>
              <Button size="sm" variant="ghost" className="h-5 text-xs gap-1 px-2" onClick={() => copy(currentStep.voiceover, 'Voiceover cue')}>
                <Copy className="w-2.5 h-2.5" /> Copy
              </Button>
            </div>
            <p className="text-xs text-foreground/80 italic leading-relaxed">"{currentStep.voiceover}"</p>
          </div>

          {/* Nav button for steps without embedded components */}
          {currentStep.navPath && (
            <a href={currentStep.navPath} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ExternalLink className="w-3 h-3" /> {currentStep.navLabel}
              </Button>
            </a>
          )}

          {/* Embedded component */}
          {renderStepComponent()}
        </CardContent>
      </Card>

      {/* Products & Scopes Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Products Audit</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {PRODUCTS_AUDIT.map(p => (
              <div key={p.name} className="flex items-center justify-between border border-border rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  {p.implemented ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  <span className="text-sm">{p.name}</span>
                  {p.step && <Badge variant="outline" className="text-xs">Step {p.step}</Badge>}
                </div>
                {!p.implemented && <Badge className="bg-red-500/20 text-red-300 text-xs">Remove</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Scopes Audit</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {SCOPES_AUDIT.map(s => (
              <div key={s.scope} className="flex items-center justify-between border border-border rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  {s.keep && s.implemented ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-primary">{s.scope}</code>
                  {s.step && <Badge variant="outline" className="text-xs">Step {s.step}</Badge>}
                </div>
                <Badge className={s.keep ? 'bg-green-500/20 text-green-300 text-xs' : 'bg-red-500/20 text-red-300 text-xs'}>
                  {s.keep ? 'Keep' : 'Remove'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Full Voiceover Script */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Full Demo Voiceover Script
            <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={() => copy(FULL_VOICEOVER, 'Voiceover script')}>
              <Copy className="w-3 h-3" /> Copy All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-body bg-secondary/30 rounded-lg p-4 leading-relaxed max-h-48 overflow-y-auto">{FULL_VOICEOVER}</pre>
        </CardContent>
      </Card>

      {/* Security reminder */}
      <Card className="border-red-500/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="text-red-300 font-semibold">Security Reminder</p>
            <p className="text-red-300/80">Do NOT show TIKTOK_CLIENT_SECRET in any recording. Client Key (awwbyibvman8svtq) is safe to show.</p>
            <p className="text-muted-foreground">OAuth tokens are stored server-side via service role — they are never accessible from the frontend.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}