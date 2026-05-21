import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const copyText = (text, toast) => {
  navigator.clipboard.writeText(text);
  toast({ title: 'Copied to clipboard' });
};

const CopyBlock = ({ label, value, multiline }) => {
  const { toast } = useToast();
  return (
    <div className="border border-border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
        <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={() => copyText(value, toast)}>
          <Copy className="w-3 h-3" /> Copy
        </Button>
      </div>
      {multiline
        ? <pre className="text-sm text-foreground whitespace-pre-wrap font-body bg-secondary/50 rounded p-2 max-h-48 overflow-y-auto">{value}</pre>
        : <p className="text-sm text-primary font-mono">{value}</p>
      }
    </div>
  );
};

const CREDENTIALS = [
  { label: 'Client Key', value: 'awwbyibvman8svtq' },
  { label: 'Client Secret', value: '(saved in TIKTOK_CLIENT_SECRET — do not display)' },
  { label: 'Terms of Service URL', value: 'https://gannonwaye.com/terms-of-service' },
  { label: 'Privacy Policy URL', value: 'https://gannonwaye.com/privacy-policy' },
  { label: 'App Name', value: 'Gannon Waye Music' },
  { label: 'Website URL', value: 'https://gannonwaye.com' },
  { label: 'DNS TXT Record (add to gannonwaye.com DNS settings)', value: 'tiktok-developers-site-verification=OsUg2LUCoNJIimgbEa9Oq8H6pkYGR1ZC' },
  { label: 'Website Verify File (already deployed at gannonwaye.com)', value: 'tiktok-developers-site-verification=KxZOq6nwSqmVh0UJXgnalbWrdx6eOC9U' },
  { label: 'Redirect URI (Web)', value: 'https://gannonwaye.com/tiktok-callback' },
  { label: 'Webhook Callback URL ✅ (paste into TikTok → Webhooks → Callback URL)', value: 'https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/tiktokWebhook' },
];

const SCOPES = [
  { scope: 'user.info.basic', product: 'Login Kit', description: 'Read a user\'s basic profile info (open id, avatar, display name). Used to identify which TikTok account is authorising the integration.' },
  { scope: 'video.upload', product: 'Content Posting API', description: 'Share content to a creator\'s account as a draft for further editing and posting. Used by the Gannon Waye platform to prepare social content as drafts — Gannon reviews and approves before anything posts publicly.' },
];

const APP_DESCRIPTION = `Gannon Waye Music is an independent music artist platform for Australian singer-songwriter Gannon Waye. The platform connects Gannon's official website (gannonwaye.com) with TikTok to support content creation and fan engagement.

How TikTok is used:
- Login Kit (user.info.basic): Allows the artist (Gannon Waye) to authenticate their TikTok Creator account and link it to the platform's AI content management system. No fan or public user authentication is required.
- Content Posting API (video.upload): The platform's AI content assistant prepares social media video content as drafts. Using video.upload, these drafts are saved to the authorised TikTok account for Gannon to review, edit, and post manually. No content is posted directly or automatically without explicit creator approval.

This is a single-creator internal tool. The TikTok integration is used solely by Gannon Waye (the account holder) to streamline their own content workflow. No third-party users connect their TikTok accounts.`;

const VIDEO_SCRIPT = `DEMO VIDEO SCRIPT — TikTok App Review

Duration target: 2–3 minutes
Platform: Web (gannonwaye.com admin dashboard)

--- SCENE 1: Introduction (0:00–0:20) ---
Show the gannonwaye.com website home page in browser.
Narrator: "This is gannonwaye.com — the official platform for independent Australian artist Gannon Waye."

--- SCENE 2: Login Kit Flow (0:20–1:00) ---
Navigate to the admin dashboard (logged in as Gannon).
Show a "Connect TikTok" button in the API Setup page (/admin/api-setup).
Click Connect TikTok → TikTok OAuth consent screen appears.
Narrator: "Login Kit allows Gannon to connect their TikTok Creator account to the platform's AI content system. Only the artist authenticates — no fans or third parties."
Show user.info.basic permission being requested.
Complete OAuth → confirmation shown.

--- SCENE 3: Content Posting API Flow (1:00–2:00) ---
Navigate to Social Content Generator (/admin/social-content).
Show AI generating a draft video caption/script for a TikTok post.
Narrator: "The AI prepares content drafts. When Gannon approves, it is saved as a draft directly to their TikTok account using the Content Posting API — it is NOT automatically published."
Show video.upload scope being used — content saved as draft.
Navigate to TikTok app — show draft video saved for review.
Narrator: "Gannon reviews the draft in TikTok and decides whether to post, edit, or discard it."

--- SCENE 4: Domain Verification (2:00–2:30) ---
Show gannonwaye.com in browser.
Narrator: "The integration runs on gannonwaye.com, which is verified via TikTok's DNS verification process."

--- SCENE 5: Summary (2:30–3:00) ---
Return to the admin dashboard.
Narrator: "All integrations require explicit artist approval. No automated posting, no public user OAuth, no data collected from fans. This is a private, artist-controlled workflow tool."`;

const CHECKLIST = [
  { item: 'Terms of Service URL', done: true, value: 'https://gannonwaye.com/terms-of-service' },
  { item: 'Privacy Policy URL', done: true, value: 'https://gannonwaye.com/privacy-policy' },
  { item: 'App icon (1024×1024px, JPEG/PNG)', done: false, action: 'Generate or export artist logo at 1024px' },
  { item: 'Platform: Web selected', done: false, action: 'Tick "Web" in TikTok Developer Portal' },
  { item: 'Redirect URI added', done: false, action: 'Add https://gannonwaye.com/tiktok-callback' },
  { item: 'Scope: user.info.basic', done: false, action: 'Add via Login Kit product' },
  { item: 'Scope: video.upload', done: false, action: 'Add via Content Posting API product' },
  { item: 'App description written', done: true, value: 'Copy from this page' },
  { item: 'Demo video recorded', done: false, action: 'Follow script on this page and record screen' },
  { item: 'DNS TXT Record: add tiktok-developers-site-verification=OsUg2LUCoNJIimgbEa9Oq8H6pkYGR1ZC to gannonwaye.com DNS', done: false, action: 'Go to your domain registrar (GoDaddy/Cloudflare) → DNS → Add TXT record for @ with that value' },
  { item: 'Website file verify: tiktok-developers-site-verification=KxZOq6nwSqmVh0UJXgnalbWrdx6eOC9U deployed', done: true, value: 'File live at gannonwaye.com — click Verify in TikTok portal' },
  { item: 'Webhook Callback URL configured (returns 200 to TikTok)', done: true, value: 'Handler deployed — paste URL from credentials section into TikTok Webhooks → Callback URL' },
];

export default function TikTokAppReview() {
  const { toast } = useToast();
  const [checked, setChecked] = useState({});

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const doneCount = CHECKLIST.filter((c, i) => c.done || checked[i]).length;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">TikTok App Review Prep</h1>
        <p className="text-muted-foreground text-sm mt-1">Everything needed to submit your TikTok Developer app for review — copy-ready</p>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-yellow-300/80 text-xs">Do NOT submit the app until the demo video is recorded and the DNS TXT record has propagated. TikTok reviews are manual and rejection causes delays.</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Submission Checklist</p>
            <Badge className="bg-primary/10 text-primary">{doneCount} / {CHECKLIST.length} done</Badge>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mb-4">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }} />
          </div>
          <div className="space-y-2">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-3 cursor-pointer" onClick={() => toggle(i)}>
                {(item.done || checked[i])
                  ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  : <div className="w-4 h-4 rounded-full border border-border shrink-0 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${(item.done || checked[i]) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.item}</p>
                  {item.value && <p className="text-xs text-primary font-mono truncate">{item.value}</p>}
                  {item.action && !item.done && !checked[i] && <p className="text-xs text-muted-foreground">{item.action}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credentials */}
      <Card>
        <CardHeader><CardTitle>App Credentials & URLs</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {CREDENTIALS.map(c => (
            <CopyBlock key={c.label} label={c.label} value={c.value} />
          ))}
        </CardContent>
      </Card>

      {/* Scopes */}
      <Card>
        <CardHeader><CardTitle>Scopes to Add</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {SCOPES.map(s => (
            <div key={s.scope} className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{s.scope}</code>
                <Badge variant="outline" className="text-xs">{s.product}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* App Description */}
      <Card>
        <CardHeader><CardTitle>App Review Description</CardTitle></CardHeader>
        <CardContent>
          <CopyBlock label="Paste this into the 'Explain how each product and scope works' field" value={APP_DESCRIPTION} multiline />
        </CardContent>
      </Card>

      {/* Demo Video Script */}
      <Card>
        <CardHeader><CardTitle>Demo Video Script</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">Record a screen recording following this script. Use Loom, QuickTime, or OBS. Export as MP4, max 50MB.</p>
          <CopyBlock label="Script (for reference)" value={VIDEO_SCRIPT} multiline />
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card>
        <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            { label: 'TikTok Developer Portal', url: 'https://developers.tiktok.com' },
            { label: 'TikTok App Review Guidelines', url: 'https://developers.tiktok.com/doc/app-review-guidelines' },
            { label: 'Your Privacy Policy', url: 'https://gannonwaye.com/privacy-policy' },
            { label: 'Your Terms of Service', url: 'https://gannonwaye.com/terms-of-service' },
          ].map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" />{l.label}
              </Button>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}