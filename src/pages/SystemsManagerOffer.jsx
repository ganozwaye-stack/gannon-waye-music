import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Layout, ShoppingCart, ShieldCheck,
  Cpu, Music, Package, RefreshCw, Send, Star, Zap,
  CheckCircle2, ExternalLink
} from 'lucide-react';

const SERVICE_CARDS = [
  {
    icon: Layout,
    title: 'Cinematic Websites',
    copy: 'Premium animated websites with parallax, particles, scroll-based storytelling, mobile-first layouts, and conversion-focused sections that make your brand feel alive instead of templated.',
    from: 'From $1,500 AUD',
    cta: 'View Cinematic Website Systems',
    href: '/systems/cinematic-websites',
    color: 'from-amber-500/10 to-transparent',
    border: 'border-amber-500/20',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce & Merch Stores',
    copy: 'Stripe-ready stores with product pages, cart flows, promo rules, order tracking, inventory panels, margin visibility, and admin controls for products, images, pricing, and campaigns.',
    from: 'From $2,900 AUD',
    cta: 'View Store Systems',
    href: '/systems/ecommerce-merch-stores',
    color: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Approval Workflows',
    copy: 'Approval queues for content, products, visuals, captions, discounts, supplier actions, and publishing — so your system can move fast without going public before you approve it.',
    from: 'From $1,200 AUD',
    cta: 'View Approval Systems',
    href: '/systems/approval-workflows',
    color: 'from-green-500/10 to-transparent',
    border: 'border-green-500/20',
  },
  {
    icon: Cpu,
    title: 'AI Content Systems',
    copy: 'Agent-assisted content pipelines for captions, hooks, post ideas, product copy, SEO, customer support, and campaign planning — with human approval before anything publishes.',
    from: 'From $2,400 AUD',
    cta: 'View AI Content Systems',
    href: '/systems/ai-content-systems',
    color: 'from-purple-500/10 to-transparent',
    border: 'border-purple-500/20',
  },
  {
    icon: Package,
    title: 'Dropshipping Dashboards',
    copy: 'Product sourcing, supplier comparison, pricing, shipping risk, product image workflow, listing builder, and approval tools brought into one clean control system.',
    from: 'From $3,500 AUD',
    cta: 'View Dropshipping Systems',
    href: '/systems/dropshipping-inventory',
    color: 'from-orange-500/10 to-transparent',
    border: 'border-orange-500/20',
  },
  {
    icon: Music,
    title: 'Artist Release Systems',
    copy: 'Release campaigns, fan CRM, merch, email lists, content calendars, social drafts, store flows, lyrics, music pages, and campaign assets connected into one artist operating system.',
    from: 'From $2,900 AUD',
    cta: 'View Artist Release Systems',
    href: '/systems/artist-release-systems',
    color: 'from-pink-500/10 to-transparent',
    border: 'border-pink-500/20',
  },
];

const PACKAGES = [
  {
    title: 'Creator Launch System',
    price: 'From $1,500',
    badge: 'Entry',
    badgeColor: 'bg-secondary text-muted-foreground',
    copy: 'For artists, creators, coaches, and small brands needing a premium launch presence. Includes a cinematic landing page, contact/list capture, basic CRM dashboard, content sections, mobile optimisation, and launch-ready structure.',
    includes: ['Cinematic landing page', 'Mobile-first design', 'Contact/lead form', 'Newsletter placeholder', 'Basic CRM dashboard', 'Social links', 'Basic SEO', 'Admin edit controls'],
    cta: 'Start Creator Launch',
    href: '#build-form',
  },
  {
    title: 'E-commerce Setup',
    price: 'From $2,900',
    badge: 'Popular',
    badgeColor: 'bg-primary/20 text-primary border border-primary/30',
    copy: 'For brands selling products, merch, or digital offers. Includes store structure, product pages, cart/checkout readiness, promo code structure, inventory/admin panels, and customer trust pages.',
    includes: ['Storefront & product manager', 'Cart & checkout flow', 'Stripe/payment readiness', 'Promo structure', 'Order dashboard', 'Product image workflow', 'Policy pages', 'Admin controls'],
    cta: 'Build My Store',
    href: '#build-form',
  },
  {
    title: 'Systems Manager Retainer',
    price: 'From $800/mo',
    badge: 'Ongoing',
    badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    copy: 'For businesses that already have systems but need ongoing diagnostics, updates, automation support, testing, content workflow maintenance, and system health monitoring.',
    includes: ['Monthly systems audit', 'Broken link checks', 'Dashboard maintenance', 'Content workflow updates', 'Automation tuning', 'Priority fix queue', 'Report summary'],
    cta: 'Book Systems Retainer',
    href: '#build-form',
  },
  {
    title: 'AI Content Operating System',
    price: 'From $2,400 + monthly',
    badge: 'AI',
    badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    copy: 'Full AI-driven content pipeline: idea intake, caption drafts, approval queue, scheduling readiness, brand rules, and monthly performance review.',
    includes: ['AI draft engine', 'Approval queue', 'Content calendar', 'Brand rules', 'Scheduling readiness', 'Performance reporting'],
    cta: 'Start AI System',
    href: '#build-form',
  },
  {
    title: 'Dropshipping Command Centre',
    price: 'From $3,500',
    badge: 'Commerce',
    badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    copy: 'Product sourcing, supplier workflow, margin calculator, image lab, approval queue, launch calendar, risk flags, and publishing status in one dashboard.',
    includes: ['Product sourcing queue', 'Supplier manager', 'Margin calculator', 'Image lab', 'Approval queue', 'Launch calendar'],
    cta: 'Build My Dashboard',
    href: '#build-form',
  },
  {
    title: 'Full Business Command System',
    price: 'From $6,500',
    badge: 'Enterprise',
    badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    copy: 'The complete operating system: website, store, approvals, AI agents, order management, analytics, social pipeline, and a central command dashboard that shows your whole business at once.',
    includes: ['All modules included', 'Central command dashboard', 'AI agents', 'Full order management', 'Analytics', 'Priority support'],
    cta: 'Enquire Now',
    href: '#build-form',
  },
];

const PROOF_CARDS = [
  {
    title: 'Gannon Waye Music OS',
    icon: Star,
    tag: 'Artist Platform',
    copy: 'A complete artist platform built to handle releases, merch, mailing list growth, fan CRM, Stripe-backed store flows, promo code logic, admin notifications, lyrics pages, content approval workflows, and release campaign management.',
    href: '/systems/case-studies/gannon-waye-music-os',
    adminLinks: [
      { label: 'Master Blueprint', href: '/admin/master-blueprint' },
      { label: 'Site Health', href: '/admin/site-health' },
      { label: 'Orders', href: '/admin/orders' },
    ],
    color: 'border-amber-500/30',
    glow: 'from-amber-500/5',
  },
  {
    title: 'GanozMix Direct',
    icon: Zap,
    tag: 'Dropshipping OS',
    copy: 'A dropshipping and ecommerce command system designed to connect product research, supplier comparison, product listings, margin checks, shipping risk, visual assets, social drafts, and publishing approvals.',
    href: '/systems/case-studies/ganozmix-direct',
    adminLinks: [
      { label: 'GanozMix Admin', href: '/admin/ganozmix' },
      { label: 'Procurement', href: '/admin/procurement-command' },
    ],
    color: 'border-blue-500/30',
    glow: 'from-blue-500/5',
  },
];

export default function SystemsManagerOffer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    business_name: '',
    website_links: '',
    business_type: 'creator',
    budget_range: '$1k - $3k',
    urgency: 'medium',
    current_bottleneck: '',
    current_tools: '',
    wish_automated: '',
    selling_type: '',
    needs: '',
    contact_method: 'email',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.current_bottleneck) {
      toast({ title: 'Please fill in required fields.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await base44.entities.BookingEnquiry.create({
        name: form.name,
        email: form.email,
        enquiry_type: 'systems_audit',
        notes: JSON.stringify(form),
        status: 'new',
      });
      await base44.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'info',
        title: `New Systems Audit Request — ${form.name}`,
        summary: `${form.business_type} | Budget: ${form.budget_range} | ${form.current_bottleneck.slice(0, 100)}`,
        requires_action: true,
        is_read: false,
      });
      setSubmitted(true);
      toast({ title: 'Request received!', description: "Gannon will review and get back to you." });
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── HERO ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-7">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary font-body">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Systems Manager
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight">
            AI-Powered Systems for <br />
            <span className="gradient-gold-text">Creators, Artists & Small Businesses</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="font-body text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            I design cinematic websites, automated content systems, ecommerce dashboards, approval workflows, and central control panels that turn scattered operations into one clear business machine.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 pt-2">
            <a href="#build-form">
              <Button className="gradient-gold-button border-0 px-7 py-5 text-sm font-semibold rounded-full gap-2">
                Book a Systems Audit <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="#proof">
              <Button variant="outline" className="px-7 py-5 text-sm font-semibold rounded-full gap-2 border-border/50">
                View Live System Demos <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <a href="#packages">
              <Button variant="ghost" className="px-7 py-5 text-sm rounded-full gap-2">
                See Build Packages
              </Button>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 pt-6 border-t border-border/20 mt-8">
            {[
              { label: 'Systems Built', value: '3+' },
              { label: 'Modules Automated', value: '80+' },
              { label: 'Stack', value: 'React · Stripe · AI' },
              { label: 'Based In', value: 'Australia' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-xl text-primary">{s.value}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHAT I BUILD ── */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">What I Build & Automate</h2>
            <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every system is built around how your business actually works — your offers, content, customers, approvals, products, bottlenecks, and growth goals. I do not just build pages. I build connected workflows that help you see what is happening, fix what is missing, and move faster without everything living in your head.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.a
                  key={card.title}
                  href={card.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`block bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-6 space-y-4 cursor-pointer group transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-card/60 border border-border/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-foreground mb-1.5">{card.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{card.copy}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <span className="font-body text-xs text-primary">{card.from}</span>
                    <span className="font-body text-[10px] text-muted-foreground group-hover:text-primary transition-colors">
                      {card.cta} →
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section id="packages" className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">Predefined Build Packages</h2>
            <p className="font-body text-sm text-muted-foreground">Fixed-scope packages for common system builds.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PACKAGES.map((pack, i) => (
              <motion.div
                key={pack.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-body text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${pack.badgeColor}`}>
                    {pack.badge}
                  </span>
                  <span className="font-display text-lg text-primary">{pack.price} AUD</span>
                </div>
                <div>
                  <h3 className="font-display text-base text-foreground mb-2">{pack.title}</h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{pack.copy}</p>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {pack.includes.map(item => (
                    <li key={item} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={pack.href}>
                  <Button variant="outline" className="w-full text-xs rounded-full border-border/40 hover:border-primary/40 hover:text-primary transition-colors">
                    {pack.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF OF ARCHITECTURE ── */}
      <section id="proof" className="py-16 px-4 bg-secondary/10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">Proof of Architecture</h2>
            <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
              Recent production systems built, repaired, or managed through the same operating principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PROOF_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${card.glow} to-card border ${card.color} rounded-2xl p-6 space-y-4 group`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-secondary text-muted-foreground border-border/30 text-[10px] mb-2">{card.tag}</Badge>
                      <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                        {card.title} <Icon className="w-4 h-4 text-primary" />
                      </h3>
                    </div>
                  </div>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{card.copy}</p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
                    <a href={card.href} className="inline-flex items-center gap-1 font-body text-xs text-primary hover:underline">
                      View Case Study <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AUDIT FORM ── */}
      <section id="build-form" className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-primary/10 to-transparent px-8 py-7 border-b border-border/30">
              <h2 className="font-display text-2xl text-foreground">Book a Systems Audit</h2>
              <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">
                Tell me what feels messy, manual, delayed, duplicated, or impossible to track. I'll map the system you actually need.
              </p>
            </div>

            {submitted ? (
              <div className="p-10 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                <h3 className="font-display text-xl text-foreground">Request Received</h3>
                <p className="font-body text-sm text-muted-foreground">Gannon will review your systems request and get back to you shortly.</p>
                <Button variant="outline" className="rounded-full mt-2" onClick={() => setSubmitted(false)}>Submit Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Name *</Label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name" className="bg-secondary/30 text-xs border-border/40" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Email *</Label>
                    <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com" className="bg-secondary/30 text-xs border-border/40" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Business Name</Label>
                    <Input value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
                      placeholder="Your business" className="bg-secondary/30 text-xs border-border/40" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Website / Social Links</Label>
                    <Input value={form.website_links} onChange={e => setForm(f => ({ ...f, website_links: e.target.value }))}
                      placeholder="gannonwaye.com or @handle" className="bg-secondary/30 text-xs border-border/40" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Business Type</Label>
                    <Select value={form.business_type} onValueChange={v => setForm(f => ({ ...f, business_type: v }))}>
                      <SelectTrigger className="bg-secondary/30 border-border/40 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="creator">Creator / Artist</SelectItem>
                        <SelectItem value="ecommerce">E-commerce / Merch</SelectItem>
                        <SelectItem value="coach">Coach / Service Provider</SelectItem>
                        <SelectItem value="agency">Agency / Consulting</SelectItem>
                        <SelectItem value="dropshipping">Dropshipping</SelectItem>
                        <SelectItem value="other">Other Small Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Project Budget AUD</Label>
                    <Select value={form.budget_range} onValueChange={v => setForm(f => ({ ...f, budget_range: v }))}>
                      <SelectTrigger className="bg-secondary/30 border-border/40 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_1k">Under $1k</SelectItem>
                        <SelectItem value="$1k - $3k">$1k – $3k</SelectItem>
                        <SelectItem value="$3k - $5k">$3k – $5k</SelectItem>
                        <SelectItem value="$5k - $10k">$5k – $10k</SelectItem>
                        <SelectItem value="above_10k">$10k+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground">Current bottleneck — what is most broken or manual? *</Label>
                  <Textarea value={form.current_bottleneck}
                    onChange={e => setForm(f => ({ ...f, current_bottleneck: e.target.value }))}
                    placeholder="e.g. I spend 3 hours a day manually posting content and tracking orders in spreadsheets..."
                    rows={3} className="bg-secondary/30 text-xs border-border/40" required />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground">What systems/tools are you using now?</Label>
                  <Input value={form.current_tools} onChange={e => setForm(f => ({ ...f, current_tools: e.target.value }))}
                    placeholder="Shopify, Notion, spreadsheets, nothing..." className="bg-secondary/30 text-xs border-border/40" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground">What do you wish was automated?</Label>
                  <Input value={form.wish_automated} onChange={e => setForm(f => ({ ...f, wish_automated: e.target.value }))}
                    placeholder="e.g. content drafts, order notifications, approval routing..." className="bg-secondary/30 text-xs border-border/40" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">You are selling...</Label>
                    <Select value={form.selling_type} onValueChange={v => setForm(f => ({ ...f, selling_type: v }))}>
                      <SelectTrigger className="bg-secondary/30 border-border/40 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="products">Physical Products</SelectItem>
                        <SelectItem value="services">Services / Consulting</SelectItem>
                        <SelectItem value="content">Content / Music</SelectItem>
                        <SelectItem value="subscriptions">Subscriptions</SelectItem>
                        <SelectItem value="mix">A mix of the above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Preferred contact</Label>
                    <Select value={form.contact_method} onValueChange={v => setForm(f => ({ ...f, contact_method: v }))}>
                      <SelectTrigger className="bg-secondary/30 border-border/40 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="instagram">Instagram DM</SelectItem>
                        <SelectItem value="phone">Phone / WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" disabled={loading}
                  className="w-full gradient-gold-button border-0 py-5 text-sm font-semibold gap-2 rounded-full">
                  {loading
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting...</>
                    : <><Send className="w-4 h-4" /> Book Systems Audit</>}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}