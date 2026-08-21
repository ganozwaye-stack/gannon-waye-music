import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Mail } from 'lucide-react';
import { SectionCard, RowItem, LoadingState, EmptyState } from '@/components/admin-v3/shared/SharedComponents';
import { categorizeFanMessage } from '@/lib/adminV3Metrics';

const INBOX_CATEGORIES = [
  'reply_required', 'approval', 'customer', 'coaching', 'booking',
  'supporter', 'moderation', 'information',
];
const CATEGORY_LABELS = {
  reply_required: 'Reply Required',
  approval: 'Approval Required',
  customer: 'Customer or Order Matter',
  coaching: 'Coaching Enquiry',
  booking: 'Booking or Industry Opportunity',
  supporter: 'Supporter or Fan Message',
  moderation: 'Moderation Required',
  information: 'Information Only',
};

export default function FansSupport() {
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['v3-ws-subscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list('-created_date', 100),
    staleTime: 30_000,
  });
  const { data: supporters = [] } = useQuery({
    queryKey: ['v3-ws-supporters'],
    queryFn: () => base44.entities.FoundingSupporter.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: contributions = [] } = useQuery({
    queryKey: ['v3-ws-contributions'],
    queryFn: () => base44.entities.SupportContribution.list('-created_date', 50),
    staleTime: 60_000,
  });
  const { data: fanPosts = [] } = useQuery({
    queryKey: ['v3-ws-fan-posts'],
    queryFn: () => base44.entities.FanPost.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: fanComments = [] } = useQuery({
    queryKey: ['v3-ws-fan-comments'],
    queryFn: () => base44.entities.FanComment.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: fanReviews = [] } = useQuery({
    queryKey: ['v3-ws-fan-reviews'],
    queryFn: () => base44.entities.FanReview.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: fanMedia = [] } = useQuery({
    queryKey: ['v3-ws-fan-media-items'],
    queryFn: () => base44.entities.FanMedia.list('-created_date', 30),
    staleTime: 60_000,
  });
  const { data: bookings = [] } = useQuery({
    queryKey: ['v3-ws-fan-bookings'],
    queryFn: () => base44.entities.BookingEnquiry.list('-created_date', 30),
    staleTime: 30_000,
  });
  const { data: merchInterest = [] } = useQuery({
    queryKey: ['v3-ws-merch-interest'],
    queryFn: () => base44.entities.MerchInterest.list('-created_date', 30),
    staleTime: 60_000,
  });
  const { data: merchFeedback = [] } = useQuery({
    queryKey: ['v3-ws-fan-merch-feedback'],
    queryFn: () => base44.entities.MerchFeedback.list('-created_date', 30),
    staleTime: 60_000,
  });

  // ── Unified inbox ──
  const inbox = useMemo(() => {
    const all = [
      ...fanPosts.map(p => ({ ...p, _type: 'post', _category: categorizeFanMessage(p, 'post') })),
      ...fanComments.map(c => ({ ...c, _type: 'comment', _category: categorizeFanMessage(c, 'comment') })),
      ...fanReviews.map(r => ({ ...r, _type: 'review', _category: categorizeFanMessage(r, 'review') })),
      ...bookings.map(b => ({ ...b, _type: 'booking', _category: 'booking' })),
      ...merchInterest.map(m => ({ ...m, _type: 'interest', _category: 'customer' })),
      ...merchFeedback.map(f => ({ ...f, _type: 'feedback', _category: 'customer' })),
      ...fanMedia.map(m => ({ ...m, _type: 'media', _category: 'moderation' })),
      ...contributions.map(c => ({ ...c, _type: 'contribution', _category: 'supporter' })),
    ];
    return all;
  }, [fanPosts, fanComments, fanReviews, bookings, merchInterest, merchFeedback, fanMedia, contributions]);

  const byCategory = useMemo(() => {
    const groups = {};
    INBOX_CATEGORIES.forEach(c => groups[c] = []);
    inbox.forEach(item => {
      if (groups[item._category]) groups[item._category].push(item);
    });
    return groups;
  }, [inbox]);

  return (
    <div className="space-y-6">
      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Subscribers</p><p className="text-xl font-semibold text-foreground">{subscribers.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Founding Supporters</p><p className="text-xl font-semibold text-foreground">{supporters.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Support Contributions</p><p className="text-xl font-semibold text-foreground">{contributions.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Fan Messages</p><p className="text-xl font-semibold text-foreground">{inbox.length}</p></div>
      </div>

      {/* ── Unified Inbox ── */}
      <div className="border border-border/40 rounded-xl bg-card/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground">Unified Inbox</h2>
          <span className="text-[10px] text-muted-foreground/50 ml-2">{inbox.length} items aggregated from {8} sources</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {INBOX_CATEGORIES.map(cat => (
            <span key={cat} className="px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap border border-border/30 text-muted-foreground">
              {CATEGORY_LABELS[cat]} <span className="opacity-50">({byCategory[cat]?.length || 0})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Inbox categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {INBOX_CATEGORIES.map(cat => {
          const items = byCategory[cat] || [];
          if (items.length === 0) return null;
          return (
            <SectionCard key={cat} title={CATEGORY_LABELS[cat]} count={items.length}>
              {items.slice(0, 8).map(item => (
                <RowItem key={`${item._type}-${item.id}`} title={item.name || item.customer_name || item.title || item.author || 'Unknown'} subtitle={`${item._type} · ${item.email || item.message || ''}`.slice(0, 80)} status={item.status || item._type} statusLevel={cat === 'reply_required' ? 'orange' : cat === 'moderation' ? 'red' : 'grey'} path="/admin/communications-hub" />
              ))}
              {items.length > 8 && <p className="text-[10px] text-muted-foreground/40 px-3">+{items.length - 8} more</p>}
            </SectionCard>
          );
        })}
        {inbox.length === 0 && !isLoading && (
          <SectionCard title="Unified Inbox">
            <EmptyState message="No fan messages found." icon={Mail} />
          </SectionCard>
        )}
        {isLoading && <SectionCard title="Loading"><LoadingState /></SectionCard>}
      </div>

      {/* ── Supporter highlights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Founding Supporters" count={supporters.length} actionLabel="View" actionPath="/admin/supporters">
          {supporters.length === 0 ? <EmptyState message="No founding supporters." /> : supporters.slice(0, 8).map(s => (
            <RowItem key={s.id} title={s.name || s.supporter_name || 'Supporter'} subtitle={s.email || ''} status={s.tier || 'Supporter'} statusLevel="green" path="/admin/supporters" />
          ))}
        </SectionCard>

        <SectionCard title="Support Contributions" count={contributions.length} actionLabel="View" actionPath="/admin/supporters">
          {contributions.length === 0 ? <EmptyState message="No contributions." /> : contributions.slice(0, 8).map(c => (
            <RowItem key={c.id} title={c.supporter_name || c.customer_name || 'Supporter'} subtitle={`$${c.amount || 0}`} status="Contributed" statusLevel="green" path="/admin/supporters" />
          ))}
        </SectionCard>
      </div>

      {/* ── Consent notice ── */}
      <div className="border border-border/20 rounded-lg px-4 py-3 bg-card/20">
        <p className="text-[10px] text-muted-foreground/50">
          Consent and email preferences are respected. No communications are sent automatically from this dashboard. All replies require explicit action.
        </p>
      </div>
    </div>
  );
}