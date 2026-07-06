import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, Heart, DollarSign, Zap, ArrowRight, Music, Scroll } from 'lucide-react';

const PUBLIC_COACHING_PAGES = [
  { path: '/coaching', title: 'Coaching Home', desc: 'Main coaching landing page with overview of all programs and offers.' },
  { path: '/coaching/self-worth-reset', title: 'Self-Worth Reset', desc: 'A focused reset program for rebuilding self-worth after difficult experiences.' },
  { path: '/coaching/boundaries', title: 'Boundaries', desc: 'Learn to set and maintain healthy boundaries in relationships and life.' },
  { path: '/coaching/creative-confidence', title: 'Creative Confidence', desc: 'Reclaim your creative voice and build confidence in your artistic expression.' },
  { path: '/coaching/workbooks', title: 'Coaching Workbooks', desc: 'Downloadable workbooks and exercises to support your coaching journey.' },
  { path: '/coaching/intake', title: 'Coaching Intake', desc: 'Intake form for new coaching clients to share their background and goals.' },
  { path: '/coaching/client-resources', title: 'Client Resources', desc: 'Resource library for existing coaching clients.' },
];

const ADMIN_COACHING_PAGES = [
  { path: '/admin/coaching-hub', title: 'Coaching Hub', desc: 'Central admin dashboard for all coaching operations.' },
  { path: '/admin/coaching-leads', title: 'Coaching Leads', desc: 'Manage incoming coaching leads and enquiries.' },
  { path: '/admin/coaching-intakes', title: 'Coaching Intakes', desc: 'Review submitted intake forms from potential clients.' },
  { path: '/admin/coaching-clients', title: 'Coaching Clients', desc: 'Manage active coaching clients and their progress.' },
  { path: '/admin/coaching-content-engine', title: 'Content Engine', desc: 'Generate and manage coaching-related content.' },
  { path: '/admin/coaching-programs', title: 'Coaching Programs', desc: 'Configure coaching program offerings and pricing.' },
  { path: '/admin/coaching-legal', title: 'Coaching Legal', desc: 'Legal documents and compliance for coaching services.' },
  { path: '/admin/coaching-launch-control', title: 'Launch Control', desc: 'Manage the launch sequence for coaching offerings.' },
  { path: '/admin/coaching-roi', title: 'Coaching ROI', desc: 'Track return on investment and outcomes for coaching programs.' },
  { path: '/admin/coaching-sales-funnel', title: 'Sales Funnel', desc: 'Manage the coaching sales funnel and conversion pipeline.' },
  { path: '/admin/coaching-content-library', title: 'Content Library', desc: 'Library of coaching content, resources, and materials.' },
  { path: '/admin/meditation-library', title: 'Meditation Library', desc: 'Manage guided meditations and audio resources.' },
  { path: '/admin/client-management', title: 'Client Management', desc: 'Detailed client management and session tracking.' },
  { path: '/admin/appointment-scheduler', title: 'Appointment Scheduler', desc: 'Schedule and manage coaching appointments.' },
  { path: '/admin/workbook-builder', title: 'Workbook Builder', desc: 'Create and edit coaching workbooks.' },
  { path: '/admin/client-resource-library', title: 'Client Resource Library', desc: 'Manage resources available to coaching clients.' },
  { path: '/admin/social-drafts', title: 'Social Drafts', desc: 'Coaching-related social media draft content.' },
  { path: '/admin/coaching-command', title: 'Coaching Command', desc: 'High-level command centre for coaching operations.' },
  { path: '/admin/coaching-launch-control', title: 'Launch Control', desc: 'Launch sequence management.' },
];

const MONETIZATION_STRATEGY = [
  {
    icon: DollarSign,
    title: '1:1 Coaching Sessions',
    pricing: '$150–$300 per session',
    desc: 'Private coaching sessions via video call. Premium pricing for personalized guidance on self-worth, boundaries, and creative confidence.',
    execution: 'Use the Appointment Scheduler to manage bookings. Intake form filters serious clients. Payment via Stripe before session.',
  },
  {
    icon: BookOpen,
    title: 'Self-Paced Workbooks',
    pricing: '$29–$79 per workbook',
    desc: 'Downloadable workbooks for self-worth reset, boundaries, and creative confidence. Clients work through exercises at their own pace.',
    execution: 'Built in Workbook Builder. Sold via the store checkout. Delivered as digital download after purchase.',
  },
  {
    icon: Users,
    title: 'Group Programs',
    pricing: '$199–$499 per program',
    desc: 'Cohort-based group coaching programs (4–8 weeks). Lower per-person price but higher total revenue. Builds community.',
    execution: 'Market via email list and socials. Intake form for screening. Payment plans available via Stripe.',
  },
  {
    icon: Zap,
    title: 'Quick-Reset Sessions',
    pricing: '$49 per 15-min session',
    desc: 'Short, focused sessions for immediate support. Lower barrier to entry — converts leads into paying clients.',
    execution: 'Booked via Appointment Scheduler. Payment upfront via Stripe. Great entry point for upselling full programs.',
  },
  {
    icon: Scroll,
    title: 'Meditation Library',
    pricing: '$9/month or $79/year',
    desc: 'Subscription access to guided meditations and audio resources. Recurring revenue stream.',
    execution: 'Content managed in Meditation Library. Subscription via Stripe. Marketed alongside coaching programs.',
  },
  {
    icon: FileText,
    title: 'Resource Bundle',
    pricing: '$129 bundle',
    desc: 'Workbook + meditation access + 1 quick-reset session. Best value bundle that drives higher average order value.',
    execution: 'Sold via store checkout. Bundles increase perceived value and total revenue per client.',
  },
];

const PROMOTION_CHANNELS = [
  { channel: 'Email List', action: 'Send dedicated coaching email to all subscribers. Feature the self-worth reset program as the lead offer.', icon: '📧' },
  { channel: 'Instagram', action: 'Post reels showing coaching transformations. Use ManyChat keyword COACH to DM the intake link.', icon: '📸' },
  { channel: 'TikTok', action: 'Short videos sharing boundary-setting tips. Link in bio to coaching intake page.', icon: '🎵' },
  { channel: 'Website', action: 'Add coaching CTA to Home page, Music page, and Mum Tribute page. Cross-promote with music releases.', icon: '🌐' },
  { channel: 'ManyChat', action: 'Set up COACH, BOUNDARIES, and WORTH keywords to auto-respond with coaching intake links.', icon: '🤖' },
  { channel: 'Word of Mouth', action: 'Offer existing clients a free session for referring new paying clients. Build referral loop.', icon: '💬' },
];

export default function CoachingOverview() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
        <h1 className="font-display text-3xl text-foreground flex items-center gap-3">
          <Heart className="w-7 h-7 text-primary/60" />
          Coaching Overview
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Complete guide to all coaching pages, monetization strategy, and promotion plan.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Public Pages', value: PUBLIC_COACHING_PAGES.length, sub: 'Client-facing' },
          { label: 'Admin Pages', value: ADMIN_COACHING_PAGES.length, sub: 'Management tools' },
          { label: 'Revenue Streams', value: MONETIZATION_STRATEGY.length, sub: 'Monetization options' },
          { label: 'Promo Channels', value: PROMOTION_CHANNELS.length, sub: 'Marketing routes' },
        ].map(s => (
          <div key={s.label} className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
            <p className="font-display text-2xl text-primary">{s.value}</p>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{s.label}</p>
            <p className="font-body text-[9px] text-muted-foreground/50 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Public Coaching Pages */}
      <section className="mb-10">
        <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary/60" />
          Public Coaching Pages
        </h2>
        <div className="grid gap-3">
          {PUBLIC_COACHING_PAGES.map(page => (
            <Link key={page.path} to={page.path}
              className="block bg-card/40 border border-border/30 rounded-xl p-4 hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{page.title}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{page.desc}</p>
                  <p className="font-body text-[10px] text-primary/50 mt-1">{page.path}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Admin Coaching Pages */}
      <section className="mb-10">
        <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary/60" />
          Admin Coaching Pages
        </h2>
        <div className="grid gap-2">
          {ADMIN_COACHING_PAGES.map(page => (
            <Link key={page.path} to={page.path}
              className="block bg-card/30 border border-border/20 rounded-lg p-3 hover:border-primary/20 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-foreground">{page.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">{page.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Monetization Strategy */}
      <section className="mb-10">
        <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary/60" />
          Monetization Strategy
        </h2>
        <div className="grid gap-3">
          {MONETIZATION_STRATEGY.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card/40 border border-border/30 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                      <span className="font-body text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{item.pricing}</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2">{item.desc}</p>
                    <div className="bg-secondary/30 rounded-lg p-3 mt-3">
                      <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Quick Execution</p>
                      <p className="font-body text-xs text-foreground/70">{item.execution}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Promotion Plan */}
      <section className="mb-10">
        <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary/60" />
          Promotion Plan
        </h2>
        <div className="grid gap-2">
          {PROMOTION_CHANNELS.map(item => (
            <div key={item.channel} className="bg-card/30 border border-border/20 rounded-lg p-4 flex items-start gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{item.channel}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Launch Checklist */}
      <section className="mb-10">
        <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
          <Music className="w-5 h-5 text-primary/60" />
          Quick Launch Checklist
        </h2>
        <div className="bg-card/40 border border-border/30 rounded-xl p-5 space-y-3">
          {[
            'Set pricing for each coaching program in /admin/coaching-programs',
            'Review and finalize intake form questions at /admin/coaching-intakes',
            'Upload workbooks to /admin/workbook-builder',
            'Add meditation audio files to /admin/meditation-library',
            'Configure appointment availability in /admin/appointment-scheduler',
            'Set up ManyChat keywords (COACH, BOUNDARIES, WORTH) linking to /coaching/intake',
            'Add coaching CTA to Home page and Music page',
            'Send launch email to subscriber list via /admin/newsletter',
            'Post coaching reels to Instagram and TikTok',
            'Create coaching bundle in store for $129 bundle offer',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <p className="font-body text-sm text-foreground/70">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Submit Your Own Documents */}
      <section>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <h2 className="font-display text-xl text-foreground mb-3">Your Own Documents</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            You mentioned you'll be submitting your own coaching documents. Once you upload them, I can integrate them into the system,
            create new pages from them, or use them to enhance existing coaching programs. Just upload the files to chat and let me know
            where you'd like them to go.
          </p>
        </div>
      </section>
    </div>
  );
}