import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Mail, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function anonymise(email) {
  if (!email) return 'A fan';
  const [user] = email.split('@');
  return user.length <= 2 ? user + '***' : user[0] + '***' + user[user.length - 1];
}

export default function RecentActivityFeed() {
  const { data: orders = [] } = useQuery({
    queryKey: ['recentOrders'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 8),
    initialData: [],
    refetchInterval: 60000,
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ['recentSubscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list('-created_date', 8),
    initialData: [],
    refetchInterval: 60000,
  });

  // Merge + sort by date
  const events = [
    ...orders.map(o => ({
      id: 'order_' + o.id,
      type: 'order',
      label: `${anonymise(o.customer_email)} placed an order`,
      date: o.created_date,
    })),
    ...subscribers.map(s => ({
      id: 'sub_' + s.id,
      type: 'subscriber',
      label: `${anonymise(s.email)} joined the community`,
      date: s.created_date,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  if (events.length === 0) return null;

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-primary" />
        <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">Recent Activity</p>
      </div>
      <div className="space-y-3">
        {events.map(ev => (
          <div key={ev.id} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              {ev.type === 'order'
                ? <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                : <Mail className="w-3.5 h-3.5 text-primary" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-foreground/80 truncate">{ev.label}</p>
            </div>
            <p className="font-body text-[10px] text-muted-foreground/50 flex-shrink-0">
              {ev.date ? formatDistanceToNow(new Date(ev.date), { addSuffix: true }) : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}