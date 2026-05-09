import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileCode, Database, Zap, Component, Globe, Shield,
  ChevronDown, ChevronRight, ExternalLink, RefreshCw, Music, ShoppingBag,
  Users, Settings, Mail, DollarSign, Activity, Gift, Video, Book
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// ── Static architecture map (reflects actual file structure) ─────────────────

const PAGES = [
  { label: 'Home', path: '/', admin: false },
  { label: 'Music', path: '/music', admin: false },
  { label: 'Store', path: '/store', admin: false },
  { label: 'Community', path: '/community', admin: false },
  { label: 'Videos', path: '/videos', admin: false },
  { label: 'Back This', path: '/back-this', admin: false },
  { label: 'Bookings', path: '/bookings', admin: false },
  { label: 'Mastering', path: '/mastering', admin: false },
  { label: 'This Is My Life', path: '/this-is-my-life', admin: false },
  { label: 'Lyrics', path: '/lyrics', admin: false },
  { label: 'Community', path: '/community', admin: false },
  { label: 'Fan Profile', path: '/fan-profile', admin: false },
  { label: 'Impact', path: '/impact', admin: false },
  { label: 'FAQ', path: '/faq', admin: false },
  { label: 'Contact', path: '/contact', admin: false },
  { label: 'Portrait Gallery', path: '/portrait-gallery', admin: false },
  { label: 'Gift Checklist', path: '/gift-checklist', admin: false },
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
  { name: '1800RESPECT', desc: '10% giving commitment', status: 'manual' },
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
  const { data: entities = [], refetch: refetchEntities } = useQuery({
    queryKey: ['blueprint-entities'],
    queryFn: () => Promise.all([
      base44.entities.MasteringProject.list('-created_date', 1),
      base44.entities.MerchProduct.list('-created_date', 1),
      base44.entities.EmailSubscriber.list('-created_date', 1),
      base44.entities.SupportContribution.list('-created_date', 1),
    ]).then(() => true),
    staleTime: 30000,
  });

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
          { label: 'Mastering Jobs', value: counts.projects ?? '—', color: 'text-primary' },
          { label: 'Products', value: counts.products ?? '—', color: 'text-blue-400' },
          { label: 'Subscribers', value: counts.subscribers ?? '—', color: 'text-green-400' },
          { label: 'Supporters', value: counts.supporters ?? '—', color: 'text-yellow-400' },
          { label: 'Orders', value: counts.orders ?? '—', color: 'text-orange-400' },
          { label: 'Bookings', value: counts.enquiries ?? '—', color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/40 rounded-xl p-3 text-center">
            <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
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

      <p className="font-body text-[10px] text-muted-foreground text-center pb-4">
        Blueprint auto-refreshes live counts every 60 seconds. Static architecture reflects the current codebase.
      </p>
    </div>
  );
}