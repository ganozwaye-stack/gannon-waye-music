import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Copy, Download, ExternalLink, Shield, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

const SECTIONS = [
  {
    id: 'overview',
    label: 'Project Overview',
    content: `# Gannon Waye Music — Business OS
gannonwaye.com — Artist Website + E-Commerce + Business Intelligence

Stack: React 18, Vite, Tailwind CSS, Base44 platform (BaaS)
Auth: Base44 built-in (email/magic link)
Database: Base44 entities (MongoDB-like)
Backend: Base44 Deno edge functions
Integrations: Stripe, Gmail, Google Sheets, Slack, TikTok, TikTok Webhook

Key facts:
- This is a BASE44 app — do NOT use Next.js, Node.js, or other backends
- All backend logic lives in /functions/*.js (Deno runtime)
- All data lives in Base44 entities (JSON schema defined)
- No SQL, no Postgres, no custom auth
- Stripe is integrated via createCheckoutSession and stripeWebhook functions
- TikTok OAuth is built but NOT yet live-tested on gannonwaye.com
- Coaching is PRIVATE (COACHING_PUBLIC_LAUNCH_ENABLED = false) — DO NOT make coaching public`,
  },
  {
    id: 'routes',
    label: 'Route Map',
    content: `# Route Map (App.jsx is the source of truth)

## Public Routes (no auth required)
/ → Home
/music → Music page
/store → Merch store (Stripe checkout)
/community → Fan community
/videos → Videos
/back-this → Support/crowdfunding
/current-single → Current release
/lyrics → Lyrics
/this-is-my-life → About Gannon
/faq → FAQ
/member-tiers → Membership tiers
/mastering → Mastering service
/bookings → Booking enquiry
/contact → Contact
/impact → Charity impact
/privacy-policy → Privacy Policy
/terms-of-service → Terms of Service
/order-status → Order tracker
/merch-feedback → Merch feedback form
/email-preferences → Email prefs
/orders → Order history (auth)
/fan-profile → Fan profile (auth)

## No-layout Routes
/embed-timer → Timer embed
/tiktok-platform-review → TikTok review (public)
/tiktok-callback → TikTok OAuth callback
/gift-checklist → Gift checklist

## Admin Routes (/admin/* — requires admin role)
All admin pages are behind AdminLayout which checks user.role === 'admin'
Key admin routes:
/admin → Dashboard
/admin/orders → Order management
/admin/merch → Merch management
/admin/financials → Financial dashboard
/admin/business-worth-command → Business valuation
/admin/order-profit-intelligence → Order P&L
/admin/offer-engine → Active offers
/admin/bundle-proposal-studio → Bundle builder
/admin/content-to-cash → Content pipeline
/admin/website-evolution → Site improvements
/admin/todays-money-moves → Daily actions
/admin/agent-capability-matrix → Agent management
/admin/az-index → A-Z page index
/admin/coaching-command → Coaching (PRIVATE — not public)
/admin/tiktok-platform-review → TikTok admin
/admin/social-platform-parity → Social platform tracker
/admin/qa-command-centre → QA & testing
/admin/playwright-test-centre → Test packs
/admin/developer-handoff → This page`,
  },
  {
    id: 'entities',
    label: 'Data Models',
    content: `# Entity List (entities/*.json)

Revenue/Commerce:
- MerchOrder — orders, line items, status, shipping
- MerchProduct — products, pricing, profit fields
- PromoCode — discount codes
- BundleOffer — bundle campaigns
- SupportContribution — crowdfunding contributions
- StripeEventLog — Stripe webhook events
- PaymentDiagnostic — payment issues/failures
- IdempotenceLog — deduplication
- OrderLock — checkout locking

Content/Music:
- Release — songs/albums, lyrics, streaming links
- SocialVideo — social content drafts
- FeaturedVideo — homepage videos
- MasteringProject — mastering jobs

Community/Fans:
- EmailSubscriber — mailing list
- FanPost — community posts
- FanComment — comments
- FanReview — product/music reviews
- FanMedia — fan-uploaded media
- SuperfanProfile — VIP fan records
- CommunityReply — reply threads
- CommunityLike — likes

Business Intelligence:
- AdminNotification — Business Attention Centre
- AgentActionProposal — agent proposals
- AgentRegistry — agent configurations
- AgentMemory / MusicAgentMemory — agent learning
- AgentLearningRecord / MusicLearningRecord — lessons
- AgentTaskLog — task history
- RevenueOpportunity — income opportunities
- GrowthOpportunity — growth ideas
- IdeaOpportunity — idea tracking

Operations:
- KnowledgeVault — knowledge/memory store
- AuditLog — action log
- ApprovalQueue — approval workflow
- SystemHealthIssue — technical issues
- RiskAlert — risk tracking
- SiteSettings — site config
- BookingEnquiry — booking requests
- ShippingRateRule — shipping config
- ApiIntegrationSetup — integration tracker

Charity/Events:
- CharityDonationTracker
- GiftRequirementTracker
- GiftClaim

Users (built-in):
- User — email, full_name, role (admin|user)`,
  },
  {
    id: 'functions',
    label: 'Backend Functions',
    content: `# Backend Functions (functions/*.js — Deno runtime)

All functions use: import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

## Stripe / Payments
- stripeWebhook — receives Stripe events, creates orders, sends receipts
- stripeIntelligenceRouter — routes Stripe events to intelligence system
- createCheckoutSession — creates Stripe checkout
- createPaymentIntent — payment intent
- getStripeConfig — returns publishable key
- validatePromoCode — checks promo codes
- recordPromoUsage — marks promo used

## Orders / Fulfilment
- onNewOrderAutomation — post-order automation
- onNewOrderAlert — admin alert
- onNewOrderSlack — Slack notification
- notifyAdminNewOrder / notifyAdminNewOrderGmail — email alert
- sendOrderReceipt — customer receipt
- onOrderShipped — shipping confirmation
- syncOrderToSheets — Google Sheets export
- orderAlertEmail — order alert
- orderLockingMiddleware — prevents duplicate orders
- calculateShippingRate — shipping cost

## TikTok
- tiktokOAuth — OAuth flow, token exchange, status
- tiktokUploadDraft — uploads MP4 as TikTok draft
- tiktokWebhook — receives TikTok webhook events

## Email / Comms
- welcomeEmail / welcomeNewSubscriber / onNewSubscriberWelcome
- sendWelcomeEmailGmail — Gmail welcome
- sendRevealNewsletter — newsletter
- sendPromoCodeEmails — promo distribution
- sendBirthdayDiscount — birthday offer
- notifyAdmin — general admin alert
- notifyAdminBookingEnquiry — booking alert
- notifyAdminLowStock — stock alert
- fanMediaSubmissionEmail — fan media alert
- fanPostNotification — community post alert
- notifyInterestRegistration — interest alert
- notifySubscribersNewRelease — release alert
- aiFanReply — AI fan engagement

## Agents / Intelligence
- agentIntelligenceLoop — agent analysis loop
- agentProposalScanner — scans for revenue proposals
- agentSelfImprovement — agent learning
- autonomousResearch — background research
- autonomousTrendEngine — trend detection
- autonomousAlertSystem — automated alerts
- autonomousSocialPoster — social (approval-gated)
- growthOpportunityScanner — growth ideas
- socialCommentMonitor — social monitoring
- executiveMorningBrief — daily brief
- runSiteHealthCheck — health checker
- automatedSiteTests — automated testing
- integrationHealthCheck — integration status

## Music / Operations
- releaseCalendarSync — Google Calendar sync
- releaseCountdownBrief — countdown
- syncTunecore — TuneCore sync
- shippingOptimisationAudit — shipping review
- generatePresaveLinks — pre-save links
- collectReleaseFeedback — release feedback
- onCalendarEvent — calendar webhook handler
- bookingWorkflowHandler — booking workflow

## Charity / Gifts
- generateDonorReceipt
- generateTaxInvoice
- trackMonthlyCharityDonation
- createGiftTracker / createSampleGiftTracker
- sendGiftEmail / sendGiftOfferEmail
- triggerMay10Reveal
- sendRevealNewsletter

## Publishing / Approval
- publishApprovedProposal — publishes approved agent proposals
- communityReplyHandler — manages community replies
- onNewApprovalItem — approval notifications
- seedAgentRegistry — seeds agent registry`,
  },
  {
    id: 'secrets',
    label: 'Environment Variables',
    content: `# Environment Variables / Secrets

## Currently Set (values hidden)
- STRIPE_PUBLISHABLE_KEY ✅
- STRIPE_SECRET_KEY ✅
- STRIPE_WEBHOOK_SECRET ✅ (⚠ ROTATE REQUIRED — was exposed in AI output on 26 May 2026. Rotate at dashboard.stripe.com/webhooks. Present = confirmed, value must be rotated.)
- TIKTOK_CLIENT_KEY ✅ (⚠ Check for leading space — if OAuth fails, re-enter key without spaces)
- TIKTOK_CLIENT_SECRET ✅ (ROTATE THIS — may be exposed in prior sessions)
- GOOGLE_SHEET_ID ✅

## Connected OAuth (Base44 Connectors)
- Slack (channels:read, chat:write, im:write)
- Notion (read, write)
- Google Drive (drive.file)
- Google Calendar (calendar.readonly, calendar.events)
- Gmail (gmail.send, gmail.readonly)
- Google Sheets (spreadsheets, drive.file)
- Airtable (records read/write)

## NOT YET SET (needed for full functionality)
- META_APP_ID — Instagram/Facebook integration
- META_APP_SECRET — Instagram/Facebook integration
- YOUTUBE_CLIENT_ID — YouTube Data API
- YOUTUBE_CLIENT_SECRET — YouTube Data API
- X_CLIENT_ID — Twitter/X integration
- X_CLIENT_SECRET — Twitter/X integration
- SOUNDCLOUD_CLIENT_ID — SoundCloud
- SOUNDCLOUD_CLIENT_SECRET — SoundCloud
- POSTHOG_API_KEY — Server-side analytics
- SENTRY_DSN — Error monitoring
- TOOLOST_API_KEY — Too Lost distribution
- OPUSCLIP_API_KEY — Video clip generation
- OPENAI_API_KEY — Direct OpenAI (Base44 InvokeLLM used as alternative)

## Security Rules
- NEVER set secrets in frontend code
- NEVER log secret values
- NEVER expose secrets in screenshots or recordings
- Rotate TIKTOK_CLIENT_SECRET immediately if it was visible in any session`,
  },
  {
    id: 'blockers',
    label: 'Known Blockers',
    content: `# Current Blockers (as of 2026-05-25)

## Critical
1. TikTok live test NOT confirmed on gannonwaye.com
   - Must test OAuth in real browser (not Base44 preview)
   - TIKTOK_CLIENT_SECRET must be rotated
   - Developer review demo not recorded
   - Status: BLOCKED until Gannon tests live

2. No external Playwright test run
   - Internal route catalogue exists but no real browser test
   - Status: BLOCKED until test pack is run externally

## High Priority
3. META_APP_ID/META_APP_SECRET not set
   - Instagram/Facebook integration cannot proceed
   - Status: Meta developer app not created

4. YouTube Data API not enabled
   - Google connector is authorized but YouTube API not enabled in Google Cloud
   - Status: Needs Google Cloud Console action by Gannon

## Medium Priority
5. POSTHOG_API_KEY not set for server-side
   - Frontend PostHog working, server-side queries blocked
   - Status: Can add when needed

6. SENTRY_DSN not set
   - Error monitoring not active
   - Status: Optional but recommended for production

## Coaching (Intentionally Locked)
7. COACHING_PUBLIC_LAUNCH_ENABLED = false (hardcoded)
   - DO NOT make coaching public without Gannon legal review + 9-gate checklist
   - Status: Private by design

## Do Not Break
- Store checkout (Stripe)
- Order management
- Email notifications (Gmail connector)
- TikTok OAuth callback route (/tiktok-callback)
- Coaching privacy lock
- Admin authentication`,
  },
  {
    id: 'high_risk',
    label: 'High-Risk Areas',
    content: `# High-Risk Areas — Do Not Break

## Payment Critical
- /store — Live Stripe checkout
- /checkout-success — Post-payment confirmation
- functions/stripeWebhook.js — Creates orders, sends receipts
- functions/createCheckoutSession.js — Initiates checkout
- entities/MerchOrder — Order records
- DO NOT change status field values or order flow

## Coaching Privacy Lock
- COACHING_PUBLIC_LAUNCH_ENABLED = false — DO NOT change this
- /admin/coaching-command — Admin only (not public)
- No coaching routes may be in PublicLayout or public router
- Any coaching page must remain behind AdminLayout

## TikTok Secrets
- TIKTOK_CLIENT_SECRET — NEVER log, display, or expose
- TIKTOK_CLIENT_KEY — NEVER log, display, or expose
- tiktokOAuth function — tokens stored server-side only via KnowledgeVault

## Stripe Secrets
- STRIPE_SECRET_KEY — backend functions only
- STRIPE_WEBHOOK_SECRET — webhook validation only

## Admin Auth
- AdminLayout — all /admin/* routes are protected
- User.role must be 'admin' to access admin routes
- DO NOT remove or bypass auth checks

## Music Site
- / (Home), /music, /store, /current-single — Live public site
- Gannon's music career depends on these pages working
- DO NOT break public layout, navbar, or store checkout`,
  },
];

const TASK_PACKS = [
  {
    id: 'cursor',
    label: 'Cursor Task Pack',
    content: `# Cursor Task Pack — Gannon Waye Music OS

## Goal
Fix, audit, and improve the Gannon Waye Business OS without breaking live functionality.

## Files to Inspect First
- App.jsx (route map)
- components/admin/AdminLayout.jsx (navigation)
- pages/admin/Dashboard.jsx (main admin page)
- functions/stripeWebhook.js (payment processing)
- functions/tiktokOAuth.js (TikTok integration)
- entities/*.json (data models)

## Safety Rules
1. DO NOT change COACHING_PUBLIC_LAUNCH_ENABLED from false
2. DO NOT modify Stripe checkout flow without testing
3. DO NOT expose any secrets in frontend
4. DO NOT break /store, /tiktok-callback, or admin auth
5. Always use find_replace tool for existing files
6. Only use write_file for new files or entity JSON

## Required Outcomes
- All admin routes open without console errors
- All cards are clickable
- All tabs switch correctly
- All modals are scrollable
- TikTok OAuth routes are functional
- Coaching is private

## Test Requirements
- Run internal checks via /admin/qa-command-centre
- Download and run Playwright pack from /admin/playwright-test-centre

## Report Format
List each file changed, what changed, and why.
Flag any breaking changes.
Confirm coaching remains private.
Confirm Stripe checkout is untouched.`,
  },
  {
    id: 'codex',
    label: 'Codex Task Pack',
    content: `# Codex Task Pack — Gannon Waye Music OS

## Context
Base44 React app (NOT Next.js).
Backend = Deno edge functions in /functions/*.js
Frontend = React + Tailwind + shadcn/ui
Data = Base44 entities

## Current Priority Tasks
1. Verify all routes in App.jsx are imported and working
2. Check all admin navigation items in AdminLayout map to real pages
3. Ensure TikTok OAuth callback (/tiktok-callback) works
4. Verify coaching routes are NOT in public router

## Files You Need
- App.jsx — all routes
- components/admin/AdminLayout — all nav items
- pages/admin/* — admin pages
- functions/ — backend functions

## Do Not Touch
- Stripe functions (stripeWebhook, createCheckoutSession)
- COACHING_PUBLIC_LAUNCH_ENABLED = false
- Any file where you haven't seen the full content first

## Output Required
- List of broken or missing imports
- List of nav items without matching pages
- List of routes with no corresponding import
- Suggested fixes with exact find_replace pairs`,
  },
  {
    id: 'claude',
    label: 'Claude Code Task Pack',
    content: `# Claude Code Task Pack — Gannon Waye Music OS

## Role
You are a senior full-stack developer working on the Gannon Waye artist website and business OS.

## Architecture
- React 18 frontend (Vite, Tailwind, shadcn/ui)
- Base44 backend as a service
- Deno edge functions in /functions/
- No SQL — Base44 entity store
- Auth: Base44 (email/magic link)

## Primary Tasks
1. Audit: Read App.jsx and list all routes. For each route, confirm the imported component exists.
2. Audit: Read AdminLayout and list all nav items. For each item, confirm the route exists in App.jsx.
3. Fix: Any import that fails or file that does not exist must be noted.
4. Test prep: Verify /tiktok-callback exists and returns a valid component.
5. Coaching check: Confirm no coaching route is in the public RouteS (only /admin/coaching-command exists).

## Safety Rules
- Read each file before editing it
- Use find_replace for targeted edits
- Never add coaching to public routes
- Never expose secrets in frontend
- Always preserve existing working functionality

## Reporting
After each task, output:
- Files read
- Issues found
- Fixes applied
- Tests to confirm
- Remaining blockers`,
  },
  {
    id: 'playwright_dev',
    label: 'Playwright Dev Pack',
    content: `# Playwright Developer Task Pack

## Goal
Run full browser QA on https://gannonwaye.com

## Setup
npm install -D @playwright/test
npx playwright install chromium
export ADMIN_SESSION_COOKIE=<your_admin_cookie>

## Test Files to Run
Download from /admin/playwright-test-centre:
- tests/routes.spec.ts
- tests/navigation.spec.ts
- tests/clickability.spec.ts
- tests/tiktok.spec.ts
- tests/coaching_lock.spec.ts
- tests/commerce.spec.ts
- tests/mobile.spec.ts

## Priority Order
1. coaching_lock — MUST pass (privacy critical)
2. routes — all public routes must open
3. tiktok — OAuth callback must exist
4. commerce — store must load
5. navigation — all tabs/buttons work
6. mobile — responsive check

## Report Format
For each test:
- Test name
- Status (Passed/Failed/Skipped)
- Error message if failed
- Screenshot filename if failed
- Time to fix estimate

## Critical Failures (Fix Immediately)
- Any coaching route returning 200 publicly
- /tiktok-callback returning 404 or 500
- Store page returning 500
- Admin auth bypass
- Any secret value visible in page source`,
  },
];

export default function DeveloperHandoff() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [activePack, setActivePack] = useState(null);

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); };
  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded ${filename}` });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Developer Handoff</h1>
            <p className="text-sm text-muted-foreground mt-1">Complete project documentation, task packs for Cursor/Codex/Claude Code, and Playwright setup.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/playwright-test-centre"><Button variant="outline" size="sm"><FileText className="w-3 h-3 mr-1" />Test Centre</Button></Link>
          <Button variant="outline" size="sm" onClick={() => SECTIONS.forEach(s => downloadFile(`handoff/${s.id}.md`, s.content))}>
            <Download className="w-3 h-3 mr-1" />Download All Docs
          </Button>
        </div>
      </div>

      {/* Task Packs */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Copy-Ready Task Packs</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {TASK_PACKS.map(pack => (
              <Button key={pack.id} variant="outline" size="sm" onClick={() => setActivePack(activePack?.id === pack.id ? null : pack)}>
                {pack.label}
              </Button>
            ))}
          </div>
          {activePack && (
            <div className="mt-3 space-y-2">
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-64">{activePack.content}</pre>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copy(activePack.content)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                <Button variant="outline" size="sm" onClick={() => downloadFile(`task-packs/${activePack.id}.md`, activePack.content)}><Download className="w-3 h-3 mr-1" />Download</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          {SECTIONS.map(s => (
            <Button key={s.id} variant={activeSection?.id === s.id ? 'default' : 'ghost'} size="sm" className="w-full justify-start" onClick={() => setActiveSection(s)}>
              {s.label}
            </Button>
          ))}
          <div className="pt-2 space-y-1">
            <p className="text-xs text-muted-foreground px-2 font-semibold">Quick Links</p>
            <Link to="/admin/qa-command-centre"><Button variant="ghost" size="sm" className="w-full justify-start text-xs">QA Command Centre</Button></Link>
            <Link to="/admin/playwright-test-centre"><Button variant="ghost" size="sm" className="w-full justify-start text-xs">Playwright Tests</Button></Link>
            <Link to="/admin/social-platform-parity"><Button variant="ghost" size="sm" className="w-full justify-start text-xs">Social Parity</Button></Link>
            <Link to="/admin/tiktok-platform-review"><Button variant="ghost" size="sm" className="w-full justify-start text-xs">TikTok Review</Button></Link>
          </div>
        </div>

        {activeSection && (
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{activeSection.label}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(activeSection.content)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(`handoff/${activeSection.id}.md`, activeSection.content)}><Download className="w-3 h-3 mr-1" />Download</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono leading-relaxed">
                {activeSection.content}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Tracker */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Current Tracker — Active Items</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
              ['TikTok Final Review Blocker Fix', 'critical', 'Live test on gannonwaye.com + rotate secret + record demo + submit review'],
              ['Social Platform Parity Engine', 'high', 'Built. Meta/YouTube/others need OAuth setup.'],
              ['Whole-System Clickability + Function Completion', 'high', 'Playwright test pack ready — must run externally'],
              ['Commerce Orders / Profit / Loss / Bundle Intelligence', 'high', 'All pages built — live data test needed'],
              ['Intelligence-to-Income Engine Upgrade', 'medium', 'Built — needs real data to produce live recommendations'],
              ['Artist Business Setup + Management Intelligence', 'medium', 'Built at /admin/artist-business-setup'],
              ['Publishing / Sync / Sessions / Catalogue Expansion', 'medium', 'Built at /admin/sync-licensing-command'],
              ['Life Coaching — Staged/Private Only', 'legal', 'PRIVATE until legal review + Gannon approval'],
              ['Developer Handoff / Playwright / Cursor / Codex Setup', 'medium', 'Built — test packs available for download'],
            ].map(([item, priority, note]) => (
              <div key={item} className="flex items-start gap-3 p-2 rounded-lg border border-border/50">
                <Badge className={priority === 'critical' ? 'bg-red-500/20 text-red-300 border-red-500/30' : priority === 'high' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : priority === 'legal' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-secondary text-muted-foreground border-border'}>
                  {priority}
                </Badge>
                <div>
                  <p className="font-semibold text-xs">{item}</p>
                  <p className="text-xs text-muted-foreground">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}