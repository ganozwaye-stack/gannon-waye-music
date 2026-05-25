import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Copy, Download, FileText, FolderOpen, Shield, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

const CODE_PACKS = [
  {
    id: 'routes-navigation',
    label: '1. Routes & Navigation',
    files: [
      { path: 'App.jsx', desc: 'ALL routes — source of truth for routing' },
      { path: 'components/admin/AdminLayout.jsx', desc: 'Admin sidebar nav, all admin links' },
      { path: 'components/public/PublicLayout.jsx', desc: 'Public site layout with Outlet' },
      { path: 'components/public/Navbar.jsx', desc: 'Public navbar/mobile nav' },
      { path: 'components/public/Footer.jsx', desc: 'Public footer links' },
    ],
    desc: 'Complete routing and navigation map. Read these first.',
    priority: 'critical',
  },
  {
    id: 'public-pages',
    label: '2. Public Pages',
    files: [
      { path: 'pages/Home.jsx', desc: 'Homepage' },
      { path: 'pages/Store.jsx', desc: 'Merch store with Stripe checkout' },
      { path: 'pages/Music.jsx', desc: 'Music/releases page' },
      { path: 'pages/Community.jsx', desc: 'Fan community' },
      { path: 'pages/Videos.jsx', desc: 'Videos page' },
      { path: 'pages/BackThis.jsx', desc: 'Support/crowdfunding page' },
      { path: 'pages/CurrentSingle.jsx', desc: 'Current release feature' },
      { path: 'pages/LyricsPage.jsx', desc: 'Lyrics' },
      { path: 'pages/ThisIsMyLife.jsx', desc: 'About Gannon' },
      { path: 'pages/Bookings.jsx', desc: 'Booking enquiry' },
      { path: 'pages/Mastering.jsx', desc: 'Mastering service' },
      { path: 'pages/ContactGannon.jsx', desc: 'Contact form' },
      { path: 'pages/Impact.jsx', desc: 'Charity impact' },
      { path: 'pages/OrderStatus.jsx', desc: 'Order tracker (public)' },
      { path: 'pages/OrderHistory.jsx', desc: 'Order history (auth)' },
      { path: 'pages/MerchFeedback.jsx', desc: 'Merch feedback form' },
      { path: 'pages/TikTokCallback.jsx', desc: 'TikTok OAuth callback — CRITICAL' },
      { path: 'pages/TikTokPlatformReview.jsx', desc: 'TikTok public review page' },
    ],
    desc: 'All public-facing pages under PublicLayout.',
    priority: 'high',
  },
  {
    id: 'admin-commerce',
    label: '3. Admin — Commerce',
    files: [
      { path: 'pages/admin/Dashboard.jsx', desc: 'Main admin dashboard' },
      { path: 'pages/admin/Orders.jsx', desc: 'Order management' },
      { path: 'pages/admin/MerchManagement.jsx', desc: 'Product management' },
      { path: 'pages/admin/FinancialDashboard.jsx', desc: 'Revenue/finance overview' },
      { path: 'pages/admin/OrderProfitIntelligence.jsx', desc: 'Per-order P&L' },
      { path: 'pages/admin/BusinessWorthCommand.jsx', desc: 'Business valuation' },
      { path: 'pages/admin/OfferEngine.jsx', desc: 'Active offer management' },
      { path: 'pages/admin/BundleProposalStudio.jsx', desc: 'Bundle builder' },
      { path: 'pages/admin/RevenueActions.jsx', desc: 'Revenue action proposals' },
      { path: 'pages/admin/TodaysMoneymoves.jsx', desc: "Daily money moves" },
      { path: 'pages/admin/WeeklyMoneyReport.jsx', desc: 'Weekly revenue report' },
      { path: 'pages/admin/ContentToCash.jsx', desc: 'Content-to-cash pipeline' },
      { path: 'pages/admin/IntelligenceToIncome.jsx', desc: 'AI income opportunities' },
      { path: 'pages/admin/PromoCodes.jsx', desc: 'Promo code management' },
      { path: 'pages/admin/ShippingRates.jsx', desc: 'Shipping rate rules' },
      { path: 'pages/admin/StripeCommandCentreNew.jsx', desc: 'Stripe health dashboard' },
      { path: 'pages/admin/PaymentDiagnosticsNew.jsx', desc: 'Payment issue tracker' },
      { path: 'pages/admin/WebhookHealthNew.jsx', desc: 'Webhook monitoring' },
      { path: 'pages/admin/StripeLiveReport.jsx', desc: 'Live Stripe event log' },
    ],
    desc: 'All commerce, payments, and revenue intelligence pages.',
    priority: 'critical',
  },
  {
    id: 'admin-agents',
    label: '4. Admin — Agents & Intelligence',
    files: [
      { path: 'pages/admin/CommandCentre.jsx', desc: 'Master command centre' },
      { path: 'pages/admin/AgentRegistry.jsx', desc: 'Agent registry' },
      { path: 'pages/admin/AgentToolRegistry.jsx', desc: 'Agent tool registry' },
      { path: 'pages/admin/AgentCapabilityMatrix.jsx', desc: 'Agent capability matrix' },
      { path: 'pages/admin/AgentIntelligence.jsx', desc: 'Agent performance' },
      { path: 'pages/admin/AgentLearning.jsx', desc: 'Agent learning records' },
      { path: 'pages/admin/OrchestratorChat.jsx', desc: 'Orchestrator chat UI' },
      { path: 'pages/admin/ApprovalQueue.jsx', desc: 'Approval queue' },
      { path: 'pages/admin/Notifications.jsx', desc: 'Business Attention Centre' },
      { path: 'pages/admin/KnowledgeVault.jsx', desc: 'Knowledge vault' },
      { path: 'pages/admin/RiskAlerts.jsx', desc: 'Risk alert tracker' },
      { path: 'pages/admin/MemoryGraph.jsx', desc: 'Agent memory graph' },
      { path: 'pages/admin/IdeasEngine.jsx', desc: 'Ideas engine' },
      { path: 'pages/admin/GrowthEngine.jsx', desc: 'Growth opportunity engine' },
      { path: 'pages/admin/ResearchHub.jsx', desc: 'Research hub' },
      { path: 'pages/admin/ResearchGrid.jsx', desc: 'Research grid' },
      { path: 'pages/admin/AtoZIndex.jsx', desc: 'A-Z index of all pages' },
    ],
    desc: 'All agent, intelligence, and knowledge management pages.',
    priority: 'high',
  },
  {
    id: 'admin-social-tiktok',
    label: '5. Admin — Social & TikTok',
    files: [
      { path: 'pages/admin/TikTokPlatformReviewAdmin.jsx', desc: 'TikTok review (admin)' },
      { path: 'pages/admin/TikTokRecordingStudio.jsx', desc: 'TikTok recording guide' },
      { path: 'pages/admin/TikTokAppReview.jsx', desc: 'TikTok app review prep' },
      { path: 'pages/admin/TikTokScreenGuide.jsx', desc: 'TikTok screen recording guide' },
      { path: 'pages/admin/SocialPlatformParity.jsx', desc: '12-platform social parity tracker' },
      { path: 'pages/admin/SocialOAuthCommand.jsx', desc: 'Social OAuth status' },
      { path: 'pages/admin/SocialReviewReadiness.jsx', desc: 'Social review prep' },
      { path: 'pages/admin/SocialContentReadiness.jsx', desc: 'Content readiness' },
      { path: 'pages/admin/SocialAnalyticsCommand.jsx', desc: 'Analytics command' },
      { path: 'pages/admin/SocialCommand.jsx', desc: 'Social command centre' },
      { path: 'pages/admin/SocialDistributionReadiness.jsx', desc: 'Distribution readiness' },
      { path: 'components/tiktok/TikTokConnectionCard.jsx', desc: 'TikTok OAuth UI component' },
      { path: 'components/tiktok/TikTokDraftUpload.jsx', desc: 'TikTok draft uploader' },
      { path: 'components/tiktok/TikTokAnalytics.jsx', desc: 'TikTok analytics component' },
    ],
    desc: 'All TikTok integration and social platform parity pages.',
    priority: 'critical',
  },
  {
    id: 'admin-music-artist',
    label: '6. Admin — Music & Artist',
    files: [
      { path: 'pages/admin/MusicCommandCentre.jsx', desc: 'Music command centre' },
      { path: 'pages/admin/Releases.jsx', desc: 'Release management' },
      { path: 'pages/admin/ArtistBusinessSetup.jsx', desc: 'Artist business/management' },
      { path: 'pages/admin/SyncLicensingCommand.jsx', desc: 'Sync/publishing/licensing' },
      { path: 'pages/admin/MasteringAdmin.jsx', desc: 'Mastering admin' },
      { path: 'pages/admin/Distributors.jsx', desc: 'Distributors' },
      { path: 'pages/admin/TunecoreIntegration.jsx', desc: 'TuneCore integration' },
      { path: 'pages/admin/GanozMixBridge.jsx', desc: 'GanozMix bridge' },
    ],
    desc: 'Music, releases, licensing, and artist management.',
    priority: 'high',
  },
  {
    id: 'admin-coaching',
    label: '7. Admin — Coaching (PRIVATE)',
    files: [
      { path: 'pages/admin/CoachingCommand.jsx', desc: 'Coaching command (PRIVATE — admin only, never public)' },
    ],
    desc: '⚠️ PRIVATE. Coaching is staged/private only. COACHING_PUBLIC_LAUNCH_ENABLED = false. Legal review required before any public launch.',
    priority: 'legal',
  },
  {
    id: 'admin-qa-dev',
    label: '8. QA & Developer Tools',
    files: [
      { path: 'pages/admin/QACommandCentre.jsx', desc: 'QA command centre + final report' },
      { path: 'pages/admin/PlaywrightTestCentre.jsx', desc: 'Playwright test pack downloads' },
      { path: 'pages/admin/DeveloperHandoff.jsx', desc: 'Full developer documentation' },
      { path: 'pages/admin/CodeAuditExport.jsx', desc: 'This page — code audit export' },
      { path: 'pages/admin/ChatGPTCodeReviewExport.jsx', desc: 'ChatGPT upload guide' },
      { path: 'pages/admin/SiteFunctionAudit.jsx', desc: 'Site function audit' },
      { path: 'pages/admin/OperationRegistry.jsx', desc: 'Operation registry' },
      { path: 'pages/admin/GoLiveChecklist.jsx', desc: 'Go-live checklist' },
      { path: 'pages/admin/SiteHealthDashboard.jsx', desc: 'Site health dashboard' },
    ],
    desc: 'All QA, testing, and developer tooling pages.',
    priority: 'high',
  },
  {
    id: 'backend-functions',
    label: '9. Backend Functions',
    files: [
      { path: 'functions/stripeWebhook.js', desc: 'CRITICAL — Stripe webhook, order creation, receipts' },
      { path: 'functions/createCheckoutSession.js', desc: 'CRITICAL — Stripe checkout session' },
      { path: 'functions/tiktokOAuth.js', desc: 'CRITICAL — TikTok OAuth token exchange' },
      { path: 'functions/tiktokUploadDraft.js', desc: 'TikTok draft video upload' },
      { path: 'functions/shippingOptimisationAudit.js', desc: 'Shipping rate audit (fixed)' },
      { path: 'functions/notifyAdmin.js', desc: 'Business Attention Centre alert creator' },
      { path: 'functions/sendOrderReceipt.js', desc: 'Order receipt email' },
      { path: 'functions/publishApprovedProposal.js', desc: 'Publishes agent proposals after approval' },
      { path: 'functions/agentProposalScanner.js', desc: 'Scans for revenue proposals' },
      { path: 'functions/agentIntelligenceLoop.js', desc: 'Agent intelligence loop' },
      { path: 'functions/runSiteHealthCheck.js', desc: 'Site health check' },
      { path: 'functions/automatedSiteTests.js', desc: 'Automated site tests' },
      { path: 'functions/validatePromoCode.js', desc: 'Promo code validation' },
      { path: 'functions/calculateShippingRate.js', desc: 'Shipping rate calculator' },
      { path: 'functions/executiveMorningBrief.js', desc: 'Daily executive brief' },
      { path: 'functions/growthOpportunityScanner.js', desc: 'Growth opportunity scanner' },
    ],
    desc: 'All Deno edge functions. Use createClientFromRequest from npm:@base44/sdk@0.8.25.',
    priority: 'critical',
  },
  {
    id: 'agents',
    label: '10. Agent Files',
    files: [
      { path: 'agents/orchestrator.json', desc: 'Master orchestrator agent' },
      { path: 'agents/music_orchestrator.json', desc: 'Music orchestrator' },
      { path: 'agents/merch_sales_agent.json', desc: 'Merch/commerce agent' },
      { path: 'agents/revenue_orchestrator.json', desc: 'Revenue orchestrator' },
      { path: 'agents/fan_engagement_agent.json', desc: 'Fan engagement' },
      { path: 'agents/release_launch_agent.json', desc: 'Release launch' },
      { path: 'agents/sync_licensing_agent.json', desc: 'Sync licensing' },
      { path: 'agents/email_revenue_agent.json', desc: 'Email revenue' },
      { path: 'agents/content_revenue_agent.json', desc: 'Content revenue' },
      { path: 'agents/qa_systems_auditor.json', desc: 'QA systems auditor (permissions granted)' },
      { path: 'agents/api_setup_assistant.json', desc: 'API setup assistant' },
      { path: 'agents/order_support.json', desc: 'Order support' },
    ],
    desc: 'All agent JSON config files. tool_configs define entity permissions.',
    priority: 'high',
  },
  {
    id: 'entities',
    label: '11. Entity Schemas',
    files: [
      { path: 'entities/MerchOrder.json', desc: 'Orders, line items, status, shipping' },
      { path: 'entities/MerchProduct.json', desc: 'Products, pricing, profit fields' },
      { path: 'entities/PromoCode.json', desc: 'Discount codes' },
      { path: 'entities/BundleOffer.json', desc: 'Bundle campaigns' },
      { path: 'entities/StripeEventLog.json', desc: 'Stripe webhook events' },
      { path: 'entities/PaymentDiagnostic.json', desc: 'Payment issues/failures' },
      { path: 'entities/AdminNotification.json', desc: 'Business Attention Centre' },
      { path: 'entities/ApprovalQueue.json', desc: 'Approval workflow' },
      { path: 'entities/SystemHealthIssue.json', desc: 'Technical issue tracker' },
      { path: 'entities/AgentActionProposal.json', desc: 'Agent proposals' },
      { path: 'entities/AgentRegistry.json', desc: 'Agent configurations' },
      { path: 'entities/KnowledgeVault.json', desc: 'Knowledge store' },
      { path: 'entities/Release.json', desc: 'Songs/albums' },
      { path: 'entities/EmailSubscriber.json', desc: 'Mailing list' },
      { path: 'entities/ShippingRateRule.json', desc: 'Shipping rules' },
      { path: 'entities/RevenueOpportunity.json', desc: 'Revenue opportunities' },
      { path: 'entities/GrowthOpportunity.json', desc: 'Growth opportunities' },
    ],
    desc: 'All entity JSON schemas. Base44 entity store (no SQL).',
    priority: 'high',
  },
  {
    id: 'lib-hooks-api',
    label: '12. Lib, Hooks & API',
    files: [
      { path: 'api/base44Client.js', desc: 'Pre-initialized Base44 SDK client — import this everywhere' },
      { path: 'lib/AuthContext.jsx', desc: 'Auth context — isLoadingAuth, user, authError' },
      { path: 'lib/query-client.js', desc: 'React Query client instance' },
      { path: 'lib/utils.js', desc: 'Utility functions (cn, etc.)' },
      { path: 'lib/eventAutomation.js', desc: 'Frontend event automation system' },
      { path: 'lib/businessLogic.js', desc: 'Core business logic' },
      { path: 'lib/checkoutCalculations.js', desc: 'Checkout price calculations' },
      { path: 'lib/auditSystem.js', desc: 'Audit logging system' },
      { path: 'lib/platformConfig.js', desc: 'Platform configuration' },
      { path: 'lib/posthog.js', desc: 'PostHog analytics' },
      { path: 'hooks/useVoiceInput.js', desc: 'Voice input hook' },
      { path: 'hooks/useSiteReveal.js', desc: 'Site reveal hook' },
      { path: 'hooks/useFormAutosave.js', desc: 'Form autosave hook' },
      { path: 'main.jsx', desc: 'React entry point' },
      { path: 'index.css', desc: 'Design tokens, CSS variables, Tailwind' },
      { path: 'tailwind.config.js', desc: 'Tailwind theme config' },
      { path: 'index.html', desc: 'HTML entry, meta tags, PostHog init' },
    ],
    desc: 'Core lib, hooks, API client, and config files.',
    priority: 'high',
  },
];

const SECURITY_STATUS = [
  { name: 'STRIPE_PUBLISHABLE_KEY', status: 'set', note: 'Frontend-safe — used in checkout UI' },
  { name: 'STRIPE_SECRET_KEY', status: 'set', note: 'Backend only — never expose in frontend' },
  { name: 'STRIPE_WEBHOOK_SECRET', status: 'set', note: 'Backend only — webhook signature validation' },
  { name: 'TIKTOK_CLIENT_KEY', status: 'set', note: 'Backend only — OAuth app ID' },
  { name: 'TIKTOK_CLIENT_SECRET', status: 'needs_rotation', note: '⚠️ ROTATE NOW — may have been exposed. Regenerate in TikTok developer portal.' },
  { name: 'GOOGLE_SHEET_ID', status: 'set', note: 'Sheet ID for order sync — not a secret key' },
  { name: 'META_APP_ID', status: 'missing', note: 'Required for Instagram/Facebook integration' },
  { name: 'META_APP_SECRET', status: 'missing', note: 'Required for Instagram/Facebook integration' },
  { name: 'YOUTUBE_CLIENT_ID', status: 'missing', note: 'Required for YouTube Data API' },
  { name: 'YOUTUBE_CLIENT_SECRET', status: 'missing', note: 'Required for YouTube Data API' },
  { name: 'X_CLIENT_ID', status: 'missing', note: 'Required for Twitter/X integration' },
  { name: 'X_CLIENT_SECRET', status: 'missing', note: 'Required for Twitter/X integration' },
  { name: 'SOUNDCLOUD_CLIENT_ID', status: 'missing', note: 'Optional — SoundCloud integration' },
  { name: 'POSTHOG_API_KEY', status: 'missing', note: 'Optional — server-side analytics (frontend works without it)' },
  { name: 'SENTRY_DSN', status: 'missing', note: 'Optional — error monitoring' },
  { name: 'OPENAI_API_KEY', status: 'missing', note: 'Optional — Base44 InvokeLLM used as alternative' },
];

const statusColor = {
  set: 'bg-green-500/20 text-green-300 border-green-500/30',
  needs_rotation: 'bg-red-500/20 text-red-300 border-red-500/30',
  missing: 'bg-secondary text-muted-foreground border-border',
  not_tested: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};
const statusLabel = {
  set: 'Saved Securely',
  needs_rotation: 'Needs Rotation',
  missing: 'Missing',
  not_tested: 'Not Tested',
};

const priorityColor = {
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  high: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  legal: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  medium: 'bg-secondary text-muted-foreground border-border',
};

export default function CodeAuditExport() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('packs');
  const [selectedPack, setSelectedPack] = useState(CODE_PACKS[0]);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const downloadManifest = () => {
    const manifest = {
      generated: new Date().toISOString(),
      project: 'Gannon Waye Music — Business OS',
      domain: 'gannonwaye.com',
      stack: 'React 18 + Vite + Tailwind + Base44 BaaS',
      runtime: 'Deno edge functions',
      auth: 'Base44 built-in (email/magic link)',
      database: 'Base44 entity store (MongoDB-like, no SQL)',
      secrets: SECURITY_STATUS.map(s => ({
        name: s.name,
        status: s.status,
        note: s.note,
        value: '[NEVER EXPORTED]',
      })),
      code_packs: CODE_PACKS.map(p => ({
        pack: p.label,
        priority: p.priority,
        file_count: p.files.length,
        files: p.files.map(f => ({ path: f.path, description: f.desc })),
      })),
      known_blockers: [
        'TikTok live test not confirmed on gannonwaye.com',
        'TIKTOK_CLIENT_SECRET needs rotation',
        'No external Playwright test run yet',
        'META_APP_ID/SECRET not set',
        'YouTube Data API not enabled in Google Cloud',
      ],
      coaching_status: 'PRIVATE — COACHING_PUBLIC_LAUNCH_ENABLED = false — do not change without legal review',
      do_not_break: [
        '/store — live Stripe checkout',
        'functions/stripeWebhook.js — order creation',
        'COACHING_PUBLIC_LAUNCH_ENABLED = false',
        '/tiktok-callback — OAuth callback route',
        'AdminLayout auth — all /admin/* protected',
      ],
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codebase-manifest.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'codebase-manifest.json downloaded' });
  };

  const downloadPackList = (pack) => {
    const lines = [
      `# ${pack.label}`,
      `# ${pack.desc}`,
      `# Priority: ${pack.priority}`,
      `# Files: ${pack.files.length}`,
      '',
      '## Files in this pack:',
      ...pack.files.map(f => `- ${f.path}\n  ${f.desc}`),
      '',
      '## Instructions for external reviewer:',
      '1. In Base44 builder, open each file listed above',
      '2. Copy the full content',
      '3. Paste into your review tool (ChatGPT, Cursor, Codex, Claude Code)',
      '4. Note: Base44 is a BaaS — do NOT suggest Next.js, Node.js, or SQL alternatives',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pack.id}-file-list.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `${pack.label} file list downloaded` });
  };

  const copyPackInstructions = (pack) => {
    const lines = [
      `CODE AUDIT PACK: ${pack.label}`,
      `Priority: ${pack.priority}`,
      `Description: ${pack.desc}`,
      '',
      'FILES TO REVIEW:',
      ...pack.files.map(f => `  ${f.path}  →  ${f.desc}`),
      '',
      'PLATFORM RULES (IMPORTANT):',
      '- This is a BASE44 app — React + Vite frontend, Deno edge functions backend',
      '- Do NOT suggest Next.js, Node.js, Postgres, or custom auth',
      '- All data is in Base44 entity store (like MongoDB)',
      '- Secrets are in Base44 environment variables — never in frontend code',
      '- COACHING_PUBLIC_LAUNCH_ENABLED = false — do not change this',
      '- /store Stripe checkout must not be broken',
    ];
    copy(lines.join('\n'));
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Code Audit Export</h1>
            <p className="text-sm text-muted-foreground mt-1">{CODE_PACKS.length} code packs · {CODE_PACKS.reduce((a, p) => a + p.files.length, 0)} files catalogued · Machine-readable manifest available</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/chatgpt-code-review-export"><Button className="gradient-gold-button" size="sm">ChatGPT Export Guide</Button></Link>
          <Button variant="outline" size="sm" onClick={downloadManifest}><Download className="w-3 h-3 mr-1" />Download Manifest JSON</Button>
          <Link to="/admin/developer-handoff"><Button variant="outline" size="sm"><FileText className="w-3 h-3 mr-1" />Dev Handoff</Button></Link>
        </div>
      </div>

      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="p-4 text-sm flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-orange-300 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-200">Base44 does not support ZIP export.</p>
            <p className="text-orange-100/80 mt-1">To share code with ChatGPT/Cursor/Codex: use the file lists below to locate each file in the Base44 builder, then copy & paste. The manifest JSON provides the full structure. <Link to="/admin/chatgpt-code-review-export" className="underline text-orange-200">See ChatGPT Export Guide →</Link></p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[{ id: 'packs', label: 'Code Packs' }, { id: 'security', label: 'Secret Registry' }].map(t => (
          <Button key={t.id} size="sm" variant={activeTab === t.id ? 'default' : 'outline'} onClick={() => setActiveTab(t.id)}>{t.label}</Button>
        ))}
      </div>

      {activeTab === 'packs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1 overflow-y-auto max-h-[70vh]">
            {CODE_PACKS.map(pack => (
              <Card
                key={pack.id}
                className={`cursor-pointer hover:border-primary/40 transition-colors ${selectedPack?.id === pack.id ? 'border-primary/60' : ''}`}
                onClick={() => setSelectedPack(pack)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-xs">{pack.label}</p>
                    <Badge className={priorityColor[pack.priority]}>{pack.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{pack.files.length} files</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPack && (
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base">{selectedPack.label}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyPackInstructions(selectedPack)}><Copy className="w-3 h-3 mr-1" />Copy Instructions</Button>
                    <Button variant="outline" size="sm" onClick={() => downloadPackList(selectedPack)}><Download className="w-3 h-3 mr-1" />Download File List</Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selectedPack.desc}</p>
              </CardHeader>
              <CardContent className="space-y-1">
                {selectedPack.files.map(f => (
                  <div key={f.path} className="flex items-start justify-between gap-3 p-2 rounded-lg hover:bg-secondary/30 border border-transparent hover:border-border/30 transition-colors">
                    <div className="min-w-0">
                      <code className="text-xs text-primary">{f.path}</code>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0" onClick={() => copy(f.path)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-2">
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-3 text-xs text-red-200">
              <Shield className="w-4 h-4 inline mr-1" />
              Secret values are NEVER exported. Only status is shown. Do not share actual values with ChatGPT, Cursor, Codex, or any external tool.
            </CardContent>
          </Card>
          {SECURITY_STATUS.map(s => (
            <Card key={s.name}>
              <CardContent className="p-3 flex items-start justify-between gap-3">
                <div>
                  <code className="text-xs font-mono text-primary">{s.name}</code>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.note}</p>
                </div>
                <Badge className={statusColor[s.status]}>{statusLabel[s.status]}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}