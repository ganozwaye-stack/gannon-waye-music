import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Heart, ShoppingBag, Mail, Star, ChevronRight, TrendingUp, Gift } from 'lucide-react';

const CONVERSION_LADDER = [
  { stage: 1, label: 'Unknown Visitor', desc: 'Arrives from TikTok, Spotify, or search', action: 'Capture email with lead magnet or signup form', route: '/admin/subscribers', color: 'text-muted-foreground' },
  { stage: 2, label: 'Email Subscriber', desc: 'Has joined the mailing list', action: 'Welcome sequence + community invitation', route: '/admin/newsletter', color: 'text-blue-400' },
  { stage: 3, label: 'Community Member', desc: 'Engaged with posts, left a comment', action: 'Personal reply from Gannon + featured in community', route: '/admin/fans', color: 'text-cyan-400' },
  { stage: 4, label: 'First-Time Buyer', desc: 'Purchased one merch item', action: 'Thank-you note + introduce supporter tiers', route: '/admin/orders', color: 'text-green-400' },
  { stage: 5, label: 'Repeat Buyer', desc: 'Purchased 2+ items', action: 'VIP early access + bundle offer', route: '/admin/orders', color: 'text-primary' },
  { stage: 6, label: 'Supporter / Backer', desc: 'Made a direct contribution', action: 'Personal acknowledgement + exclusive content', route: '/admin/supporters', color: 'text-yellow-400' },
  { stage: 7, label: 'Superfan', desc: 'Highest engagement + spend', action: 'Direct relationship + VIP access + advisory input', route: '/admin/fans', color: 'text-orange-400' },
];

const RETENTION_STRATEGIES = [
  { label: 'Follow-up offer after purchase', desc: 'Within 24h — complementary product recommendation', urgency: 'High' },
  { label: 'Abandoned checkout recovery', desc: 'Email sequence for incomplete purchases', urgency: 'High' },
  { label: 'Refund recovery offer', desc: 'Alternative product or discount after refund', urgency: 'Medium' },
  { label: 'Restock alert for out-of-stock interest', desc: 'Notify fans who showed interest', urgency: 'Medium' },
  { label: 'Limited-time discount for cold subscribers', desc: 'Re-engage list with exclusive offer', urgency: 'Medium' },
  { label: 'Bundle upgrade suggestion post-purchase', desc: 'Upsell bundle after single item purchase', urgency: 'Low' },
  { label: 'Personal thank-you note from Gannon', desc: 'High-value supporters and repeat buyers', urgency: 'High' },
  { label: 'Waitlist offer for upcoming product', desc: 'Build anticipation and capture intent', urgency: 'Low' },
  { label: 'Email nurture sequence (7-part)', desc: 'Story-based sequence for new subscribers', urgency: 'Medium' },
  { label: 'Supporter conversion offer for top fans', desc: 'Convert engaged fans to backers', urgency: 'Medium' },
];

function UrgencyBadge({ urgency }) {
  const c = urgency === 'High' ? 'bg-red-500/20 text-red-300' : urgency === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-secondary text-muted-foreground';
  return <Badge className={`text-xs ${c}`}>{urgency}</Badge>;
}

export default function FanConversionEngine() {
  const navigate = useNavigate();
  const { data: subscribers = [] } = useQuery({ queryKey: ['subs-conv'], queryFn: () => base44.entities.EmailSubscriber.list('-created_date', 100) });
  const { data: orders = [] } = useQuery({ queryKey: ['orders-conv'], queryFn: () => base44.entities.MerchOrder.filter({ payment_status: 'paid' }, '-created_date', 100) });
  const { data: supporters = [] } = useQuery({ queryKey: ['supporters-conv'], queryFn: () => base44.entities.SupportContribution.list('-created_date', 50) });
  const { data: comments = [] } = useQuery({ queryKey: ['comments-conv'], queryFn: () => base44.entities.FanComment.filter({ status: 'approved' }, '-created_date', 50) });

  const uniqueBuyers = [...new Set(orders.map(o => o.customer_email).filter(Boolean))].length;
  const repeatBuyers = [...new Map(orders.map(o => [o.customer_email, o])).entries()].filter(([email]) => orders.filter(o => o.customer_email === email).length > 1).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded"><ArrowLeft className="w-4 h-4" /></button>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Fan Conversion Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">Turn visitors into subscribers, buyers, and superfans</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Email Subscribers', value: subscribers.length, color: 'text-blue-400', route: '/admin/subscribers' },
          { label: 'Unique Buyers', value: uniqueBuyers, color: 'text-green-400', route: '/admin/orders' },
          { label: 'Repeat Buyers', value: repeatBuyers, color: 'text-primary', route: '/admin/orders' },
          { label: 'Supporters', value: supporters.length, color: 'text-yellow-400', route: '/admin/supporters' },
        ].map(({ label, value, color, route }) => (
          <Link key={label} to={route}>
            <Card className="hover:border-primary/40 cursor-pointer">
              <CardContent className="p-4">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Fan Conversion Ladder</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {CONVERSION_LADDER.map(({ stage, label, desc, action, route, color }) => (
            <Link key={stage} to={route}>
              <div className="flex items-start gap-4 border border-border rounded-xl p-4 hover:border-primary/40 transition-colors group">
                <span className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold shrink-0 ${color}`}>{stage}</span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${color}`}>{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                  <p className="text-xs text-foreground/70 mt-1">Action: {action}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Retention Strategies</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground mb-3">Agents may prepare these strategies. None are sent externally without Gannon's approval via the Approval Queue.</p>
          {RETENTION_STRATEGIES.map((s, i) => (
            <div key={i} className="flex items-start justify-between gap-3 border border-border rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
              <UrgencyBadge urgency={s.urgency} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { to: '/admin/newsletter', icon: Mail, label: 'Newsletter', desc: 'Email campaigns and sequences' },
          { to: '/admin/fans', icon: Users, label: 'Fan Management', desc: 'Fan profiles and engagement' },
          { to: '/admin/supporters', icon: Heart, label: 'Supporters', desc: 'Backers and contributors' },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to}>
            <Card className="hover:border-primary/40 cursor-pointer h-full">
              <CardContent className="p-4 flex items-start gap-3">
                <Icon className="w-5 h-5 text-primary shrink-0" />
                <div><p className="font-semibold text-sm">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}