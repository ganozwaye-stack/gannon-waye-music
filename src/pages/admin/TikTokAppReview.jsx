import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle2, ExternalLink, AlertTriangle, XCircle, Info, Shield, ChevronDown, ChevronUp, Link } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';

const { toast: useToastHook } = { toast: () => {} };

const CopyBlock = ({ label, value, multiline }) => {
  const { toast } = useToast();
  return (
    <div className="border border-border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
        <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={() => { navigator.clipboard.writeText(value); toast({ title: 'Copied' }); }}>
          <Copy className="w-3 h-3" /> Copy
        </Button>
      </div>
      {multiline
        ? <pre className="text-sm text-foreground whitespace-pre-wrap font-body bg-secondary/50 rounded p-2 max-h-64 overflow-y-auto">{value}</pre>
        : <p className="text-sm text-primary font-mono break-all">{value}</p>}
    </div>
  );
};

// ─── SELECTED PRODUCTS ───────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: 'Login Kit',
    implemented: true,
    demonstrated: true,
    demoSection: 'TikTok Review Demo → Step 2–3: OAuth flow + connected account display',
    whyRequired: 'Authenticates the authorised TikTok creator account via official OAuth.',
    whereOnSite: '/admin/tiktok-review-demo → Step 2 & 3',
    missing: null,
  },
  {
    name: 'Content Posting API',
    implemented: true,
    demonstrated: true,
    demoSection: 'TikTok Review Demo → Step 5–7: Approval pipeline + video.upload draft flow',
    whyRequired: 'Uploads approved video drafts to TikTok for creator final review before publishing.',
    whereOnSite: '/admin/tiktok-review-demo → Step 5, 6, 7',
    missing: null,
  },
  {
    name: 'Share Kit',
    implemented: false,
    demonstrated: false,
    demoSection: null,
    whyRequired: 'Manual TikTok share workflow from the platform.',
    whereOnSite: 'NOT IMPLEMENTED — REMOVED',
    missing: '⛔ REMOVED — uncheck Share Kit in TikTok Developer Portal now. No share UI exists. This causes the "client_key" OAuth error and will block review approval.',
    removed: true,
  },
];

// ─── SELECTED SCOPES ─────────────────────────────────────────────────────────
const SCOPES = [
  {
    scope: 'user.info.basic',
    product: 'Login Kit',
    implemented: true,
    demonstrated: true,
    demoSection: 'TikTok Review Demo → Step 2 & 3',
    rule: 'Shown via Login Kit OAuth return and connected account display (name, username, avatar).',
    missing: null,
    keep: true,
  },
  {
    scope: 'user.info.stats',
    product: 'Login Kit',
    implemented: true,
    demonstrated: true,
    demoSection: 'TikTok Review Demo → Step 8 (TikTokAnalytics component)',
    rule: 'Dashboard retrieves and displays follower count, following, likes, and video count via TikTokAnalytics.',
    missing: null,
    keep: true,
  },
  {
    scope: 'video.list',
    product: 'Content Posting API',
    implemented: true,
    demonstrated: true,
    demoSection: 'TikTok Review Demo → Step 8 (TikTokAnalytics component)',
    rule: 'Dashboard retrieves and displays the creator\'s TikTok video list with per-video performance stats.',
    missing: null,
    keep: true,
  },
  {
    scope: 'video.upload',
    product: 'Content Posting API',
    implemented: true,
    demonstrated: true,
    demoSection: 'TikTok Review Demo → Step 5, 6, 7',
    rule: 'System uploads approved video drafts to TikTok. Creator must manually publish from TikTok Drafts.',
    missing: null,
    keep: true,
  },
  {
    scope: 'video.publish',
    product: 'Content Posting API',
    implemented: false,
    demonstrated: false,
    demoSection: null,
    rule: 'Only needed for direct publishing (bypassing Drafts). Platform uses video.upload (drafts only).',
    missing: '⛔ REMOVED — remove video.publish scope from TikTok Developer Portal. Platform uses video.upload (drafts only). This scope causes review delays if selected without a demo.',
    keep: false,
    removed: true,
  },
];

const RECOMMENDED_SCOPES = ['user.info.basic', 'user.info.stats', 'video.list', 'video.upload'];
const RECOMMENDED_PRODUCTS = ['Login Kit', 'Content Posting API'];

// ─── CHECKLIST ───────────────────────────────────────────────────────────────
const CHECKLIST = [
  { item: 'Official domain: gannonwaye.com', done: true, value: 'https://gannonwaye.com' },
  { item: 'Privacy Policy URL live', done: true, value: 'https://gannonwaye.com/privacy-policy' },
  { item: 'Terms of Service URL live', done: true, value: 'https://gannonwaye.com/terms-of-service' },
  { item: 'Redirect URI configured', done: false, action: 'Add https://gannonwaye.com/tiktok-callback in TikTok portal' },
  { item: 'TikTok callback route exists in app (/tiktok-callback)', done: true, value: 'Route handles return from OAuth' },
  { item: 'Website verification file deployed', done: true, value: 'tiktok-developers-site-verification=KxZOq6nwSqmVh0UJXgnalbWrdx6eOC9U' },
  { item: 'DNS TXT record added to gannonwaye.com', done: false, action: 'Add TXT: tiktok-developers-site-verification=OsUg2LUCoNJIimgbEa9Oq8H6pkYGR1ZC' },
  { item: 'App icon 1024×1024px uploaded', done: false, action: 'Export artist logo at 1024px JPEG/PNG' },
  { item: 'Platform: Web selected in TikTok portal', done: false, action: 'Tick Web in developer portal settings' },
  { item: 'Remove Share Kit (not implemented)', done: false, action: 'Uncheck Share Kit in TikTok portal before submission — no share UI exists' },
  { item: 'Remove video.publish (not used — drafts only)', done: false, action: 'Remove video.publish from scopes — platform uses video.upload to upload as drafts only' },
  { item: 'Demo video: Login Kit OAuth return shown', done: false, action: 'Record actual TikTok OAuth popup → callback → connected account screen' },
  { item: 'Demo video: video.upload draft flow shown', done: false, action: 'Record approval pipeline → Upload Draft button → TikTok Drafts confirmation' },
  { item: 'Demo video: user.info.stats shown', done: false, action: 'Record TikTok Analytics component showing follower/like/video stats' },
  { item: 'Demo video: video.list shown', done: false, action: 'Record TikTok Analytics video list with per-video performance data' },
  { item: 'Client secret rotated after exposure', done: false, action: 'Regenerate TikTok client secret before production submission because it was exposed in chat' },
  { item: 'Client secret NOT visible in demo', done: false, action: 'Confirm no credentials shown in screen recording' },
];

const PORTAL_SHORT_DESCRIPTION = 'Official Gannon Waye creator workflow for content drafts, approvals, store operations, and TikTok creator tools.';

const APP_DESCRIPTION = `Gannon Waye Music is the official creator workflow platform for Australian singer-songwriter Gannon Waye. The platform manages content drafts, approvals, store operations, and TikTok creator tools for a single authorised creator account.

The TikTok integration connects only to Gannon Waye's authorised creator account. Public website visitors do not connect their own TikTok accounts.

Login Kit (user.info.basic, user.info.stats): Used to authenticate the creator account and display account statistics (follower count, following, total likes, video count) in the creator dashboard.

Content Posting API (video.list, video.upload): video.list retrieves and displays the creator's published TikTok videos and per-video performance data. video.upload is used to upload approved video drafts to the creator's TikTok account. All content requires creator approval through an internal approval pipeline before upload. After upload, the creator must manually publish from within the TikTok app.

The platform is not used for mass automation, bulk posting, spam distribution, engagement manipulation, or third-party account management.`;

const VOICEOVER = `"This is the TikTok creator workflow inside Gannon Waye Music.

The platform connects to my authorised TikTok creator account using Login Kit.

AI helps prepare content ideas, captions, drafts, and workflow recommendations, but nothing is automatically published without my approval.

When a TikTok draft is ready, it goes through the Approval Queue first.

After I approve it, the system uploads the draft to my authorised TikTok account for final creator review.

The platform is designed for creator workflow management, not spam automation, not bulk posting, and not third-party account control."`;

const UNSAFE_PHRASES = [
  'fully autonomous posting', 'AI automatically posts', 'bulk posting', 'viral automation',
  'mass creator management', 'engagement manipulation', 'growth hacking',
  'auto-posting farm', 'spam automation',
];

const SAFE_PHRASES = [
  'creator workflow', 'manual creator approval', 'approved drafts', 'content preparation',
  'creator-controlled publishing', 'internal content management', 'authorised creator account', 'workflow efficiency',
];

const ItemDetail = ({ item, type, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
    <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{type}</p>
          <h3 className="text-lg font-semibold mt-1">{item.name || item.scope || item.item}</h3>
        </div>
        {item.keep !== undefined && (
          <Badge className={item.keep ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
            {item.keep ? '✓ Keep' : '⚠ Remove'}
          </Badge>
        )}
      </div>
      {item.whyRequired && <div><p className="text-xs text-muted-foreground mb-1">Why TikTok requires it</p><p className="text-sm">{item.whyRequired}</p></div>}
      {item.rule && <div><p className="text-xs text-muted-foreground mb-1">Rule</p><p className="text-sm">{item.rule}</p></div>}
      {item.whereOnSite && <div><p className="text-xs text-muted-foreground mb-1">Where on site</p><p className="text-sm text-primary">{item.whereOnSite}</p></div>}
      {item.demoSection && <div><p className="text-xs text-muted-foreground mb-1">Demo section</p><p className="text-sm text-cyan-300">{item.demoSection}</p></div>}
      {item.missing && (
        <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-400 mb-1">⚠ Action Required</p>
          <p className="text-sm text-red-300">{item.missing}</p>
        </div>
      )}
      {item.action && !item.done && (
        <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-lg p-3">
          <p className="text-xs font-semibold text-yellow-400 mb-1">Action Required</p>
          <p className="text-sm text-yellow-300">{item.action}</p>
        </div>
      )}
      <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
    </div>
  </div>
);

export default function TikTokAppReview() {
  const { toast } = useToast();
  const [checked, setChecked] = useState({});
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const doneCount = CHECKLIST.filter((c, i) => c.done || checked[i]).length;
  const score = Math.round((doneCount / CHECKLIST.length) * 100);

  const unimplementedScopes = SCOPES.filter(s => !s.implemented);
  const unimplementedProducts = PRODUCTS.filter(p => !p.implemented);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">TikTok App Review</h1>
        <p className="text-muted-foreground text-sm mt-1">Full readiness checklist, scope matching, copy-ready description, and submission guide</p>
      </div>

      {/* PORTAL SETUP STATUS BANNER */}
      <div className="border-2 border-green-500/50 bg-green-500/8 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <p className="font-bold text-green-300 text-base">✓ Share Kit + video.publish removed — Portal is clean</p>
        </div>
        <p className="text-sm text-foreground/80">Scopes now show "No scopes yet" — correct. Now complete the steps below to configure products, scopes, and submit for review.</p>
      </div>

      {/* NEXT STEPS — PORTAL ACTION CARD */}
      <div className="border-2 border-primary/40 bg-primary/5 rounded-xl p-5 space-y-4">
        <p className="font-bold text-primary text-base">📋 What to do in TikTok Developer Portal right now</p>

        <div className="space-y-3 text-sm">
          <div className="border border-border rounded-lg p-3 space-y-1">
            <p className="font-semibold text-foreground">1. Description field (120 chars max) — paste this exactly:</p>
            <p className="font-mono text-xs bg-secondary/60 rounded p-2 text-foreground select-all">Official Gannon Waye creator workflow for content drafts, approvals, store operations, and TikTok creator tools.</p>
            <p className="text-xs text-muted-foreground">117 chars ✓</p>
          </div>

          <div className="border border-border rounded-lg p-3 space-y-1">
            <p className="font-semibold text-foreground">2. Terms of Service URL:</p>
            <p className="font-mono text-xs bg-secondary/60 rounded p-2 text-primary select-all">https://gannonwaye.com/terms-of-service</p>
          </div>

          <div className="border border-border rounded-lg p-3 space-y-1">
            <p className="font-semibold text-foreground">3. Privacy Policy URL:</p>
            <p className="font-mono text-xs bg-secondary/60 rounded p-2 text-primary select-all">https://gannonwaye.com/privacy-policy</p>
          </div>

          <div className="border border-border rounded-lg p-3 space-y-1">
            <p className="font-semibold text-foreground">4. Platform: tick <strong>Web</strong> only</p>
          </div>

          <div className="border border-border rounded-lg p-3 space-y-1">
            <p className="font-semibold text-foreground">5. Add Products — click "Add products" and select:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge className="bg-green-500/20 text-green-300">Login Kit</Badge>
              <Badge className="bg-green-500/20 text-green-300">Content Posting API</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Do NOT add Share Kit.</p>
          </div>

          <div className="border border-border rounded-lg p-3 space-y-1">
            <p className="font-semibold text-foreground">6. Add Scopes — add these 4 only:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {['user.info.basic', 'user.info.stats', 'video.list', 'video.upload'].map(s => (
                <code key={s} className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded">{s}</code>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Do NOT add video.publish.</p>
          </div>

          <div className="border border-border rounded-lg p-3 space-y-1">
            <p className="font-semibold text-foreground">7. App Review — "Explain how each product and scope works" (1000 chars) — paste this:</p>
          </div>
        </div>
      </div>

      {/* Score */}
      <Card className="border-primary/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Submission Readiness</p>
            <span className={`text-2xl font-bold ${score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{score}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div className={`h-2.5 rounded-full transition-all ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{doneCount} of {CHECKLIST.length} items complete</p>
        </CardContent>
      </Card>

      {/* SCOPE WARNINGS */}
      {(unimplementedScopes.length > 0 || unimplementedProducts.length > 0) && (
        <div className="border border-red-500/40 bg-red-500/8 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <p className="font-semibold text-red-300">Scope / Product Warnings — Action Required Before Submission</p>
          </div>
          {unimplementedScopes.map(s => (
            <div key={s.scope} className="border border-red-500/20 rounded-lg p-3 cursor-pointer hover:bg-red-500/10" onClick={() => { setSelected(s); setSelectedType('Scope'); }}>
              <div className="flex items-center gap-2 mb-1">
                <code className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">{s.scope}</code>
                <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">Remove</Badge>
              </div>
              <p className="text-xs text-red-300">{s.missing}</p>
            </div>
          ))}
          {unimplementedProducts.map(p => (
            <div key={p.name} className="border border-orange-500/20 rounded-lg p-3 cursor-pointer hover:bg-orange-500/10" onClick={() => { setSelected(p); setSelectedType('Product'); }}>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="text-xs bg-orange-500/20 text-orange-300">{p.name}</Badge>
                <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">Consider Removing</Badge>
              </div>
              <p className="text-xs text-orange-300">{p.missing}</p>
            </div>
          ))}
        </div>
      )}

      {/* RECOMMENDED CONFIG */}
      <Card className="border-green-500/30">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-green-300">✓ Recommended Fastest-Approval Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">If only draft upload is implemented, use only these:</p>
          <p className="text-xs text-green-200/80">Remove Share Kit and video.publish before submission — these are not implemented. All other scopes (user.info.basic, user.info.stats, video.list, video.upload) are demonstrated in the TikTok Review Demo page.</p>
          <div className="flex flex-wrap gap-2">
            {RECOMMENDED_PRODUCTS.map(p => <Badge key={p} className="bg-green-500/20 text-green-300">{p}</Badge>)}
          </div>
          <div className="flex flex-wrap gap-2">
            {RECOMMENDED_SCOPES.map(s => <code key={s} className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded">{s}</code>)}
          </div>
        </CardContent>
      </Card>

      {/* PRODUCTS */}
      <Card>
        <CardHeader><CardTitle>Selected Products</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {PRODUCTS.map(p => (
            <div key={p.name} className="border border-border rounded-lg p-3 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => { setSelected(p); setSelectedType('Product'); }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs">{p.name}</Badge>
                  {p.implemented ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  {p.demonstrated ? <Badge className="text-xs bg-cyan-500/20 text-cyan-300">Demonstrated</Badge> : <Badge className="text-xs bg-orange-500/20 text-orange-300">Not Demonstrated</Badge>}
                </div>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              {p.missing && <p className="text-xs text-red-300 mt-1">{p.missing.slice(0, 80)}…</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SCOPES */}
      <Card>
        <CardHeader><CardTitle>Selected Scopes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {SCOPES.map(s => (
            <div key={s.scope} className="border border-border rounded-lg p-3 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => { setSelected(s); setSelectedType('Scope'); }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{s.scope}</code>
                  <Badge variant="outline" className="text-xs">{s.product}</Badge>
                  {s.keep ? <Badge className="text-xs bg-green-500/20 text-green-300">Keep</Badge> : <Badge className="text-xs bg-red-500/20 text-red-300">Remove</Badge>}
                  {s.demonstrated ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                </div>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              {!s.keep && <p className="text-xs text-red-300 mt-1">{s.missing}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DOMAIN VERIFICATION */}
      <Card>
        <CardHeader><CardTitle>Domain Verification</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Official Domain', value: 'https://gannonwaye.com', ok: true },
            { label: 'Privacy Policy', value: 'https://gannonwaye.com/privacy-policy', ok: true },
            { label: 'Terms of Service', value: 'https://gannonwaye.com/terms-of-service', ok: true },
            { label: 'Redirect URI', value: 'https://gannonwaye.com/tiktok-callback', ok: false, action: 'Add to TikTok portal' },
            { label: 'Verification File', value: 'tiktok-developers-site-verification=KxZOq6nwSqmVh0UJXgnalbWrdx6eOC9U', ok: true },
            { label: 'DNS TXT Record', value: 'tiktok-developers-site-verification=OsUg2LUCoNJIimgbEa9Oq8H6pkYGR1ZC', ok: false, action: 'Add TXT record at domain registrar (GoDaddy/Cloudflare)' },
            { label: 'Webhook Callback URL', value: 'https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/tiktokWebhook', ok: true },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              {item.ok ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-primary font-mono truncate">{item.value}</p>
                {item.action && !item.ok && <p className="text-xs text-orange-300 mt-0.5">{item.action}</p>}
              </div>
              <Button size="sm" variant="ghost" className="h-6 text-xs shrink-0" onClick={() => { navigator.clipboard.writeText(item.value); toast({ title: 'Copied' }); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CHECKLIST */}
      <Card>
        <CardHeader><CardTitle>Full Submission Checklist</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {CHECKLIST.map((item, i) => (
            <div key={i} className="flex items-start gap-3 cursor-pointer group" onClick={() => { setSelected(item); setSelectedType('Checklist Item'); toggle(i); }}>
              {(item.done || checked[i]) ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <div className="w-4 h-4 rounded-full border border-border shrink-0 mt-0.5 group-hover:border-primary" />}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${(item.done || checked[i]) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.item}</p>
                {item.value && <p className="text-xs text-primary font-mono truncate">{item.value}</p>}
                {item.action && !item.done && !checked[i] && <p className="text-xs text-orange-300">{item.action}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* APP DESCRIPTION */}
      <Card>
        <CardHeader><CardTitle>Copy-Ready App Review Description</CardTitle></CardHeader>
        <CardContent>
          <CopyBlock label="Safe TikTok Portal Short Description (120 chars)" value={PORTAL_SHORT_DESCRIPTION} />
          <div className="h-3" />
          <p className="text-xs text-muted-foreground mb-3">Paste this into the TikTok portal "Explain how each product and scope works" field.</p>
          <CopyBlock label="App Review Description" value={APP_DESCRIPTION} multiline />
        </CardContent>
      </Card>

      {/* VOICEOVER */}
      <Card>
        <CardHeader><CardTitle>Demo Video Voiceover Script</CardTitle></CardHeader>
        <CardContent>
          <CopyBlock label="Voiceover (read while recording Part 8)" value={VOICEOVER} multiline />
        </CardContent>
      </Card>

      {/* SECURITY WARNING */}
      <Card className="border-red-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-red-300">
            <Shield className="w-4 h-4" /> Security Warning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-red-300/80">The TikTok client secret has been exposed in chat. Treat it as compromised and rotate/regenerate it before production submission.</p>
          <p className="text-red-300/80">Do <strong>not</strong> display your TikTok client secret in the screen recording, review text, screenshots, or documents.</p>
          <p className="text-muted-foreground text-xs">Client Key may be visible in the portal. Client Secret must only be stored in the secure environment variable and never shown after saving.</p>
          <p className="text-yellow-300/80 text-xs">Also rotate any Stripe, webhook, OpusClip, Meta, Google, or other API secret that appeared in chat, screenshots, logs, or recordings.</p>
        </CardContent>
      </Card>

      {/* SAFE LANGUAGE */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Language Guide — What to Say / Not Say</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-red-400 mb-2">⛔ Do NOT use</p>
              <div className="space-y-1">
                {UNSAFE_PHRASES.map(p => <p key={p} className="text-xs text-red-300/70 line-through">{p}</p>)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-green-400 mb-2">✓ Use instead</p>
              <div className="space-y-1">
                {SAFE_PHRASES.map(p => <p key={p} className="text-xs text-green-300/80">{p}</p>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QUICK LINKS */}
      <Card>
        <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            { label: 'TikTok Developer Portal', url: 'https://developers.tiktok.com' },
            { label: 'App Review Guidelines', url: 'https://developers.tiktok.com/doc/app-review-guidelines' },
            { label: 'Privacy Policy', url: 'https://gannonwaye.com/privacy-policy' },
            { label: 'Terms of Service', url: 'https://gannonwaye.com/terms-of-service' },
            { label: 'TikTok Review Demo (10-step)', url: '/admin/tiktok-review-demo' },
            { label: 'Screen Recording Guide', url: '/admin/tiktok-screen-guide' },
            { label: 'Recording Studio', url: '/admin/tiktok-recording-studio' },
            { label: 'Social + Distribution Readiness', url: '/admin/social-distribution-readiness' },
          ].map(l => (
            <a key={l.url} href={l.url} target={l.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />{l.label}</Button>
            </a>
          ))}
        </CardContent>
      </Card>

      {selected && <ItemDetail item={selected} type={selectedType} onClose={() => setSelected(null)} />}
    </div>
  );
}