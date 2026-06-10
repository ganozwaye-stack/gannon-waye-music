import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle2, AlertTriangle, Lock, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ─── INTEGRATIONS YOU NEED TO ACTION PERSONALLY ──────────────────────────────
// Grouped by: Already done | Needs your login | Gannon-only action | Low priority / optional

const DONE = [
  { name: 'Stripe (Payments)', note: 'STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY + STRIPE_WEBHOOK_SECRET all set. Live mode active.' },
  { name: 'Google Sheets', note: 'GOOGLE_SHEET_ID set. OAuth connector authorized. Order sync working.' },
  { name: 'Metricool', note: 'METRICOOL_API_TOKEN + METRICOOL_USER_ID + METRICOOL_BLOG_ID all set.' },
  { name: 'TikTok OAuth', note: 'TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET set. OAuth flow built.' },
  { name: 'OpenAI', note: 'OPENAI_API_KEY set. All AI agents and content generation working.' },
  { name: 'GitHub', note: 'GITHUB_TOKEN set.' },
];

const GANNON_MUST_DO = [
  {
    name: 'YouTube Data API',
    priority: 'high',
    time: '10 min',
    url: 'https://console.cloud.google.com',
    steps: [
      'Go to console.cloud.google.com → Sign in with your Google account',
      'Select or create a project → click "APIs & Services" → "Enable APIs"',
      'Search "YouTube Data API v3" → Enable it',
      'Go to "Credentials" → "Create Credentials" → "API Key"',
      'Copy the key → add as YOUTUBE_API_KEY in Base44 Settings → Secrets',
    ],
    env_var: 'YOUTUBE_API_KEY',
  },
  {
    name: 'Instagram Graph API (Meta)',
    priority: 'high',
    time: '30 min',
    url: 'https://developers.facebook.com',
    steps: [
      'Go to developers.facebook.com → Log in with your Facebook account',
      'Click "My Apps" → "Create App" → choose "Business" type',
      'Add "Instagram Graph API" product to your app',
      'Connect your Instagram Business account under Instagram Basic Display',
      'Request permissions: instagram_basic, instagram_content_publish, instagram_manage_insights',
      'Get your User Access Token and Instagram User ID',
      'Add as INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in Secrets',
    ],
    env_var: 'INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_USER_ID',
    note: 'Requires Instagram Business account (not personal). Your account must be connected to a Facebook Page.',
  },
  {
    name: 'Spotify for Artists',
    priority: 'medium',
    time: '15 min',
    url: 'https://developer.spotify.com/dashboard',
    steps: [
      'Go to developer.spotify.com/dashboard → Log in with your Spotify account',
      'Click "Create App" → name it "Gannon Waye Music OS"',
      'Set redirect URI to: https://gannonwaye.com/spotify-callback',
      'Copy Client ID and Client Secret',
      'Add as SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Secrets',
    ],
    env_var: 'SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET',
  },
  {
    name: 'Stripe Webhooks (verify endpoint)',
    priority: 'high',
    time: '5 min',
    url: 'https://dashboard.stripe.com/webhooks',
    steps: [
      'Go to dashboard.stripe.com → Developers → Webhooks',
      'Confirm webhook endpoint URL matches your live site',
      'Verify STRIPE_WEBHOOK_SECRET matches the signing secret shown in Stripe',
      'Check that these events are subscribed: payment_intent.succeeded, checkout.session.completed, charge.refunded',
    ],
    env_var: 'STRIPE_WEBHOOK_SECRET (already set — just verify)',
    note: '⚠️ This is already set but needs a manual verification that the endpoint URL is pointing to your live domain.',
  },
  {
    name: 'X / Twitter API',
    priority: 'low',
    time: '20 min',
    url: 'https://developer.x.com/en/portal/dashboard',
    steps: [
      'Go to developer.x.com → Apply for Developer Access (Basic is free)',
      'Create a new Project and App',
      'Go to App Settings → "Keys and Tokens"',
      'Generate "Consumer Keys" (API Key + Secret) and "Access Token + Secret"',
      'Add as X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET in Secrets',
    ],
    env_var: 'X_API_KEY + X_API_SECRET + X_ACCESS_TOKEN + X_ACCESS_SECRET',
  },
  {
    name: 'Sentry (Error Monitoring)',
    priority: 'medium',
    time: '10 min',
    url: 'https://sentry.io',
    steps: [
      'Go to sentry.io → Create free account',
      'Create new project → select "React" as platform',
      'Copy the DSN value shown after project creation',
      'Add as SENTRY_DSN in Secrets',
    ],
    env_var: 'SENTRY_DSN',
  },
  {
    name: 'ElevenLabs (AI Voice)',
    priority: 'low',
    time: '5 min',
    url: 'https://elevenlabs.io/app/settings/api-keys',
    steps: [
      'Go to elevenlabs.io → Log in or create account',
      'Go to Profile → API Keys',
      'Click "Create API Key" → copy it',
      'Add as ELEVENLABS_API_KEY in Secrets',
    ],
    env_var: 'ELEVENLABS_API_KEY',
  },
  {
    name: 'Too Lost / Toolost (Distribution)',
    priority: 'medium',
    time: '5 min',
    url: 'https://toolost.com',
    steps: [
      'Log in to your Toolost account at toolost.com',
      'Go to Account Settings → Developer / API section',
      'If no API key exists, contact Toolost support to request one',
      'Add as TOOLOST_API_KEY in Secrets',
    ],
    env_var: 'TOOLOST_API_KEY',
  },
];

const OPTIONAL = [
  { name: 'PostHog', note: 'Analytics. Already partially configured via posthog-js. Optional: add POSTHOG_KEY secret for server-side events.', url: 'https://posthog.com' },
  { name: 'Canva Connect API', note: 'Apply at canva.com/developers. Beta access required. Low priority.', url: 'https://www.canva.com/developers' },
  { name: 'Runway ML', note: 'AI video generation. Get API key at runwayml.com → Account → API.', url: 'https://runwayml.com' },
  { name: 'Zapier', note: 'No-code automation bridge. Only needed if you want Zapier workflows. Get key from zapier.com → Settings → Developer.', url: 'https://zapier.com' },
  { name: 'Make (Integromat)', note: 'Advanced automations. Get token from make.com → Profile → API.', url: 'https://make.com' },
  { name: 'n8n', note: 'Self-hosted automations. Deploy first, then get API key.', url: 'https://app.n8n.cloud' },
  { name: 'Cloudflare', note: 'CDN/DNS. Only needed if migrating hosting. High risk — requires approval before changing.', url: 'https://cloudflare.com' },
  { name: 'Pinterest API', note: 'Currently low traffic channel for music artists. Set up when Pinterest is part of active strategy.', url: 'https://developers.pinterest.com' },
  { name: 'CapCut', note: 'No public API available — use the app manually. No integration possible.', url: null },
  { name: 'Krea', note: 'API access is limited beta. Check krea.ai for availability.', url: 'https://krea.ai' },
  { name: 'Facebook/Meta API', note: 'Covered partially by Instagram Graph API setup. Full Facebook Page API requires app review which can take weeks.', url: 'https://developers.facebook.com' },
];

const PRIORITY_COLOR = { high: 'text-red-400 bg-red-500/10 border-red-500/30', medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', low: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };

export default function IntegrationActionCentre() {
  return (
    <div className="space-y-6 pb-10 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/api-setup"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />API Setup</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Integration Action Centre</h1>
          <p className="text-sm text-muted-foreground">Exactly what YOU need to do — direct links, step-by-step</p>
        </div>
      </div>

      {/* Export details */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5">
          <p className="font-bold text-sm text-primary mb-3">📤 Export Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div><span className="text-foreground font-medium">Base44 App ID:</span> 69eb7905ca6eb4180010f794</div>
            <div><span className="text-foreground font-medium">Owner email:</span> ganozwaye@gmail.com</div>
            <div><span className="text-foreground font-medium">Stripe Mode:</span> Live (sk_live_ confirmed)</div>
            <div><span className="text-foreground font-medium">Google Sheet ID:</span> Set via GOOGLE_SHEET_ID secret</div>
            <div><span className="text-foreground font-medium">Metricool Blog ID:</span> Set via METRICOOL_BLOG_ID secret</div>
            <div><span className="text-foreground font-medium">TikTok App:</span> TIKTOK_CLIENT_KEY + SECRET set</div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Link to="/admin/api-setup"><Button size="sm" variant="outline" className="text-xs gap-1"><Zap className="w-3 h-3" />API Setup Dashboard</Button></Link>
            <Link to="/admin/stripe-command-centre"><Button size="sm" variant="outline" className="text-xs">Stripe Command Centre</Button></Link>
            <Link to="/admin/site-health"><Button size="sm" variant="outline" className="text-xs">Run Site Health Check</Button></Link>
          </div>
        </CardContent>
      </Card>

      {/* Already done */}
      <Card className="border-green-500/20">
        <CardHeader><CardTitle className="text-base flex items-center gap-2 text-green-400"><CheckCircle2 className="w-4 h-4" />Already Connected & Working ({DONE.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {DONE.map(d => (
            <div key={d.name} className="flex items-start gap-3 px-3 py-2 bg-green-500/5 rounded-lg border border-green-500/10">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.note}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gannon must action */}
      <Card className="border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />Needs Your Action — Direct Links ({GANNON_MUST_DO.length})
          </CardTitle>
          <p className="text-xs text-muted-foreground">These require you to log into external platforms. Click the link, follow the steps, then add the key to Base44 Settings → Secrets.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {GANNON_MUST_DO.map(item => (
            <div key={item.name} className="border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <Badge className={`text-[10px] border ${PRIORITY_COLOR[item.priority]}`}>{item.priority}</Badge>
                  <span className="text-xs text-muted-foreground">⏱ {item.time}</span>
                </div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-1 text-xs shrink-0" variant="outline">
                      <ExternalLink className="w-3 h-3" />Open →
                    </Button>
                  </a>
                )}
              </div>

              <ol className="space-y-1.5 mb-3">
                {item.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="flex items-center gap-2 flex-wrap mt-2">
                <code className="text-xs bg-secondary px-2 py-1 rounded text-primary font-mono">{item.env_var}</code>
                <a href="https://base44.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-xs text-primary/60 hover:text-primary transition-colors">
                  → Add in Base44 Settings → Secrets
                </a>
              </div>

              {item.note && (
                <p className="text-xs text-yellow-300/70 mt-2 bg-yellow-500/5 rounded p-2">{item.note}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Optional / low priority */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />Optional / Low Priority ({OPTIONAL.length})
          </CardTitle>
          <p className="text-xs text-muted-foreground">Set up when you need them — not blocking anything right now.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {OPTIONAL.map(item => (
            <div key={item.name} className="flex items-start justify-between gap-3 px-3 py-2.5 border border-border/40 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
              </div>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="ghost" className="text-xs gap-1 shrink-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* What's blocked until keys are added */}
      <Card className="border-red-500/20 bg-red-500/3">
        <CardHeader><CardTitle className="text-base text-red-400 flex items-center gap-2"><Lock className="w-4 h-4" />What's Blocked Without These Keys</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          {[
            { key: 'YOUTUBE_API_KEY', blocks: 'YouTube analytics, video stats in admin dashboard' },
            { key: 'INSTAGRAM_ACCESS_TOKEN', blocks: 'Instagram post analytics, comment monitoring, insights' },
            { key: 'SPOTIFY_CLIENT_ID/SECRET', blocks: 'Spotify stream stats, audience data, playlist tracking' },
            { key: 'STRIPE_WEBHOOK endpoint', blocks: 'Order confirmation emails, stock deduction on payment — verify urgently' },
            { key: 'TOOLOST_API_KEY', blocks: 'Distribution royalty sync, catalog management' },
            { key: 'X_API_KEY', blocks: 'Twitter/X post scheduling, analytics' },
            { key: 'SENTRY_DSN', blocks: 'Error monitoring — currently flying blind on production errors' },
            { key: 'ELEVENLABS_API_KEY', blocks: 'AI voice synthesis features' },
          ].map(b => (
            <div key={b.key} className="flex gap-3">
              <code className="text-red-400/70 font-mono shrink-0">{b.key}</code>
              <span>→ {b.blocks}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}