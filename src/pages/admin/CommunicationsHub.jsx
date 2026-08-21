import { useQueries } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, ShoppingCart, Heart, Users, MessageCircle, BookOpen, Star, TrendingUp,
  DollarSign, AlertTriangle, Clock, ArrowRight, Sparkles, Network, Zap, Bell, Package, FileText, Video, Calendar, Gift,
  ChevronRight, Target, Music
} from 'lucide-react';

const COMMUNICATION_SOURCES = [
  { key: 'orders', label: 'Store Orders', entity: 'MerchOrder', icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10', route: '/admin/orders' },
  { key: 'subscribers', label: 'Email Subscribers', entity: 'EmailSubscriber', icon: Mail, color: 'text-green-400', bg: 'bg-green-500/10', route: '/admin/subscribers' },
  { key: 'supporters', label: 'Support Contributions', entity: 'SupportContribution', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10', route: '/admin/supporters' },
  { key: 'fanposts', label: 'Fan Posts', entity: 'FanPost', icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', route: '/admin/fan-media' },
  { key: 'fanmedia', label: 'Fan Media', entity: 'FanMedia', icon: Video, color: 'text-indigo-400', bg: 'bg-indigo-500/10', route: '/admin/fan-media' },
  { key: 'fancomments', label: 'Fan Comments', entity: 'FanComment', icon: MessageCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/10', route: '/admin/fans' },
  { key: 'bookings', label: 'Booking Enquiries', entity: 'BookingEnquiry', icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10', route: '/admin/coaching-leads' },
  { key: 'leads', label: 'Coaching Leads', entity: 'CoachingLead', icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10', route: '/admin/coaching-leads' },
  { key: 'intakes', label: 'Coaching Intakes', entity: 'CoachingIntake', icon: BookOpen, color: 'text-teal-400', bg: 'bg-teal-500/10', route: '/admin/coaching-intakes' },
  { key: 'feedback', label: 'Merch Feedback', entity: 'MerchFeedback', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10', route: '/admin/merch-feedback' },
  { key: 'reviews', label: 'Product Reviews', entity: 'ProductReview', icon: Star, color: 'text-lime-400', bg: 'bg-lime-500/10', route: '/admin/merch' },
  { key: 'interest', label: 'Merch Interest', entity: 'MerchInterest', icon: Package, color: 'text-rose-400', bg: 'bg-rose-500/10', route: '/admin/merch' },
  { key: 'giftclaims', label: 'Gift Claims', entity: 'GiftClaim', icon: Gift, color: 'text-violet-400', bg: 'bg-violet-500/10', route: '/admin/gift-claims' },
  { key: 'notifications', label: 'System Alerts', entity: 'AdminNotification', icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10', route: '/admin/notifications' },
];

const REVENUE_IDEAS = [
  { title: 'Launch VIP Supporter Tier', desc: 'Create a $50/mo subscription tier with exclusive unreleased demos, behind-the-scenes content, and early access to tickets.', potential: '$2,000+/mo', icon: DollarSign, priority: 'high' },
  { title: 'Bundle Merch + Digital Album', desc: 'Create bundle offers combining physical merch with digital album download for 20% premium over individual items.', potential: '+30% AOV', icon: Package, priority: 'high' },
  { title: 'Sync Licensing Push', desc: 'Submit tracks to music supervisors for film/TV placement. Each placement = $2,000-$50,000+', potential: '$10k-$50k per placement', icon: Music, priority: 'high' },
  { title: 'Coaching Upsell to Fans', desc: 'Your most engaged fans are prime coaching clients. Add a coaching CTA to fan welcome emails.', potential: '$2,400/client', icon: Users, priority: 'medium' },
  { title: 'Systems Manager Retainer', desc: 'Offer your platform as a service to other artists. 3 clients at $800/mo = $2,400/mo recurring.', potential: '$2,400+/mo recurring', icon: Network, priority: 'high' },
  { title: 'Memorial Merch Line', desc: 'Create memorial-themed merch tied to the Mum Tribute page. Emotional connection = higher conversion.', potential: '$1,000-$5,000', icon: Heart, priority: 'medium' },
  { title: 'Birthday Discount Automation', desc: 'Already running. Expand to include personalized merch recommendations in birthday emails.', potential: '+15% birthday sales', icon: Gift, priority: 'low' },
  { title: 'Pre-Save Campaign Expansion', desc: 'Run pre-save for every release. Pre-savers convert to streamers at 80%+ rate.', potential: '+5,000 streams/release', icon: Sparkles, priority: 'medium' },
];

const OUTREACH_TARGETS = [
  { category: 'Playlist Curators', desc: 'Submit to Spotify editorial and user-curated playlists', action: 'Build pitch list, submit weekly', icon: Music },
  { category: 'Music Blogs', desc: 'Pitch to indie music blogs for features and reviews', action: 'Research 20 blogs, send personalized pitches', icon: FileText },
  { category: 'Podcast Appearances', desc: 'Get booked on music and storytelling podcasts', action: 'Find 10 podcasts, pitch your story', icon: Video },
  { category: 'Sync Licensing Agents', desc: 'Connect with music supervisors for film/TV placements', action: 'Research 5 agents, send catalog', icon: Network },
  { category: 'Venue Bookers', desc: 'Reach out to venues for live performance opportunities', action: 'Contact 10 venues, send press kit', icon: Calendar },
  { category: 'Brand Partnerships', desc: 'Partner with brands aligned with your values (1800RESPECT, etc.)', action: 'Identify 5 brands, pitch collaboration', icon: Target },
  { category: 'Other Artists', desc: 'Collaborate with complementary artists for cross-promotion', action: 'Find 5 artists, propose collaboration', icon: Users },
  { category: 'Influencer Outreach', desc: 'Send music to micro-influencers for organic mentions', action: 'Find 20 influencers, send personalized DMs', icon: Sparkles },
];

const AUTOMATION_SUGGESTIONS = [
  { title: 'Abandoned Cart Recovery', desc: 'Email visitors who add to cart but dont checkout within 1 hour. Recovers 10-15% of lost sales.', impact: 'High revenue', icon: ShoppingCart },
  { title: 'Welcome Email Sequence', desc: '5-part automated welcome sequence for new subscribers (day 0, 1, 3, 7, 14).', impact: 'High engagement', icon: Mail },
  { title: 'Re-engagement Campaign', desc: 'Email subscribers who havent opened in 30 days with a special offer.', impact: 'Medium retention', icon: Users },
  { title: 'Post-Purchase Review Request', desc: 'Email customers 7 days after delivery asking for a product review.', impact: 'Medium social proof', icon: Star },
  { title: 'Weekly Metrics Digest', desc: 'Monday morning email summarizing last weeks streams, sales, subscribers, and engagement.', impact: 'High visibility', icon: TrendingUp },
  { title: 'Inventory Reorder Alerts', desc: 'Auto-create purchase orders when stock hits reorder threshold.', impact: 'Medium operations', icon: Package },
  { title: 'Fan Milestone Rewards', desc: 'Auto-send special offers when fans hit engagement milestones (5 posts, 1 year, etc.).', impact: 'Medium loyalty', icon: Gift },
  { title: 'Social Cross-Posting', desc: 'Auto-post Instagram content to TikTok and YouTube Shorts simultaneously.', impact: 'Medium reach', icon: Zap },
];

function StatCard({ source, count, latest }) {
  const Icon = source.icon;
  return (
    <Link to={source.route} className="block">
      <div className={`rounded-2xl border border-border/40 ${source.bg} p-4 hover:border-primary/30 transition-all group`}>
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-card/60 border border-border/30 flex items-center justify-center">
            <Icon className={`w-4 h-4 ${source.color}`} />
          </div>
          {count > 0 && <span className="font-display text-2xl text-foreground">{count}</span>}
        </div>
        <p className="font-body text-xs text-muted-foreground group-hover:text-foreground transition-colors">{source.label}</p>
        {latest && <p className="font-body text-[10px] text-muted-foreground/50 mt-1 truncate">{latest}</p>}
      </div>
    </Link>
  );
}

function PriorityItem({ icon: Icon, title, desc, action, route, priority }) {
  const priorityColors = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-amber-500/30 bg-amber-500/5',
    low: 'border-blue-500/30 bg-blue-500/5',
  };
  return (
    <div className={`rounded-xl border ${priorityColors[priority] || priorityColors.medium} p-4 flex items-start gap-3`}>
      <div className="w-8 h-8 rounded-lg bg-card/60 border border-border/30 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-display text-sm text-foreground">{title}</h4>
          {priority === 'high' && <span className="text-[9px] uppercase tracking-wider text-red-400 font-semibold">Urgent</span>}
        </div>
        <p className="font-body text-xs text-muted-foreground mb-2 leading-relaxed">{desc}</p>
        {action && route && (
          <Link to={route} className="inline-flex items-center gap-1 font-body text-xs text-primary hover:underline">
            {action} <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

function RevenueIdeaCard({ idea }) {
  const Icon = idea.icon;
  const priorityColors = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-amber-500/30 bg-amber-500/5',
    low: 'border-blue-500/30 bg-blue-500/5',
  };
  return (
    <div className={`rounded-xl border ${priorityColors[idea.priority]} p-4`}>
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-card/60 border border-border/30 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-green-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-display text-sm text-foreground">{idea.title}</h4>
          <p className="font-body text-xs text-green-400/80 mt-0.5 font-semibold">{idea.potential}</p>
        </div>
      </div>
      <p className="font-body text-xs text-muted-foreground leading-relaxed">{idea.desc}</p>
    </div>
  );
}

export default function CommunicationsHub() {
  // Call all queries at top level using useQueries
  const queryConfigs = COMMUNICATION_SOURCES.map(source => ({
    queryKey: [`commhub_${source.entity}`],
    queryFn: () => base44.entities[source.entity].list('-created_date', 50),
    staleTime: 30_000,
    retry: 1,
  }));

  const queryResults = useQueries(queryConfigs);

  // Build data map
  const dataMap = {};
  COMMUNICATION_SOURCES.forEach((source, i) => {
    dataMap[source.key] = queryResults[i]?.data || [];
  });

  const unreadNotifications = (dataMap.notifications || []).filter(n => !n.is_read);
  const newBookings = (dataMap.bookings || []).filter(b => b.status === 'new');
  const newLeads = (dataMap.leads || []).filter(l => l.status === 'new' || l.status === 'contacted');
  const pendingOrders = (dataMap.orders || []).filter(o => o.status === 'pending' || o.status === 'paid');

  const priorityItems = [
    ...(unreadNotifications.length > 0 ? [{
      icon: Bell, title: `${unreadNotifications.length} unread system alerts`,
      desc: 'System notifications need your review — may include risk alerts, order issues, or growth opportunities.',
      action: 'Review alerts', route: '/admin/notifications', priority: 'high',
    }] : []),
    ...(pendingOrders.length > 0 ? [{
      icon: ShoppingCart, title: `${pendingOrders.length} orders need attention`,
      desc: 'Orders pending fulfilment. Process these to maintain customer satisfaction.',
      action: 'View orders', route: '/admin/orders', priority: 'high',
    }] : []),
    ...(newBookings.length > 0 ? [{
      icon: Calendar, title: `${newBookings.length} new booking enquiries`,
      desc: 'People want to book you. Respond within 24 hours for best conversion.',
      action: 'View bookings', route: '/admin/coaching-leads', priority: 'high',
    }] : []),
    ...(newLeads.length > 0 ? [{
      icon: Users, title: `${newLeads.length} coaching leads to follow up`,
      desc: 'Potential coaching clients waiting for response. Every day of delay reduces conversion.',
      action: 'Follow up', route: '/admin/coaching-leads', priority: 'high',
    }] : []),
    {
      icon: TrendingUp, title: 'Daily sales tracking ran last night',
      desc: "Check yesterday's revenue summary and today's projections.",
      action: 'View financials', route: '/admin/financials', priority: 'medium',
    },
    {
      icon: FileText, title: 'Review content drafts',
      desc: 'AI-generated social posts are waiting for approval before publishing.',
      action: 'Review content', route: '/admin/content-studio', priority: 'medium',
    },
    {
      icon: Sparkles, title: 'Release prep checklist',
      desc: 'Ensure your next release has all assets, links, and promotional materials ready.',
      action: 'View release sprint', route: '/admin/release-sprint', priority: 'medium',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="text-center py-2">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">Unified Operations</p>
        <h1 className="font-display text-3xl md:text-4xl text-foreground">Communications Command Centre</h1>
        <p className="font-body text-sm text-muted-foreground mt-2">Every conversation, every signal, every opportunity — in one place.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {COMMUNICATION_SOURCES.map(source => {
          const data = dataMap[source.key] || [];
          const latest = data[0];
          let latestLabel = '';
          if (latest) {
            latestLabel = latest.name || latest.email || latest.title || latest.notification_type || '';
          }
          return <StatCard key={source.key} source={source} count={data.length} latest={latestLabel} />;
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Priority Items */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-lg text-foreground">Priority Actions</h2>
            <span className="font-body text-xs text-muted-foreground">— Do these first</span>
          </div>
          <div className="space-y-3">
            {priorityItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <PriorityItem {...item} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: Revenue Ideas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <h2 className="font-display text-lg text-foreground">Revenue Opportunities</h2>
            <span className="font-body text-xs text-muted-foreground">— Ways to make more</span>
          </div>
          <div className="space-y-3">
            {REVENUE_IDEAS.map((idea, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <RevenueIdeaCard idea={idea} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Outreach & Networking */}
      <div className="bg-card border border-border/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg text-foreground">Industry Outreach & Networking</h2>
          <span className="font-body text-xs text-muted-foreground">— Build your empire</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OUTREACH_TARGETS.map((target, i) => {
            const Icon = target.icon;
            return (
              <div key={i} className="rounded-xl border border-border/40 bg-secondary/10 p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <h4 className="font-display text-sm text-foreground">{target.category}</h4>
                </div>
                <p className="font-body text-xs text-muted-foreground mb-2 leading-relaxed">{target.desc}</p>
                <p className="font-body text-[10px] text-primary/70">{target.action}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automation Recommendations */}
      <div className="bg-card border border-border/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="font-display text-lg text-foreground">Automation Recommendations</h2>
          <span className="font-body text-xs text-muted-foreground">— Systems to install</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AUTOMATION_SUGGESTIONS.map((suggestion, i) => {
            const Icon = suggestion.icon;
            return (
              <div key={i} className="rounded-xl border border-border/40 bg-secondary/10 p-4 hover:border-primary/30 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-card/60 border border-border/30 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="font-body text-[9px] text-muted-foreground uppercase tracking-wider">{suggestion.impact}</span>
                </div>
                <h4 className="font-display text-sm text-foreground mb-1">{suggestion.title}</h4>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{suggestion.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Communications Feed */}
      <div className="bg-card border border-border/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg text-foreground">Recent Communications</h2>
          <span className="font-body text-xs text-muted-foreground">— Latest from all sources</span>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {COMMUNICATION_SOURCES.map(source => {
            const data = dataMap[source.key] || [];
            const Icon = source.icon;
            return data.slice(0, 3).map((item, i) => {
              const label = item.name || item.email || item.title || item.notification_type || 'Untitled';
              const detail = item.notes || item.message || item.summary || item.description || '';
              const date = item.created_date ? new Date(item.created_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : '';
              return (
                <Link key={`${source.key}-${i}`} to={source.route} className="flex items-center gap-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 p-3 transition-colors">
                  <Icon className={`w-4 h-4 ${source.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-foreground truncate">{label}</p>
                    {detail && <p className="font-body text-[10px] text-muted-foreground truncate">{String(detail).slice(0, 100)}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-body text-[10px] text-muted-foreground">{source.label}</span>
                    {date && <span className="font-body text-[10px] text-muted-foreground/50">{date}</span>}
                  </div>
                </Link>
              );
            });
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 justify-center">
        {COMMUNICATION_SOURCES.map(source => {
          const Icon = source.icon;
          return (
            <Link key={source.key} to={source.route} className={`flex items-center gap-1.5 px-3 py-2 rounded-full ${source.bg} border border-border/40 hover:border-primary/30 transition-colors`}>
              <Icon className={`w-3 h-3 ${source.color}`} />
              <span className="font-body text-xs text-foreground/70">{source.label}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}