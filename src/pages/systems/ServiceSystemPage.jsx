import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  LayoutDashboard,
  Music,
  Package,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminEditButton from '@/components/store/AdminEditButton';

const SERVICES = {
  'social-automation': {
    icon: Share2,
    eyebrow: 'Social Automation',
    title: 'Social Automation Systems',
    intro: 'A controlled content workflow for ideas, captions, assets, scheduling readiness, review queues, and platform checks, with human approval before anything publishes.',
    starting: 'From $1,800 AUD',
    adminHref: '/admin/social-command',
    includes: [
      'Content intake and campaign brief structure',
      'Caption, hook, and asset draft queues',
      'Platform readiness checks for TikTok, Instagram, and short-form content',
      'Approval gates before scheduling or publishing',
      'Performance review prompts and monthly clean-up tasks',
      'Escalation notes for anything that needs account access or OAuth approval',
    ],
    outcomes: [
      'Less scattered posting work',
      'Clear owner approval before public actions',
      'Reusable campaign structure for repeat launches',
    ],
  },
  'dropshipping-inventory': {
    icon: Package,
    eyebrow: 'Dropshipping Command',
    title: 'Dropshipping Inventory Systems',
    intro: 'A review-first command centre for sourcing, supplier comparison, landed-cost checks, listing drafts, image readiness, inventory notes, and launch approvals.',
    starting: 'From $3,500 AUD',
    adminHref: '/admin/procurement-command',
    includes: [
      'Product sourcing and supplier review queues',
      'Variant, MOQ, shipping, returns, and image-rights checks',
      'Landed cost and margin calculator structure',
      'Listing draft and product content workflow',
      'Image lab and background cleanup approval path',
      'Supplier order and marketplace publishing locks until approval',
    ],
    outcomes: [
      'Cleaner product decisions',
      'No accidental supplier orders',
      'Traceable launch gates for each product',
    ],
  },
  'control-panels': {
    icon: LayoutDashboard,
    eyebrow: 'Business Control',
    title: 'Control Panel Systems',
    intro: 'Central dashboards that bring scattered business tasks, metrics, approvals, links, and operating notes into one practical owner view.',
    starting: 'From $2,200 AUD',
    adminHref: '/admin/master-blueprint',
    includes: [
      'Owner dashboard and priority summary',
      'Route, module, and integration maps',
      'Health checks and action-needed panels',
      'Approval queue and admin navigation shortcuts',
      'Documentation links for handoff and future repair',
      'Manual-only gates for payments, suppliers, DNS, and account changes',
    ],
    outcomes: [
      'A smaller mental load',
      'Faster diagnosis when something breaks',
      'One place to see what is done, blocked, and next',
    ],
  },
  'ecommerce-merch-stores': {
    icon: ShoppingCart,
    eyebrow: 'E-commerce',
    title: 'E-commerce & Merch Store Systems',
    intro: 'Storefronts, product pages, carts, checkout readiness, promo rules, order admin, fulfilment notes, and trust pages built around safe launch operations.',
    starting: 'From $2,900 AUD',
    adminHref: '/admin/merch',
    includes: [
      'Storefront and product detail pages',
      'Cart, customer details, and checkout flow structure',
      'Promo code rules and bundle exclusions',
      'Order dashboard and manual fulfilment fallback',
      'Product image and launch content workflow',
      'Policy, contact, and public trust pages',
    ],
    outcomes: [
      'A real store path, not only a landing page',
      'Safer discount and fulfilment handling',
      'Clear approval boundaries for live payments and suppliers',
    ],
  },
  'approval-workflows': {
    icon: ShieldCheck,
    eyebrow: 'Approvals',
    title: 'Approval Workflow Systems',
    intro: 'Human-in-the-loop review paths for products, content, AI drafts, visuals, suppliers, publishing, and business actions that should never happen silently.',
    starting: 'From $1,200 AUD',
    adminHref: '/admin/approval-queue',
    includes: [
      'Approval queues by business area',
      'Risk labels for money, legal, reputation, and account-access actions',
      'Draft review states and owner decision notes',
      'Publishing and supplier action locks',
      'Audit-friendly task history',
      'Escalation prompts for anything requiring account credentials or 2FA',
    ],
    outcomes: [
      'Fast work without reckless automation',
      'A cleaner record of decisions',
      'Fewer accidental public changes',
    ],
  },
  'ai-content-systems': {
    icon: Cpu,
    eyebrow: 'AI Content',
    title: 'AI Content Systems',
    intro: 'AI-assisted content operations for briefs, hooks, captions, product copy, campaign ideas, SEO, support drafts, and brand guardrails.',
    starting: 'From $2,400 AUD',
    adminHref: '/admin/content-command',
    includes: [
      'Content brief intake and brand rules',
      'AI draft generation with review states',
      'Caption, hook, and asset variation queues',
      'Campaign planning and reusable launch structures',
      'Quality checks before anything is scheduled or posted',
      'Monthly review prompts and performance notes',
    ],
    outcomes: [
      'More draft volume with less blank-page drag',
      'Brand consistency across repeated posts',
      'Approval-first AI support',
    ],
  },
  'artist-release-systems': {
    icon: Music,
    eyebrow: 'Artist Releases',
    title: 'Artist Release Systems',
    intro: 'Connected release campaigns for music pages, lyrics, presaves, merch drops, fan CRM, email capture, social drafts, and campaign review.',
    starting: 'From $2,900 AUD',
    adminHref: '/admin/music-command',
    includes: [
      'Release pages and music detail flows',
      'Lyrics, artwork, video, and presave sections',
      'Fan CRM and subscriber growth points',
      'Merch drop and campaign bundle pathways',
      'Content calendar and social draft structure',
      'Launch checklist, QA, and post-release review',
    ],
    outcomes: [
      'One launch path for music, store, and fans',
      'Less repeated setup each release',
      'Cleaner connection between creative work and revenue',
    ],
  },
};

export default function ServiceSystemPage({ serviceId }) {
  const service = SERVICES[serviceId] || SERVICES['control-panels'];
  const Icon = service.icon || SlidersHorizontal;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <Link to="/systems-manager" className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-primary transition-colors">
            &lt;- Systems Manager
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary">{service.eyebrow}</span>
            </div>
            <AdminEditButton href={service.adminHref} label="Open Admin Area" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-4xl md:text-5xl text-foreground">{service.title}</h1>
            <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">{service.intro}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/systems-manager#build-form">
              <Button className="gradient-gold-button border-0 rounded-full gap-2">
                Book a Systems Audit <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Link to="/systems/case-studies/gannon-waye-music-os">
              <Button variant="outline" className="rounded-full gap-2 border-border/50">
                View Gannon Waye Example <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.header>

        <section className="grid grid-cols-1 md:grid-cols-[1fr_0.7fr] gap-5">
          <div className="bg-card border border-border/40 rounded-2xl p-7 space-y-5">
            <h2 className="font-display text-xl text-foreground">What Is Included</h2>
            <div className="grid grid-cols-1 gap-3">
              {service.includes.map((item) => (
                <div key={item} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-primary/5 border border-primary/20 rounded-2xl p-7 space-y-5">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-primary">Typical Build</p>
              <p className="font-display text-2xl text-foreground mt-2">{service.starting}</p>
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-lg text-foreground">Outcomes</h2>
              {service.outcomes.map((item) => (
                <div key={item} className="flex items-start gap-2 font-body text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="bg-card border border-border/40 rounded-2xl p-7 space-y-4">
          <h2 className="font-display text-xl text-foreground">Approval Boundaries</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            These systems can prepare drafts, checks, reports, and structured next actions. They do not change live DNS, live Stripe, marketplace listings, supplier orders, account credentials, 2FA, or final publishing without explicit approval.
          </p>
        </section>

        <section className="text-center space-y-4 py-6 border-t border-border/20">
          <p className="font-body text-sm text-muted-foreground">Want this kind of system mapped for your business?</p>
          <a href="/systems-manager#build-form">
            <Button className="gradient-gold-button border-0 rounded-full px-8 py-5 text-sm gap-2">
              Book Your Systems Audit <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </section>
      </div>
    </div>
  );
}
