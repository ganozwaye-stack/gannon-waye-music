import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Bell, CheckCheck, ShoppingBag, MessageCircle, AlertTriangle, Zap, TrendingUp,
  Star, Mail, Activity, Eye, DollarSign, ChevronRight, Clock, ArrowLeft,
  CheckCircle2, XCircle, ExternalLink, RefreshCw, Hash
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  high: { label: 'Requires Approval', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  warning: { label: 'System Issue', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  info: { label: 'FYI', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
};

const TYPE_CONFIG = {
  order: { icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/10', section: 'orders' },
  comment: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', section: 'fan' },
  reply: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', section: 'fan' },
  approval: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', section: 'approvals' },
  risk_alert: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', section: 'system' },
  community_report: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', section: 'fan' },
  viral_opportunity: { icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10', section: 'opportunities' },
  creator_gap: { icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10', section: 'opportunities' },
  high_value_supporter: { icon: Star, color: 'text-primary', bg: 'bg-primary/10', section: 'fan' },
  automation_failed: { icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10', section: 'system' },
  email_failed: { icon: Mail, color: 'text-red-400', bg: 'bg-red-500/10', section: 'system' },
  payment_warning: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', section: 'payments' },
  growth_spike: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', section: 'opportunities' },
  system: { icon: Hash, color: 'text-muted-foreground', bg: 'bg-muted', section: 'system' },
  like: { icon: Star, color: 'text-pink-400', bg: 'bg-pink-500/10', section: 'fan' },
};

const SECTIONS = [
  { key: 'all', label: 'All', icon: Bell },
  { key: 'approvals', label: 'Needs Approval', icon: AlertTriangle },
  { key: 'opportunities', label: 'Opportunities', icon: TrendingUp },
  { key: 'orders', label: 'Orders', icon: ShoppingBag },
  { key: 'payments', label: 'Payments', icon: DollarSign },
  { key: 'fan', label: 'Fan Activity', icon: Star },
  { key: 'system', label: 'System', icon: Activity },
];

export default function Notifications() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('all');

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => base44.entities.AdminNotification.list('-created_date', 200),
    refetchInterval: 15000,
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ['agent-proposals-notif'],
    queryFn: () => base44.entities.AgentActionProposal.filter({ status: 'pending_approval' }, '-created_date', 20),
  });

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.AdminNotification.update(id, { is_read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-notifications'] }),
  });

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => base44.entities.AdminNotification.update(n.id, { is_read: true })));
    qc.invalidateQueries({ queryKey: ['admin-notifications'] });
    toast.success('All marked as read');
  };

  const unread = notifications.filter(n => !n.is_read);
  const requiresAction = notifications.filter(n => n.requires_action && !n.is_read);
  const critical = notifications.filter(n => n.severity === 'critical' || n.severity === 'high');

  const sectionItems = (key) => {
    if (key === 'all') return notifications;
    if (key === 'approvals') return notifications.filter(n => n.requires_action || n.notification_type === 'approval');
    if (key === 'opportunities') return notifications.filter(n => ['viral_opportunity', 'growth_spike', 'creator_gap', 'high_value_supporter'].includes(n.notification_type));
    if (key === 'orders') return notifications.filter(n => n.notification_type === 'order');
    if (key === 'payments') return notifications.filter(n => n.notification_type === 'payment_warning');
    if (key === 'fan') return notifications.filter(n => ['comment', 'reply', 'community_report', 'like', 'high_value_supporter'].includes(n.notification_type));
    if (key === 'system') return notifications.filter(n => ['risk_alert', 'automation_failed', 'email_failed', 'system'].includes(n.notification_type));
    return [];
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <h1 className="text-3xl font-display font-bold gradient-gold-text flex items-center gap-3">
              Business Attention Centre
              {unread.length > 0 && <Badge className="bg-red-500 text-white text-sm">{unread.length}</Badge>}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Everything Gannon should know — all in one place</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {unread.length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="w-4 h-4 mr-1" />Mark All Read</Button>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <SummaryCard label="Unread" value={unread.length} color="text-red-400" bg="bg-red-500/10" urgent={unread.length > 0} />
        <SummaryCard label="Needs Action" value={requiresAction.length} color="text-yellow-400" bg="bg-yellow-500/10" urgent={requiresAction.length > 0} />
        <SummaryCard label="Approval Waiting" value={proposals.length} color="text-orange-400" bg="bg-orange-500/10" urgent={proposals.length > 0} link="/admin/revenue-actions" />
        <SummaryCard label="Critical" value={critical.length} color="text-red-500" bg="bg-red-700/10" urgent={critical.length > 0} />
        <SummaryCard label="Total" value={notifications.length} color="text-muted-foreground" bg="bg-muted" />
      </div>

      {/* Pending proposals alert */}
      {proposals.length > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/3">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-yellow-400">{proposals.length} Agent Proposal{proposals.length > 1 ? 's' : ''} Awaiting Approval</p>
                <p className="text-xs text-muted-foreground">Agents have prepared ready-to-publish revenue actions. Your approval is required before anything goes live.</p>
              </div>
              <Link to="/admin/revenue-actions">
                <Button size="sm" className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30 gap-1">
                  <Eye className="w-3 h-3" /> Review Proposals
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          {SECTIONS.map(s => {
            const count = sectionItems(s.key).length;
            const hasUnread = sectionItems(s.key).some(n => !n.is_read);
            return (
              <TabsTrigger key={s.key} value={s.key} className="relative text-xs">
                {s.label}
                {count > 0 && (
                  <Badge className={`ml-1 text-[10px] px-1 py-0 ${hasUnread ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SECTIONS.map(s => (
          <TabsContent key={s.key} value={s.key} className="mt-4">
            {sectionItems(s.key).length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-xl">
                <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No notifications in this category.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sectionItems(s.key).map(n => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onRead={() => markRead.mutate(n.id)}
                    onSelect={() => setSelected(n)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {selected && (
        <NotificationDetailModal
          notification={selected}
          onClose={() => setSelected(null)}
          onRead={() => { markRead.mutate(selected.id); setSelected(null); }}
        />
      )}
    </div>
  );
}

function NotificationCard({ notification: n, onRead, onSelect }) {
  const config = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.system;
  const Icon = config.icon;
  const priorityConf = PRIORITY_CONFIG[n.severity] || PRIORITY_CONFIG.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-xl transition-all cursor-pointer hover:border-primary/30 ${!n.is_read ? `${priorityConf.border} bg-card` : 'border-border'}`}
      onClick={onSelect}
    >
      <div className={`${config.bg} p-2 rounded-lg shrink-0 mt-0.5`}><Icon className={`w-4 h-4 ${config.color}`} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className={`text-sm font-medium ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            {n.severity && n.severity !== 'info' && (
              <Badge className={`text-xs ${priorityConf.bg} ${priorityConf.color}`}>{priorityConf.label}</Badge>
            )}
            {n.requires_action && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Action needed</Badge>}
            {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
          </div>
        </div>
        {n.summary && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.summary}</p>}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="text-xs text-muted-foreground">{n.created_date ? format(new Date(n.created_date), 'dd MMM, h:mm a') : ''}</span>
          {n.source && <span className="text-xs text-muted-foreground">· {n.source}</span>}
          <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto" />
        </div>
      </div>
    </div>
  );
}

function NotificationDetailModal({ notification: n, onClose, onRead }) {
  const config = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.system;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className={`${config.bg} p-2.5 rounded-lg shrink-0`}><Icon className={`w-5 h-5 ${config.color}`} /></div>
          <div className="flex-1">
            <p className="font-semibold">{n.title}</p>
            <p className="text-xs text-muted-foreground">{n.notification_type?.replace(/_/g, ' ')} · {n.source}</p>
          </div>
        </div>

        {n.severity && (
          <Badge className={`text-xs ${PRIORITY_CONFIG[n.severity]?.bg} ${PRIORITY_CONFIG[n.severity]?.color}`}>
            {PRIORITY_CONFIG[n.severity]?.label}
          </Badge>
        )}

        {n.summary && (
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Why This Matters</p>
            <p className="text-sm text-foreground/80">{n.summary}</p>
          </div>
        )}

        {n.created_date && (
          <p className="text-xs text-muted-foreground">Received: {format(new Date(n.created_date), 'dd MMM yyyy, h:mm a')}</p>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {n.linked_route && (
            <Link to={n.linked_route} onClick={onClose}>
              <Button size="sm" className="gap-1 text-xs"><Eye className="w-3 h-3" />View Source</Button>
            </Link>
          )}
          {n.requires_action && n.linked_route && (
            <Link to={n.linked_route} onClick={onClose}>
              <Button size="sm" className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30 gap-1 text-xs">
                <CheckCircle2 className="w-3 h-3" /> Review & Approve
              </Button>
            </Link>
          )}
          {!n.is_read && (
            <Button size="sm" variant="outline" onClick={onRead} className="gap-1 text-xs">
              <CheckCheck className="w-3 h-3" />Mark Done
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose} className="text-xs">Close</Button>
        </div>

        <p className="text-xs text-muted-foreground italic">
          Source chain: {n.notification_type} → {n.linked_entity || 'AdminNotification'} → {n.linked_route || 'Admin'}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, bg, urgent, link }) {
  const content = (
    <Card className={`${urgent && value > 0 ? 'border-yellow-500/30' : ''} ${link ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`${bg} p-2 rounded-lg shrink-0`}><Bell className={`w-4 h-4 ${color}`} /></div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
        {link && <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto" />}
      </CardContent>
    </Card>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}