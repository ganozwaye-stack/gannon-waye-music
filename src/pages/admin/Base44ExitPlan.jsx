import { useState } from 'react';
import { ChevronDown, Copy, Check, AlertTriangle, Database, Key, Zap, Bot, Plug, FileDown, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ─── COMPLETE ENTITY INVENTORY ──────────────────────────────────────────────
const ENTITIES = [
  { name: 'Release', desc: 'Songs/albums — title, status, lyrics, streaming links, artwork', critical: true },
  { name: 'Lyric', desc: 'Lyrics with publishing status, approval workflow, source tracking', critical: true },
  { name: 'MerchProduct', desc: 'Products — pricing, cost, margins, stock, images, sizes', critical: true },
  { name: 'MerchOrder', desc: 'Orders — items, Stripe IDs, payment/fulfillment status, addresses', critical: true },
  { name: 'StoreCustomer', desc: 'Customer profiles linked to orders', critical: true },
  { name: 'PromoCode', desc: 'Discount codes with rules, exclusions, usage tracking', critical: true },
  { name: 'GiftCard', desc: 'Gift card codes, values, redemption tracking', critical: true },
  { name: 'SupportContribution', desc: 'Fan support/donation payments', critical: true },
  { name: 'EmailSubscriber', desc: 'Newsletter subscribers', critical: true },
  { name: 'FanComment', desc: 'Community wall comments', critical: false },
  { name: 'CommunityReply', desc: 'Replies to fan comments', critical: false },
  { name: 'FanPost', desc: 'Fan-created community posts', critical: false },
  { name: 'FanMedia', desc: 'Fan-uploaded media (photos, videos)', critical: false },
  { name: 'BookingEnquiry', desc: 'Booking/tour enquiry submissions', critical: false },
  { name: 'FoundingSupporter', desc: 'Founding supporter registry', critical: false },
  { name: 'SupporterProfile', desc: 'Supporter profiles with tiers', critical: false },
  { name: 'SuperfanProfile', desc: 'Superfan identification data', critical: false },
  { name: 'MerchInterest', desc: 'Product interest registrations', critical: false },
  { name: 'MerchFeedback', desc: 'Product feedback from customers', critical: false },
  { name: 'ProductReview', desc: 'Product reviews and ratings', critical: false },
  { name: 'FanReview', desc: 'Fan reviews of music/experience', critical: false },
  { name: 'FanReminder', desc: 'Fan-requested email reminders', critical: false },
  { name: 'GiftClaim', desc: 'Gift claim tracking', critical: false },
  { name: 'GiftRequirementTracker', desc: 'Gift requirement compliance', critical: false },
  { name: 'CharityDonationTracker', desc: '1800RESPECT donation tracking', critical: true },
  { name: 'BusinessProfileSettings', desc: 'Business name, emails, social links, legal text', critical: true },
  { name: 'SiteSettings', desc: 'Site-wide feature toggles and config', critical: true },
  { name: 'SiteReveal', desc: 'Site reveal/launch state', critical: true },
  { name: 'AdminNotification', desc: 'Admin notification feed', critical: false },
  { name: 'ApprovalQueue', desc: 'Agent action approval queue', critical: false },
  { name: 'ApprovalQueueItem', desc: 'Detailed approval items', critical: false },
  { name: 'AuditLog', desc: 'System audit trail', critical: false },
  { name: 'RiskAlert', desc: 'Risk alerts from agents', critical: false },
  { name: 'AgentRegistry', desc: 'Agent registration data', critical: false },
  { name: 'AgentMemory', desc: 'Agent persistent memory', critical: false },
  { name: 'AgentMessage', desc: 'Agent message bus', critical: false },
  { name: 'AgentTaskLog', desc: 'Agent task execution logs', critical: false },
  { name: 'AgentActionProposal', desc: 'Proposed agent actions', critical: false },
  { name: 'AgentLearningRecord', desc: 'Agent learning history', critical: false },
  { name: 'MemoryGraphNode', desc: 'Memory graph relationships', critical: false },
  { name: 'MusicAgentMemory', desc: 'Music-specific agent memory', critical: false },
  { name: 'MusicProductionProject', desc: 'Self-production — DAW settings, plugin chains, status', critical: false },
  { name: 'ProducerContact', desc: 'Producer directory — contacts, quotes, ratings', critical: false },
  { name: 'MasteringProject', desc: 'Audio mastering projects with analysis', critical: false },
  { name: 'GalleryImage', desc: 'Gallery images — photos, tour, artwork', critical: false },
  { name: 'Meditation', desc: 'Coaching meditation audio library', critical: false },
  { name: 'CoachingOffer', desc: 'Coaching programs with inclusions and pricing', critical: false },
  { name: 'CoachingClient', desc: 'Coaching client management', critical: false },
  { name: 'CoachingLead', desc: 'Coaching lead pipeline', critical: false },
  { name: 'CoachingIntake', desc: 'Coaching intake forms', critical: false },
  { name: 'CoachingSession', desc: 'Coaching session scheduling', critical: false },
  { name: 'CoachingResource', desc: 'Coaching client resource library', critical: false },
  { name: 'CoachingTestimonial', desc: 'Coaching testimonials', critical: false },
  { name: 'CoachingWorkbook', desc: 'Coaching workbooks', critical: false },
  { name: 'ContentPipelineItem', desc: 'Content pipeline with approval workflow', critical: false },
  { name: 'ContentPost', desc: 'Generated social content posts', critical: false },
  { name: 'ContentCalendarPost', desc: 'Scheduled content calendar', critical: false },
  { name: 'ContentStudioRecord', desc: 'Content studio drafts', critical: false },
  { name: 'SocialAsset', desc: 'Social media asset library', critical: false },
  { name: 'SocialVideo', desc: 'Social video content', critical: false },
  { name: 'ManyChatKeywordDraft', desc: 'ManyChat DM keyword drafts', critical: false },
  { name: 'DailyDashboardTask', desc: 'Daily admin tasks', critical: false },
  { name: 'DailyAdminChecklistItem', desc: 'Morning/evening checklists', critical: false },
  { name: 'DailyNote', desc: 'Daily admin notes', critical: false },
  { name: 'StrategicPlanItem', desc: 'Strategic plan items (7/30/90 day)', critical: false },
  { name: 'ReleaseActionPlan', desc: 'Release launch action plans', critical: false },
  { name: 'BlockedItem', desc: 'Blocked items tracking', critical: false },
  { name: 'ProjectionMetric', desc: 'Projection metrics and goals', critical: false },
  { name: 'WebsiteOverhaulTask', desc: 'Website overhaul tracking', critical: false },
  { name: 'AdminPreparationItem', desc: 'Admin prep items', critical: false },
  { name: 'MerchVisualAsset', desc: 'Merch visual assets', critical: false },
  { name: 'MerchVisualComposition', desc: 'Merch visual compositions', critical: false },
  { name: 'VisualGenerationQueue', desc: 'AI visual generation queue', critical: false },
  { name: 'FeaturedVideo', desc: 'Featured videos for pages', critical: false },
  { name: 'FanPlaylist', desc: 'Curated fan playlists', critical: false },
  { name: 'PhoneNotificationRule', desc: 'Phone notification rules', critical: false },
  { name: 'BusinessPhoneNumber', desc: 'Business phone numbers', critical: false },
  { name: 'PhoneLeadSource', desc: 'Phone lead sources', critical: false },
  { name: 'SmsDraft', desc: 'SMS draft messages', critical: false },
  { name: 'SalesCallLead', desc: 'Sales call leads', critical: false },
  { name: 'CallLog', desc: 'Call log records', critical: false },
  { name: 'MissedCallFollowUp', desc: 'Missed call follow-ups', critical: false },
  { name: 'PhoneProviderSetting', desc: 'Phone provider config', critical: false },
  { name: 'EmailPreference', desc: 'Email preference management', critical: false },
  { name: 'IdeaOpportunity', desc: 'Idea/opportunity tracking', critical: false },
  { name: 'ShippingRateRule', desc: 'Shipping rate rules', critical: false },
  { name: 'InventoryBatch', desc: 'Inventory batch tracking', critical: false },
  { name: 'PurchaseOrder', desc: 'Purchase orders', critical: false },
  { name: 'ApiIntegrationSetup', desc: 'API integration tracking', critical: false },
  { name: 'IdempotenceLog', desc: 'Idempotency tracking', critical: false },
  { name: 'OrderLock', desc: 'Order locking for dedup', critical: false },
  { name: 'Supplier', desc: 'Supplier directory', critical: false },
  { name: 'SupplierProduct', desc: 'Supplier product catalog', critical: false },
  { name: 'LandedCostCalculation', desc: 'Landed cost calculations', critical: false },
  { name: 'BundleOffer', desc: 'Bundle offer configs', critical: false },
  { name: 'GrowthOpportunity', desc: 'Growth opportunities', critical: false },
  { name: 'ViralOpportunity', desc: 'Viral content opportunities', critical: false },
  { name: 'CreatorGapInsight', desc: 'Creator gap analysis', critical: false },
  { name: 'AudienceInsight', desc: 'Audience insights', critical: false },
  { name: 'RevenueOpportunity', desc: 'Revenue opportunities', critical: false },
  { name: 'MerchFeedback', desc: 'Merch feedback records', critical: false },
  { name: 'SystemHealthIssue', desc: 'System health issues', critical: false },
  { name: 'CommunityLike', desc: 'Community post likes', critical: false },
  { name: 'StripeEventLog', desc: 'Stripe webhook event logs', critical: false },
  { name: 'PaymentDiagnostic', desc: 'Payment diagnostic records', critical: false },
  { name: 'TrainingModule', desc: 'Training modules', critical: false },
  { name: 'MusicLearningRecord', desc: 'Music learning tracking', critical: false },
  { name: 'KnowledgeVault', desc: 'Knowledge vault documents', critical: false },
  { name: 'DriveSync', desc: 'Google Drive sync records', critical: false },
  { name: 'ProducerContact', desc: 'Producer contacts (dup check)', critical: false },
  { name: 'User', desc: 'Built-in — users, roles, auth', critical: true },
];

// ─── COMPLETE SECRETS / INTEGRATIONS ─────────────────────────────────────────
const SECRETS = [
  { name: 'STRIPE_SECRET_KEY', desc: 'Stripe payment processing', action: 'Reuse on new platform', critical: true },
  { name: 'STRIPE_PUBLISHABLE_KEY', desc: 'Stripe client-side key', action: 'Reuse on new platform', critical: true },
  { name: 'STRIPE_WEBHOOK_SECRET', desc: 'Stripe webhook signature verification', action: 'Re-register webhook URL on new platform, get new secret', critical: true },
  { name: 'OPENAI_API_KEY', desc: 'OpenAI for AI agents, content generation', action: 'Reuse on new platform', critical: true },
  { name: 'GITHUB_TOKEN', desc: 'GitHub API for code management', action: 'Reuse on new platform', critical: false },
  { name: 'CURSOR_API_KEY', desc: 'Cursor IDE integration', action: 'Reuse if needed', critical: false },
  { name: 'METRICOOL_BLOG_ID', desc: 'Metricool social scheduling', action: 'Reuse on new platform', critical: false },
  { name: 'METRICOOL_USER_ID', desc: 'Metricool user ID', action: 'Reuse on new platform', critical: false },
  { name: 'METRICOOL_API_TOKEN', desc: 'Metricool API access', action: 'Reuse on new platform', critical: false },
  { name: 'TIKTOK_CLIENT_KEY', desc: 'TikTok OAuth client', action: 'Re-register redirect URI on new platform', critical: false },
  { name: 'TIKTOK_CLIENT_SECRET', desc: 'TikTok OAuth secret', action: 'Reuse, update redirect URIs', critical: false },
  { name: 'GOOGLE_SHEET_ID', desc: 'Google Sheets sync', action: 'Reuse on new platform', critical: false },
];

// ─── OAUTH CONNECTORS ───────────────────────────────────────────────────────
const CONNECTORS = [
  { name: 'Instagram Business', scopes: 'instagram_business_basic, instagram_business_content_publish', action: 'Re-authorize on new platform' },
  { name: 'Slack', scopes: 'chat:write, users:read.email, users:read', action: 'Re-authorize on new platform' },
  { name: 'Google Drive', scopes: 'email', action: 'Re-authorize on new platform' },
  { name: 'Google Calendar', scopes: 'calendar.events, email', action: 'Re-authorize on new platform' },
  { name: 'Gmail', scopes: 'gmail.send, email', action: 'Re-authorize on new platform' },
  { name: 'Google Sheets', scopes: 'spreadsheets, drive.file, email', action: 'Re-authorize on new platform' },
];

// ─── AGENTS ─────────────────────────────────────────────────────────────────
const AGENTS = [
  'orchestrator', 'music_orchestrator', 'revenue_orchestrator', 'fan_engagement_agent',
  'merch_visual_agent', 'merch_sales_agent', 'social_grid_architect', 'pricing_optimiser',
  'shipping_optimisation', 'sync_licensing_agent', 'link_integrity_agent',
  'memorial_visual_director', 'partnership_agent', 'ganozmix_direct',
  'security_secrets_agent', 'academic_writing_coach', 'master_blueprint_agent',
  'email_revenue_agent', 'metricool_agent', 'stripe_revenue_protection',
  'booking_revenue_agent', 'qa_systems_auditor', 'streaming_royalty_agent',
  'release_launch_agent', 'api_setup_assistant', 'approval_gate',
  'superfan_converter', 'literature_researcher', 'content_revenue_agent',
  'site_auditor', 'workbook_writer', 'order_support',
];

// ─── MIGRATION PHASES ────────────────────────────────────────────────────────
const MIGRATION_PHASES = [
  {
    id: 'p1', title: 'Phase 1 — Inventory & Export (Base44)', status: 'ready',
    items: [
      'Export all entity data as JSON/CSV via dashboard or exec_tool',
      'Export all frontend source code from the GitHub repo (if 2-way sync enabled) or copy from file explorer',
      'Document all routes from src/App.jsx (public + admin)',
      'Document all entity schemas from base44/entities/*.jsonc',
      'Document all backend functions from base44/functions/',
      'Document all agent configs from base44/agents/',
      'Screenshot every public page for visual reference',
      'Screenshot every admin page for feature reference',
      'Export all secrets list (values entered manually on new platform)',
      'Export all OAuth connector scopes and statuses',
    ],
  },
  {
    id: 'p2', title: 'Phase 2 — Set Up Emergent Project', status: 'not_started',
    items: [
      'Create account at emergent.sh',
      'Create new project — choose React/Vite scaffold',
      'Configure custom domain (gannonwaye.com) or staging subdomain',
      'Set up environment variables for all secrets',
      'Set up Stripe (reuse STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY)',
      'Set up OpenAI (reuse OPENAI_API_KEY)',
      'Set up database (Emergent built-in or external Supabase)',
      'Create all entity tables matching Base44 schemas',
      'Set up file storage for images/audio',
      'Configure OAuth redirect URIs for Instagram, Gmail, Google, Slack, TikTok',
    ],
  },
  {
    id: 'p3', title: 'Phase 3 — Rebuild Public Site', status: 'not_started',
    items: [
      'Rebuild Home page (hero, story, music, CTAs)',
      'Rebuild Music page (discography, lyrics, streaming links)',
      'Rebuild Store + StoreWorld (product grid, cart, checkout)',
      'Rebuild StoreCheckout (Stripe Payment Intent / Checkout Session)',
      'Rebuild StoreCartPage, StoreCustomerDetails, StoreCartDetails',
      'Rebuild LyricsPage (lyrics archive, search)',
      'Rebuild Gallery (masonry, lightbox, categories)',
      'Rebuild BackThis (support/donation page)',
      'Rebuild Community (fan wall, comments, replies)',
      'Rebuild Videos page',
      'Rebuild ContactGannon page',
      'Rebuild MumTribute / MumsGarden / Memorial pages',
      'Rebuild CurrentSingle, ReleaseDetail pages',
      'Rebuild About, Biography, Press, PressKit pages',
      'Rebuild Coaching pages (offers, intake, workbooks)',
      'Rebuild GiftCards, GiftTracker pages',
      'Rebuild MixingServices, Mastering pages',
      'Rebuild MusicRecommender, FanReminders pages',
      'Rebuild PreSave, CheckoutSuccess, CheckoutCancel pages',
      'Rebuild PrivacyPolicy, TermsOfService pages',
      'Rebuild FAQSection, MemberTiers, Impact pages',
      'Rebuild SystemsManagerOffer, CinematicWebsites, case studies',
      'Rebuild EmailPreferences, OrderHistory, OrderStatus pages',
      'Rebuild EmbedTimer, Live pages',
      'Rebuild Navigation (Navbar, Footer, MobileBottomTabs)',
      'Rebuild StickySupportBar, ScrollToTop components',
    ],
  },
  {
    id: 'p4', title: 'Phase 4 — Rebuild Admin System', status: 'not_started',
    items: [
      'Rebuild AdminLayout (sidebar nav, auth guard, breadcrumbs)',
      'Rebuild Dashboard / DailyDashboard (tasks, checklists, priorities)',
      'Rebuild Orders management (list, filter, fulfill, track)',
      'Rebuild MerchManagement (product CRUD, stock, pricing)',
      'Rebuild Releases management (CRUD, lyrics, streaming links)',
      'Rebuild Subscribers / EmailSubscriber management',
      'Rebuild PromoCodes management (rules, exclusions, usage)',
      'Rebuild ShippingRates management',
      'Rebuild FinancialDashboard (revenue, costs, profit)',
      'Rebuild StripeCommandCentre (webhook health, diagnostics)',
      'Rebuild ApprovalQueue (agent action approvals)',
      'Rebuild ContentStudio / ContentPipeline management',
      'Rebuild ManyChatDrafts management',
      'Rebuild MeditationLibrary (audio upload, playback)',
      'Rebuild CoachingPrograms (offers, inclusions, pricing)',
      'Rebuild CoachingClients / CoachingLeads management',
      'Rebuild MusicProduction (DAW, plugin chains, status)',
      'Rebuild ProducerDirectory (contacts, quotes, ratings)',
      'Rebuild GalleryImage management (upload, categories)',
      'Rebuild MasteringAdmin (audio mastering projects)',
      'Rebuild AgentRegistry, AgentTaskLog, AgentWorkbench',
      'Rebuild RiskAlerts, AuditLog, SystemHealthIssue pages',
      'Rebuild BusinessProfileSettings, SiteSettings',
      'Rebuild all other admin pages as needed (50+ pages)',
    ],
  },
  {
    id: 'p5', title: 'Phase 5 — Rebuild Backend Logic', status: 'not_started',
    items: [
      'Rebuild Stripe webhook handler (stripeWebhook)',
      'Rebuild Stripe checkout session creation (createCheckoutSession)',
      'Rebuild Stripe payment intent creation (createPaymentIntent)',
      'Rebuild promo code validation (validatePromoCode)',
      'Rebuild shipping rate calculation (calculateShippingRate)',
      'Rebuild order notification chain (notifyAdmin, sendOrderReceipt, onNewOrderAlert)',
      'Rebuild order fulfillment (fulfilOrderAndNotify)',
      'Rebuild order locking / dedup (orderLockingMiddleware, OrderLock)',
      'Rebuild charity donation tracking (trackMonthlyCharityDonation)',
      'Rebuild email sending (welcomeEmail, sendOrderReceipt, sendFanReminders)',
      'Rebuild AI content generation (generateResearchedSocialContent, generateContentPost)',
      'Rebuild social posting (postToInstagram, scheduledSocialPost, autonomousSocialPoster)',
      'Rebuild Metricool integration (metricoolSchedulePost, metricoolImportMetrics)',
      'Rebuild TikTok integration (tiktokOAuth, tiktokUploadDraft, tiktokWebhook)',
      'Rebuild site health checks (runSiteHealthCheck, integrationHealthCheck)',
      'Rebuild Stripe order recovery (recoverStripeOrders)',
      'Rebuild gift card / gift tracker functions (createGiftTracker, sendGiftEmail)',
      'Rebuild all other functions as needed (100+ functions)',
    ],
  },
  {
    id: 'p6', title: 'Phase 6 — Rebuild Agent System', status: 'not_started',
    items: [
      'Rebuild orchestrator agent (central coordinator)',
      'Rebuild music_orchestrator (release pipeline)',
      'Rebuild revenue_orchestrator (monetization)',
      'Rebuild fan_engagement_agent (community)',
      'Rebuild literature_researcher (credible content research)',
      'Rebuild academic_writing_coach (content quality review)',
      'Rebuild all 30+ agents with instructions and tool permissions',
      'Rebuild agent memory system (AgentMemory, MusicAgentMemory)',
      'Rebuild agent approval queue (ApprovalQueue, proofApprovalChain)',
      'Rebuild agent intelligence loop (agentIntelligenceLoop, agentSelfImprovement)',
    ],
  },
  {
    id: 'p7', title: 'Phase 7 — Rebuild Automations', status: 'not_started',
    items: [
      'Rebuild scheduled automations (daily drafts, trend engine, alert system)',
      'Rebuild entity-triggered automations (new order, new subscriber, new approval)',
      'Rebuild connector webhook automations (Instagram, Slack, Gmail, Google Drive, Calendar, Sheets)',
      'Rebuild Stripe webhook automation',
      'Rebuild TikTok webhook automation',
      'Rebuild all scheduled tasks (cleanup, reminders, birthday discounts)',
    ],
  },
  {
    id: 'p8', title: 'Phase 8 — Data Migration', status: 'not_started',
    items: [
      'Migrate MerchProduct records (all products)',
      'Migrate MerchOrder records (all orders — historical)',
      'Migrate StoreCustomer records',
      'Migrate EmailSubscriber records',
      'Migrate Release records (songs, lyrics, artwork)',
      'Migrate Lyric records',
      'Migrate PromoCode records',
      'Migrate GiftCard records',
      'Migrate SupportContribution records',
      'Migrate FanComment, FanPost, CommunityReply records',
      'Migrate BookingEnquiry records',
      'Migrate BusinessProfileSettings, SiteSettings',
      'Migrate all media URLs (re-upload if storage changes)',
      'Verify data integrity post-migration',
    ],
  },
  {
    id: 'p9', title: 'Phase 9 — Parity Testing', status: 'not_started',
    items: [
      'All public pages load and render correctly',
      'Store: products display with correct pricing',
      'Cart works end-to-end',
      'Checkout completes via Stripe',
      'Stripe webhooks fire and create orders',
      'Order deduplication works',
      'Promo code rules enforced correctly',
      'Email notifications send on key events',
      'Admin dashboard protected and functional',
      'Agent system responds and creates content',
      'Mobile responsive on all pages',
      'No secrets exposed in frontend',
      'Full test order completed successfully',
      'Community features work (comments, posts)',
      'Gallery displays images',
      'Meditation audio plays',
      'Coaching programs show inclusions',
    ],
  },
  {
    id: 'p10', title: 'Phase 10 — Domain Cutover', status: 'not_started',
    items: [
      'Freeze Base44 — no more changes',
      'Final data export from Base44',
      'Final data import to Emergent',
      'Deploy Emergent project to production',
      'Run smoke tests on production',
      'Switch DNS: gannonwaye.com → Emergent',
      'Update Stripe webhook URL to new endpoint',
      'Update all OAuth redirect URIs',
      'Monitor checkout and orders for 48 hours',
      'Keep Base44 accessible as fallback temporarily',
      'Retire Base44 subscription only after confirmed stable',
    ],
  },
];

const STATUS_COLORS = {
  ready: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  not_started: 'bg-secondary text-muted-foreground border-border/30',
  in_progress: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  complete: 'bg-green-500/15 text-green-400 border-green-500/30',
};

function Section({ icon: Icon, title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/10 transition-colors">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-display text-sm text-foreground">{title}</span>
          {count != null && <Badge variant="outline" className="text-[10px]">{count}</Badge>}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 py-4 border-t border-border/20 space-y-2">{children}</div>}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return <button onClick={copy} className="text-muted-foreground hover:text-primary transition-colors">{copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}</button>;
}

export default function Base44ExitPlan() {
  const [exportText, setExportText] = useState('');

  const generateExportScript = () => {
    const script = `// ═══════════════════════════════════════════════════════════════
// GANNON WAYE MUSIC — FULL SITE EXPORT FOR EMERGENT + CHATGPT WEBSITE BUILDER
// Generated: ${new Date().toISOString()}
// ═══════════════════════════════════════════════════════════════

// ─── ENTITIES TO MIGRATE (${ENTITIES.length}) ───────────────────────────
${ENTITIES.map(e => `// ${e.name}${e.critical ? ' [CRITICAL]' : ''} — ${e.desc}`).join('\n')}

// ─── SECRETS TO SET ON NEW PLATFORM (${SECRETS.length}) ────────────────
${SECRETS.map(s => `// ${s.name} [${s.critical ? 'CRITICAL' : 'optional'}] — ${s.desc} → ${s.action}`).join('\n')}

// ─── OAUTH CONNECTORS TO RE-AUTHORIZE (${CONNECTORS.length}) ───────────
${CONNECTORS.map(c => `// ${c.name} — scopes: ${c.scopes} → ${c.action}`).join('\n')}

// ─── AGENTS TO REBUILD (${AGENTS.length}) ──────────────────────────────
${AGENTS.map(a => `// ${a}`).join('\n')}

// ─── BACKEND FUNCTIONS TO REBUILD (100+) ──────────────────────────────
// See base44/functions/ directory for all entry.ts files.
// Key functions: stripeWebhook, createCheckoutSession, validatePromoCode,
// calculateShippingRate, generateResearchedSocialContent, notifyAdmin,
// fulfilOrderAndNotify, trackMonthlyCharityDonation, and 90+ more.

// ─── DATA EXPORT INSTRUCTIONS ──────────────────────────────────────────
// 1. Go to Base44 dashboard → Entities → each entity → Export (CSV/JSON)
// 2. Or use exec_tool in Base44 to bulk export:
//    const entities = await base44.asServiceRole.entities.EntityName.list();
//    return entities;
// 3. Download all source code from GitHub repo or Base44 file explorer
// 4. Copy all base44/entities/*.jsonc schema files
// 5. Copy all base44/functions/*/entry.ts backend function files
// 6. Copy all base44/agents/*.jsonc agent config files
// 7. Copy all src/pages/*.jsx frontend page files
// 8. Copy all src/components/*.jsx component files
// 9. Copy src/App.jsx (router — contains all routes)
// 10. Copy src/index.css and tailwind.config.js (design system)
// 11. Copy package.json (dependency list)

// ─── EMERGENT MIGRATION STEPS ──────────────────────────────────────────
// 1. Create project at emergent.sh
// 2. Choose React/Vite scaffold
// 3. Set environment variables for all secrets listed above
// 4. Create database tables matching entity schemas
// 5. Upload source code files
// 6. Configure custom domain
// 7. Test all flows
// 8. Switch DNS when ready

// ─── CHATGPT WEBSITE BUILDER MIGRATION ──────────────────────────────────
// 1. Provide ChatGPT with the exported source code files
// 2. Provide entity schemas (JSON) as database structure
// 3. Provide this export script as the complete feature inventory
// 4. Ask it to rebuild page by page using the screenshots as reference
// 5. Set up Stripe, OpenAI, and OAuth integrations manually
// 6. Import data from exported CSV/JSON files`;
    setExportText(script);
  };

  const totalTasks = MIGRATION_PHASES.reduce((s, p) => s + p.items.length, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-3xl text-foreground">Base44 Exit Plan — Full Migration</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Complete transfer to Emergent (emergent.sh) + ChatGPT Website Builder. Every entity, integration, route, function, and agent documented below.
        </p>
      </div>

      {/* Critical Alert */}
      <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs text-red-300/90 leading-relaxed space-y-1">
          <p><strong>CRITICAL:</strong> Do NOT cancel Base44 subscription until the new platform is fully tested and live.</p>
          <p>Build replacement in parallel. Prove parity with test orders. Only switch DNS after all flows work on the new platform.</p>
          <p>Stripe webhook URL must be updated after DNS cutover — orders will fail silently otherwise.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border/40 rounded-xl p-4"><Database className="w-4 h-4 text-primary mb-2" /><p className="text-[10px] uppercase text-muted-foreground">Entities</p><p className="text-xl font-semibold">{ENTITIES.length}</p></div>
        <div className="bg-card border border-border/40 rounded-xl p-4"><Key className="w-4 h-4 text-primary mb-2" /><p className="text-[10px] uppercase text-muted-foreground">Secrets</p><p className="text-xl font-semibold">{SECRETS.length}</p></div>
        <div className="bg-card border border-border/40 rounded-xl p-4"><Bot className="w-4 h-4 text-primary mb-2" /><p className="text-[10px] uppercase text-muted-foreground">Agents</p><p className="text-xl font-semibold">{AGENTS.length}</p></div>
        <div className="bg-card border border-border/40 rounded-xl p-4"><CheckCircle2 className="w-4 h-4 text-primary mb-2" /><p className="text-[10px] uppercase text-muted-foreground">Migration Tasks</p><p className="text-xl font-semibold">{totalTasks}</p></div>
      </div>

      {/* Mastering System Location */}
      <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-4 flex items-start gap-3">
        <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300/90">
          <p className="font-semibold mb-1">Mastering System Location</p>
          <p>Admin: <code className="bg-secondary/40 rounded px-1">/admin/mastering</code> (MasteringAdmin — upload, analyze, master audio)</p>
          <p>Public: <code className="bg-secondary/40 rounded px-1">/mastering</code> (Mastering — public mastering service page)</p>
        </div>
      </div>

      {/* Export Script Generator */}
      <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base text-foreground flex items-center gap-2"><FileDown className="w-4 h-4 text-primary" /> Export Script for ChatGPT / Emergent</h2>
          <Button onClick={generateExportScript} size="sm" className="gap-2">Generate Export</Button>
        </div>
        <p className="text-xs text-muted-foreground">Generates a complete inventory script you can paste into ChatGPT or Emergent to rebuild the entire site. Includes all entities, secrets, connectors, agents, and migration steps.</p>
        {exportText && (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10"><CopyButton text={exportText} /></div>
            <pre className="bg-background border border-border rounded-lg p-3 text-[10px] text-muted-foreground overflow-x-auto max-h-96 whitespace-pre-wrap">{exportText}</pre>
          </div>
        )}
      </div>

      {/* Entity Inventory */}
      <Section icon={Database} title="Entity Inventory" count={ENTITIES.length} defaultOpen>
        <div className="space-y-1">
          {ENTITIES.map(e => (
            <div key={e.name} className="flex items-start gap-2 text-xs py-1 border-b border-border/10 last:border-0">
              {e.critical ? <span className="text-red-400 shrink-0">●</span> : <span className="text-muted-foreground/30 shrink-0">○</span>}
              <code className="text-primary/70 shrink-0">{e.name}</code>
              <span className="text-muted-foreground/60">— {e.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Secrets Inventory */}
      <Section icon={Key} title="Secrets & Integrations" count={SECRETS.length}>
        <div className="space-y-2">
          {SECRETS.map(s => (
            <div key={s.name} className="flex items-start gap-2 text-xs py-1">
              {s.critical ? <span className="text-red-400 shrink-0">●</span> : <span className="text-muted-foreground/30 shrink-0">○</span>}
              <code className="text-primary/70 shrink-0">{s.name}</code>
              <span className="text-muted-foreground/60">— {s.desc} → <span className="text-yellow-400/70">{s.action}</span></span>
            </div>
          ))}
        </div>
      </Section>

      {/* Connectors */}
      <Section icon={Plug} title="OAuth Connectors" count={CONNECTORS.length}>
        <div className="space-y-2">
          {CONNECTORS.map(c => (
            <div key={c.name} className="flex items-start gap-2 text-xs py-1">
              <span className="text-primary/70 shrink-0 font-medium">{c.name}</span>
              <span className="text-muted-foreground/50">scopes: {c.scopes}</span>
              <span className="text-yellow-400/70 shrink-0">→ {c.action}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Agents */}
      <Section icon={Bot} title="AI Agents" count={AGENTS.length}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {AGENTS.map(a => (
            <div key={a} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Bot className="w-3 h-3 text-primary/40" /> {a}
            </div>
          ))}
        </div>
      </Section>

      {/* Migration Phases */}
      <div className="space-y-3">
        <h2 className="font-display text-lg text-foreground">Migration Phases</h2>
        {MIGRATION_PHASES.map(phase => {
          const done = phase.items.filter(i => i.done).length;
          return (
            <div key={phase.id} className="bg-card border border-border/40 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] tracking-[0.12em] uppercase border rounded-full px-2 py-0.5 ${STATUS_COLORS[phase.status]}`}>{phase.status.replace('_', ' ')}</span>
                  <p className="font-display text-sm text-foreground">{phase.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">{done}/{phase.items.length}</p>
              </div>
              <div className="px-5 py-3 space-y-1.5">
                {phase.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    {item.done ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" /> : <Circle className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 mt-0.5" />}
                    <p className={`text-xs leading-relaxed ${item.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center font-body text-xs text-muted-foreground/40 pb-8">
        Base44 Exit Plan — Emergent + ChatGPT Website Builder · Updated {new Date().toLocaleDateString('en-AU')}
      </p>
    </div>
  );
}