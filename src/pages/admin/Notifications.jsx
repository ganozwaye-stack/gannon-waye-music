import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bell, CheckCheck, ShoppingBag, MessageCircle, AlertTriangle, Zap, TrendingUp, Star, Mail, Hash, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

const TYPE_CONFIG = {
  order: { icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Order' },
  comment: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Comment' },
  reply: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Reply' },
  approval: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Approval' },
  risk_alert: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Risk' },
  community_report: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Report' },
  viral_opportunity: { icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Viral' },
  high_value_supporter: { icon: Star, color: 'text-primary', bg: 'bg-primary/10', label: 'VIP' },
  automation_failed: { icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10', label: 'System' },
  email_failed: { icon: Mail, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Email' },
  payment_warning: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Payment' },
  growth_spike: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Growth' },
  system: { icon: Hash, color: 'text-muted-foreground', bg: 'bg-muted', label: 'System' },
};

const SEVERITY_COLORS = { critical: 'bg-red-500/20 text-red-400', high: 'bg-orange-500/20 text-orange-400', warning: 'bg-yellow-500/20 text-yellow-400', info: 'bg-blue-500/20 text-blue-400' };

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => base44.entities.AdminNotification.list('-created_date', 100),
    refetchInterval: 15000,
  });

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.AdminNotification.update(id, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-notifications'] }),
  });

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => base44.entities.AdminNotification.update(n.id, { is_read: true })));
    queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    toast.success('All notifications marked as read');
  };

  const unread = notifications.filter(n => !n.is_read);
  const requiresAction = notifications.filter(n => n.requires_action && !n.is_read);
  const orders = notifications.filter(n => n.notification_type === 'order');
  const community = notifications.filter(n => ['comment', 'reply', 'community_report'].includes(n.notification_type));
  const system = notifications.filter(n => ['risk_alert', 'approval', 'automation_failed', 'payment_warning'].includes(n.notification_type));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" /> Notifications
            {unread.length > 0 && <Badge className="bg-red-500 text-white text-sm">{unread.length}</Badge>}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">All activity, alerts and required actions</p>
        </div>
        {unread.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="w-4 h-4 mr-2" />Mark All Read</Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Unread" value={unread.length} color="text-red-400" bg="bg-red-500/10" urgent={unread.length > 0} />
        <StatCard label="Requires Action" value={requiresAction.length} color="text-yellow-400" bg="bg-yellow-500/10" urgent={requiresAction.length > 0} />
        <StatCard label="Orders Today" value={orders.filter(o => new Date(o.created_date) > new Date(Date.now() - 86400000)).length} color="text-green-400" bg="bg-green-500/10" />
        <StatCard label="Total" value={notifications.length} color="text-muted-foreground" bg="bg-muted" />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
          <TabsTrigger value="action">Action ({requiresAction.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="community">Community ({community.length})</TabsTrigger>
          <TabsTrigger value="system">System ({system.length})</TabsTrigger>
        </TabsList>

        {[
          { key: 'all', items: notifications },
          { key: 'unread', items: unread },
          { key: 'action', items: requiresAction },
          { key: 'orders', items: orders },
          { key: 'community', items: community },
          { key: 'system', items: system },
        ].map(({ key, items }) => (
          <TabsContent key={key} value={key} className="mt-4">
            {items.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-xl">
                <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No notifications here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map(n => <NotificationRow key={n.id} notification={n} onRead={() => markRead.mutate(n.id)} />)}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function NotificationRow({ notification: n, onRead }) {
  const config = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.system;
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-xl transition-colors ${!n.is_read ? 'border-primary/20 bg-primary/3' : 'border-border'}`}>
      <div className={`${config.bg} p-2 rounded-lg shrink-0 mt-0.5`}><Icon className={`w-4 h-4 ${config.color}`} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className={`text-sm font-medium ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
          <div className="flex items-center gap-2 shrink-0">
            {n.severity && n.severity !== 'info' && <Badge className={`text-xs ${SEVERITY_COLORS[n.severity]}`}>{n.severity}</Badge>}
            {n.requires_action && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Action needed</Badge>}
            {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
          </div>
        </div>
        {n.summary && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.summary}</p>}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="text-xs text-muted-foreground">{n.created_date ? format(new Date(n.created_date), 'dd MMM, h:mm a') : ''}</span>
          {n.source && <span className="text-xs text-muted-foreground">· {n.source}</span>}
          {n.linked_route && (
            <Link to={n.linked_route} className="text-xs text-primary hover:underline flex items-center gap-1"><Eye className="w-3 h-3" />View</Link>
          )}
          {!n.is_read && <button onClick={onRead} className="text-xs text-muted-foreground hover:text-primary transition-colors ml-auto">Mark read</button>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg, urgent }) {
  return (
    <Card className={urgent && value > 0 ? 'border-yellow-500/30' : ''}>
      <CardContent className="p-4">
        <div className={`${bg} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}><Bell className={`w-4 h-4 ${color}`} /></div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}