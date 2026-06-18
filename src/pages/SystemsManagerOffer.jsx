import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight, CheckCircle2, Cpu, Layers3, Layout, RefreshCw, Send,
  ShieldCheck, ShoppingCart, Sparkles, Workflow, Zap, PenTool, Music2, Users, Repeat
} from 'lucide-react';
import { routeForIntent } from '@/config/intentRoutes';

const SERVICES = [
  {
    intent: 'service_cinematic_websites',
    slug: 'cinematic-websites',
    title: 'Cinematic Websites',
    icon: Layout,
    price: 'From $1,500 AUD',
    cta: 'View Cinematic Website Systems',
    desc: 'Premium websites that do not look like templates. Cinematic landing pages, scroll-based storytelling, release pages, product showcases, and mobile-first experiences built to make visitors believe in the brand before they buy.',
  },
  {
    intent: 'service_automated_social_workflows',
    slug: 'social-automation',
    title: 'Automated Social Workflows',
    icon: Workflow,
    price: 'From $800/mo AUD',
    cta: 'View Social Workflow Systems',
    desc: 'A managed pipeline for ideas, captions, visuals, hashtags, approvals, scheduling readiness, content calendars, and reporting in one place.',
  },
  {
    intent: 'service_dropshipping_dashboards',
    slug: 'dropshipping-inventory',
    title: 'Dropshipping Dashboards',
    icon: ShoppingCart,
    price: 'From $3,500 AUD',
    cta: 'View Dropshipping Systems',
    desc: 'A central product command centre for sourcing queues, supplier checks, margin calculators, launch calendars, risk flags, and publishing status.',
  },
  {
    intent: 'service_control_panels',
    slug: 'control-panels',
    title: 'Central Dashboard Control Panels',
    icon: Cpu,
    price: 'From $2,400 AUD',
    cta: 'View Control Panel Systems',
    desc: 'Instead of guessing what is broken, missing, delayed, or costing money, your business gets one operating dashboard showing what matters and what needs approval.',
  },
  {
    intent: 'service_ecommerce_merch_stores',
    slug: 'ecommerce-merch-stores',
    title: 'E-commerce & Merch Stores',
    icon: Layers3,
    price: 'From $2,900 AUD',
    cta: 'View Store Systems',
    desc: 'Connected stores with product data, checkout readiness, customer flow, order visibility, stock controls, and admin editing built around real selling.',
  },
  {
    intent: 'service_approval_workflows',
    slug: 'approval-workflows',
    title: 'Approval Workflows',
    icon: ShieldCheck,
    price: 'From $1,800 AUD',
    cta: 'View Approval Systems',
    desc: 'Approval gates for content, offers, pricing, publishing, legal-sensitive copy, and agent actions so the system moves quickly without risking the business.',
  },
  {
    intent: 'service_ai_content_systems',
    slug: 'ai-content-systems',
    title: 'AI Content Systems',
    icon: PenTool,
    price: 'From $2,400 AUD setup',
    cta: 'View AI Content Systems',
    desc: 'Agent-assisted content pipelines for captions, hooks, post ideas, product copy, SEO, customer support, and campaign planning with human approval before anything publishes.',
  },
  {
    intent: 'service_artist_release_systems',
    slug: 'artist-release-systems',
    title: 'Artist Release Systems',
    icon: Music2,
    price: 'From $2,900 AUD',
    cta: 'View Artist Release Systems',
    desc: 'Release campaigns, fan CRM, merch, email lists, content calendars, social drafts, store flows, lyrics, music pages, and campaign assets connected into one artist operating system.',
  },
  {
    intent: 'service_client_portals',
    slug: 'client-portals',
    title: 'Client Portals',
    icon: Users,
    price: 'Proposal-based',
    cta: 'View Client Portal Systems',
    desc: 'Private workspaces for briefs, uploads, approvals, tasks, status updates, onboarding, and client communication so project delivery is easier to manage.',
  },
  {
    intent: 'service_automation_retainers',
    slug: 'automation-retainers',
    title: 'Automation Retainers',
    icon: Repeat,
    price: 'From $800/mo AUD',
    cta: 'View Automation Retainers',
    desc: 'Ongoing diagnostics, content workflow maintenance, link checks, automation tuning, reporting, and priority fixes for businesses that need systems kept alive.',
  },
];

const PACKAGES = [
  {
    intent: 'package_creator_launch_system',
    slug: 'creator-launch-system',
    title: 'Creator Launch System',
    price: 'From $1,500 AUD',
    cta: 'Start Creator Launch',
    desc: 'For artists, creators, coaches, and small brands needing a premium launch presence. Includes cinematic landing page, list capture, basic CRM dashboard, social links, SEO, mobile optimisation, and admin edit controls.',
  },
  {
    intent: 'package_ecommerce_setup',
    slug: 'ecommerce-setup',
    title: 'E-commerce Setup',
    price: 'From $2,900 AUD',
    cta: 'Build My Store',
    desc: 'For brands selling products, merch, or digital offers. Includes storefront, product manager, cart readiness, promo structure, order dashboard, image workflow, policy pages, SEO, and admin controls.',
  },
  {
    intent: 'package_systems_manager_retainer',
    slug: 'systems-manager-retainer',
    title: 'AI Systems Manager Retainer',
    price: 'From $800/mo AUD',
    cta: 'Book Systems Retainer',
    desc: 'Ongoing monthly audit, Playwright checks, broken-link reviews, dashboard maintenance, content workflow updates, automation tuning, report summary, and priority fix queue.',
  },
  {
    intent: 'package_ai_content_operating_system',
    slug: 'ai-content-operating-system',
    title: 'AI Content Operating System',
    price: 'From $2,400 AUD setup + support',
    cta: 'Map My Content OS',
    desc: 'Content intake, brand rules, campaign calendar, caption drafts, creative briefs, approval queues, and performance review structure.',
  },
  {
    intent: 'package_dropshipping_command_centre',
    slug: 'dropshipping-command-centre',
    title: 'Dropshipping Command Centre',
    price: 'From $3,500 AUD',
    cta: 'Build My Product System',
    desc: 'Supplier comparison, product sourcing, landed cost planning, listing workflow, visual asset pipeline, launch checklist, and approval control.',
  },
  {
    intent: 'package_artist_release_os',
    slug: 'artist-release-os',
    title: 'Artist Release OS',
    price: 'From $2,900 AUD',
    cta: 'Plan My Release System',
    desc: 'Music pages, lyrics, release campaign hub, fan CRM, email capture, merch tie-ins, content calendar, and post-release growth workflow.',
  },
  {
    intent: 'package_full_business_command_system',
    slug: 'full-business-command-system',
    title: 'Full Business Command System',
    price: 'From $6,500 AUD',
    cta: 'Scope Full System',
    desc: 'A larger operating system combining website, CRM, ecommerce, dashboards, approvals, content, reporting, task routing, and owner command views.',
  },
];

export default function SystemsManagerOffer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    business_name: '',
    links: '',
    business_type: 'creator',
    problem: '',
    current_systems: '',
    automation_wishlist: '',
    selling_type: '',
    system_need: '',
    preferred_contact_method: 'email',
    budget_range: '$1k - $3k',
    urgency: 'medium',
  });

  useEffect(() => {
    let active = true;
    base44.auth.me()
      .then(user => {
        if (active) setIsAdmin(user?.role === 'admin');
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.problem) {
      toast({ title: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await base44.entities.SystemsManagerLead.create({
        ...form,
        proposal_status: 'received',
      }).then(async (lead) => {
        await Promise.allSettled([
          base44.entities.AdminNotification.create({
            notification_type: 'system',
            severity: form.urgency === 'high' ? 'high' : 'info',
            title: 'New Systems Audit Request',
            summary: `${form.name} asked for help with ${form.business_type}. ${form.problem.slice(0, 180)}`,
            source: 'SystemsManagerOffer',
            requires_action: true,
            linked_entity: 'SystemsManagerLead',
            linked_id: lead?.id,
            linked_route: '/admin/owner-business?tab=leads',
          }),
          base44.entities.ActionItem.create({
            title: `Review systems audit request from ${form.name}`,
            category: 'Marketing',
            priority: form.urgency === 'high' ? 'high' : 'medium',
            status: 'todo',
            notes: form.problem,
            suggested_by: 'SystemsManagerOffer',
            linked_route: '/admin/owner-business?tab=leads',
            linked_entity: 'SystemsManagerLead',
            linked_id: lead?.id,
            source: 'SystemsManagerOffer',
          }),
        ]);
      });
      toast({ title: 'Systems audit request received', description: 'Gannon will review your setup and reply with the clearest next step.' });
      setForm({
        name: '',
        email: '',
        business_name: '',
        links: '',
        business_type: 'creator',
        problem: '',
        current_systems: '',
        automation_wishlist: '',
        selling_type: '',
        system_need: '',
        preferred_contact_method: 'email',
        budget_range: '$1k - $3k',
        urgency: 'medium',
      });
    } catch {
      toast({ title: 'Submission failed', description: 'Could not save the request. Please try again.', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <section className="relative min-h-[86vh] px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,208,110,0.12),transparent_32%),radial-gradient(circle_at_75%_55%,rgba(255,255,255,0.06),transparent_30%)]" />
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              style={{ left: `${8 + i * 9}%`, top: `${18 + (i % 5) * 14}%` }}
              animate={{ opacity: [0.15, 0.7, 0.15], x: [0, 24, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="space-y-7">
            <Badge className="bg-primary/10 border border-primary/30 text-primary w-fit">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> AI-Powered Systems Manager
            </Badge>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-tight text-foreground">
              AI-Powered Systems for Creators, Artists & Small Businesses
            </h1>
            <p className="font-body text-lg text-foreground/70 max-w-2xl leading-relaxed">
              I design cinematic websites, automated content systems, ecommerce dashboards, approval workflows, and central control panels that turn scattered operations into one clear business machine.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#build-form">
                <Button className="gradient-gold-button border-0 rounded-full px-6 gap-2">Book a Systems Audit <ArrowRight className="w-4 h-4" /></Button>
              </a>
              <a href="#demos">
                <Button variant="outline" className="rounded-full border-primary/30 gap-2">View Live System Demos</Button>
              </a>
              <a href="#packages">
                <Button variant="ghost" className="rounded-full gap-2">See Build Packages</Button>
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2rem] border border-primary/25 bg-card/40 p-5 shadow-2xl shadow-black/40 backdrop-blur"
          >
            <div className="grid grid-cols-2 gap-3">
              {['Leads', 'Content', 'Orders', 'Approvals', 'Agents', 'Risks'].map((label, i) => (
                <motion.div
                  key={label}
                  className="rounded-2xl border border-border/40 bg-secondary/35 p-4 min-h-28"
                  animate={{ y: [0, i % 2 ? 8 : -8, 0] }}
                  transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{label}</p>
                  <p className="font-display text-3xl gradient-gold-glow mt-3">{i % 2 ? 'Live' : 'Ready'}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="font-body text-xs text-primary/80">Proof: the Gannon Waye Music platform itself is the working case study.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="demos" className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">What I Build & Automate</h2>
            <p className="font-body text-sm text-foreground/60 mt-3">
              Every system is built around how your business actually works: your offers, content, customers, approvals, products, bottlenecks, and growth goals. I do not just build pages. I build connected workflows that help you see what is happening, fix what is missing, and move faster without everything living in your head.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.intent}
                  className="group rounded-2xl border border-border/40 bg-card/45 p-5 min-h-64 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <Link to={routeForIntent(service.intent)} className="block">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl text-foreground">{service.title}</h3>
                    <p className="font-body text-xs text-primary mt-2">{service.price}</p>
                    <p className="font-body text-sm text-foreground/62 leading-relaxed mt-3">{service.desc}</p>
                    <span className="inline-flex items-center gap-1 mt-5 font-body text-xs tracking-wider uppercase text-primary">
                      {service.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to={`/admin/services/${service.slug}`}
                      className="inline-flex items-center rounded-full border border-primary/25 px-3 py-1 text-[11px] uppercase tracking-wider text-primary hover:bg-primary/10 mt-4"
                    >
                      Edit service page
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="packages" className="px-4 sm:px-6 lg:px-8 py-16 border-y border-border/30 bg-secondary/10">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">Build Packages</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {PACKAGES.map(pack => (
              <div key={pack.title} className="rounded-2xl border border-primary/20 bg-card/55 p-6 hover:border-primary/45 hover:bg-primary/5 transition-all">
                <Link to={routeForIntent(pack.intent)} className="block">
                  <Badge className="bg-primary/15 text-primary border border-primary/25 mb-4">Package</Badge>
                  <h3 className="font-display text-xl text-foreground">{pack.title}</h3>
                  <p className="font-display text-2xl gradient-gold-glow mt-3">{pack.price}</p>
                  <p className="font-body text-sm text-foreground/62 leading-relaxed mt-4">{pack.desc}</p>
                  <Button variant="outline" className="w-full mt-6 border-primary/30 rounded-full">{pack.cta}</Button>
                </Link>
                {isAdmin && (
                  <Link
                    to={`/admin/packages/${pack.slug}`}
                    className="inline-flex items-center rounded-full border border-primary/25 px-3 py-1 text-[11px] uppercase tracking-wider text-primary hover:bg-primary/10 mt-4"
                  >
                    Edit package
                  </Link>
                )}
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground">
            Pricing is proposal-based. No subscription, ad spend, or paid tool connection is started without approval.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5">
          <Link to={routeForIntent('case_study_gannon_waye_music_os')} className="rounded-2xl border border-border/40 bg-card/45 p-6 hover:border-primary/40 transition-all">
            <Zap className="w-5 h-5 text-primary mb-4" />
            <h3 className="font-display text-2xl text-foreground">Gannon Waye Music OS</h3>
            <p className="font-body text-sm text-foreground/62 mt-3">Artist website, store, subscriber capture, social planning, approval queues, release content, and admin command layers.</p>
          </Link>
          <Link to={routeForIntent('case_study_ganozmix_direct')} className="rounded-2xl border border-border/40 bg-card/45 p-6 hover:border-primary/40 transition-all">
            <ShoppingCart className="w-5 h-5 text-primary mb-4" />
            <h3 className="font-display text-2xl text-foreground">GanozMix Direct</h3>
            <p className="font-body text-sm text-foreground/62 mt-3">Dropshipping and ecommerce operating model: product sourcing, supplier tracking, margin analysis, and listing workflow.</p>
          </Link>
        </div>
      </section>

      <section id="build-form" className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto rounded-2xl border border-primary/25 bg-card/60 p-6 sm:p-8">
          <h2 className="font-display text-3xl text-foreground">Book a Systems Audit</h2>
          <p className="font-body text-sm text-foreground/60 mt-2 mb-6">Tell me what feels messy, manual, delayed, duplicated, or impossible to track. I will map the system you actually need.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">Your Name *</Label>
                <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email Address *</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="business_name" className="text-xs">Business Name</Label>
                <Input id="business_name" value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="links" className="text-xs">Website / Social Links</Label>
                <Input id="links" value={form.links} onChange={e => setForm(f => ({ ...f, links: e.target.value }))} />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Business Type</Label>
                <Select value={form.business_type} onValueChange={v => setForm(f => ({ ...f, business_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creator">Creator / Artist</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="service">Service Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Budget Range</Label>
                <Select value={form.budget_range} onValueChange={v => setForm(f => ({ ...f, budget_range: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_1k">Under $1k</SelectItem>
                    <SelectItem value="$1k - $3k">$1k - $3k</SelectItem>
                    <SelectItem value="$3k - $5k">$3k - $5k</SelectItem>
                    <SelectItem value="above_5k">$5k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Urgency</Label>
                <Select value={form.urgency} onValueChange={v => setForm(f => ({ ...f, urgency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Flexible</SelectItem>
                    <SelectItem value="medium">2-4 weeks</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="problem" className="text-xs">What needs to become easier, clearer, or more profitable? *</Label>
              <Textarea id="problem" value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} rows={5} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="current_systems" className="text-xs">What systems are you using now?</Label>
              <Textarea id="current_systems" value={form.current_systems} onChange={e => setForm(f => ({ ...f, current_systems: e.target.value }))} rows={3} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="automation_wishlist" className="text-xs">What do you wish was automated?</Label>
              <Textarea id="automation_wishlist" value={form.automation_wishlist} onChange={e => setForm(f => ({ ...f, automation_wishlist: e.target.value }))} rows={3} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="selling_type" className="text-xs">What do you sell?</Label>
                <Input id="selling_type" placeholder="Products, services, music..." value={form.selling_type} onChange={e => setForm(f => ({ ...f, selling_type: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="system_need" className="text-xs">What do you need?</Label>
                <Input id="system_need" placeholder="Website, dashboard, store..." value={form.system_need} onChange={e => setForm(f => ({ ...f, system_need: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Preferred Contact</Label>
                <Select value={form.preferred_contact_method} onValueChange={v => setForm(f => ({ ...f, preferred_contact_method: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full gradient-gold-button border-0 rounded-full gap-2">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting</> : <><Send className="w-4 h-4" /> Send Audit Request</>}
            </Button>
          </form>

          <div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <p>No paid action, publishing action, price change, or system commitment happens without approval.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
