import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, CheckCircle2, ClipboardList, ExternalLink, Lock, PlayCircle, RefreshCw, Shield, Wrench, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PLATFORMS = [
  ['Stripe', 'payments', 'Revenue Critical', 'Revenue Command Agent', 'Connected', 'Payment processing, checkout sessions, refunds, subscriptions.', 'Can spend money or change payment state. Approval required for refunds/settings.', ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY']],
  ['Stripe Webhooks', 'payments', 'Revenue Critical', 'Revenue Command Agent', 'Needs Credential', 'Confirms payments, refunds, disputes, subscriptions, and order status.', 'Requires STRIPE_WEBHOOK_SECRET from Stripe. Endpoint must not use admin auth.', ['STRIPE_WEBHOOK_SECRET']],
  ['Order Reports', 'payments', 'Revenue Critical', 'Revenue Command Agent', 'Ready To Test', 'Exports and reconciles order records for fulfilment and reporting.', 'Safe to test with existing orders.', []],
  ['Receipt Emails', 'email', 'Revenue Critical', 'Operations Agent', 'Needs OAuth Login', 'Sends customer confirmations and admin alerts.', 'Requires Gmail/Base44 email authorization.', ['GMAIL_CONNECTOR']],
  ['Business Attention Centre', 'notifications', 'Revenue Critical', 'Orchestrator', 'Ready To Test', 'Routes payment, TikTok, and integration alerts into one action centre.', 'Safe internal notifications only.', []],
  ['Payment Diagnostics', 'payments', 'Revenue Critical', 'Revenue Command Agent', 'Connected', 'Shows failed payments, webhook issues, payment/order mismatches, and stuck checkouts.', 'Admin-only; no secrets displayed.', []],
  ['Sentry', 'analytics', 'Revenue Critical', 'Analytics Agent', 'Needs Credential', 'Error monitoring and performance alerts.', 'Requires DSN, no customer card data.', ['SENTRY_DSN']],
  ['PostHog', 'analytics', 'Revenue Critical', 'Analytics Agent', 'Needs Credential', 'Funnels, conversion, checkout drop-off, product analytics.', 'Requires project key and privacy review.', ['POSTHOG_API_KEY']],
  ['TikTok API', 'social', 'High Priority', 'Social Content Agent', 'Needs Approval', 'Login Kit, creator connection, video draft upload, review demo.', 'Keep Login Kit + Content Posting API. Remove unimplemented scopes before review.', ['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET']],
  ['TikTok Webhooks', 'social', 'High Priority', 'Social Content Agent', 'Needs External Manual Setup', 'Receives TikTok status updates if kept in Developer Portal.', 'Remove unless implemented and demonstrated in demo video.', ['TIKTOK_WEBHOOK_SECRET']],
  ['Instagram Graph API', 'social', 'High Priority', 'Social Content Agent', 'Needs OAuth Login', 'Instagram Business analytics and publishing workflows.', 'Requires Meta app, business account, app review.', ['META_APP_ID', 'META_APP_SECRET']],
  ['Facebook/Meta API', 'social', 'High Priority', 'Social Content Agent', 'Needs OAuth Login', 'Meta Page workflows, ads/insights if approved.', 'High risk if ads or public posting enabled; approval required.', ['META_APP_ID', 'META_APP_SECRET']],
  ['YouTube Data API', 'social', 'Manual Action Required', 'Social Content Agent', 'Needs OAuth Login', 'Video list, channel insights, uploads if approved.', 'Requires Google Cloud OAuth setup.', ['YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET']],
  ['X / Twitter API', 'social', 'Deferred', 'Social Content Agent', 'Needs OAuth Login', 'Text posts, media posts, and account reads if approved.', 'Use read scopes first; write/media scopes require Approval Queue.', ['X_CLIENT_ID', 'X_CLIENT_SECRET']],
  ['Pinterest API', 'social', 'Deferred', 'Social Content Agent', 'Needs OAuth Login', 'Release artwork, merch, quotes, and story pins.', 'Use boards/pins read first; write scopes require Approval Queue.', ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET']],
  ['Spotify for Artists', 'distribution', 'Manual Action Required', 'Music Distribution Agent', 'Manual Only', 'Artist insights and release tracking.', 'Spotify for Artists has limited public API access; manual dashboard may be required.', []],
  ['Too Lost / Toolost', 'distribution', 'Manual Action Required', 'Music Distribution Agent', 'Needs Credential', 'Distribution catalog and royalty sync if API access is available.', 'May require support-provided API access.', ['TOOLOST_API_KEY']],
  ['Apple Music for Artists', 'distribution', 'Manual Action Required', 'Music Distribution Agent', 'Manual Only', 'Artist profile claiming, release links, and analytics snapshots.', 'Manual dashboard/export workflow unless official access is granted.', []],
  ['Google Drive', 'productivity', 'High Priority', 'Operations Agent', 'Needs OAuth Login', 'Stores assets, contracts, exports, recording packages.', 'Requires Google OAuth connector.', ['GOOGLE_DRIVE_CONNECTOR']],
  ['Google Sheets', 'productivity', 'Revenue Critical', 'Operations Agent', 'Needs OAuth Login', 'Order exports, reports, reconciliation sheets.', 'Requires Sheets/Drive OAuth connector.', ['GOOGLE_SHEET_ID']],
  ['Google Calendar', 'productivity', 'High Priority', 'Operations Agent', 'Needs OAuth Login', 'Performance, release, and booking calendar sync.', 'Only publish tagged public events.', ['GOOGLE_CALENDAR_CONNECTOR']],
  ['Zapier', 'infrastructure', 'Deferred', 'Operations Agent', 'Needs Credential', 'Optional automation bridge.', 'Use only when native webhook/API cannot cover the workflow.', ['ZAPIER_API_KEY']],
  ['Make', 'infrastructure', 'Deferred', 'Operations Agent', 'Needs Credential', 'Optional scenario automation.', 'Approval required before workflows can spend credits or affect public systems.', ['MAKE_API_KEY']],
  ['n8n', 'infrastructure', 'Deferred', 'Operations Agent', 'Needs External Manual Setup', 'Self-hosted workflow automation.', 'Requires hosted instance, API key, and security hardening.', ['N8N_API_KEY', 'N8N_BASE_URL']],
  ['Runway', 'creative', 'Deferred', 'Creative Studio Agent', 'Needs Credential', 'AI video generation.', 'Paid usage must go to Approval Queue first.', ['RUNWAY_API_KEY']],
  ['Krea', 'creative', 'Deferred', 'Creative Studio Agent', 'Manual Action Required', 'AI image creation if API access is granted.', 'API access may be limited/beta.', ['KREA_API_KEY']],
  ['CapCut', 'creative', 'Manual Only', 'Creative Studio Agent', 'Manual Only', 'Manual video editing/export workflow.', 'No dependable public automation API for this app workflow.', []],
  ['Canva', 'creative', 'Deferred', 'Creative Studio Agent', 'Needs OAuth Login', 'Brand templates and design automation if approved.', 'Requires Canva developer app/OAuth.', ['CANVA_CLIENT_ID', 'CANVA_CLIENT_SECRET']],
  ['ElevenLabs', 'creative', 'Deferred', 'Creative Studio Agent', 'Needs Credential', 'Voice generation and voiceover support.', 'Paid usage and voice clone operations require approval.', ['ELEVENLABS_API_KEY']],
  ['OpusClip', 'creative', 'High Priority', 'Creative Studio Agent', 'Needs Credential', 'Clip generation, social cutdowns, captioned short-form assets.', 'Rotate any exposed API key before use. Credit-consuming jobs require Approval Queue.', ['OPUSCLIP_API_KEY']],
  ['Cloudflare', 'infrastructure', 'Deferred', 'Security Agent', 'Needs Approval', 'DNS, CDN, cache, security rules.', 'Dangerous: DNS/security changes require approval.', ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ZONE_ID']],
  ['Slack Alerts', 'notifications', 'High Priority', 'Operations Agent', 'Needs OAuth Login', 'Internal payment and health alerts.', 'Requires Slack connector authorization.', ['SLACK_CONNECTOR']],
  ['OpenAI / AI Provider', 'infrastructure', 'High Priority', 'Orchestrator', 'Needs Credential', 'AI model calls, agents, summaries, content preparation.', 'Secrets must never be shown in frontend or recordings.', ['OPENAI_API_KEY']],
].map(([name, category, impact, agent, status, unlocks, risk, credentials]) => ({
  name, category, impact, agent, status, unlocks, risk, credentials,
  canSpendMoney: /Stripe|Runway|OpusClip|ElevenLabs|Cloudflare|Ads|OpenAI/.test(name),
  canPublishPublicly: /TikTok|Instagram|Facebook|YouTube|Canva/.test(name),
  requiresApproval: /Stripe|Cloudflare|TikTok|Instagram|Facebook|OpusClip|Runway|ElevenLabs|OpenAI/.test(name),
  requiresOAuth: /Google|Gmail|Instagram|Facebook|YouTube|TikTok|Canva|Slack/.test(name),
  manualOnly: status === 'Manual Only',
}));

const TABS = [
  'Live', 'Needs Credential', 'Needs OAuth Login', 'Needs Approval', 'Manual Action Required',
  'Blocked', 'Ready To Test', 'Connected', 'Failed', 'Manual Only', 'High Priority',
  'Revenue Critical', 'TikTok / Social', 'Payments', 'Email / Notifications',
  'Analytics', 'Creative Tools', 'Distribution', 'Infrastructure'
];

function tabMatches(platform, tab) {
  if (!tab || tab === 'All') return true;
  if (tab === 'Live') return platform.status === 'Connected';
  if (tab === 'High Priority') return platform.impact === 'High Priority' || platform.impact === 'Revenue Critical';
  if (tab === 'Revenue Critical') return platform.impact === 'Revenue Critical';
  if (tab === 'TikTok / Social') return platform.category === 'social';
  if (tab === 'Payments') return platform.category === 'payments';
  if (tab === 'Email / Notifications') return ['email', 'notifications'].includes(platform.category);
  if (tab === 'Analytics') return platform.category === 'analytics';
  if (tab === 'Creative Tools') return platform.category === 'creative';
  if (tab === 'Distribution') return platform.category === 'distribution';
  if (tab === 'Infrastructure') return platform.category === 'infrastructure';
  return platform.status === tab;
}

function statusClass(status) {
  if (status === 'Connected') return 'bg-green-500/20 text-green-300 border-green-500/30';
  if (status === 'Ready To Test') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (status === 'Needs Credential' || status === 'Needs OAuth Login') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  if (status === 'Needs Approval' || status === 'Blocked') return 'bg-red-500/20 text-red-300 border-red-500/30';
  return 'bg-secondary text-muted-foreground border-border';
}

export default function IntegrationCompletionCentre() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState(null);
  const activeTab = params.get('tab') || 'High Priority';

  const { data: saved = [], refetch } = useQuery({
    queryKey: ['integration-completion-records'],
    queryFn: () => base44.entities.ApiIntegrationSetup.list('-created_date', 200),
  });

  const merged = useMemo(() => PLATFORMS.map(platform => {
    const record = saved.find(item => item.platform_name === platform.name);
    return record ? { ...platform, record, status: record.setup_status === 'live' ? 'Connected' : platform.status } : platform;
  }), [saved]);

  const filtered = merged.filter(p => tabMatches(p, activeTab));

  const createRecord = useMutation({
    mutationFn: (platform) => base44.entities.ApiIntegrationSetup.create({
      platform_name: platform.name,
      purpose: platform.unlocks,
      setup_status: platform.status === 'Connected' ? 'live' : 'needs_credentials',
      credential_status: platform.credentials.length ? 'none' : 'saved',
      human_action_required: platform.manualOnly ? 'Manual-only workflow. Use the guide and mark done after completing externally.' : platform.requiresOAuth ? 'Complete external OAuth login, then return to test.' : platform.credentials.length ? `Save required secret(s): ${platform.credentials.join(', ')}` : 'Ready for internal testing.',
      risk_level: platform.requiresApproval ? 'high' : 'low',
      approval_required: platform.requiresApproval,
      setup_steps: [
        'Open platform account or developer portal.',
        'Complete any external OAuth, approval, or credential creation step.',
        'Save secrets only in Base44 secrets/environment variables.',
        'Return here and run Test Connection.',
        'Do not mark Connected until the test passes.'
      ],
      test_status: 'not_tested',
      category: platform.category === 'payments' ? 'payment' : platform.category === 'creative' ? 'ai_creative' : platform.category === 'email' ? 'productivity' : platform.category === 'notifications' ? 'infrastructure' : platform.category,
      notes: `Assigned agent: ${platform.agent}. Impact: ${platform.impact}. ${platform.risk}`,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration-completion-records'] });
      toast({ title: 'Setup record created' });
    },
  });

  const createApproval = useMutation({
    mutationFn: (platform) => base44.entities.ApprovalQueue.create({
      agent_name: platform.agent,
      action_title: `Approve setup: ${platform.name}`,
      action_description: `${platform.name} setup may access credentials, publish publicly, spend credits, or affect revenue systems. Review permissions before enabling.`,
      risk_type: [
        ...(platform.canSpendMoney ? ['financial'] : []),
        ...(platform.canPublishPublicly ? ['publishing'] : []),
        ...(platform.name.includes('Stripe') ? ['payment_settings'] : []),
      ],
      risk_level: platform.requiresApproval ? 'high' : 'medium',
      status: 'pending',
      payload: platform,
      proposed_output: `Proceed with ${platform.name} setup only after credentials/OAuth are supplied and testing passes.`,
      auto_eligible: false,
      tags: ['integration-setup', platform.category, platform.impact],
    }),
    onSuccess: () => toast({ title: 'Approval Queue item created' }),
  });

  const createNotification = useMutation({
    mutationFn: (platform) => base44.entities.AdminNotification.create({
      notification_type: platform.category === 'payments' ? 'payment_warning' : 'system',
      severity: platform.impact === 'Revenue Critical' ? 'critical' : 'warning',
      title: `${platform.name} needs setup`,
      summary: `${platform.status}: ${platform.unlocks}`,
      source: 'IntegrationCompletionCentre',
      requires_action: true,
      linked_entity: 'ApiIntegrationSetup',
      linked_id: platform.record?.id || '',
      linked_route: '/admin/integration-completion-centre',
    }),
    onSuccess: () => toast({ title: 'Business Attention Centre notification created' }),
  });

  const createHealthIssue = useMutation({
    mutationFn: (platform) => base44.entities.SystemHealthIssue.create({
      system_area: platform.category === 'payments' ? 'payments' : 'integrations',
      issue_title: `${platform.name} is not connected`,
      severity: platform.impact === 'Revenue Critical' ? 'critical' : 'warning',
      detected_by: 'IntegrationCompletionCentre',
      recommended_fix: platform.credentials.length ? `Save credentials securely: ${platform.credentials.join(', ')}. Then test connection.` : platform.risk,
      status: platform.requiresApproval ? 'needs_approval' : 'open',
      requires_approval: platform.requiresApproval,
      risk_type: platform.category === 'payments' ? 'payment' : platform.canPublishPublicly ? 'public_content' : 'data',
      last_checked: new Date().toISOString(),
    }),
    onSuccess: () => toast({ title: 'System Health issue created' }),
  });

  const startSprint = async () => {
    for (const platform of merged.filter(p => ['Revenue Critical', 'High Priority'].includes(p.impact)).slice(0, 10)) {
      if (!platform.record) await createRecord.mutateAsync(platform);
      await createNotification.mutateAsync(platform);
      if (platform.requiresApproval) await createApproval.mutateAsync(platform);
    }
    toast({ title: "Today's integration sprint created" });
    refetch();
  };

  const counts = Object.fromEntries(TABS.map(tab => [tab, merged.filter(p => tabMatches(p, tab)).length]));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Integration Completion Centre</h1>
            <p className="text-muted-foreground text-sm mt-1">Same-day setup sprint: what is connected, what is blocked, who owns it, and what Gannon must do.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={startSprint}><PlayCircle className="w-4 h-4 mr-1" />Start Today's Sprint</Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-1" />Refresh</Button>
        </div>
      </div>

      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-200">Secret exposure warning</p>
          <p className="text-sm text-red-100/80">If any API key, Stripe secret, TikTok client secret, webhook secret, or OpusClip key has appeared in chat, logs, screenshots, or recordings, rotate/regenerate it before use. This page only shows saved/missing status and never displays secret values.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Revenue Critical', counts['Revenue Critical'], 'text-red-400', Shield],
          ['Needs Credentials', counts['Needs Credential'], 'text-yellow-400', Lock],
          ['Ready To Test', counts['Ready To Test'], 'text-blue-400', Wrench],
          ['Connected', counts.Connected, 'text-green-400', CheckCircle2],
        ].map(([label, value, color, Icon]) => (
          <Card key={label} className="cursor-pointer hover:border-primary/40" onClick={() => setParams({ tab: label === 'Needs Credentials' ? 'Needs Credential' : label })}>
            <CardContent className="p-4">
              <Icon className={`w-5 h-5 ${color}`} />
              <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={activeTab === 'All' ? 'default' : 'ghost'} onClick={() => setParams({ tab: 'All' })}>All ({merged.length})</Button>
        {TABS.map(tab => (
          <Button key={tab} size="sm" variant={activeTab === tab ? 'default' : 'ghost'} onClick={() => setParams({ tab })}>
            {tab} ({counts[tab] || 0})
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(platform => (
          <Card key={platform.name} className="hover:border-primary/40 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <button className="text-left flex-1 min-w-0" onClick={() => setSelected(platform)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{platform.name}</p>
                    <Badge className={statusClass(platform.status)}>{platform.status}</Badge>
                    <Badge variant="outline">{platform.impact}</Badge>
                    <Badge variant="outline">{platform.agent}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{platform.unlocks}</p>
                  <p className="text-xs text-muted-foreground mt-1">Next step: {platform.requiresOAuth ? 'Complete OAuth login externally, then test.' : platform.credentials.length ? `Save ${platform.credentials.join(', ')} securely.` : platform.manualOnly ? 'Use manual workflow and mark done.' : 'Run a safe connection test.'}</p>
                </button>
                <div className="flex gap-2 flex-wrap justify-end">
                  <Button variant="outline" size="sm" onClick={() => createRecord.mutate(platform)}><ClipboardList className="w-3 h-3 mr-1" />Setup</Button>
                  <Button variant="outline" size="sm" onClick={() => createApproval.mutate(platform)} disabled={!platform.requiresApproval}>Approval</Button>
                  <Button variant="outline" size="sm" onClick={() => createHealthIssue.mutate(platform)}>Health</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Today Completion Order</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
          {[
            '1. Stripe checkout + Stripe webhook + Payment Diagnostics',
            '2. Gmail/email notifications + receipt/admin alerts',
            '3. Business Attention Centre notifications',
            '4. Sentry error monitoring',
            '5. PostHog analytics',
            '6. TikTok Login Kit + Content Posting API readiness',
            '7. TikTok Recording Studio + Screen Guide',
            '8. Google Sheets order export',
            '9. Google Calendar release/bookings sync',
            '10. Social, distribution, creative, automation, and DNS tools',
          ].map(item => <p key={item}>{item}</p>)}
        </CardContent>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Integration Detail</p>
                <h3 className="text-xl font-semibold">{selected.name}</h3>
              </div>
              <Badge className={statusClass(selected.status)}>{selected.status}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-muted-foreground">Business purpose</p><p>{selected.unlocks}</p></div>
              <div><p className="text-xs text-muted-foreground">Assigned agent</p><p>{selected.agent}</p></div>
              <div><p className="text-xs text-muted-foreground">Credentials required</p><p>{selected.credentials.length ? selected.credentials.join(', ') : 'None'}</p></div>
              <div><p className="text-xs text-muted-foreground">Requires approval</p><p>{selected.requiresApproval ? 'Yes' : 'No'}</p></div>
              <div><p className="text-xs text-muted-foreground">Can spend money</p><p>{selected.canSpendMoney ? 'Yes - approval required' : 'No'}</p></div>
              <div><p className="text-xs text-muted-foreground">Can publish publicly</p><p>{selected.canPublishPublicly ? 'Yes - approval required' : 'No'}</p></div>
              <div><p className="text-xs text-muted-foreground">Can Base44 complete automatically?</p><p>{selected.credentials.length || selected.requiresOAuth ? 'No, it can prepare setup and tests but needs Gannon for credentials/login.' : 'Yes, internal setup/checks can be prepared.'}</p></div>
              <div><p className="text-xs text-muted-foreground">Can be tested today?</p><p>{selected.manualOnly ? 'Manual verification only' : 'Yes after credential/OAuth step is complete'}</p></div>
            </div>
            {selected.name === 'TikTok API' && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <p className="font-semibold text-primary mb-1">TikTok Review Safety</p>
                <p>Recommended fastest approval setup: Login Kit + Content Posting API, scopes user.info.basic and video.upload. Remove Share Kit, Webhooks, user.info.stats, video.list, and video.publish unless each is implemented and clearly demonstrated in the review video.</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Link to="/admin/tiktok-review"><Button variant="outline" size="sm">TikTok Review</Button></Link>
                  <Link to="/admin/tiktok-screen-guide"><Button variant="outline" size="sm">Screen Guide</Button></Link>
                  <Link to="/admin/tiktok-recording-studio"><Button variant="outline" size="sm">Recording Studio</Button></Link>
                  <Link to="/admin/social-distribution-readiness"><Button variant="outline" size="sm">Social Readiness</Button></Link>
                </div>
              </div>
            )}
            {selected.name === 'Stripe Webhooks' && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <p className="font-semibold text-primary mb-1">Stripe Router Endpoint</p>
                <code className="block rounded bg-secondary p-2 text-xs break-all">https://api.base44.app/api/v2/apps/69eb7905ca6eb4180010f794/functions/stripeIntelligenceRouter</code>
              </div>
            )}
            <div className="rounded-lg border border-border/50 p-3 text-xs text-muted-foreground">
              Source chain: Integration Card {"->"} Missing Credential/OAuth/Approval {"->"} Agent Blocked {"->"} Automation Blocked {"->"} Approval Queue {"->"} System Health {"->"} Business Attention Centre
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
              <Button variant="outline" size="sm" onClick={() => createRecord.mutate(selected)}><ClipboardList className="w-4 h-4 mr-1" />Create Setup Task</Button>
              <Button variant="outline" size="sm" onClick={() => createNotification.mutate(selected)}><Zap className="w-4 h-4 mr-1" />Notify</Button>
              <Button variant="outline" size="sm" onClick={() => createHealthIssue.mutate(selected)}><Shield className="w-4 h-4 mr-1" />System Health</Button>
              <a href={selected.name === 'Stripe' ? 'https://dashboard.stripe.com' : '#'} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" disabled={selected.name !== 'Stripe'}><ExternalLink className="w-4 h-4 mr-1" />External Portal</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}