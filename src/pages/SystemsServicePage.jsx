import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, Sparkles } from 'lucide-react';

const PAGES = {
  'cinematic-websites': {
    eyebrow: 'Cinematic Web Designs',
    title: 'Premium websites that feel built, not templated.',
    intro: 'Cinematic landing pages, scroll-based storytelling, animated sections, product showcases, release pages, and mobile-first experiences built to make visitors trust the brand before they buy.',
    bullets: ['Full visual direction', 'Motion-ready page sections', 'Release and product storytelling', 'Mobile-first interaction', 'Admin edit handoff'],
    proof: 'Best for artists, creators, launches, campaigns, founders and service brands that need the first impression to carry weight.',
  },
  'social-automation': {
    eyebrow: 'Automated Social Workflows',
    title: 'Turn social media into a managed creative pipeline.',
    intro: 'Ideas, captions, visuals, hooks, hashtags, approvals, scheduling readiness, brand rules and reporting in one place.',
    bullets: ['Content intake and brief generation', 'AI draft preparation', 'Approval queue routing', 'Metricool-ready scheduling flow', 'Monthly performance review'],
    proof: 'Best for creators and businesses tired of scattered notes, random captions, and last-minute posting panic.',
  },
  'dropshipping-inventory': {
    eyebrow: 'Dropshipping Inventory Systems',
    title: 'A command centre for sourcing, margins and product launch control.',
    intro: 'A central system to identify products, compare suppliers, calculate landed costs, prepare listings, approve launches and avoid supplier chaos.',
    bullets: ['Supplier and sourcing queue', 'Margin calculator', 'Product image lab', 'Risk flags', 'Publishing readiness status'],
    proof: 'Best for ecommerce operators who need product decisions tied to real profit logic.',
  },
  'control-panels': {
    eyebrow: 'Central Control Panels',
    title: 'One operating dashboard for the moving parts that matter.',
    intro: 'Orders, content, approvals, agents, site health, revenue, tasks, missing items and human action required in a single view.',
    bullets: ['Business priority feed', 'System warnings', 'Revenue blockers', 'Task routing', 'Admin-ready next actions'],
    proof: 'Best for owners who want clarity without hunting through ten different tabs.',
  },
  'ecommerce-merch-stores': {
    eyebrow: 'E-commerce & Merch Stores',
    title: 'Stores that connect product data, checkout flow and admin control.',
    intro: 'Product displays, pricing consistency, cart flow, customer details, checkout readiness, order visibility and post-sale communication paths.',
    bullets: ['Product cards that route correctly', 'Cart and checkout readiness', 'Promo eligibility clarity', 'Order/admin visibility', 'Customer communication hooks'],
    proof: 'Best for merch, physical products, bundles, artist collections and limited drops.',
  },
  'approval-workflows': {
    eyebrow: 'Approval Workflows',
    title: 'Move quickly without letting risky actions slip through.',
    intro: 'Approval gates for content, offers, pricing, publishing, legal-sensitive copy, agent work and anything that could cost money or damage trust.',
    bullets: ['Approval queue design', 'Risk labels', 'Decision history', 'Agent handoff rules', 'No-spend/no-loss controls'],
    proof: 'Best for AI-assisted businesses that need automation without losing control.',
  },
  'ai-content-systems': {
    eyebrow: 'AI Content Systems',
    title: 'A content engine that drafts, routes, and protects the brand.',
    intro: 'Agent-assisted content pipelines for captions, hooks, post ideas, product copy, SEO, customer support, and campaign planning with human approval before anything publishes.',
    bullets: ['Brand voice rules', 'Hook and caption drafts', 'Campaign calendars', 'Approval queue before publishing', 'Performance feedback loop'],
    proof: 'Best for creators and small businesses that need consistent content without sounding generic.',
  },
  'artist-release-systems': {
    eyebrow: 'Artist Release Systems',
    title: 'Music release operations in one clear command flow.',
    intro: 'Release campaigns, fan CRM, merch, email lists, content calendars, social drafts, store flows, lyrics, music pages, and campaign assets connected into one artist operating system.',
    bullets: ['Release page and lyric flow', 'Fan CRM and subscriber capture', 'Merch and support tie-ins', 'Social content calendar', 'Post-release growth dashboard'],
    proof: 'Best for independent artists who need release momentum without juggling scattered tools.',
  },
  'client-portals': {
    eyebrow: 'Client Portals',
    title: 'A private workspace for briefs, approvals, uploads, and delivery.',
    intro: 'Client portals keep project requests, files, status updates, approvals, onboarding, and next steps in one place so the business does not rely on memory or message threads.',
    bullets: ['Client intake', 'Upload hub', 'Approval checkpoints', 'Status timeline', 'Delivery notes'],
    proof: 'Best for service businesses, creative studios, agencies, coaches, and consultants.',
  },
  'automation-retainers': {
    eyebrow: 'Automation Retainers',
    title: 'Ongoing systems care for businesses that cannot afford decay.',
    intro: 'Monthly diagnostics, broken-link checks, workflow maintenance, automation tuning, content pipeline adjustments, and reporting to keep the system useful after launch.',
    bullets: ['Monthly systems audit', 'Broken link checks', 'Workflow tuning', 'Report summary', 'Priority fix queue'],
    proof: 'Best for owners who want the system maintained without having to become the technician.',
  },
};

const PACKAGES = {
  'creator-launch-system': {
    eyebrow: 'Build Package',
    title: 'Creator Launch System',
    intro: 'For artists, creators, coaches, and small brands needing a premium launch presence without building a giant platform on day one.',
    bullets: ['Cinematic landing page', 'Mobile-first design', 'Contact and lead form', 'Newsletter placeholder', 'Basic CRM dashboard', 'Launch sections', 'Social links', 'Basic SEO', 'Admin edit controls'],
    proof: 'From $1,500 AUD. Final scope is proposal-based and nothing is purchased or started without approval.',
  },
  'ecommerce-setup': {
    eyebrow: 'Build Package',
    title: 'E-commerce Setup',
    intro: 'For brands selling products, merch, or digital offers who need store structure, product flow, cart readiness, and admin controls.',
    bullets: ['Storefront', 'Product manager', 'Product pages', 'Cart flow', 'Stripe/payment readiness', 'Promo structure', 'Order dashboard', 'Product image workflow', 'Policy pages', 'Basic SEO'],
    proof: 'From $2,900 AUD. Payment systems and live checkout changes remain approval-gated.',
  },
  'systems-manager-retainer': {
    eyebrow: 'Build Package',
    title: 'Systems Manager Retainer',
    intro: 'For businesses that already have systems but need ongoing diagnostics, updates, automation support, testing, content workflow maintenance, and system health monitoring.',
    bullets: ['Monthly systems audit', 'Playwright/test checks', 'Broken link checks', 'Dashboard maintenance', 'Content workflow updates', 'Automation tuning', 'Report summary', 'Priority fix queue'],
    proof: 'From $800/mo AUD. No subscription is started without approval.',
  },
  'ai-content-operating-system': {
    eyebrow: 'Build Package',
    title: 'AI Content Operating System',
    intro: 'A structured content production system for brands that need ideas, hooks, captions, briefs, review, approval, and campaign learning in one workflow.',
    bullets: ['Brand voice profile', 'Prompt library', 'Campaign calendar', 'Content draft queue', 'Approval guard', 'Performance review'],
    proof: 'From $2,400 AUD setup plus optional support.',
  },
  'dropshipping-command-centre': {
    eyebrow: 'Build Package',
    title: 'Dropshipping Command Centre',
    intro: 'A control system for product sourcing, supplier comparisons, margin planning, listing readiness, product imagery, launch approvals, and risk flags.',
    bullets: ['Product sourcing queue', 'Supplier manager', 'Margin calculator', 'Product image workflow', 'Launch calendar', 'Risk flags', 'Approval queue'],
    proof: 'From $3,500 AUD. Supplier purchases and paid tools stay approval-gated.',
  },
  'artist-release-os': {
    eyebrow: 'Build Package',
    title: 'Artist Release OS',
    intro: 'An operating system for independent artists who need music pages, lyrics, merch, fan CRM, subscriber growth, content planning, and release campaign tracking connected.',
    bullets: ['Release hub', 'Lyrics manager', 'Fan CRM', 'Merch tie-ins', 'Email capture', 'Social content plan', 'Post-release growth dashboard'],
    proof: 'From $2,900 AUD. Public campaign actions remain approval-gated.',
  },
  'full-business-command-system': {
    eyebrow: 'Build Package',
    title: 'Full Business Command System',
    intro: 'A larger owner command system connecting public website, CRM, ecommerce, approvals, content operations, analytics, tasks, and internal dashboards.',
    bullets: ['Public website', 'CRM', 'Store or service flow', 'Approval workflows', 'Admin command centre', 'Reporting', 'Training handoff', 'Risk controls'],
    proof: 'From $6,500 AUD. Scoped carefully so money, legal, and publishing risks are controlled.',
  },
};

const CASE_STUDIES = {
  'gannon-waye-music-os': {
    eyebrow: 'Case Study',
    title: 'Gannon Waye Music Operating System',
    intro: 'A live artist platform connecting release pages, store, support, subscribers, content workflows, admin command layers and approval-gated automation.',
    bullets: ['Artist release flow', 'Store and subscriber capture', 'Admin command centre', 'Content and social planning', 'Approval-gated agent structure'],
    proof: 'This is the working proof: a real music business being organized into one operating system.',
  },
  'ganozmix-direct': {
    eyebrow: 'Case Study',
    title: 'GanozMix Direct Commerce System',
    intro: 'A dropshipping and ecommerce model designed around product sourcing, supplier evidence, landed cost planning, profit logic and listing control.',
    bullets: ['Product sourcing workflow', 'Supplier comparison', 'Profit and margin view', 'Listing readiness', 'Evidence-first operating model'],
    proof: 'Built for ecommerce growth without losing track of cost, supplier risk and publishing state.',
  },
};

export default function SystemsServicePage({ caseStudy = false, packagePage = false }) {
  const { slug } = useParams();
  const page = packagePage ? PACKAGES[slug] : caseStudy ? CASE_STUDIES[slug] : PAGES[slug];

  if (!page) {
    return (
      <div className="min-h-screen px-4 py-28 max-w-3xl mx-auto">
        <Link to="/systems-manager" className="text-primary text-sm">Back to Systems Manager</Link>
        <h1 className="font-display text-4xl mt-6">System page not found</h1>
        <p className="font-body text-muted-foreground mt-3">This route exists so it can be connected, but the matching page content has not been configured yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        <Link to="/systems-manager" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Systems Manager
        </Link>

        <section className="relative mt-10 rounded-[2rem] border border-primary/25 bg-card/45 p-6 sm:p-10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_25%_15%,rgba(245,208,110,0.14),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_32%)]" />
          <div className="relative z-10 grid lg:grid-cols-[1fr_0.85fr] gap-10 items-center">
            <div>
              <Badge className="bg-primary/10 border border-primary/30 text-primary">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> {page.eyebrow}
              </Badge>
              <h1 className="font-display text-4xl sm:text-6xl text-foreground leading-tight mt-5">{page.title}</h1>
              <p className="font-body text-lg text-foreground/68 leading-relaxed mt-6">{page.intro}</p>
              <a href="#audit">
                <Button className="gradient-gold-button border-0 rounded-full mt-7 gap-2">Book a Systems Audit <ArrowRight className="w-4 h-4" /></Button>
              </a>
            </div>

            <div className="rounded-2xl border border-border/40 bg-secondary/25 p-5">
              <div className="grid gap-3">
                {page.bullets.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-border/30 bg-card/40 p-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-foreground/75">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-8">
          {['Strategy Map', 'Build Proof', 'Approval Safety'].map((label, i) => (
            <div key={label} className="rounded-2xl border border-border/40 bg-card/35 p-5">
              <Layers3 className="w-5 h-5 text-primary mb-4" />
              <h2 className="font-display text-xl text-foreground">{label}</h2>
              <p className="font-body text-sm text-foreground/60 mt-3">
                {i === 0 && 'The page starts by mapping the actual business problem instead of selling generic software.'}
                {i === 1 && page.proof}
                {i === 2 && 'Money, legal, pricing, publishing and reputation-risk actions stay approval-gated.'}
              </p>
            </div>
          ))}
        </section>

        <section id="audit" className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="font-display text-2xl text-foreground">Want this mapped for your business?</p>
          <p className="font-body text-sm text-foreground/62 mt-2">Start with a systems audit. No paid build or subscription starts without approval.</p>
          <Link to="/systems-manager#build-form">
            <Button className="gradient-gold-button border-0 rounded-full mt-5">Request Audit</Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
