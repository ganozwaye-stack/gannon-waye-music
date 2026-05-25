import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Loader2, Zap, CheckCircle2, AlertTriangle, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const STATUS_CONFIG = {
  not_connected: { label: 'Not Connected', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', Icon: Clock },
  needs_credentials: { label: 'Needs Credentials', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', Icon: AlertTriangle },
  connecting: { label: 'Connecting', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', Icon: Loader2 },
  testing: { label: 'Testing', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', Icon: Loader2 },
  live: { label: 'Live', color: 'bg-green-500/10 text-green-400 border-green-500/30', Icon: CheckCircle2 },
  error: { label: 'Error', color: 'bg-red-500/10 text-red-400 border-red-500/30', Icon: XCircle },
  disabled: { label: 'Disabled', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', Icon: XCircle },
};

const PLATFORMS = [
  { platform_name: 'TikTok API', category: 'social', purpose: 'Post scheduling, analytics, viral content tracking', developer_account_required: true, api_key_required: true, oauth_required: true, approval_required: true, risk_level: 'medium', human_action_required: 'Create TikTok Developer account at developers.tiktok.com, submit app for review', permissions_needed: ['video.upload', 'video.list', 'user.info.basic', 'video.insights'], setup_steps: ['Go to developers.tiktok.com', 'Create developer account', 'Create new app', 'Submit for sandbox access', 'Generate client key + secret', 'Add to environment variables'] },
  { platform_name: 'Instagram Graph API', category: 'social', purpose: 'Post analytics, comments, DM management, insights', developer_account_required: true, api_key_required: false, oauth_required: true, approval_required: true, risk_level: 'medium', human_action_required: 'Connect Facebook Developer account, create Meta App, link Instagram Business account', permissions_needed: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_comments', 'instagram_manage_insights'], setup_steps: ['Go to developers.facebook.com', 'Create Meta App', 'Add Instagram product', 'Connect Instagram Business account', 'Request advanced permissions'] },
  { platform_name: 'Facebook/Meta API', category: 'social', purpose: 'Page management, ad insights, audience data', developer_account_required: true, api_key_required: false, oauth_required: true, approval_required: true, risk_level: 'high', human_action_required: 'Requires Meta Business Suite account and app review for most permissions', permissions_needed: ['pages_manage_posts', 'pages_read_engagement', 'ads_read'], setup_steps: ['Create Meta Developer app', 'Add Facebook Login product', 'Request page permissions', 'Submit for app review'] },
  { platform_name: 'YouTube Data API', category: 'social', purpose: 'Video analytics, comment management, upload stats', developer_account_required: true, api_key_required: true, oauth_required: true, approval_required: false, risk_level: 'low', human_action_required: 'Enable YouTube Data API v3 in Google Cloud Console, create OAuth credentials', permissions_needed: ['youtube.readonly', 'youtube.force-ssl'], setup_steps: ['Go to console.cloud.google.com', 'Enable YouTube Data API v3', 'Create OAuth 2.0 credentials', 'Download credentials JSON', 'Add API key to environment'] },
  { platform_name: 'Spotify for Artists', category: 'distribution', purpose: 'Stream analytics, audience demographics, playlist pitching', developer_account_required: false, api_key_required: false, oauth_required: true, approval_required: false, risk_level: 'low', human_action_required: 'Claim Spotify for Artists profile at artists.spotify.com, then connect Spotify API via developers.spotify.com', permissions_needed: ['user-read-private', 'user-read-email', 'user-library-read'], setup_steps: ['Claim artist profile at artists.spotify.com', 'Go to developer.spotify.com', 'Create app', 'Get Client ID + Secret', 'Add to environment'] },
  { platform_name: 'Too Lost / Toolost', category: 'distribution', purpose: 'Music distribution, royalty tracking, catalog sync', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: false, risk_level: 'low', human_action_required: 'Log into Toolost account, find API key in account settings or contact Toolost support', permissions_needed: ['catalog.read', 'royalties.read', 'releases.read'], setup_steps: ['Log in at toolost.com', 'Go to Account → Developer / API', 'Copy API key', 'Add TOOLOST_API_KEY to environment variables'] },
  { platform_name: 'Stripe', category: 'payment', purpose: 'Payment processing, subscriptions, invoices', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: true, risk_level: 'high', human_action_required: '⚠️ Already connected. Never change keys without approval. Stripe changes require ApprovalQueue sign-off.', permissions_needed: ['payments', 'refunds', 'customers', 'subscriptions'], setup_steps: ['Already configured', 'STRIPE_SECRET_KEY set', 'STRIPE_PUBLISHABLE_KEY set', 'Do not change without approval'] },
  { platform_name: 'Gmail', category: 'productivity', purpose: 'Send/receive emails, fan replies, notifications', developer_account_required: false, api_key_required: false, oauth_required: true, approval_required: false, risk_level: 'low', human_action_required: '✅ Already connected via Base44 OAuth connector', permissions_needed: ['gmail.send', 'gmail.readonly'], setup_steps: ['Already authorized', 'Gmail connector active', 'Scopes: send + readonly'] },
  { platform_name: 'Google Drive', category: 'productivity', purpose: 'Document storage, file sync, asset management', developer_account_required: false, api_key_required: false, oauth_required: true, approval_required: false, risk_level: 'low', human_action_required: 'Connect via Base44 OAuth connector (Google Drive)', permissions_needed: ['drive.file', 'drive.readonly'], setup_steps: ['Go to Admin → API Setup', 'Connect Google Drive via OAuth', 'Authorize drive.file scope'] },
  { platform_name: 'Google Sheets', category: 'productivity', purpose: 'Order sync, data export, tracking sheets', developer_account_required: false, api_key_required: false, oauth_required: true, approval_required: false, risk_level: 'low', human_action_required: '✅ Already connected via Base44 OAuth connector', permissions_needed: ['spreadsheets', 'drive.file'], setup_steps: ['Already authorized', 'GOOGLE_SHEET_ID set', 'Sheets connector active'] },
  { platform_name: 'Google Calendar', category: 'productivity', purpose: 'Booking management, release schedule, reminders', developer_account_required: false, api_key_required: false, oauth_required: true, approval_required: false, risk_level: 'low', human_action_required: 'Connect via Base44 Google Calendar OAuth connector', permissions_needed: ['calendar.events', 'calendar.readonly'], setup_steps: ['Go to Admin → connect Google Calendar', 'Authorize calendar events scope'] },
  { platform_name: 'Zapier', category: 'infrastructure', purpose: 'No-code automation between apps', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: false, risk_level: 'low', human_action_required: 'Create Zapier account at zapier.com, find API key in Settings → Developer', permissions_needed: ['zaps.read', 'zaps.write'], setup_steps: ['Sign up at zapier.com', 'Go to Settings → Developer', 'Copy API key', 'Add ZAPIER_API_KEY to environment'] },
  { platform_name: 'Make (Integromat)', category: 'infrastructure', purpose: 'Advanced automation workflows', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: false, risk_level: 'low', human_action_required: 'Create Make account at make.com, find API token in Profile → API', permissions_needed: ['scenarios.read', 'scenarios.write'], setup_steps: ['Sign up at make.com', 'Go to Profile → API', 'Generate API token', 'Add MAKE_API_KEY to environment'] },
  { platform_name: 'n8n', category: 'infrastructure', purpose: 'Self-hosted automation engine', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: true, risk_level: 'medium', human_action_required: 'Deploy n8n instance (cloud or self-hosted), generate API key from Settings', permissions_needed: ['workflows.all'], setup_steps: ['Deploy n8n at app.n8n.cloud or self-host', 'Create account', 'Go to Settings → API', 'Generate API key', 'Add N8N_API_KEY + N8N_BASE_URL to environment'] },
  { platform_name: 'Runway', category: 'ai_creative', purpose: 'AI video generation, visual effects', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: false, risk_level: 'low', human_action_required: 'Create Runway account at runwayml.com, go to API settings to generate key', permissions_needed: ['generations.create'], setup_steps: ['Sign up at runwayml.com', 'Go to Account → API', 'Generate API key', 'Add RUNWAY_API_KEY to environment'] },
  { platform_name: 'Krea', category: 'ai_creative', purpose: 'AI image generation, real-time creative tools', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: false, risk_level: 'low', human_action_required: 'Create Krea account at krea.ai, check API access (currently limited beta)', permissions_needed: ['images.generate'], setup_steps: ['Sign up at krea.ai', 'Request API access (beta)', 'Add KREA_API_KEY when available'] },
  { platform_name: 'CapCut', category: 'ai_creative', purpose: 'Video editing templates, AI effects, content creation', developer_account_required: false, api_key_required: false, oauth_required: false, approval_required: false, risk_level: 'none', human_action_required: 'CapCut has no public API — use manually via app. No integration available.', permissions_needed: [], setup_steps: ['Use CapCut manually via mobile or desktop app', 'No API integration available'] },
  { platform_name: 'Canva', category: 'ai_creative', purpose: 'Design creation, template editing, brand assets', developer_account_required: true, api_key_required: true, oauth_required: true, approval_required: false, risk_level: 'low', human_action_required: 'Apply for Canva Connect API at canva.com/developers', permissions_needed: ['design:content:read', 'design:content:write'], setup_steps: ['Apply at canva.com/developers', 'Create Connect app', 'Get OAuth credentials', 'Add CANVA_CLIENT_ID + CANVA_CLIENT_SECRET'] },
  { platform_name: 'ElevenLabs', category: 'ai_creative', purpose: 'AI voice synthesis, text-to-speech, voice cloning', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: false, risk_level: 'low', human_action_required: 'Create ElevenLabs account at elevenlabs.io, go to Profile → API Key', permissions_needed: ['text_to_speech', 'voice_generation'], setup_steps: ['Sign up at elevenlabs.io', 'Go to Profile → API Key', 'Copy key', 'Add ELEVENLABS_API_KEY to environment'] },
  { platform_name: 'PostHog', category: 'analytics', purpose: 'Product analytics, user behaviour tracking, event capture, funnels', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: false, risk_level: 'low', human_action_required: 'Create PostHog account at posthog.com, create project, get API key from Settings → Project Settings → Project API Key. LLM inference included — no additional API key needed.', permissions_needed: ['events.create', 'events.read', 'persons.read'], setup_steps: ['Sign up at posthog.com', 'Create new project', 'Go to Settings → Project Settings', 'Copy Project API Key (phc_...)', 'Add POSTHOG_KEY to environment variables', 'Initialize PostHog in React with your API key'] },
  { platform_name: 'Cloudflare', category: 'infrastructure', purpose: 'CDN, DDoS protection, DNS, edge functions', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: true, risk_level: 'high', human_action_required: 'Create Cloudflare account, go to My Profile → API Tokens → Create Token', permissions_needed: ['zone.read', 'cache_purge', 'dns.edit'], setup_steps: ['Sign up at cloudflare.com', 'Go to My Profile → API Tokens', 'Create scoped token', 'Add CLOUDFLARE_API_TOKEN + CLOUDFLARE_ZONE_ID to environment'] },
  { platform_name: 'Sentry', category: 'infrastructure', purpose: 'Error monitoring, performance tracking, alerts', developer_account_required: false, api_key_required: true, oauth_required: false, approval_required: false, risk_level: 'low', human_action_required: 'Create Sentry account at sentry.io, go to Settings → API → Auth Tokens', permissions_needed: ['project:read', 'event:read'], setup_steps: ['Sign up at sentry.io', 'Create project', 'Go to Settings → API → Auth Tokens', 'Create token', 'Add SENTRY_DSN to environment'] },
];

const CATEGORY_LABELS = {
  social: '📱 Social',
  distribution: '🎵 Distribution',
  payment: '💳 Payment',
  productivity: '📊 Productivity',
  ai_creative: '🎨 AI Creative',
  analytics: '📈 Analytics',
  infrastructure: '🔧 Infrastructure',
};

export default function ApiSetup() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [generatedGuide, setGeneratedGuide] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: dbPlatforms = [], isLoading } = useQuery({
    queryKey: ['api-integration-setup'],
    queryFn: () => base44.entities.ApiIntegrationSetup.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ApiIntegrationSetup.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-integration-setup'] }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ApiIntegrationSetup.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-integration-setup'] }),
  });

  // Merge static platform definitions with any DB overrides
  const platforms = PLATFORMS.map(p => {
    const saved = dbPlatforms.find(d => d.platform_name === p.platform_name);
    return saved ? { ...p, ...saved } : p;
  });

  const filtered = filterCategory === 'all' ? platforms : platforms.filter(p => p.category === filterCategory);

  const seedPlatforms = async () => {
    const existing = dbPlatforms.map(d => d.platform_name);
    const toSeed = PLATFORMS.filter(p => !existing.includes(p.platform_name));
    for (const p of toSeed) {
      await createMutation.mutateAsync(p);
    }
    toast({ title: `Seeded ${toSeed.length} platform records` });
  };

  const generateGuide = async (platform) => {
    setGenerating(platform.platform_name);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an API setup assistant for a music artist's AI operating system. Generate a clear, step-by-step setup guide for integrating ${platform.platform_name}.

Context: This is for Gannon Waye — an independent music artist in Australia building a private AI operating system.

Purpose: ${platform.purpose}
Permissions needed: ${platform.permissions_needed?.join(', ') || 'standard'}
OAuth required: ${platform.oauth_required}
API key required: ${platform.api_key_required}
Developer account required: ${platform.developer_account_required}
Risk level: ${platform.risk_level}

Generate:
1. Prerequisites (what accounts/access is needed first)
2. Step-by-step setup instructions (specific URLs, button names, menu paths)
3. What credentials to save and under what environment variable names
4. How to test the connection once set up
5. Common errors and how to fix them
6. Privacy/security notes
7. Sample app description to use when creating the developer app (if needed)

Be specific, practical, and safe. Flag anything that costs money or requires approval.`,
      });
      setGeneratedGuide(prev => ({ ...prev, [platform.platform_name]: result }));
    } catch (err) {
      toast({ title: 'Guide generation failed', variant: 'destructive' });
    }
    setGenerating(null);
  };

  const updateStatus = (platform, newStatus) => {
    const saved = dbPlatforms.find(d => d.platform_name === platform.platform_name);
    if (saved) {
      updateMutation.mutate({ id: saved.id, data: { setup_status: newStatus } });
    } else {
      createMutation.mutate({ ...platform, setup_status: newStatus });
    }
    toast({ title: `${platform.platform_name} → ${newStatus}` });
  };

  const liveCount = platforms.filter(p => {
    const saved = dbPlatforms.find(d => d.platform_name === p.platform_name);
    return (saved?.setup_status || p.setup_status || 'not_connected') === 'live';
  }).length;

  const needsCredCount = platforms.filter(p => {
    const saved = dbPlatforms.find(d => d.platform_name === p.platform_name);
    const status = saved?.setup_status || p.setup_status || 'not_connected';
    return status === 'needs_credentials' || status === 'not_connected';
  }).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">API Setup Assistant</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Safe, guided credential setup for all integrations — private admin only</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={seedPlatforms} disabled={createMutation.isPending}>
            <RefreshCw className="w-4 h-4 mr-1" />Seed All Platforms
          </Button>
        </div>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-start gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-300 text-xs font-semibold">Do-Not-Spend-Or-Lose Rule: ACTIVE</p>
          <p className="text-yellow-300/70 text-xs mt-0.5">Secrets are never displayed after saving. No paid subscriptions, terms of service, financial settings, or app review submissions will be made without explicit approval. All high-risk connections go to ApprovalQueue first.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-400">{liveCount}</p><p className="text-xs text-muted-foreground">Live</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-yellow-400">{needsCredCount}</p><p className="text-xs text-muted-foreground">Needs Credentials</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{platforms.length}</p><p className="text-xs text-muted-foreground">Total Platforms</p></CardContent></Card>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant={filterCategory === 'all' ? 'default' : 'ghost'} className="text-xs" onClick={() => setFilterCategory('all')}>All ({platforms.length})</Button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <Button key={key} size="sm" variant={filterCategory === key ? 'default' : 'ghost'} className="text-xs" onClick={() => setFilterCategory(key)}>
            {label} ({platforms.filter(p => p.category === key).length})
          </Button>
        ))}
      </div>

      {/* Platform list */}
      <div className="space-y-2">
        {filtered.map(platform => {
          const saved = dbPlatforms.find(d => d.platform_name === platform.platform_name);
          const currentStatus = saved?.setup_status || platform.setup_status || 'not_connected';
          const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.not_connected;
          const StatusIcon = cfg.Icon;
          const isOpen = expanded === platform.platform_name;
          const guide = generatedGuide[platform.platform_name];
          const isGenerating = generating === platform.platform_name;

          return (
            <Card key={platform.platform_name} className={isOpen ? 'border-primary/30' : 'border-border'}>
              <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(isOpen ? null : platform.platform_name)}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge className={`text-xs border shrink-0 ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />{cfg.label}
                    </Badge>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{platform.platform_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{platform.purpose}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs hidden md:inline-flex">{CATEGORY_LABELS[platform.category]}</Badge>
                    {platform.approval_required && <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-xs hidden md:inline-flex">Needs Approval</Badge>}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </CardHeader>

              {isOpen && (
                <CardContent className="pt-0 space-y-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {/* Requirements */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Requirements</p>
                      <div className="space-y-1">
                        {[
                          { label: 'Developer Account', val: platform.developer_account_required },
                          { label: 'API Key', val: platform.api_key_required },
                          { label: 'OAuth', val: platform.oauth_required },
                          { label: 'Approval Required', val: platform.approval_required },
                        ].map(r => (
                          <div key={r.label} className="flex items-center gap-2 text-xs">
                            {r.val ? <CheckCircle2 className="w-3 h-3 text-primary" /> : <span className="w-3 h-3 inline-block rounded-full border border-border" />}
                            <span className={r.val ? 'text-foreground' : 'text-muted-foreground'}>{r.label}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span className="text-muted-foreground">Risk:</span>
                          <Badge variant="outline" className={`text-xs ${platform.risk_level === 'high' ? 'text-red-400' : platform.risk_level === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{platform.risk_level}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Setup steps */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Setup Steps</p>
                      <ol className="space-y-1">
                        {platform.setup_steps?.map((step, i) => (
                          <li key={i} className="text-xs flex gap-2">
                            <span className="text-primary shrink-0 font-medium">{i + 1}.</span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Permissions */}
                  {platform.permissions_needed?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Permissions Needed</p>
                      <div className="flex flex-wrap gap-1">
                        {platform.permissions_needed.map(p => (
                          <code key={p} className="text-xs bg-secondary px-2 py-0.5 rounded text-primary">{p}</code>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Human action required */}
                  <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-3">
                    <p className="text-xs font-medium text-yellow-400 mb-1">👤 Manual Action Required</p>
                    <p className="text-xs text-muted-foreground">{platform.human_action_required}</p>
                  </div>

                  {/* Generated guide */}
                  {guide && (
                    <div className="border border-primary/20 bg-primary/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-primary">AI Setup Guide</p>
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { navigator.clipboard.writeText(guide); toast({ title: 'Copied' }); }}>
                          <Copy className="w-3 h-3 mr-1" />Copy
                        </Button>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-xs max-h-72 overflow-y-auto">
                        <ReactMarkdown>{guide}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap pt-1">
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => generateGuide(platform)} disabled={isGenerating}>
                      {isGenerating ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Generating...</> : <><Zap className="w-3 h-3 mr-1" />Generate Setup Guide</>}
                    </Button>
                    {['not_connected', 'needs_credentials', 'testing', 'live', 'error', 'disabled'].map(s => (
                      <Button key={s} size="sm" variant={currentStatus === s ? 'default' : 'ghost'} className="text-xs capitalize"
                        onClick={() => updateStatus(platform, s)}>
                        {s.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}