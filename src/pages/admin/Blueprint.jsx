import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Database, Zap, Globe, Shield,
  ChevronDown, ChevronRight, ExternalLink, Music, ShoppingBag,
  Users, Settings, Mail, DollarSign, Activity, Gift, Video,
  CreditCard, CheckSquare, Brain
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// ── Static architecture map (reflects actual file structure) ─────────────────

const PAGES = [
  { label: 'Home', path: '/', admin: false },
  { label: 'My Story', path: '/this-is-my-life', admin: false },
  { label: 'Music', path: '/music', admin: false },
  { label: 'Videos', path: '/videos', admin: false },
  { label: 'Store', path: '/store', admin: false },
  { label: 'Community', path: '/community', admin: false },
  { label: 'Contact', path: '/contact', admin: false },
  { label: 'Support', path: '/back-this', admin: false },
  // Admin
  { label: 'Dashboard', path: '/admin', admin: true },
  { label: 'Releases', path: '/admin/releases', admin: true },
  { label: 'Merch Management', path: '/admin/merch', admin: true },
  { label: 'Merch Financials', path: '/admin/merch-financials', admin: true },
  { label: 'Orders', path: '/admin/orders', admin: true },
  { label: 'Subscribers', path: '/admin/subscribers', admin: true },
  { label: 'Fan Management', path: '/admin/fans', admin: true },
  { label: 'Supporters', path: '/admin/supporters', admin: true },
  { label: 'Newsletter', path: '/admin/newsletter', admin: true },
  { label: 'Videos', path: '/admin/videos', admin: true },
  { label: 'Financial Dashboard', path: '/admin/financials', admin: true },
  { label: 'Site Settings', path: '/admin/settings', admin: true },
  { label: 'Site Health', path: '/admin/site-health', admin: true },
  { label: 'Audit Log', path: '/admin/audit-log', admin: true },
  { label: 'Mastering Queue', path: '/admin/mastering', admin: true },
  { label: 'Gift Claims', path: '/admin/gift-claims', admin: true },
  { label: 'Gift Progress', path: '/admin/gift-progress', admin: true },
  { label: 'Release Countdown', path: '/admin/release-countdown', admin: true },
  { label: 'Content Automate', path: '/admin/content-automate', admin: true },
  { label: 'Charity Tracking', path: '/admin/charity-tracking', admin: true },
  { label: 'Birthday Discounts', path: '/admin/birthdays', admin: true },
  { label: 'Promo Codes', path: '/admin/promo-codes', admin: true },
  { label: 'Training Hub', path: '/admin/training', admin: true },
  { label: 'Blueprint', path: '/admin/blueprint', admin: true },
];

const ENTITIES = [
  { name: 'MasteringProject', desc: 'Audio mastering sessions & output', icon: Music },
  { name: 'MerchProduct', desc: 'Products, pricing, stock', icon: ShoppingBag },
  { name: 'MerchOrder', desc: 'Customer orders & shipping', icon: ShoppingBag },
  { name: 'EmailSubscriber', desc: 'Fan subscriber list', icon: Mail },
  { name: 'EmailPreference', desc: 'Subscriber consent preferences', icon: Mail },
  { name: 'SupportContribution', desc: 'Back This payments received', icon: DollarSign },
  { name: 'SupporterProfile', desc: 'Supporter tiers & badges', icon: Users },
  { name: 'BookingEnquiry', desc: 'Live & media booking pipeline', icon: Music },
  { name: 'FanPost', desc: 'Community messages (moderated)', icon: Users },
  { name: 'FanMedia', desc: 'Fan photo/video wall', icon: Video },
  { name: 'FeaturedVideo', desc: 'YouTube/social video embeds', icon: Video },
  { name: 'SocialVideo', desc: 'Instagram/TikTok reels', icon: Video },
  { name: 'Release', desc: 'Music releases & artwork', icon: Music },
  { name: 'SiteSettings', desc: 'Global site configuration', icon: Settings },
  { name: 'SiteReveal', desc: 'Artwork & merch reveal flags', icon: Globe },
  { name: 'GiftClaim', desc: 'Gift verification & dispatch', icon: Gift },
  { name: 'GiftRequirementTracker', desc: 'Social follow requirements', icon: Gift },
  { name: 'MerchInterest', desc: 'Pre-launch product interest', icon: ShoppingBag },
  { name: 'PromoCode', desc: 'Discount & promo codes', icon: DollarSign },
  { name: 'CharityDonationTracker', desc: '10% monthly giving tracker', icon: DollarSign },
  { name: 'AuditLog', desc: 'Admin change history', icon: Activity },
  { name: 'OrderLock', desc: 'Race condition prevention', icon: Shield },
  { name: 'IdempotenceLog', desc: 'Duplicate-prevention log', icon: Shield },
];

const FUNCTIONS = [
  { name: 'generatePresaveLinks', desc: 'Presave links generator (all platforms)', category: 'Distribution' },
  { name: 'releaseCalendarSync', desc: 'Release calendar sync to Google Calendar', category: 'Distribution' },
  { name: 'collectReleaseFeedback', desc: 'Fan feedback collection system', category: 'Distribution' },
  { name: 'autonomousSocialPoster', desc: 'AI social content generator', category: 'Social' },
  { name: 'autonomousAlertSystem', desc: 'System health & alert dispatcher', category: 'Monitoring' },
  { name: 'sendSlackAlert', desc: 'Slack notification dispatcher', category: 'Notifications' },
  { name: 'onNewOrderSlack', desc: 'Order Slack alerts', category: 'Notifications' },
  { name: 'createPaymentIntent', desc: 'Stripe payment creation', category: 'Payments' },
  { name: 'getStripeConfig', desc: 'Stripe public key fetch', category: 'Payments' },
  { name: 'generateDonorReceipt', desc: 'HTML receipt for supporters', category: 'Payments' },
  { name: 'generateTaxInvoice', desc: 'Tax invoice generator', category: 'Payments' },
  { name: 'validatePromoCode', desc: 'Promo code validation', category: 'Payments' },
  { name: 'calculateShippingRate', desc: 'Shipping cost calculator', category: 'Payments' },
  { name: 'sendOrderReceipt', desc: 'Order receipt email', category: 'Email' },
  { name: 'welcomeEmail', desc: 'Subscriber welcome email', category: 'Email' },
  { name: 'welcomeNewSubscriber', desc: 'New subscriber trigger', category: 'Email' },
  { name: 'onNewSubscriberWelcome', desc: 'Gmail welcome flow', category: 'Email' },
  { name: 'sendWelcomeEmailGmail', desc: 'Gmail-based welcome', category: 'Email' },
  { name: 'sendGiftEmail', desc: 'Gift offer email', category: 'Email' },
  { name: 'sendGiftOfferEmail', desc: 'Gift campaign email', category: 'Email' },
  { name: 'sendBirthdayDiscount', desc: 'Birthday promo email', category: 'Email' },
  { name: 'sendRevealNewsletter', desc: 'Release reveal newsletter', category: 'Email' },
  { name: 'notifySubscribersNewRelease', desc: 'New release blast', category: 'Email' },
  { name: 'notifyAdminNewOrder', desc: 'Admin new order alert', category: 'Notifications' },
  { name: 'notifyAdminNewOrderGmail', desc: 'Admin order via Gmail', category: 'Notifications' },
  { name: 'notifyAdminBookingEnquiry', desc: 'Admin booking alert', category: 'Notifications' },
  { name: 'notifyAdminLowStock', desc: 'Low stock warning', category: 'Notifications' },
  { name: 'onNewOrderAlert', desc: 'Order alert automation', category: 'Notifications' },
  { name: 'onNewOrderAutomation', desc: 'Full order workflow', category: 'Notifications' },
  { name: 'onOrderShipped', desc: 'Shipping notification', category: 'Notifications' },
  { name: 'orderAlertEmail', desc: 'Order email alert', category: 'Notifications' },
  { name: 'fanPostNotification', desc: 'Fan post moderation alert', category: 'Notifications' },
  { name: 'fanMediaSubmissionEmail', desc: 'Fan media upload alert', category: 'Notifications' },
  { name: 'createGiftTracker', desc: 'Gift tracker initialisation', category: 'Campaigns' },
  { name: 'createSampleGiftTracker', desc: 'Sample gift tracker', category: 'Campaigns' },
  { name: 'triggerMay10Reveal', desc: 'Site reveal trigger', category: 'Campaigns' },
  { name: 'bookingWorkflowHandler', desc: 'Booking state machine', category: 'Bookings' },
  { name: 'syncOrderToSheets', desc: 'Google Sheets sync', category: 'Integrations' },
  { name: 'syncTunecore', desc: 'TuneCore data sync', category: 'Integrations' },
  { name: 'aiFanReply', desc: 'AI-powered fan reply', category: 'AI' },
  { name: 'orderLockingMiddleware', desc: 'Race condition lock', category: 'Safety' },
  { name: 'trackMonthlyCharityDonation', desc: 'Monthly charity tracker', category: 'Finance' },
  { name: 'runSiteHealthCheck', desc: 'Automated site tests', category: 'Monitoring' },
  { name: 'automatedSiteTests', desc: 'Test suite runner', category: 'Monitoring' },
];

const INTEGRATIONS = [
  { name: 'Stripe', desc: 'Payments & receipts', status: 'active' },
  { name: 'Gmail (OAuth)', desc: 'Transactional emails', status: 'active' },
  { name: 'Google Sheets (OAuth)', desc: 'Order sync', status: 'active' },
  { name: 'Base44 LLM (InvokeLLM)', desc: 'AI fan replies, product intelligence', status: 'active' },
  { name: 'TuneCore', desc: 'Streaming royalty sync', status: 'active' },
  { name: '1800RESPECT', desc: 'Independent crisis-support resource link', status: 'reference' },
];

// ── Section component ────────────────────────────────────────────────────────

function Section({ icon: Icon, title, count, color, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-display text-base text-foreground">{title}</p>
          </div>
          <Badge variant="outline" className="font-body text-xs ml-1">{count}</Badge>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="border-t border-border/40 p-5">{children}</div>}
    </div>
  );
}

// ── Main Blueprint ───────────────────────────────────────────────────────────

export default function Blueprint() {
  // Live counts
  const { data: counts = {} } = useQuery({
    queryKey: ['blueprint-counts'],
    queryFn: async () => {
      const [projects, products, subscribers, supporters, orders, enquiries] = await Promise.all([
        base44.entities.MasteringProject.list('-created_date', 200),
        base44.entities.MerchProduct.list('-created_date', 200),
        base44.entities.EmailSubscriber.list('-created_date', 200),
        base44.entities.SupporterProfile.list('-created_date', 200),
        base44.entities.MerchOrder.list('-created_date', 200),
        base44.entities.BookingEnquiry.list('-created_date', 200),
      ]);
      return {
        projects: projects.length,
        products: products.length,
        subscribers: subscribers.length,
        supporters: supporters.length,
        orders: orders.length,
        enquiries: enquiries.length,
      };
    },
    refetchInterval: 60000, // refresh every minute
  });

  const publicPages  = PAGES.filter(p => !p.admin);
  const adminPages   = PAGES.filter(p => p.admin);
  const funcCategories = [...new Set(FUNCTIONS.map(f => f.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">App Blueprint</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Live architecture overview — every page, entity, function & integration in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-body text-muted-foreground bg-card border border-border/40 rounded-full px-3 py-1.5">
          <Activity className="w-3 h-3 text-green-400" />
          Auto-refreshes every 60s
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Mastering Jobs', value: counts.projects ?? '—', color: 'text-primary', to: '/admin/mastering' },
          { label: 'Products', value: counts.products ?? '—', color: 'text-blue-400', to: '/admin/merch' },
          { label: 'Subscribers', value: counts.subscribers ?? '—', color: 'text-green-400', to: '/admin/subscribers' },
          { label: 'Supporters', value: counts.supporters ?? '—', color: 'text-yellow-400', to: '/admin/supporters' },
          { label: 'Orders', value: counts.orders ?? '—', color: 'text-orange-400', to: '/admin/orders' },
          { label: 'Bookings', value: counts.enquiries ?? '—', color: 'text-purple-400', to: '/admin/fans' },
        ].map(s => (
          <Link key={s.label} to={s.to} className="bg-card border border-border/40 rounded-xl p-3 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
            <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Pages — Public */}
      <Section icon={Globe} title="Public Pages" count={publicPages.length} color="bg-blue-500/10 text-blue-400">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {publicPages.map(p => (
            <Link key={p.path} to={p.path} target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/30 hover:border-primary/40 hover:bg-primary/5 transition-all group">
              <span className="font-body text-sm text-foreground">{p.label}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </Section>

      {/* Pages — Admin */}
      <Section icon={Shield} title="Admin Pages" count={adminPages.length} color="bg-orange-500/10 text-orange-400">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {adminPages.map(p => (
            <Link key={p.path} to={p.path}
              className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/30 hover:border-primary/40 hover:bg-primary/5 transition-all group">
              <span className="font-body text-sm text-foreground">{p.label}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </Section>

      {/* Entities */}
      <Section icon={Database} title="Data Entities" count={ENTITIES.length} color="bg-green-500/10 text-green-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ENTITIES.map(e => {
            const Icon = e.icon;
            return (
              <div key={e.name} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border/30">
                <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-body text-sm text-foreground">{e.name}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{e.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Backend Functions */}
      <Section icon={Zap} title="Backend Functions" count={FUNCTIONS.length} color="bg-yellow-500/10 text-yellow-400">
        <div className="space-y-4">
          {funcCategories.map(cat => (
            <div key={cat}>
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-2">{cat}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {FUNCTIONS.filter(f => f.category === cat).map(f => (
                  <div key={f.name} className="flex items-start gap-2 px-3 py-2 rounded-lg border border-border/30">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body text-xs text-foreground font-medium">{f.name}</p>
                      <p className="font-body text-[11px] text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Integrations */}
      <Section icon={Globe} title="External Integrations" count={INTEGRATIONS.length} color="bg-purple-500/10 text-purple-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {INTEGRATIONS.map(i => (
            <div key={i.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border/30">
              <div>
                <p className="font-body text-sm text-foreground">{i.name}</p>
                <p className="font-body text-[11px] text-muted-foreground">{i.desc}</p>
              </div>
              <Badge className={`text-[10px] border-0 ${i.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {i.status}
              </Badge>
            </div>
          ))}
        </div>
      </Section>

      {/* DSP Chain */}
      <Section icon={Music} title="Mastering DSP Chain" count={9} color="bg-primary/10 text-primary">
        <div className="flex flex-wrap gap-2">
          {[
            'High-Pass Filter',
            '4-Band Parametric EQ',
            'Harmonic Saturation',
            'M/S Stereo Width',
            'Multi-Band Compression',
            'K-Weighted LUFS Normalisation',
            'True-Peak Look-Ahead Limiter',
            'TPDF Dither',
            '24-bit WAV Export',
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full border border-border/30">
              <span className="font-body text-[10px] text-primary font-bold">{i + 1}</span>
              <span className="font-body text-xs text-foreground">{step}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Payment Test Checklist — ADMIN ONLY */}
      <Section icon={CreditCard} title="Stripe Payment Test Checklist" count={6} color="bg-blue-500/10 text-blue-400">
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <p className="font-body text-xs text-amber-400 leading-relaxed">
              <strong>Admin only — not visible publicly.</strong> Use these Stripe test cards in the Stripe test/sandbox environment before going live. Use a small test amount (e.g. $5). Confirm in Stripe Dashboard → Payments that each result is as expected.
            </p>
          </div>
          <div className="space-y-2">
            {[
              { card: '4242 4242 4242 4242', result: 'Success — payment completes', color: 'text-green-400', check: 'SupportContribution created once · SupporterProfile upserted (no duplicate) · receipt email sends or logs sandbox note · admin notification sends or logs sandbox note' },
              { card: '4000 0000 0000 9995', result: 'Decline — insufficient funds', color: 'text-red-400', check: 'Visible error shown to user · No SupportContribution or MerchOrder created · No promo usage recorded' },
              { card: '4000 0000 0000 3220', result: '3D Secure / authentication required', color: 'text-yellow-400', check: 'Auth popup appears · After completing auth, payment succeeds · SupportContribution created once only' },
            ].map(({ card, result, color, check }) => (
              <div key={card} className="bg-secondary/30 rounded-xl p-4 border border-border/30">
                <div className="flex items-start gap-3">
                  <CreditCard className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                  <div className="flex-1">
                    <p className="font-body text-sm text-foreground font-mono tracking-wider">{card}</p>
                    <p className={`font-body text-xs font-medium mt-0.5 ${color}`}>{result}</p>
                    <p className="font-body text-[11px] text-muted-foreground mt-1 leading-relaxed">{check}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-secondary/40 rounded-xl p-3 border border-border/30">
            <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-2">For all test cards, use:</p>
            <div className="flex flex-wrap gap-4 font-body text-xs text-foreground/70">
              <span>Expiry: <strong className="text-foreground">any future date</strong> e.g. 12/29</span>
              <span>CVC: <strong className="text-foreground">any 3 digits</strong> e.g. 123</span>
              <span>ZIP/postcode: <strong className="text-foreground">any value</strong></span>
            </div>
          </div>
          <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
            <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-2">After each successful test — verify:</p>
            <div className="space-y-1.5">
              {[
                'SupportContribution record created exactly once (check /admin/supporters)',
                'SupporterProfile upserted by email — not duplicated',
                'Promo code usage recorded only after payment success (check /admin/promo-codes)',
                'Failed payments show visible user-facing error and create no paid record',
                'Customer receipt email sends (or logs "sandbox restricted" — expected in test mode)',
                'Admin notification sends (or logs expected sandbox note)',
                'Order/pre-order status visible in /admin/orders',
              ].map(item => (
                <div key={item} className="flex items-start gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="font-body text-xs text-foreground/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Agent Autonomy & Self-Learning Requirements */}
      <Section icon={Brain} title="Agent Autonomy Requirements" count={7} color="bg-purple-500/10 text-purple-400">
        <div className="space-y-4">
          <p className="font-body text-xs text-muted-foreground">For agents to become truly self-reliant and autonomous, implement these core systems:</p>
          {[
            { req: 'Knowledge Vault Integration', desc: 'Every agent decision must save learnings to KnowledgeVault for future reference. Agents retrieve past decisions before acting.', status: '✅ Ready' },
            { req: 'Approval Queue Learning Loop', desc: 'When approvals are rejected, agents analyze rejection reasons and store anti-patterns. Auto-improve prompts next time.', status: '⏳ Partial' },
            { req: 'AgentMemory for Pattern Recognition', desc: 'Track what worked (high-confidence outputs) vs failed (low-confidence blocks). Agents query memory before executing risky tasks.', status: '⏳ Partial' },
            { req: 'AgentLearningRecord Auto-Population', desc: 'Every successful task creation, rejection, or optimization must be logged. Agents generate their own lesson records.', status: '⏳ Partial' },
            { req: 'Real-Time Feedback Loop (Slack)', desc: 'Agents receive immediate Slack notifications of task outcomes — success/failure — allowing them to adjust strategy mid-execution.', status: '✅ Ready' },
            { req: 'AgentTaskLog for Audit Trail', desc: 'Every autonomous action is logged with risk assessment. Agents can query their own history to avoid repeating mistakes.', status: '✅ Ready' },
            { req: 'LLM-Driven Self-Critique', desc: 'Before executing high-risk tasks, agents invoke an LLM to self-critique their plan. Store critiques in KnowledgeVault.', status: '⏳ Build Now' },
            { req: 'Autonomous Prompt Evolution', desc: 'Agents automatically improve their system prompt by analyzing successful vs failed outputs. Store versioned prompts in KnowledgeVault.', status: '⏳ Build Now' },
            { req: 'Financial/Legal Risk Awareness', desc: 'Agents auto-flag high-risk actions for ApprovalQueue. Over time, learn which approvals succeed vs fail to refine risk threshold.', status: '✅ Ready' },
            { req: 'Competitive/Market Intelligence Loop', desc: 'Agents autonomously fetch, analyse, and store market data (TrendMonitor, CreatorInsights, SocialIntelligence). Update memory weekly.', status: '✅ Ready' },
          ].map(({ req, desc, status }, i) => (
            <div key={i} className="bg-secondary/30 rounded-xl p-3 border border-border/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-body text-sm text-foreground font-medium">{req}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{desc}</p>
                </div>
                <Badge className={status.includes('Ready') ? 'bg-green-500/10 text-green-400 border-green-500/30' : status.includes('Partial') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}>
                  {status.split(' ')[0]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Owner Launch Checklist */}
      <Section icon={CheckSquare} title="Pre-Launch Owner Checklist" count={7} color="bg-green-500/10 text-green-400">
        <div className="space-y-3">
          <p className="font-body text-xs text-muted-foreground">Complete these steps before going live. Check them off manually as you go.</p>
          {[
            { item: 'Upload chorus MP3 to Base44 files and confirm AmbientPlayer URL is correct', note: 'File uploaded: 297c2c434_thank-you-chorus-1m30s-2m12s-site-loop.mp3 ✓' },
            { item: 'Upload gold circular GW mark logo — set URL in Navbar (components/public/Navbar.jsx)', note: 'TODO: replace fallback text GW badge with image src once asset is confirmed' },
            { item: 'Upload GW heart support mark — set GW_HEART_SUPPORT_LOGO_URL in StickySupportBar', note: 'TODO: update const GW_HEART_SUPPORT_LOGO_URL with uploaded asset URL' },
            { item: 'Publish the app after any asset/config changes in Base44 dashboard', note: 'Changes do not go live until published' },
            { item: 'Run Stripe test cards (see Payment Test Checklist above) and verify all scenarios', note: 'Test both success and failure flows before switching to live keys' },
            { item: 'Submit a test subscriber signup and verify welcome email sends or logs expected sandbox note', note: 'Check /admin/subscribers after signup' },
            { item: 'Submit a test merch pre-order interest and verify admin + customer emails', note: 'Store pre-orders do NOT charge today — payment not collected until June 1 2026 manually' },
            { item: 'Submit a test contact/community item and verify moderation flow', note: 'Check /admin/fans and /community' },
            { item: 'Verify all public pages load: /, /music, /store, /community, /contact, /back-this', note: 'Thank You official release date: 05 June 2026 — verify this is correct everywhere' },
            { item: 'Connect Gmail/Google Drive integrations under gannonwayemusic@gmail.com — NOT personal Gmail', note: 'Go to Base44 Dashboard → Integrations and reconnect under the correct account before going live' },
            { item: 'Update Gmail sender/reply-to to hello@gannonwaye.com or an authorised Gmail alias if available', note: 'Set up alias in Gmail Settings → Accounts → Send mail as, then verify ownership' },
            { item: 'Reconnect Google Drive/Sheets integration under gannonwayemusic@gmail.com before using Drive docs or syncing orders', note: 'Any existing Google Sheets linked under personal Gmail will stop working after reconnection — update GOOGLE_SHEET_ID secret if sheet changes' },
            { item: 'Manually migrate working docs from personal Drive to gannonwayemusic@gmail.com Drive (share-copy or Google Drive Transfer)', note: 'Base44 cannot migrate Drive files — this must be done manually in Google Drive' },
            { item: 'Verify all backend functions using Gmail/Drive (welcomeEmail, syncOrderToSheets, sendOrderReceipt etc.) send correctly under new account', note: 'Run a test subscriber signup and test order after reconnecting to confirm' },
          ].map(({ item, note }, i) => (
            <div key={i} className="flex items-start gap-3 bg-secondary/30 rounded-xl p-3 border border-border/30">
              <div className="w-5 h-5 rounded border border-border/50 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-sm text-foreground">{item}</p>
                <p className="font-body text-[11px] text-muted-foreground mt-0.5">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Site URLs for owner reference */}
      <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-2">
        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-3">Site URLs</p>
        {[
          { label: 'Live Site', url: 'https://gannonwaye.base44.app/' },
          { label: 'Editor / Preview', url: 'https://app.base44.com/apps/69eb7905ca6eb4180010f794/editor/preview' },
        ].map(({ label, url }) => (
          <div key={label} className="flex items-center justify-between gap-4 bg-secondary/30 rounded-xl px-4 py-2.5">
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline truncate">{url}</a>
          </div>
        ))}
      </div>

      <p className="font-body text-[10px] text-muted-foreground text-center pb-4">
        Blueprint auto-refreshes live counts every 60 seconds. Static architecture reflects the current codebase.
      </p>
    </div>
  );
}