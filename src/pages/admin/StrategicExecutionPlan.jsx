import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const STATUS = {
  'COMPLETE': { color: 'bg-green-500/15 text-green-400 border-green-500/30', icon: CheckCircle2 },
  'BUILT — UNTESTED': { color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', icon: Clock },
  'BLOCKED': { color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: AlertTriangle },
  'AWAITING APPROVAL': { color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: Clock },
  'FAILED': { color: 'bg-red-500/15 text-red-400 border-red-500/30', icon: XCircle },
};

const SECTIONS = [
  { id: 1, title: 'Website Polish & Gold Brand', owner: 'base44', status: 'COMPLETE', nextAction: 'Run Playwright visual-brand.spec.js to confirm no yellow on public pages', blocker: null, latestResult: 'Contact page rebuilt. Booking language removed. Gold token system verified. All nav/footer/player use text-primary.', items: ['Gold token system', 'Contact page rebuilt', 'Booking language removed', 'Footer language updated', 'Spotify URL corrected'] },
  { id: 2, title: 'Store Conversion', owner: 'base44 + Gannon', status: 'BUILT — UNTESTED', nextAction: 'Run Playwright store + cart tests against live site.', blocker: 'Playwright not yet run on live site', latestResult: 'Add to Cart, Continue Shopping, View Cart, Checkout, cart drawer, sticky bar all built.', items: ['Add to Cart confirmation', 'Cart drawer', 'Sticky checkout bar', 'CartDrawer quantity controls'] },
  { id: 3, title: 'Checkout Proof', owner: 'Gannon (Stripe)', status: 'BLOCKED', nextAction: 'Complete a real test purchase: card 4242 4242 4242 4242', blocker: 'Live Stripe payment not yet tested end-to-end', latestResult: 'createCheckoutSession deployed. Promo codes, shipping, stripe redirect coded.', items: ['Checkout page', 'Promo code validation', 'Shipping calculation', 'Stripe session creation', 'Webhook on success'] },
  { id: 4, title: 'Spotify / Music Links', owner: 'base44', status: 'COMPLETE', nextAction: 'Verify Footer and Contact page show correct Spotify artist link.', blocker: null, latestResult: 'SPOTIFY_ARTIST_URL constant in config/links.js. Contact page fixed. Footer updated.', items: ['config/links.js constant', 'Contact page Spotify fixed', 'SocialLinks component'] },
  { id: 5, title: '7 Days of Thankyou Campaign', owner: 'Gannon + agents', status: 'AWAITING APPROVAL', nextAction: '1. Review 21 posts in ApprovalQueue. 2. Confirm Thankyou audio timestamps.', blocker: 'Audio timestamps not confirmed. Posts must not be scheduled until Gannon approves.', latestResult: '21 posts drafted across 7 days, 3/day. All in ApprovalQueue awaiting_approval.', items: ['21 draft posts', 'All in ApprovalQueue', 'TikTok + Instagram + Facebook', 'Audio timestamps NEED CONFIRMATION'] },
  { id: 6, title: 'Merch Campaign', owner: 'Gannon + agents', status: 'BUILT — UNTESTED', nextAction: 'Record store flow demo for CapCut. Film product shots.', blocker: 'Physical product filming not done', latestResult: 'Store live with all products. Infomercial scripts ready.', items: ['Hoodie product live', 'Tee product live', 'CD singles live', 'Bundle live'] },
  { id: 7, title: 'Founding Supporters', owner: 'base44', status: 'COMPLETE', nextAction: 'Share /founding-supporter link publicly', blocker: null, latestResult: 'FoundingSupporter entity + page built. Form captures name, email, interests, consent.', items: ['Founding Supporter page', 'Form with email/interests', 'Back This page'] },
  { id: 8, title: 'Content Engine', owner: 'agents', status: 'AWAITING APPROVAL', nextAction: 'Review ContentCalendarPost items. Approve 1 post per day.', blocker: 'All drafts awaiting approval', latestResult: 'ContentPost, ContentCalendarPost entities. generateDailyDrafts function. 21 campaign posts drafted.', items: ['ContentPost entity', 'ContentCalendarPost entity', 'generateDailyDrafts function', '21 campaign posts in ApprovalQueue'] },
  { id: 9, title: 'Metricool Scheduling', owner: 'Gannon', status: 'BUILT — UNTESTED', nextAction: 'Confirm Metricool profile ID in /admin/metricool-api-setup. Test schedule 1 post.', blocker: 'METRICOOL_BLOG_ID profile mapping not confirmed', latestResult: 'metricoolSchedulePost, metricoolDiagnostics functions deployed.', items: ['metricoolSchedulePost function', 'MetricoolApiSetup admin page'] },
  { id: 10, title: 'Testing / GitHub Actions', owner: 'Gannon + base44', status: 'BUILT — UNTESTED', nextAction: 'cd gannonwaye-playwright-pack → npx playwright install → npx playwright test', blocker: 'Tests not yet run on live site', latestResult: '6 Playwright test files. GitHub Actions workflow built.', items: ['contact-page.spec.js', 'visual-brand.spec.js', 'cart.spec.js', 'checkout.spec.js', 'store-load.spec.js', 'public-routes.spec.js'] },
  { id: 11, title: 'Security', owner: 'base44', status: 'COMPLETE', nextAction: 'No action required.', blocker: null, latestResult: 'All secrets in Deno.env. RLS enforced on all admin entities. No secrets in frontend.', items: ['No secrets in frontend', 'RLS on admin entities', 'Admin functions check user.role'] },
];

function SectionRow({ section }) {
  const [expanded, setExpanded] = useState(false);
  const statusKey = Object.keys(STATUS).find(k => section.status.includes(k.split(' ')[0])) || 'BUILT — UNTESTED';
  const statusCfg = STATUS[section.status] || STATUS['BUILT — UNTESTED'];
  const Icon = statusCfg.icon;

  return (
    <div className="bg-card border border-border/30 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-secondary/20 transition-colors">
        <span className="font-body text-sm text-muted-foreground w-6 shrink-0">{section.id}.</span>
        <span className="font-body text-sm text-foreground flex-1">{section.title}</span>
        <Badge className={`text-[9px] border shrink-0 ${statusCfg.color}`}>
          <Icon className="w-2.5 h-2.5 mr-1" />{section.status}
        </Badge>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/20 pt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Next Action</p>
              <p className="font-body text-sm text-foreground">{section.nextAction}</p>
            </div>
            {section.blocker && (
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Blocker</p>
                <p className="font-body text-sm text-red-400/80">{section.blocker}</p>
              </div>
            )}
            <div>
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Latest Result</p>
              <p className="font-body text-xs text-foreground/70">{section.latestResult}</p>
            </div>
            <div>
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Owner</p>
              <p className="font-body text-sm text-foreground">{section.owner}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {section.items.map(item => (
              <span key={item} className="px-2 py-0.5 rounded-full bg-secondary/50 border border-border/30 font-body text-[10px] text-muted-foreground">{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StrategicExecutionPlan() {
  const complete = SECTIONS.filter(s => s.status === 'COMPLETE').length;
  const blocked = SECTIONS.filter(s => s.status === 'BLOCKED' || s.status === 'FAILED').length;
  const inProgress = SECTIONS.length - complete - blocked;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground">Strategic Execution Plan</h1>
          <p className="font-body text-xs text-muted-foreground mt-1">{SECTIONS.length} areas · {complete} complete · {inProgress} in progress · {blocked} blocked</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/code-audit-command">
            <button className="px-3 py-1.5 rounded-full border border-border/40 font-body text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-all flex items-center gap-1">
              Code Audit <ExternalLink className="w-3 h-3" />
            </button>
          </Link>
          <Link to="/admin/business-attention-centre">
            <button className="px-3 py-1.5 rounded-full border border-primary/40 font-body text-xs text-primary hover:bg-primary/10 transition-all">
              Action Required
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-green-500/20 rounded-xl p-4 text-center">
          <p className="font-display text-3xl text-green-400">{complete}</p>
          <p className="font-body text-[10px] text-muted-foreground mt-1">Complete</p>
        </div>
        <div className="bg-card border border-blue-500/20 rounded-xl p-4 text-center">
          <p className="font-display text-3xl text-blue-400">{inProgress}</p>
          <p className="font-body text-[10px] text-muted-foreground mt-1">In Progress</p>
        </div>
        <div className="bg-card border border-red-500/20 rounded-xl p-4 text-center">
          <p className="font-display text-3xl text-red-400">{blocked}</p>
          <p className="font-body text-[10px] text-muted-foreground mt-1">Blocked</p>
        </div>
      </div>

      <div className="space-y-2">
        {SECTIONS.map(section => (
          <motion.div key={section.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: section.id * 0.03 }}>
            <SectionRow section={section} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}