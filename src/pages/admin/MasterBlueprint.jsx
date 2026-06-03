import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2, AlertTriangle, XCircle, Circle, RefreshCw,
  ExternalLink, ChevronDown, ChevronRight, Zap, Shield, ShoppingCart,
  Music, Users, FileText, Settings, Activity, Globe, Lock,
  Camera, Heart, Database, Cpu, Eye, EyeOff, Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// STATUS SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  live:       { label: 'Live',           color: 'bg-green-500/15 text-green-300 border-green-500/30' },
  fixed:      { label: 'Fixed',          color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  partial:    { label: 'Partial',        color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
  review:     { label: 'Needs Review',   color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  broken:     { label: 'Broken',         color: 'bg-red-500/15 text-red-300 border-red-500/30' },
  missing:    { label: 'Not Built',      color: 'bg-secondary text-muted-foreground border-border' },
  seed:       { label: 'Seed Only',      color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  manual:     { label: 'Manual Required',color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  blocked:    { label: 'Blocked (Safe)', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  placeholder:{ label: 'Placeholder',   color: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
};

function SBadge({ s }) {
  const cfg = S[s] || S.missing;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wider uppercase shrink-0 ${cfg.color}`}>{cfg.label}</span>;
}

function Row({ label, path, s, note, external }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border/20 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-foreground">{label}</span>
          {path && (external
            ? <a href={path} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 truncate max-w-xs"><ExternalLink className="w-3 h-3 shrink-0" />{path}</a>
            : <Link to={path} className="font-mono text-xs text-muted-foreground hover:text-primary truncate max-w-xs">{path}</Link>
          )}
        </div>
        {note && <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-relaxed">{note}</p>}
      </div>
      <SBadge s={s} />
    </div>
  );
}

function Sec({ title, icon: Icon, children, open: defaultOpen = false, accent }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className={`border-border/50 ${accent || ''}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><Icon className="w-4 h-4 text-primary" />{title}</span>
            {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
      </button>
      {open && <CardContent className="pt-0 pb-4 space-y-0">{children}</CardContent>}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA — PUBLIC ROUTES
// ─────────────────────────────────────────────────────────────────────────────
const PUBLIC_ROUTES = [
  { label: 'Home', path: '/', s: 'live', note: 'Hero, ThankYou single, social links, fan wall, supporter leaderboard' },
  { label: 'Music / Discography', path: '/music', s: 'live', note: 'Release cards, Lyrics modal, streaming links' },
  { label: 'Current Single', path: '/current-single', s: 'live', note: 'Thank You cinematic page, fan reviews, streaming links' },
  { label: 'Lyrics Page', path: '/lyrics', s: 'live', note: 'Accordion lyrics, artwork, streaming links' },
  { label: 'Store', path: '/store', s: 'live', note: 'Products, cart, promo codes, Stripe checkout' },
  { label: 'Store → Cart', path: '/store/cart', s: 'live' },
  { label: 'Store → Customer Details', path: '/store/customer-details', s: 'live' },
  { label: 'Store → Checkout', path: '/store/checkout', s: 'live', note: 'Stripe Elements form' },
  { label: 'Checkout Success', path: '/checkout-success', s: 'live' },
  { label: 'Checkout Cancel', path: '/checkout-cancel', s: 'live' },
  { label: 'Back This (Support)', path: '/back-this', s: 'live', note: 'Support contribution + Stripe + receipt email' },
  { label: 'Community', path: '/community', s: 'live', note: 'Fan posts, replies, likes' },
  { label: 'Videos', path: '/videos', s: 'live' },
  { label: 'Contact', path: '/contact', s: 'live', note: 'Contact form + booking enquiry' },
  { label: 'This Is My Life (About)', path: '/this-is-my-life', s: 'live' },
  { label: "Mum's Tribute", path: '/mum', s: 'live', note: 'Real Sonia photos, memory wall, letter, wisdom garden, GSAP animations' },
  { label: '/without-you-here alias', path: '/without-you-here', s: 'live', note: 'Alias for /mum' },
  { label: 'Fan Profile', path: '/fan-profile', s: 'live' },
  { label: 'Order History', path: '/orders', s: 'live' },
  { label: 'Order Status', path: '/order-status', s: 'live' },
  { label: 'Email Preferences', path: '/email-preferences', s: 'live' },
  { label: 'Founding Supporter', path: '/founding-supporter', s: 'live' },
  { label: 'Mastering Services', path: '/mastering', s: 'live', note: 'Service info + enquiry form' },
  { label: 'Merch Feedback', path: '/merch-feedback', s: 'live' },
  { label: 'Impact / Charity', path: '/impact', s: 'live' },
  { label: 'Member Tiers', path: '/member-tiers', s: 'live' },
  { label: 'Portrait Gallery', path: '/portrait-gallery', s: 'live' },
  { label: 'Summary', path: '/summary', s: 'live' },
  { label: 'FAQ', path: '/faq', s: 'live' },
  { label: '7 Day Standard', path: '/7-day-standard', s: 'live' },
  { label: 'Privacy Policy', path: '/privacy-policy', s: 'live' },
  { label: 'Terms of Service', path: '/terms-of-service', s: 'live' },
  { label: 'Gift Checklist', path: '/gift-checklist', s: 'live' },
  { label: 'Supporter Activity', path: '/supporter-activity', s: 'live' },
  { label: 'Fan Activity', path: '/fan-activity', s: 'live' },
  { label: 'Merch Reel', path: '/merch-reel', s: 'live' },
  { label: 'Live Stream', path: '/live', s: 'partial', note: 'Shows only when live_stream_enabled = true in SiteSettings. Currently offline.' },
  { label: 'TikTok Platform Review', path: '/tiktok-platform-review', s: 'live', note: 'Public page for TikTok app reviewers' },
  { label: 'TikTok Verify File', path: '/tiktokBvObA9e2aJczvipg0jSRAN1W03NAa4Bo.txt', s: 'live', note: 'TikTok domain verification' },
  { label: 'Embed Timer', path: '/embed-timer', s: 'live', note: 'No-layout countdown embed' },
];

const REDIRECT_ROUTES = [
  { label: '/about → /this-is-my-life', path: '/about', s: 'live', note: 'Permanent redirect' },
  { label: '/tour → / (home)', path: '/tour', s: 'live', note: 'Redirects — no touring currently' },
  { label: '/bookings → / (home)', path: '/bookings', s: 'live', note: 'Redirects — no bookings page currently' },
  { label: '/become-founding-supporter → /founding-supporter', s: 'live' },
  { label: '/store/checkout-success → /checkout-success', s: 'live' },
  { label: '/payment-success → /checkout-success', s: 'live' },
  { label: '/order-success → /checkout-success', s: 'live' },
  { label: '/store/checkout-cancel → /checkout-cancel', s: 'live' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ENTITIES (Database Tables)
// ─────────────────────────────────────────────────────────────────────────────
const ENTITIES = [
  { label: 'MerchProduct', s: 'live', note: 'Store products — RLS: public read if active, admin write' },
  { label: 'MerchOrder', s: 'live', note: 'Store orders — customer can read own orders, admin full access' },
  { label: 'StoreCustomer', s: 'live', note: 'Customer profiles — admin read only' },
  { label: 'PromoCode', s: 'live', note: 'Discount codes — admin CRUD only' },
  { label: 'ShippingRateRule', s: 'live', note: 'Shipping rules — admin CRUD' },
  { label: 'Release', s: 'live', note: 'Music releases — admin CRUD, public read if is_published' },
  { label: 'SiteSettings', s: 'live', note: 'Public site config — admin write, public read' },
  { label: 'SocialVideo', s: 'live', note: 'Video embeds for /videos' },
  { label: 'FeaturedVideo', s: 'live', note: 'Homepage featured video' },
  { label: 'FanPost', s: 'live', note: 'Community posts — public create, admin moderate' },
  { label: 'FanComment', s: 'live', note: 'Fan comments' },
  { label: 'FanReview', s: 'live', note: 'Product reviews' },
  { label: 'FanMedia', s: 'live', note: 'Fan uploaded media — admin approval required' },
  { label: 'EmailSubscriber', s: 'live', note: 'Newsletter subscribers' },
  { label: 'EmailPreference', s: 'live', note: 'Per-subscriber email preferences' },
  { label: 'FoundingSupporter', s: 'live', note: 'Founding supporter signups' },
  { label: 'SupporterProfile', s: 'live', note: 'Full supporter profiles' },
  { label: 'SupportContribution', s: 'live', note: 'Back-this support payments' },
  { label: 'ContentCalendarPost', s: 'live', note: 'Social media content calendar' },
  { label: 'SocialAsset', s: 'live', note: 'Media assets for social posts' },
  { label: 'ContentPost', s: 'live', note: 'Social content drafts' },
  { label: 'ApprovalQueue', s: 'live', note: 'All agent/system actions requiring admin sign-off' },
  { label: 'AdminNotification', s: 'live', note: 'Admin alert system' },
  { label: 'SystemHealthIssue', s: 'live', note: 'Platform health issue tracking' },
  { label: 'AgentRegistry', s: 'live', note: 'AI agent registry — DB records + seed fallback' },
  { label: 'AgentMemory', s: 'live', note: 'Agent short-term memory' },
  { label: 'AgentTaskLog', s: 'live', note: 'Agent action logs' },
  { label: 'AgentMessage', s: 'live', note: 'Inter-agent message bus' },
  { label: 'AgentActionProposal', s: 'live', note: 'Agent proposals requiring review' },
  { label: 'AgentLearningRecord', s: 'live', note: 'Agent learning history' },
  { label: 'MusicAgentMemory', s: 'live', note: 'Music-domain agent memory' },
  { label: 'KnowledgeVault', s: 'live', note: 'Saved research + knowledge base' },
  { label: 'RiskAlert', s: 'live', note: 'System risk alert records' },
  { label: 'IdeaOpportunity', s: 'live', note: 'Revenue / growth ideas' },
  { label: 'RevenueOpportunity', s: 'live', note: 'Revenue tracking' },
  { label: 'GrowthOpportunity', s: 'live', note: 'Growth tracking' },
  { label: 'AuditLog', s: 'live', note: 'Full system audit trail' },
  { label: 'BusinessProfileSettings', s: 'live', note: 'Business contact/profile settings — admin only' },
  { label: 'BookingEnquiry', s: 'live', note: 'Booking form submissions' },
  { label: 'MasteringProject', s: 'live', note: 'Mastering service projects' },
  { label: 'CharityDonationTracker', s: 'live', note: 'Charity/1800RESPECT donation tracking' },
  { label: 'GiftRequirementTracker', s: 'live', note: 'Supporter gift requirements' },
  { label: 'GiftClaim', s: 'live', note: 'Gift claim records' },
  { label: 'Supplier', s: 'live', note: 'Supplier management' },
  { label: 'SupplierProduct', s: 'live', note: 'Supplier product catalogue' },
  { label: 'PurchaseOrder', s: 'live', note: 'Purchase orders — admin only, no auto-submit' },
  { label: 'InventoryBatch', s: 'live', note: 'Inventory batches' },
  { label: 'LandedCostCalculation', s: 'live', note: 'Landed cost calculations' },
  { label: 'BundleOffer', s: 'live', note: 'Merch bundle offers' },
  { label: 'PromoCode', s: 'live', note: 'Discount codes' },
  { label: 'MerchFeedback', s: 'live', note: 'Post-purchase merch feedback' },
  { label: 'MerchVisualAsset', s: 'live', note: 'Merch visual assets — background removal pipeline' },
  { label: 'MerchVisualComposition', s: 'live', note: 'Merch visual compositions' },
  { label: 'VisualGenerationQueue', s: 'live', note: 'AI image generation queue' },
  { label: 'StripeEventLog', s: 'live', note: 'Stripe webhook event log' },
  { label: 'PaymentDiagnostic', s: 'live', note: 'Payment diagnostics' },
  { label: 'IdempotenceLog', s: 'live', note: 'Order duplicate prevention log' },
  { label: 'OrderLock', s: 'live', note: 'Order lock for concurrent checkout prevention' },
  { label: 'SuperfanProfile', s: 'live', note: 'Superfan tracking' },
  { label: 'AudienceInsight', s: 'live', note: 'Audience analytics' },
  { label: 'MemoryGraphNode', s: 'live', note: 'Agent memory graph nodes' },
  { label: 'CreatorGapInsight', s: 'live', note: 'Creator gap analysis records' },
  { label: 'ViralOpportunity', s: 'live', note: 'Viral trend opportunities' },
  { label: 'SiteReveal', s: 'live', note: 'Site reveal/countdown state' },
  { label: 'ApiIntegrationSetup', s: 'live', note: 'API integration config records' },
  { label: 'ClientBlueprintInstall', s: 'live', note: 'Blueprint client installs (GanozMix/other clients)' },
];

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
const FUNCTIONS = [
  { label: 'validatePromoCode', s: 'fixed', note: 'v2.1 — Fixed 401 error. Uses asServiceRole + stored used_by_emails, no User entity lookup.' },
  { label: 'createCheckoutSession', s: 'live', note: 'Stripe session + order lock + idempotency' },
  { label: 'stripeWebhook', s: 'live', note: 'Async signature validation, async constructEventAsync (Deno-safe)' },
  { label: 'sendOrderReceipt', s: 'live', note: 'Email receipt on order confirmation' },
  { label: 'calculateShippingRate', s: 'live', note: 'Shipping cost calculation' },
  { label: 'applyCheckoutDiscountGuard', s: 'live', note: 'Cart-level discount eligibility guard' },
  { label: 'recordPromoUsage', s: 'live', note: 'Updates used_by_emails + times_used on promo' },
  { label: 'createPaymentIntent', s: 'live', note: 'Stripe payment intent for support contributions' },
  { label: 'notifyAdmin / notifyAdminNewOrder', s: 'live', note: 'Admin notification on new orders' },
  { label: 'notifyAdminNewOrderGmail', s: 'live', note: 'Gmail notification on new orders' },
  { label: 'onOrderShipped', s: 'live', note: 'Triggers when order marked shipped' },
  { label: 'onNewOrderAutomation', s: 'live', note: 'Post-order automation trigger' },
  { label: 'recoverStripeOrders', s: 'live', note: 'Recovery scan for missed Stripe events' },
  { label: 'syncOrderToSheets', s: 'live', note: 'Google Sheets order sync' },
  { label: 'orderLockingMiddleware', s: 'live', note: 'Concurrent order duplicate prevention' },
  { label: 'generateDonorReceipt', s: 'live', note: 'Charity donation receipt generation' },
  { label: 'generateTaxInvoice', s: 'live', note: 'Tax invoice PDF generation' },
  { label: 'getStripeConfig', s: 'live', note: 'Returns publishable key to frontend' },
  { label: 'notifySubscribersNewRelease', s: 'live', note: 'Sends release email to subscriber list' },
  { label: 'sendRevealNewsletter', s: 'live', note: 'Reveal campaign newsletter send' },
  { label: 'sendBirthdayDiscount', s: 'live', note: 'Birthday discount email' },
  { label: 'sendGiftEmail / sendGiftOfferEmail', s: 'live', note: 'Gift offer and fulfillment emails' },
  { label: 'sendPromoCodeEmails', s: 'live', note: 'Batch promo code email send' },
  { label: 'welcomeEmail / welcomeNewSubscriber / onNewSubscriberWelcome', s: 'live', note: 'Welcome sequence on signup' },
  { label: 'sendWelcomeEmailGmail', s: 'live', note: 'Gmail welcome send' },
  { label: 'openAIContentAssistant', s: 'live', note: 'Content generation via OpenAI' },
  { label: 'openAIMessageRouter', s: 'live', note: 'Routes messages to correct agent' },
  { label: 'openAIQAAssistant', s: 'live', note: 'QA testing assistant' },
  { label: 'openAIRepairAssistant', s: 'live', note: 'Auto-repair suggestions' },
  { label: 'openAIStoreConversionAssistant', s: 'live', note: 'Store conversion optimisation' },
  { label: 'openAIVideoAssistant', s: 'live', note: 'Video clip idea and caption generation' },
  { label: 'openaiAgent', s: 'live', note: 'Core agent execution function' },
  { label: 'generateContentPost', s: 'live', note: 'Social content post generation' },
  { label: 'generateDailyDrafts', s: 'live', note: 'Daily post draft automation' },
  { label: 'generateReleaseSprint', s: 'live', note: 'Release sprint post generation' },
  { label: 'generatePresaveLinks', s: 'live', note: 'Pre-save link generation' },
  { label: 'metricoolSchedulePost', s: 'live', note: 'Schedules post to Metricool — REQUIRES APPROVAL first' },
  { label: 'metricoolDiagnostics', s: 'live', note: 'Metricool connection diagnostic' },
  { label: 'metricoolImportMetrics', s: 'live', note: 'Imports performance data from Metricool' },
  { label: 'metricoolNormalizeMedia', s: 'live', note: 'Normalizes media for Metricool upload' },
  { label: 'listMetricoolProfiles', s: 'live', note: 'Lists connected Metricool profiles' },
  { label: 'validateMetricoolConfig', s: 'live', note: 'Validates Metricool API config' },
  { label: 'scheduledSocialPost', s: 'live', note: 'Timed social post automation' },
  { label: 'socialCommentMonitor', s: 'live', note: 'Monitors social comments for engagement' },
  { label: 'socialQualityCouncil', s: 'live', note: 'Quality check before post approval' },
  { label: 'autonomousSocialPoster', s: 'blocked', note: 'BLOCKED — requires ApprovalQueue approval before any post goes live' },
  { label: 'autonomousTrendEngine', s: 'live', note: 'Scans trends, writes to ViralOpportunity records only' },
  { label: 'autonomousAlertSystem', s: 'live', note: 'Creates AdminNotification records' },
  { label: 'autonomousResearch', s: 'live', note: 'Research to KnowledgeVault only' },
  { label: 'agentIntelligenceLoop', s: 'live', note: 'Core agent intelligence cycle' },
  { label: 'agentProposalScanner', s: 'live', note: 'Scans for new proposals to create approvals' },
  { label: 'agentSelfImprovement', s: 'live', note: 'Agent learning and improvement' },
  { label: 'growthOpportunityScanner', s: 'live', note: 'Scans for growth opportunities' },
  { label: 'executiveMorningBrief', s: 'live', note: 'Daily briefing generation' },
  { label: 'proofApprovalChain', s: 'live', note: 'Multi-step approval chain for high-risk actions' },
  { label: 'publishApprovedProposal', s: 'live', note: 'Executes approved proposals' },
  { label: 'runSiteHealthCheck', s: 'live', note: 'Full site health diagnostic' },
  { label: 'runSystemHealthSeed', s: 'live', note: 'Seeds health records' },
  { label: 'integrationHealthCheck', s: 'live', note: 'Checks external integrations' },
  { label: 'automatedSiteTests', s: 'live', note: 'Playwright-style automated tests' },
  { label: 'seedAgentRegistry', s: 'live', note: 'Seeds agent registry with base agents' },
  { label: 'tiktokOAuth', s: 'review', note: 'TikTok OAuth flow — credentials set, app review status unknown' },
  { label: 'tiktokUploadDraft', s: 'review', note: 'Uploads draft to TikTok — NEVER auto-publishes, draft only' },
  { label: 'tiktokWebhook', s: 'review', note: 'TikTok webhook handler' },
  { label: 'testOpenAIKey / testCursorApiKey', s: 'live', note: 'API key validation tests' },
  { label: 'notifyAdminBookingEnquiry', s: 'live', note: 'Booking enquiry admin alert' },
  { label: 'notifyAdminLowStock', s: 'live', note: 'Low stock admin alert' },
  { label: 'fanPostNotification', s: 'live', note: 'Fan post moderation alert' },
  { label: 'fanMediaSubmissionEmail', s: 'live', note: 'Fan media submission confirmation' },
  { label: 'notifyInterestRegistration', s: 'live', note: 'Interest form notification' },
  { label: 'communityReplyHandler', s: 'live', note: 'Community reply processing' },
  { label: 'aiFanReply', s: 'live', note: 'AI-drafted fan reply — requires approval before sending' },
  { label: 'collectReleaseFeedback', s: 'live', note: 'Post-release fan feedback collection' },
  { label: 'releaseCalendarSync', s: 'live', note: 'Syncs release dates to content calendar' },
  { label: 'releaseCountdownBrief', s: 'live', note: 'Pre-release countdown brief' },
  { label: 'onCalendarEvent', s: 'live', note: 'Calendar event handler' },
  { label: 'onNewApprovalItem', s: 'live', note: 'Fires when new ApprovalQueue item created' },
  { label: 'onNewOrderSlack', s: 'live', note: 'Slack notification on new order' },
  { label: 'onNewOrderAlert', s: 'live', note: 'Alert on new order' },
  { label: 'sendSlackAlert', s: 'live', note: 'Generic Slack alert sender' },
  { label: 'shippingOptimisationAudit', s: 'live', note: 'Shipping rate audit' },
  { label: 'syncTunecore', s: 'live', note: 'Tunecore data sync' },
  { label: 'trackMonthlyCharityDonation', s: 'live', note: 'Monthly charity donation tracking' },
  { label: 'triggerMay10Reveal', s: 'live', note: 'May 10 reveal trigger (historical)' },
  { label: 'createGiftTracker / createSampleGiftTracker', s: 'live', note: 'Gift tracker creation' },
  { label: 'orderAlertEmail', s: 'live', note: 'Order alert email sender' },
  { label: 'bookingWorkflowHandler', s: 'live', note: 'Booking state machine handler' },
  { label: 'generateDonorReceipt', s: 'live' },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI AGENTS
// ─────────────────────────────────────────────────────────────────────────────
const AGENTS = [
  { label: 'Orchestrator (Top-level)', s: 'live', note: 'Routes all tasks, approval gating, escalation' },
  { label: 'Music Orchestrator', s: 'live', note: 'Coordinates release campaigns and music strategy' },
  { label: 'Revenue Orchestrator', s: 'live', note: 'Revenue stream coordination' },
  { label: 'Release Launch Agent', s: 'live', note: 'Owns Thank You release sprint' },
  { label: 'Fan Engagement Agent', s: 'live', note: 'Community, comments, likes, engagement' },
  { label: 'Merch Sales Agent', s: 'live', note: 'Store conversion and product visibility' },
  { label: 'Content Revenue Agent', s: 'live', note: 'Social content → sales pipeline' },
  { label: 'QA Systems Auditor', s: 'live', note: 'Playwright tests and site health' },
  { label: 'Order Support Agent', s: 'live', note: 'Customer order queries' },
  { label: 'Pricing Optimiser', s: 'live', note: 'Margin and pricing analysis' },
  { label: 'Shipping Optimisation Agent', s: 'live', note: 'Shipping rate audit' },
  { label: 'Compliance Gatekeeper', s: 'live', note: 'Legal, risk, and content compliance checks' },
  { label: 'Commerce Profit Agent', s: 'live', note: 'Profit and margin intelligence' },
  { label: 'Email Revenue Agent', s: 'live', note: 'Email list monetisation' },
  { label: 'Streaming Royalty Agent', s: 'live', note: 'Streaming royalty tracking' },
  { label: 'Superfan Converter', s: 'live', note: 'Converts fans to superfans/supporters' },
  { label: 'Sync Licensing Agent', s: 'live', note: 'Sync licensing opportunities' },
  { label: 'Partnership Agent', s: 'live', note: 'Partnership and brand deal identification' },
  { label: 'Booking Revenue Agent', s: 'live', note: 'Booking and live performance revenue' },
  { label: 'GanozMix Product Hunter', s: 'seed', note: 'SEED ONLY — eBay/supplier product discovery (not live until GanozMix OAuth connected)' },
  { label: 'Memorial Page Agent', s: 'live', note: 'Manages Mum tribute page content integrity' },
  { label: 'Stripe Intelligence Agent', s: 'live', note: 'Stripe event monitoring and repair' },
  { label: 'Website QA Agent', s: 'live', note: 'Site health and UX auditing' },
  { label: 'Academic Writing Coach', s: 'seed', note: 'SEED ONLY — Future Systems Manager offer' },
  { label: 'Literature Researcher', s: 'seed', note: 'SEED ONLY — Research support' },
  { label: 'API Setup Assistant', s: 'live', note: 'Guides API configuration' },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATIONS
// ─────────────────────────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { label: 'Stripe (Payments)', s: 'review', note: 'Keys set. Webhook connected. CONFIRM: Is dashboard in LIVE mode (not test)? Check stripe.com/dashboard.' },
  { label: 'Metricool (Social Scheduling)', s: 'review', note: 'Profile 6305775 / User 4741333 set. Verify correct account at /admin/metricool-diagnostics. APPROVAL_REQUIRED enforced.' },
  { label: 'OpenAI (LLM / AI)', s: 'live', note: 'OPENAI_API_KEY set. Used by all AI agent and content functions.' },
  { label: 'Google Sheets (Order Sync)', s: 'live', note: 'OAuth authorised. GOOGLE_SHEET_ID set. syncOrderToSheets active.' },
  { label: 'Gmail (Email)', s: 'live', note: 'sendWelcomeEmailGmail, notifyAdminNewOrderGmail active.' },
  { label: 'TikTok OAuth', s: 'review', note: 'Client key + secret set. App review in progress. Draft upload only — no auto-publish ever.' },
  { label: 'Cursor AI (Code)', s: 'live', note: 'CURSOR_API_KEY set. testCursorApiKey function present.' },
  { label: 'GanozMix / eBay', s: 'missing', note: 'NOT YET CONNECTED. No eBay OAuth. No live listings. No order sync. Seed agent only.' },
  { label: 'Tunecore (Distribution)', s: 'partial', note: 'syncTunecore function exists. Manual login required at tunecore.com.' },
  { label: 'Spotify (Artist Profile)', s: 'review', note: 'Links updated in SiteSettings. Confirm URL: open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz' },
  { label: 'Apple Music', s: 'review', note: 'Link added to SiteSettings. Confirm correct once single is fully live.' },
  { label: 'YouTube', s: 'review', note: 'Link added to SiteSettings (@ganozwaye). Confirm correct channel handle.' },
  { label: 'Instagram (@ganozwaye)', s: 'live', note: 'URL set correctly in SiteSettings.' },
  { label: 'Facebook (gannonwaye88)', s: 'live', note: 'URL set correctly in SiteSettings.' },
  { label: 'Slack (Notifications)', s: 'live', note: 'sendSlackAlert function active for order/risk notifications.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SAFETY RULES
// ─────────────────────────────────────────────────────────────────────────────
const SAFETY = [
  { label: 'Stripe/checkout code untouched by all agents', s: 'live' },
  { label: 'Cart and order logic untouched', s: 'live' },
  { label: 'Webhook signature validation intact', s: 'live' },
  { label: 'Duplicate order guard (OrderLock + IdempotenceLog)', s: 'live' },
  { label: 'Metricool auto-post BLOCKED — ApprovalQueue required', s: 'blocked' },
  { label: 'Agents cannot publish social posts without approval', s: 'blocked' },
  { label: 'Agents cannot spend money or change pricing', s: 'blocked' },
  { label: 'Agents cannot modify legal pages (Privacy/Terms)', s: 'blocked' },
  { label: 'Agents cannot submit supplier orders (PurchaseOrder drafts only)', s: 'blocked' },
  { label: 'TikTok: draft upload only, no auto-publish', s: 'blocked' },
  { label: 'eBay/GanozMix: not connected, no live listings', s: 'blocked' },
  { label: 'No AI-generated Sonia (Mum) voice — real photos only', s: 'live' },
  { label: 'No tax-deductible donation claim — 10% donation stated only', s: 'live' },
  { label: 'No therapy/legal/medical/financial advice claims', s: 'live' },
  { label: 'Emergency kill: set SiteSettings.show_thank_you_campaign_section = false', s: 'live', note: 'Hides campaign section instantly' },
  { label: 'Emergency kill: set SiteSettings.live_stream_enabled = false', s: 'live', note: 'Takes live page offline instantly' },
  { label: 'Public support email not exposed as ganozwaye@gmail.com', s: 'review', note: 'Confirm at /admin/business-profile-settings' },
];

// ─────────────────────────────────────────────────────────────────────────────
// CLICKABLE AUDIT (key UI items)
// ─────────────────────────────────────────────────────────────────────────────
const CLICKABLE_AUDIT = [
  // Navbar
  { label: 'Navbar: Music', s: 'live', note: 'Routes to /music' },
  { label: 'Navbar: Store', s: 'live', note: 'Routes to /store' },
  { label: 'Navbar: Community', s: 'live', note: 'Routes to /community' },
  { label: 'Navbar: Videos', s: 'live', note: 'Routes to /videos' },
  { label: 'Navbar: Contact', s: 'live', note: 'Routes to /contact' },
  { label: 'Mobile bottom tabs (all 5)', s: 'live', note: 'Home, Music, Store, Community, More' },
  { label: 'Footer: social links (Instagram, TikTok, Facebook)', s: 'live' },
  { label: 'Footer: Spotify, YouTube, Apple Music', s: 'fixed', note: 'Fixed this session — were blank before' },
  { label: 'Hero: Pre-Save Now button', s: 'live', note: '→ /music' },
  { label: 'Hero: My Story button', s: 'live', note: '→ /this-is-my-life' },
  { label: 'Hero: Be Part Of This button', s: 'live', note: '→ /back-this' },
  { label: 'Store: Add to Cart', s: 'live' },
  { label: 'Store: Product detail modal', s: 'live' },
  { label: 'Store: Promo code apply', s: 'fixed', note: 'Fixed 401 error this session' },
  { label: 'Store: Checkout / Stripe payment', s: 'live', note: 'Stripe Elements form + createCheckoutSession' },
  { label: 'Store: Checkout Success page', s: 'live' },
  { label: 'Back This: Support contribution form', s: 'live', note: 'createPaymentIntent + receipt' },
  { label: 'Community: Post, reply, like', s: 'live' },
  { label: 'Newsletter: Email signup form', s: 'live' },
  { label: 'Campaign images (11): each opens detail', s: 'live', note: 'Managed at /admin/campaign-image-approval' },
  { label: 'Admin: all approve/reject buttons', s: 'live', note: 'Via ApprovalQueue entity' },
  { label: 'Admin: order rows → detail', s: 'live' },
  { label: 'Admin: Metricool schedule button', s: 'review', note: 'Requires Metricool profile verified first' },
  { label: 'Admin: TikTok upload draft button', s: 'review', note: 'Requires TikTok app review approval' },
  { label: 'Admin: agent activate button', s: 'review', note: 'Seed-only agents show warning — cannot activate without DB record' },
  { label: 'Admin: gallery / media items', s: 'live' },
  { label: 'Admin: copy/download buttons (blueprints, exports)', s: 'live' },
  { label: 'GanozMix product rows / listing rows', s: 'missing', note: 'Not connected — eBay OAuth not set up' },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEXT ACTIONS
// ─────────────────────────────────────────────────────────────────────────────
const NEXT_ACTIONS = [
  { p: 'critical', action: 'Confirm Stripe Dashboard is in LIVE mode (not test). Check stripe.com/dashboard → mode toggle top-left.', link: null },
  { p: 'critical', action: 'Set correct public support email in /admin/business-profile-settings — must NOT be ganozwaye@gmail.com.', link: '/admin/business-profile-settings' },
  { p: 'high', action: 'Verify Metricool profile 6305775 is the correct Gannon Waye account at /admin/metricool-diagnostics.', link: '/admin/metricool-diagnostics' },
  { p: 'high', action: 'Review + approve campaign images at /admin/campaign-image-approval before June 5.', link: '/admin/campaign-image-approval' },
  { p: 'high', action: 'Review + approve release sprint posts at /admin/release-sprint before June 5.', link: '/admin/release-sprint' },
  { p: 'high', action: 'Confirm YouTube channel handle @ganozwaye is correct. Update in /admin/settings if different.', link: '/admin/settings' },
  { p: 'high', action: 'Confirm Apple Music artist page URL is correct once single goes live at /admin/settings.', link: '/admin/settings' },
  { p: 'medium', action: 'Review Mum Tribute at /mum — confirm all photos, quotes, letter content are correct and you approve it for public.', link: '/mum' },
  { p: 'medium', action: 'Check Stripe webhook endpoint in Stripe Dashboard points to the correct Base44 function URL.', link: '/admin/webhook-health' },
  { p: 'medium', action: 'Complete TikTok app review process at /admin/tiktok-review — submit pending items.', link: '/admin/tiktok-review' },
  { p: 'medium', action: 'Run Site Health Check at /admin/site-health to get a live diagnostic score.', link: '/admin/site-health' },
  { p: 'low', action: 'Decide on GanozMix eBay integration — if ready, connect eBay OAuth via /admin/ganozmix.', link: '/admin/ganozmix' },
  { p: 'low', action: 'Review AI Systems Manager offer vault — materials at /admin/blueprint-builder.', link: '/admin/blueprint-builder' },
];

const PC = {
  critical: 'border-red-500/50 bg-red-500/5 text-red-300',
  high:     'border-primary/50 bg-primary/5 text-primary',
  medium:   'border-blue-500/40 bg-blue-500/5 text-blue-300',
  low:      'border-border/50 bg-secondary text-muted-foreground',
};

// ─────────────────────────────────────────────────────────────────────────────
// WHAT IS / ISN'T SAFE
// ─────────────────────────────────────────────────────────────────────────────
const SAFE_TO_PUBLISH = [
  'Public website (all public routes)',
  'Store with Stripe checkout (once Stripe live mode confirmed)',
  'Community / fan posts',
  'Mum tribute page (once Gannon reviews and approves content)',
  'Lyrics page',
  'Newsletter signup + welcome email',
  'Contact / booking enquiry form',
  'Mastering services enquiry page',
  'Back-this support contribution',
  'Gift checklist and claiming',
];

const NOT_SAFE_YET = [
  'TikTok auto-posting — app review not complete, draft upload only',
  'eBay/GanozMix listings — OAuth not connected, no live listings',
  'Metricool scheduling — verify profile ID first',
  'AI Systems Manager offer public page — vault not published',
  'Claiming "automated income" — agents draft proposals only, all publishing manual',
  'Tax-deductible donation claims — 10% donation stated, not tax receipt',
  'Sonia voice cloning — NO AI voice, only real uploaded photos',
  'Any new public email exposed without confirming it is not personal email',
];

const MANUAL_REQUIRED = [
  'Stripe: manually confirm Live mode in Stripe Dashboard',
  'Metricool: manually log in to verify profile ID 6305775',
  'TikTok: complete app review in TikTok Developer Portal',
  'Apple Music: verify/update artist page URL once single is live',
  'YouTube: verify @ganozwaye channel handle is correct',
  'Mum tribute: Gannon must personally review and approve /mum content',
  'Stripe support email: manually update in Stripe Dashboard',
  'Business email: manually confirm in /admin/business-profile-settings',
  'eBay/GanozMix: manually connect OAuth when ready',
  'Tunecore: manually log in to Tunecore to confirm distribution status',
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function MasterBlueprint() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [copied, setCopied] = useState(false);

  const { data: orders = [] } = useQuery({ queryKey: ['mb-orders'], queryFn: () => base44.entities.MerchOrder.filter({ status: 'pending' }, '-created_date', 10) });
  const { data: approvals = [] } = useQuery({ queryKey: ['mb-approvals'], queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 20) });
  const { data: notifications = [] } = useQuery({ queryKey: ['mb-notifs'], queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 20) });
  const { data: sprintPosts = [] } = useQuery({ queryKey: ['mb-sprint'], queryFn: () => base44.entities.ContentCalendarPost.filter({ campaign: 'thank_you_june5_sprint' }, 'sprint_day', 100) });

  const pendingPosts = sprintPosts.filter(p => p.status === 'pending_approval').length;
  const approvedPosts = sprintPosts.filter(p => ['approved', 'scheduled', 'posted'].includes(p.status)).length;
  const daysToRelease = Math.max(0, Math.ceil((new Date('2026-06-05T00:00:00+10:00') - new Date()) / 86400000));

  const copyRef = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 pb-16 font-body">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Gannon Waye Music OS · App ID 69eb7905ca6eb4180010f794</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Master Blueprint</h1>
          <p className="text-sm text-muted-foreground mt-1">Single source of truth — entire system. Updated June 2026.</p>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5">Covers: Base44 platform · Codex history · GanozMix · Future AI Systems Manager offer</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={copyRef}><Copy className="w-3.5 h-3.5" />{copied ? 'Copied!' : 'Copy URL'}</Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setLastRefresh(new Date())}><RefreshCw className="w-3.5 h-3.5" />Refresh</Button>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground/40">Refreshed: {lastRefresh.toLocaleTimeString()}</p>

      {/* System stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Days to Release', value: daysToRelease, color: 'text-primary', urgent: daysToRelease <= 5 },
          { label: 'Pending Approvals', value: approvals.length, color: 'text-amber-400', urgent: approvals.length > 0 },
          { label: 'Sprint Posts Pending', value: pendingPosts, color: 'text-blue-400', urgent: pendingPosts > 0 },
          { label: 'Unread Notifications', value: notifications.length, color: 'text-purple-400', urgent: notifications.length > 0 },
        ].map(s => (
          <Card key={s.label} className={s.urgent ? 'border-primary/40' : ''}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold font-display ${s.urgent ? s.color : ''}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Release Campaign Banner */}
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs gradient-gold-glow tracking-widest uppercase mb-2">THANKYOU — June 5, 2026</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center bg-card/60 rounded-lg p-2">
              <p className="font-display text-xl font-bold">{sprintPosts.length}</p>
              <p className="text-[10px] text-muted-foreground">Total Posts</p>
            </div>
            <div className="text-center bg-card/60 rounded-lg p-2">
              <p className="font-display text-xl font-bold text-amber-400">{pendingPosts}</p>
              <p className="text-[10px] text-muted-foreground">Pending Approval</p>
            </div>
            <div className="text-center bg-card/60 rounded-lg p-2">
              <p className="font-display text-xl font-bold text-green-400">{approvedPosts}</p>
              <p className="text-[10px] text-muted-foreground">Approved</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/release-sprint"><Button size="sm" className="gradient-gold-button border-0 gap-1.5 text-xs"><Zap className="w-3.5 h-3.5" />Sprint Posts</Button></Link>
            <Link to="/admin/campaign-image-approval"><Button size="sm" variant="outline" className="gap-1.5 text-xs">Campaign Images</Button></Link>
            <Link to="/admin/social-schedule-queue"><Button size="sm" variant="outline" className="gap-1.5 text-xs">Schedule Queue</Button></Link>
          </div>
        </CardContent>
      </Card>

      {/* ── NEXT ACTIONS ── */}
      <Sec title="⚡ Next Actions — Priority Order" icon={Zap} open={true}>
        <div className="space-y-2">
          {NEXT_ACTIONS.map((a, i) => (
            <div key={i} className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${PC[a.p]}`}>
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <Badge className={`text-[9px] uppercase tracking-wider shrink-0 mt-0.5 border-0 ${a.p === 'critical' ? 'bg-red-500/20 text-red-400' : a.p === 'high' ? 'bg-primary/20 text-primary' : a.p === 'medium' ? 'bg-blue-500/20 text-blue-400' : 'bg-secondary text-muted-foreground'}`}>{a.p}</Badge>
                <p className="text-xs text-foreground/85 leading-relaxed">{a.action}</p>
              </div>
              {a.link && <Link to={a.link} className="shrink-0"><Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1"><ExternalLink className="w-3 h-3" />Go</Button></Link>}
            </div>
          ))}
        </div>
      </Sec>

      {/* ── MANUAL ACTIONS REQUIRED ── */}
      <Sec title="🔑 External Manual Actions Required (Cannot be automated)" icon={Lock}>
        <div className="space-y-1.5">
          {MANUAL_REQUIRED.map((m, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 border-b border-border/20 last:border-0">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 text-amber-400 shrink-0" />
              <p className="text-xs text-foreground/80">{m}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ── SAFE / NOT SAFE ── */}
      <Sec title="✅ Safe to Publish Now vs ⛔ Not Safe Yet" icon={Shield}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-green-400 mb-2">✅ Safe to publish:</p>
            {SAFE_TO_PUBLISH.map((s, i) => (
              <div key={i} className="flex items-start gap-2 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-400 shrink-0" />
                <p className="text-xs text-foreground/80">{s}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-red-400 mb-2">⛔ Not safe to claim yet:</p>
            {NOT_SAFE_YET.map((s, i) => (
              <div key={i} className="flex items-start gap-2 py-1">
                <XCircle className="w-3.5 h-3.5 mt-0.5 text-red-400 shrink-0" />
                <p className="text-xs text-foreground/80">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* ── SAFETY RULES ── */}
      <Sec title="🔒 Safety & Kill Switches" icon={Shield}>
        {SAFETY.map((c, i) => <Row key={i} label={c.label} s={c.s} note={c.note} />)}
      </Sec>

      {/* ── PUBLIC ROUTES ── */}
      <Sec title={`🌐 Public Routes (${PUBLIC_ROUTES.length})`} icon={Globe}>
        <div className="mb-2 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
          <p className="text-[11px] text-green-400">All public routes must load without login. No admin data exposed.</p>
        </div>
        {PUBLIC_ROUTES.map((r, i) => <Row key={i} {...r} />)}
      </Sec>

      {/* ── REDIRECTS ── */}
      <Sec title="↪️ Redirects" icon={Globe}>
        {REDIRECT_ROUTES.map((r, i) => <Row key={i} {...r} />)}
      </Sec>

      {/* ── ENTITIES ── */}
      <Sec title={`🗄️ Entities / Database Tables (${ENTITIES.length})`} icon={Database}>
        <div className="mb-2 p-2 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <p className="text-[11px] text-blue-400">All entities have RLS rules. Admin-only tables cannot be read by unauthenticated users.</p>
        </div>
        {ENTITIES.map((r, i) => <Row key={i} label={r.label} s={r.s} note={r.note} />)}
      </Sec>

      {/* ── BACKEND FUNCTIONS ── */}
      <Sec title={`⚙️ Backend Functions (${FUNCTIONS.length})`} icon={Settings}>
        {FUNCTIONS.map((r, i) => <Row key={i} label={r.label} s={r.s} note={r.note} />)}
      </Sec>

      {/* ── AGENTS ── */}
      <Sec title={`🤖 AI Agents (${AGENTS.length})`} icon={Cpu}>
        <div className="mb-2 p-2 bg-purple-500/5 border border-purple-500/20 rounded-lg">
          <p className="text-[11px] text-purple-300">SEED ONLY agents = exist in fallback data only, not live DB records. Cannot be activated until seeded and configured.</p>
          <p className="text-[11px] text-purple-300 mt-1">BLOCKED agents = code exists but gated behind ApprovalQueue. No auto-publish, spend, or external submit.</p>
        </div>
        {AGENTS.map((r, i) => <Row key={i} label={r.label} s={r.s} note={r.note} />)}
        <div className="mt-3">
          <Link to="/admin/agent-registry"><Button size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Full Agent Registry</Button></Link>
        </div>
      </Sec>

      {/* ── INTEGRATIONS ── */}
      <Sec title="🔌 Integrations & Credentials" icon={Activity}>
        {INTEGRATIONS.map((r, i) => <Row key={i} label={r.label} s={r.s} note={r.note} />)}
      </Sec>

      {/* ── CLICKABLE AUDIT ── */}
      <Sec title="🖱️ Clickable Item Audit (Key UI Elements)" icon={Eye}>
        <div className="mb-2 p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="text-[11px] text-amber-300">Every clickable item must route to real page, open real modal, trigger real action, or be visibly disabled.</p>
        </div>
        {CLICKABLE_AUDIT.map((r, i) => <Row key={i} label={r.label} s={r.s} note={r.note} />)}
      </Sec>

      {/* ── MUM TRIBUTE ── */}
      <Sec title="♡ Mum Tribute / Sonia Living Garden" icon={Heart} accent="border-primary/20">
        <Row label="Mum Tribute Page live" path="/mum" s="live" note="Real Sonia photos, memory wall, GSAP parallax, letter, wisdom garden, heart animation" />
        <Row label="/without-you-here alias" path="/without-you-here" s="live" />
        <Row label="Birth year 1961–2022 stated correctly" s="live" />
        <Row label="Lifeline / Beyond Blue / 1800RESPECT support links present" s="live" />
        <Row label="No AI-generated Sonia images" s="live" />
        <Row label="No AI Sonia voice clone" s="live" note="NON-NEGOTIABLE — only real uploaded audio approved by family" />
        <Row label="Memorial media/audio family consent" s="review" note="Gannon must personally confirm all media shown has family consent" />
        <Row label="ApprovalQueue item created for Gannon review" s="live" />
        <Row label="Sonia Living Garden advanced Vite build (local)" s="missing" note="Advanced GSAP cinematic version planned for local sonia-living-garden folder — not yet built" />
        <div className="mt-3"><Link to="/mum"><Button size="sm" variant="outline" className="gap-1.5 text-xs"><Heart className="w-3 h-3" />View /mum</Button></Link></div>
      </Sec>

      {/* ── GANOZMIX ── */}
      <Sec title="🏪 GanozMix Direct (eBay)" icon={ShoppingCart}>
        <Row label="GanozMix admin page" path="/admin/ganozmix" s="partial" note="Admin interface exists but eBay not connected" />
        <Row label="eBay OAuth" s="missing" note="NOT connected. Must manually connect via /admin/ganozmix when ready." />
        <Row label="eBay live listings" s="missing" note="No live listings — GanozMix Product Hunter agent is SEED ONLY" />
        <Row label="eBay order sync" s="missing" note="Not active — requires eBay OAuth first" />
        <Row label="Draft listing preview (no publish)" s="missing" note="Available once eBay connected — draft only, never auto-publish" />
        <Row label="GanozMix agent" s="seed" note="SEED ONLY — not live until eBay OAuth connected" />
      </Sec>

      {/* ── AI SYSTEMS MANAGER ── */}
      <Sec title="💼 AI Systems Manager Offer / Proof Vault" icon={FileText}>
        <Row label="Blueprint Builder" path="/admin/blueprint-builder" s="live" note="Template and proof vault builder" />
        <Row label="Client Installs" path="/admin/client-installs" s="live" note="Client install tracking" />
        <Row label="Client Onboarding" path="/admin/client-onboarding" s="live" note="Onboarding flow for AI Systems Manager clients" />
        <Row label="Intelligence to Income" path="/admin/intelligence-to-income" s="live" note="ROI tracking for offer" />
        <Row label="Systems Manager offer public page" s="missing" note="No public-facing offer page yet — needs to be built when ready" />
        <Row label="Proof vault (case studies)" s="partial" note="Internal records exist — no public page yet" />
      </Sec>

      {/* ── TESTING STATUS ── */}
      <Sec title="🧪 Testing Status" icon={Activity}>
        <Row label="Build result" s="live" note="App builds and renders — no fatal compile errors detected" />
        <Row label="Public route smoke test" s="review" note="Run via Base44 Testing Agent — describe: 'Visit each public page and confirm it loads'" />
        <Row label="Admin route smoke test" s="review" note="Run via Base44 Testing Agent as admin user" />
        <Row label="Console error test" s="partial" note="validatePromoCode 401 fixed this session. Check runtime logs for remaining errors." />
        <Row label="Form submit test" s="live" note="Contact, newsletter, fan profile, booking enquiry all tested" />
        <Row label="Store checkout test" s="review" note="Use Stripe test card 4242 4242 4242 4242 — confirm no accidental live charge" />
        <Row label="Stripe webhook test" s="review" note="Use Stripe Dashboard → Webhooks → Send test event" />
        <Row label="Promo code test" s="fixed" note="401 fixed — test in store with a valid code" />
        <Row label="Order duplicate-prevention test" s="live" note="OrderLock + IdempotenceLog active" />
        <Row label="Campaign upload test" s="live" note="Tested via /admin/campaign-image-approval" />
        <Row label="Approval queue test" s="live" note="Create/approve/reject flow working" />
        <Row label="Metricool connection test" s="review" note="Run /admin/metricool-diagnostics" />
        <Row label="TikTok OAuth/draft-upload readiness test" s="review" note="App review not yet complete" />
        <Row label="GanozMix eBay OAuth test" s="missing" note="Not connected yet" />
        <Row label="GanozMix draft listing test" s="missing" note="Cannot test until eBay connected" />
        <Row label="Mum memorial page test" s="review" note="Gannon must personally review /mum" />
        <Row label="Mobile layout test" s="review" note="Use Base44 Testing Agent → mobile viewport test" />
        <Row label="Owner-only access test" s="live" note="All /admin/* routes require role=admin" />
        <Row label="Legal wording search" s="review" note="Run text search across all public pages for advice/guarantee language" />
      </Sec>

      {/* ── OWNER ACCEPTANCE CHECKLIST ── */}
      <Sec title="✅ Final Owner Acceptance Checklist" icon={CheckCircle2} open={true}>
        <div className="space-y-2">
          {[
            { item: 'Stripe is in LIVE mode (not test)', done: false },
            { item: 'Correct support email set (not ganozwaye@gmail.com)', done: false },
            { item: 'Metricool profile ID verified', done: false },
            { item: 'Campaign images approved (all 11)', done: false },
            { item: 'Release sprint posts approved and scheduled', done: false },
            { item: 'YouTube handle confirmed', done: false },
            { item: 'Apple Music URL confirmed', done: false },
            { item: 'Mum tribute page personally reviewed and approved', done: false },
            { item: 'Stripe webhook endpoint URL confirmed in Stripe Dashboard', done: false },
            { item: 'TikTok app review submitted', done: false },
            { item: 'Social links confirmed: Instagram, TikTok, Facebook, Spotify, YouTube, Apple Music', done: true },
            { item: 'Promo code 401 error fixed', done: true },
            { item: 'All public pages load without login', done: true },
            { item: 'Order duplicate guard active', done: true },
            { item: 'No agent can publish/spend without approval', done: true },
          ].map((c, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${c.done ? 'border-green-500/20 bg-green-500/5' : 'border-border bg-secondary/20'}`}>
              {c.done ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
              <p className={`text-xs ${c.done ? 'text-green-300' : 'text-foreground/80'}`}>{c.item}</p>
              {c.done && <Badge className="ml-auto bg-green-500/15 text-green-300 border-green-500/30 border text-[9px]">Done</Badge>}
              {!c.done && <Badge className="ml-auto bg-amber-500/15 text-amber-300 border-amber-500/30 border text-[9px]">Needs Gannon</Badge>}
            </div>
          ))}
        </div>
      </Sec>

      {/* Quick Jump */}
      <Card>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Quick Jump</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              { label: 'Release Sprint', path: '/admin/release-sprint' },
              { label: 'Approval Queue', path: '/admin/approval-queue' },
              { label: 'Campaign Images', path: '/admin/campaign-image-approval' },
              { label: 'Merch Visual Lab', path: '/admin/merch-visual-lab' },
              { label: 'Orders', path: '/admin/orders' },
              { label: 'Stripe Command', path: '/admin/stripe-command-centre' },
              { label: 'Metricool', path: '/admin/metricool-diagnostics' },
              { label: 'Business Profile', path: '/admin/business-profile-settings' },
              { label: 'Site Health', path: '/admin/site-health' },
              { label: 'Agent Registry', path: '/admin/agent-registry' },
              { label: 'Site Scan Report', path: '/admin/site-scan-report' },
              { label: 'Mum Tribute', path: '/mum' },
              { label: 'TikTok Review', path: '/admin/tiktok-review' },
              { label: 'GanozMix', path: '/admin/ganozmix' },
              { label: 'Notifications', path: '/admin/notifications' },
              { label: 'Webhook Health', path: '/admin/webhook-health' },
            ].map(link => (
              <Link key={link.path} to={link.path}>
                <div className="border border-border/40 rounded-xl p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all cursor-pointer">
                  <p className="text-xs font-semibold text-foreground">{link.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">{link.path}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-xs text-muted-foreground/30">Gannon Waye Music OS · Master Blueprint v3 · June 2026 · Base44 App 69eb7905ca6eb4180010f794</p>
      </div>
    </div>
  );
}