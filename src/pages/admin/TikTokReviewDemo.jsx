import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, ChevronRight, ChevronLeft, Shield, Copy,
  ExternalLink, Video, AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TikTokConnectionCard from '@/components/tiktok/TikTokConnectionCard';
import TikTokDraftUpload from '@/components/tiktok/TikTokDraftUpload';

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
    title: 'TikTok Login Kit — Connect',
    scope: 'Login Kit',
    icon: '🔑',
    description: 'Click "Connect TikTok (Login Kit)" — this opens the official TikTok OAuth consent screen. Authorise with your TikTok creator account to demonstrate the real OAuth return to gannonwaye.com/tiktok-callback.',
    component: 'connection',
    voiceover: 'The platform connects to my authorised TikTok creator account using Login Kit. This is the official TikTok OAuth flow — I will now click Connect and complete the consent screen.',
  },
  {
    number: 3,
    title: 'Connected Creator Account',
    scope: 'user.info.basic',
    icon: '👤',
    description: 'After OAuth completes, show the connected TikTok creator account — display name and authorised scopes (user.info.basic, video.upload only).',
    component: 'connection',
    voiceover: 'Here you can see my connected TikTok account — the display name and the exact scopes authorised: user.info.basic and video.upload. No other scopes are requested.',
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
    description: 'Every TikTok post goes through: Draft Created → Awaiting Review → Approved before any upload occurs. Tick the approval checkbox to unlock the upload button.',
    component: 'upload',
    voiceover: 'Every piece of content goes through a mandatory approval queue. AI creates the draft, but I review and approve before anything moves forward.',
  },
  {
    number: 6,
    title: 'Upload Draft to TikTok Inbox',
    scope: 'video.upload',
    icon: '📤',
    description: 'After ticking the approval checkbox and entering a public HTTPS video URL, click Upload Draft. The system calls the Content Posting API inbox/video/init/ endpoint — this sends the video to your TikTok creator draft inbox, NOT auto-published.',
    component: 'upload',
    voiceover: 'After I approve the draft, the system uploads it to my TikTok account as a draft using the Content Posting API. I still have to open TikTok and manually publish.',
  },
  {
    number: 7,
    title: 'Safety Controls Summary',
    scope: null,
    icon: '🛡️',
    description: 'Summarise all safety controls — manual approval required at every stage, no auto-posting, no bulk publishing, no Share Kit, no Webhooks, no video.publish.',
    component: 'safety',
    voiceover: 'The platform is designed for creator workflow management — not spam automation, not bulk posting. I always have final say. Only Login Kit and Content Posting API are used.',
  },
];

const PRODUCTS_AUDIT = [
  { name: 'Login Kit', implemented: true, scope: 'user.info.basic', step: 2, notes: 'Real OAuth flow → gannonwaye.com/tiktok-callback' },
  { name: 'Content Posting API', implemented: true, scope: 'video.upload', step: 6, notes: 'inbox/video/init/ — draft only, not auto-published' },
  { name: 'Share Kit', implemented: false, scope: null, step: null, notes: '⚠ NOT IMPLEMENTED — DO NOT select in submission' },
  { name: 'Webhooks', implemented: false, scope: null, step: null, notes: '⚠ NOT DEMONSTRATED in this demo — DO NOT select in submission' },
];

const SCOPES_AUDIT = [
  { scope: 'user.info.basic', keep: true, implemented: true, step: 3, notes: 'Shown via Login Kit connection card' },
  { scope: 'video.upload', keep: true, implemented: true, step: 6, notes: 'inbox/video/init/ draft upload demonstrated' },
  { scope: 'user.info.stats', keep: false, implemented: false, step: null, notes: '⚠ NOT DEMONSTRATED — remove from submission' },
  { scope: 'video.list', keep: false, implemented: false, step: null, notes: '⚠ NOT DEMONSTRATED — remove from submission' },
  { scope: 'video.publish', keep: false, implemented: false, step: null, notes: '⚠ NOT USED — platform uses inbox drafts only, remove' },
];

const SAFETY_CONTROLS = [
  'Products submitted: Login Kit + Content Posting API ONLY',
  'Scopes submitted: user.info.basic + video.upload ONLY',
  'All TikTok posts require manual creator approval before upload',
  'Upload endpoint: inbox/video/init/ — sends to creator draft inbox, NOT auto-published',
  'Creator must manually publish from within the TikTok app',
  'No bulk posting, no auto-scheduling, no third-party accounts',
  'Only Gannon Waye\'s authorised creator account is connected',
  'OAuth tokens stored securely via service role — never exposed to frontend',
  'Client secret stored as environment variable — never visible in UI or logs',
  'NOT using: Share Kit, Webhooks, user.info.stats, video.list, video.publish',
];

const FULL_VOICEOVER = `"This is the Gannon Waye Music AI Operating System — a private creator workflow platform.

PRODUCTS USED: Login Kit and Content Posting API only.
SCOPES: user.info.basic and video.upload only.

The platform connects to my authorised TikTok creator account using Login Kit and the official TikTok OAuth flow. The OAuth return URL is https://gannonwaye.com/tiktok-callback.

Here you can see my connected creator account — display name and the exact scopes authorised: user.info.basic and video.upload. No other scopes are requested or used.

AI helps prepare content ideas, captions, and workflow recommendations. But nothing is automatically published — everything waits in an approval queue for my review.

Every piece of content goes through: Draft Created → Awaiting Review → Approved → Uploaded to Creator Draft Inbox → Creator manually publishes from TikTok app.

Only after I manually tick the approval checkbox does the system upload it to my TikTok account — using the Content Posting API inbox/video/init/ endpoint. This sends it to my draft inbox only. Nothing is auto-published. I open TikTok and manually decide to publish.

The platform does not use: Share Kit, Webhooks, user.info.stats, video.list, or video.publish.

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
      {/* Critical submission warning */}
      <div className="border border-red-500/60 bg-red-500/10 rounded-xl p-4 space-y-2">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-red-300">Before you record — read this</p>
            <p className="text-foreground/80">1. <strong>Rotate TIKTOK_CLIENT_SECRET</strong> in the TikTok Developer Portal before production submission — the old key was visible in previous code. Update the secret in Base44 → Settings → Environment Variables.</p>
            <p className="text-foreground/80">2. <strong>Submit only:</strong> Login Kit + Content Posting API. Scopes: user.info.basic + video.upload. Do NOT select Share Kit, Webhooks, user.info.stats, video.list, or video.publish.</p>
            <p className="text-foreground/80">3. <strong>Recording is not ready</strong> until you show: real OAuth return to /tiktok-callback + real inbox/video/init/ upload call + publish_id in the response.</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/20 text-primary text-xs">TikTok Developer Review</Badge>
            <Badge className="bg-green-500/20 text-green-300 text-xs">Demo Mode</Badge>
          </div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">TikTok Review Demo</h1>
          <p className="text-muted-foreground text-sm mt-1">Submission: Login Kit + Content Posting API · Scopes: user.info.basic + video.upload only</p>
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
            <p className="text-red-300 font-semibold">Security Checklist</p>
            <p className="text-red-300/80">⚠ Rotate TIKTOK_CLIENT_SECRET before production submission — old secret was exposed in source code.</p>
            <p className="text-muted-foreground">Do NOT show TIKTOK_CLIENT_SECRET in any recording. Client Key (awwbyibvman8svtq) is public-safe.</p>
            <p className="text-muted-foreground">OAuth tokens are stored server-side via service role — never accessible from frontend.</p>
            <p className="text-muted-foreground">Upload endpoint: inbox/video/init/ — draft inbox only, not auto-published.</p>
            <p className="text-muted-foreground">tokens_visible: false — no token, refresh_token, or client_secret is ever returned to the browser.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}