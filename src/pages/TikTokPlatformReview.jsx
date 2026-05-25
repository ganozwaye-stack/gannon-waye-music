import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Shield, ArrowRight, Lock, Smartphone, Upload, Eye } from 'lucide-react';
import TikTokConnectionCard from '@/components/tiktok/TikTokConnectionCard';
import TikTokDraftUpload from '@/components/tiktok/TikTokDraftUpload';

const STEPS = [
  {
    number: 1,
    icon: <Lock className="w-5 h-5" />,
    title: 'Login Kit — OAuth Authorization',
    scope: 'user.info.basic',
    description: 'The creator clicks "Connect TikTok" which opens TikTok\'s official OAuth consent screen. After authorizing, TikTok redirects to the registered callback URL at gannonwaye.com/tiktok-callback with an authorization code.',
    component: 'connection',
  },
  {
    number: 2,
    icon: <Upload className="w-5 h-5" />,
    title: 'Content Posting API — Draft Upload',
    scope: 'video.upload',
    description: 'After connecting, the creator prepares a video draft — adding a URL, caption, and title. The draft goes through a mandatory approval step before anything is sent to TikTok. The upload calls POST /v2/post/publish/inbox/video/init/ which places the video in the creator\'s TikTok Draft inbox — NOT auto-published.',
    component: 'upload',
  },
  {
    number: 3,
    icon: <Smartphone className="w-5 h-5" />,
    title: 'Creator Final Publish (TikTok App)',
    scope: null,
    description: 'After a successful upload, the video appears in the creator\'s TikTok app under Drafts. The creator must manually open TikTok, review the draft, and tap Publish. This platform never auto-publishes. The creator always has final control.',
    component: 'final',
  },
];

const COMPLIANCE = [
  'Login Kit: user.info.basic only — no stats, no video list',
  'Content Posting API: video.upload only — inbox/video/init/ endpoint',
  'No auto-publish: video always goes to creator draft inbox',
  'Manual approval required before every upload',
  'Only the registered creator account can connect',
  'OAuth tokens stored server-side — never exposed to browser',
  'Client secret in environment variables — not in source code',
  'No Share Kit, no Webhooks, no video.publish, no video.list',
];

export default function TikTokPlatformReview() {
  const [tiktokStatus, setTiktokStatus] = useState({ connected: false });
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 py-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">🎵</span>
                <Badge className="bg-primary/20 text-primary text-xs">TikTok Platform Review</Badge>
                <Badge className="bg-green-500/20 text-green-300 text-xs border-green-500/30">Login Kit + Content Posting API</Badge>
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">Gannon Waye Music</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Creator workflow platform — manual-approval TikTok draft publishing only
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground space-y-0.5">
              <p>Scopes: <code className="text-primary">user.info.basic</code>, <code className="text-primary">video.upload</code></p>
              <p>Callback: <code className="text-muted-foreground/70">gannonwaye.com/tiktok-callback</code></p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">

        {/* Platform description */}
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                <p>
                  <strong className="text-foreground">What this platform does:</strong> Gannon Waye Music is a private creator workflow tool for the independent music artist Gannon Waye. It uses TikTok's Login Kit to securely authenticate the creator's account, and the Content Posting API to send prepared video drafts to the creator's TikTok inbox for manual review and publishing.
                </p>
                <p>
                  <strong className="text-foreground">What this platform does NOT do:</strong> It does not auto-publish, bulk post, schedule posts, manage third-party accounts, or use any API features beyond Login Kit and the Content Posting API inbox draft endpoint.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step navigator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setActiveStep(s.number)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all flex-1 ${
                  activeStep === s.number
                    ? 'bg-primary/15 border-primary/40 text-foreground'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                }`}
              >
                <span className={`shrink-0 ${activeStep === s.number ? 'text-primary' : 'text-muted-foreground'}`}>{s.icon}</span>
                <span className="hidden sm:block text-xs leading-tight">{s.title}</span>
                <span className="sm:hidden text-xs">{s.number}</span>
              </button>
              {i < STEPS.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>

        {/* Active step content */}
        {STEPS.map(step => activeStep === step.number && (
          <div key={step.number} className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                {step.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-lg font-semibold text-foreground">{step.title}</h2>
                  {step.scope && (
                    <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{step.scope}</code>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>

            {/* Step 1: Connection */}
            {step.component === 'connection' && (
              <div className="space-y-3">
                <TikTokConnectionCard onStatusChange={setTiktokStatus} />
                <Card className="border-border/50">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">OAuth Flow Details</p>
                    <div className="space-y-1.5 text-xs text-foreground/70">
                      <p>1. Clicking "Connect TikTok" opens a blank popup <strong className="text-foreground">synchronously</strong> (direct user gesture — never blocked)</p>
                      <p>2. Backend returns TikTok OAuth URL → popup is navigated to <code className="text-muted-foreground">tiktok.com/v2/auth/authorize/</code></p>
                      <p>3. If popup is blocked by browser → same-tab redirect fallback kicks in automatically</p>
                      <p>4. Creator completes consent; TikTok redirects to <code className="text-primary">gannonwaye.com/tiktok-callback?code=…</code></p>
                      <p>5. Popup flow: callback stores code in localStorage → opener exchanges via <code>action: "exchange_code"</code></p>
                      <p>5. Same-tab flow: callback page calls backend exchange directly → redirects back to this page</p>
                      <p>6. Token stored server-side in KnowledgeVault (service role) — <strong className="text-green-400">never returned to browser</strong></p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Upload */}
            {step.component === 'upload' && (
              <div className="space-y-3">
                <TikTokDraftUpload connected={tiktokStatus.connected} />
                <Card className="border-border/50">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">API Call Details</p>
                    <div className="space-y-1.5 text-xs text-foreground/70">
                      <p>Endpoint: <code className="text-primary">POST /v2/post/publish/inbox/video/init/</code></p>
                      <p>Source type: <code className="text-primary">PULL_FROM_URL</code> — TikTok pulls the video from a public URL</p>
                      <p>Privacy: <code className="text-primary">SELF_ONLY</code> — only the creator can see it in their drafts</p>
                      <p>Response includes <code className="text-primary">publish_id</code> — confirms the draft was received</p>
                      <p>The video appears in the TikTok app under <strong className="text-foreground">Drafts</strong> — not published</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Final publish */}
            {step.component === 'final' && (
              <Card className="border-green-500/20">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <div className="space-y-3 text-sm">
                      <p className="text-foreground/80">After the draft is uploaded, the creator must complete publishing manually inside the TikTok mobile app:</p>
                      <ol className="space-y-1.5 text-foreground/70 list-decimal list-inside">
                        <li>Open TikTok app on your mobile device</li>
                        <li>Tap <strong className="text-foreground">Profile → Drafts</strong></li>
                        <li>Find the uploaded draft</li>
                        <li>Review the caption, hashtags, and settings</li>
                        <li>Tap <strong className="text-foreground">Post</strong> to publish</li>
                      </ol>
                      <div className="border border-green-500/20 bg-green-500/5 rounded-lg p-3">
                        <p className="text-xs text-green-300/90">
                          <strong>Creator control confirmed:</strong> This platform has no ability to publish content on the creator's behalf. The TikTok app enforces the final publish action exclusively with the authenticated device owner.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step navigation */}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => setActiveStep(s => Math.max(1, s - 1))}
                disabled={activeStep === 1}
                className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                ← Previous step
              </button>
              <button
                onClick={() => setActiveStep(s => Math.min(STEPS.length, s + 1))}
                disabled={activeStep === STEPS.length}
                className="text-xs text-primary hover:text-primary/80 disabled:opacity-30 transition-colors font-medium"
              >
                Next step →
              </button>
            </div>
          </div>
        ))}

        {/* Compliance summary */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" /> Compliance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMPLIANCE.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/75">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}