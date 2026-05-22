import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell, CheckCheck, ShoppingBag, MessageCircle, AlertTriangle, Zap, TrendingUp,
  Star, Mail, Activity, Eye, DollarSign, ChevronRight, RefreshCw,
  CheckCircle2, Hash, Brain, Video, Package, ArrowLeft
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

const TYPE_CONFIG = {
  order: { icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/10' },
  comment: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  reply: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  approval: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  risk_alert: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  community_report: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  viral_opportunity: { icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  creator_gap: { icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  high_value_supporter: { icon: Star, color: 'text-primary', bg: 'bg-primary/10' },
  automation_failed: { icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10' },
  email_failed: { icon: Mail, color: 'text-red-400', bg: 'bg-red-500/10' },
  payment_warning: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  growth_spike: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
  system: { icon: Hash, color: 'text-muted-foreground', bg: 'bg-muted' },
  like: { icon: Star, color: 'text-pink-400', bg: 'bg-pink-500/10' },
};

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/40' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40' },
  warning: { label: 'Warning', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  info: { label: 'Info', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-border' },
};

const ALL_TABS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'needs-action', label: 'Needs Action' },
  { key: 'needs-approval', label: 'Needs Approval' },
  { key: 'profit-opportunities', label: 'Profit Opps' },
  { key: 'viral-opportunities', label: 'Viral Opps' },
  { key: 'research', label: 'Research' },
  { key: 'orders', label: 'Orders' },
  { key: 'payments', label: 'Payments' },
  { key: 'fan-activity', label: 'Fan Activity' },
  { key: 'agent-activity', label: 'Agent Activity' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'store', label: 'Store' },
  { key: 'system', label: 'System' },
  { key: 'completed', label: 'Completed' },
];

function filterByTab(notifications, tab) {
  switch (tab) {
    case 'unread': return notifications.filter(n => !n.is_read);
    case 'needs-action': return notifications.filter(n => n.requires_action && !n.is_read);
    case 'needs-approval': return notifications.filter(n => n.requires_action || n.notification_type === 'approval');
    case 'profit-opportunities': return notifications.filter(n =>
      ['viral_opportunity', 'growth_spike', 'creator_gap', 'high_value_supporter'].includes(n.notification_type) ||
      n.title?.toLowerCase().includes('profit') || n.title?.toLowerCase().includes('bundle') || n.title?.toLowerCase().includes('opportunity'));
    case 'viral-opportunities': return notifications.filter(n =>
      n.notification_type === 'viral_opportunity' || n.title?.toLowerCase().includes('viral') || n.title?.toLowerCase().includes('trend'));
    case 'research': return notifications.filter(n =>
      n.source?.toLowerCase().includes('research') || n.notification_type === 'creator_gap' ||
      n.title?.toLowerCase().includes('research') || n.title?.toLowerCase().includes('insight'));
    case 'orders': return notifications.filter(n => n.notification_type === 'order');
    case 'payments': return notifications.filter(n =>
      n.notification_type === 'payment_warning' || n.title?.toLowerCase().includes('payment') || n.title?.toLowerCase().includes('stripe'));
    case 'fan-activity': return notifications.filter(n =>
      ['comment', 'reply', 'community_report', 'like', 'high_value_supporter'].includes(n.notification_type));
    case 'agent-activity': return notifications.filter(n =>
      n.source?.toLowerCase().includes('agent') || n.notification_type === 'automation_failed' ||
      n.title?.toLowerCase().includes('agent') || n.title?.toLowerCase().includes('scan'));
    case 'tiktok': return notifications.filter(n =>
      n.title?.toLowerCase().includes('tiktok') || n.source?.toLowerCase().includes('tiktok'));
    case 'store': return notifications.filter(n =>
      n.notification_type === 'order' || n.title?.toLowerCase().includes('store') ||
      n.title?.toLowerCase().includes('merch') || n.title?.toLowerCase().includes('bundle') ||
      n.title?.toLowerCase().includes('stock'));
    case 'system': return notifications.filter(n =>
      ['risk_alert', 'automation_failed', 'email_failed', 'system'].includes(n.notification_type));
    case 'completed': return notifications.filter(n => n.is_read || n.title?.startsWith('✅'));
    default: return notifications;
  }
}

function NotificationDetailModal({ notification: n, onClose, onRead }) {
  const config = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.system;
  const Icon = config.icon;
  const sevConf = SEVERITY_CONFIG[n.severity] || SEVERITY_CONFIG.info;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-card border ${sevConf.border} rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className={`${config.bg} p-2.5 rounded-lg shrink-0 mt-0.5`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base leading-tight">{n.title}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <Badge className={`text-xs ${sevConf.bg} ${sevConf.color}`}>{sevConf.label}</Badge>
                <Badge variant="outline" className="text-xs">{n.notification_type?.replace(/_/g, ' ')}</Badge>
                {!n.is_read && <Badge className="text-xs bg-primary/20 text-primary">Unread</Badge>}
                {n.requires_action && <Badge className="text-xs bg-yellow-500/20 text-yellow-400">Action Needed</Badge>}
              </div>
            </div>
          </div>

          {/* Why this matters */}
          {n.summary && (
            <div className="bg-secondary/30 rounded-xl p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Why This Matters</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{n.summary}</p>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-secondary/20 rounded-lg p-2">
              <p className="text-muted-foreground mb-0.5">Source</p>
              <p className="font-medium">{n.source || '—'}</p>
            </div>
            <div className="bg-secondary/20 rounded-lg p-2">
              <p className="text-muted-foreground mb-0.5">Created</p>
              <p className="font-medium">{n.created_date ? format(new Date(n.created_date), 'dd MMM, h:mm a') : '—'}</p>
            </div>
            {n.linked_entity && (
              <div className="bg-secondary/20 rounded-lg p-2">
                <p className="text-muted-foreground mb-0.5">Linked Record</p>
                <p className="font-medium">{n.linked_entity}</p>
              </div>
            )}
          </div>

          {/* Source chain */}
          <div className="bg-secondary/10 border border-border rounded-xl p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source Chain</p>
            <p className="text-xs text-foreground/60 font-mono">
              {n.notification_type?.replace(/_/g, ' ')} notification → {n.linked_entity || 'AdminNotification'} → {n.source || 'System'} → {n.linked_route || '/admin'}
            </p>
            {!n.linked_route && <p className="text-xs text-muted-foreground italic mt-1">This is the deepest available source record.</p>}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
            {n.requires_action && n.linked_route && (
              <Link to={n.linked_route} onClick={onClose}>
                <Button size="sm" className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30 gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" />Review & Approve
                </Button>
              </Link>
            )}
            {n.linked_route && (
              <Link to={n.linked_route} onClick={onClose}>
                <Button size="sm" variant="outline" className="gap-1 text-xs"><Eye className="w-3 h-3" />View Source</Button>
              </Link>
            )}
            {!n.is_read && (
              <Button size="sm" variant="outline" onClick={() => { onRead(); }} className="gap-1 text-xs">
                <CheckCheck className="w-3 h-3" />Mark Done
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onClose} className="text-xs gap-1">
              <ArrowLeft className="w-3 h-3" />Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);

  const activeFilter = searchParams.get('filter') || 'all';

  const setFilter = (key) => {
    setSearchParams({ filter: key });
  };

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => base44.entities.AdminNotification.list('-created_date', 200),
    refetchInterval: 15000,
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ['pending-proposals-notif'],
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

  // Computed counts
  const counts = {
    all: notifications.length,
    unread: notifications.filter(n => !n.is_read).length,
    'needs-action': notifications.filter(n => n.requires_action && !n.is_read).length,
    'needs-approval': notifications.filter(n => n.requires_action || n.notification_type === 'approval').length,
    critical: notifications.filter(n => n.severity === 'critical' || n.severity === 'high').length,
  };

  const filteredItems = filterByTab(notifications, activeFilter);

  const SUMMARY_CARDS = [
    { key: 'unread', label: 'Unread', value: counts.unread, color: 'text-red-400', bg: 'bg-red-500/10', border: counts.unread > 0 ? 'border-red-500/30 hover:border-red-500/60' : 'border-border hover:border-primary/40', urgent: counts.unread > 0 },
    { key: 'needs-action', label: 'Needs Action', value: counts['needs-action'], color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: counts['needs-action'] > 0 ? 'border-yellow-500/30 hover:border-yellow-500/60' : 'border-border hover:border-primary/40', urgent: counts['needs-action'] > 0 },
    { key: 'needs-approval', label: 'Approval Waiting', value: proposals.length, color: 'text-orange-400', bg: 'bg-orange-500/10', border: proposals.length > 0 ? 'border-orange-500/30 hover:border-orange-500/60' : 'border-border hover:border-primary/40', urgent: proposals.length > 0, link: '/admin/revenue-actions' },
    { key: 'critical', label: 'Critical', value: counts.critical, color: 'text-red-500', bg: 'bg-red-700/10', border: counts.critical > 0 ? 'border-red-700/40 hover:border-red-500/60' : 'border-border hover:border-primary/40', urgent: counts.critical > 0 },
    { key: 'all', label: 'Total', value: counts.all, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border hover:border-primary/40' },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text flex items-center gap-3">
              Business Attention Centre
              {counts.unread > 0 && <Badge className="bg-red-500 text-white text-sm">{counts.unread}</Badge>}
            </h1>
            <p className="text-muted-foreground text-sm">Everything Gannon should know — all in one place</p>
          </div>
        </div>
        <div className="flex gap-2">
          {counts.unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1">
              <CheckCheck className="w-3.5 h-3.5" />Mark All Read
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Clickable Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {SUMMARY_CARDS.map(card => {
          const isActive = activeFilter === card.key;
          const content = (
            <button
              key={card.key}
              onClick={() => !card.link && setFilter(card.key)}
              className={`w-full rounded-xl border p-4 flex items-center gap-3 transition-all cursor-pointer
                ${isActive ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/30' : `bg-card ${card.border}`}
                ${card.urgent ? 'animate-pulse-subtle' : ''}`}
            >
              <div className={`${card.bg} p-2 rounded-lg shrink-0`}>
                <Bell className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-left">
                <p className={`text-2xl font-bold ${isActive ? 'text-primary' : ''}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
              {isActive && <ChevronRight className="w-3 h-3 text-primary ml-auto" />}
            </button>
          );

          if (card.link) {
            return (
              <Link key={card.key} to={card.link}>
                {content}
              </Link>
            );
          }
          return <div key={card.key}>{content}</div>;
        })}
      </div>

      {/* Pending proposals alert */}
      {proposals.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/30 rounded-xl flex-wrap">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-yellow-400">{proposals.length} Agent Proposal{proposals.length > 1 ? 's' : ''} Awaiting Approval</p>
            <p className="text-xs text-muted-foreground">Agents have prepared ready-to-publish revenue actions. Your approval is required before anything goes live.</p>
          </div>
          <Link to="/admin/revenue-actions">
            <Button size="sm" className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30 gap-1 text-xs shrink-0">
              <Eye className="w-3 h-3" />Review Proposals
            </Button>
          </Link>
        </div>
      )}

      {/* TOP TABS */}
      <div className="overflow-x-auto">
        <div className="flex gap-1.5 min-w-max pb-1">
          {ALL_TABS.map(tab => {
            const count = filterByTab(notifications, tab.key).length;
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border
                  ${isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary/40'
                  }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-secondary text-secondary-foreground'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">No notifications in "{ALL_TABS.find(t => t.key === activeFilter)?.label || activeFilter}"</p>
            <p className="text-xs text-muted-foreground mt-1">Items will appear here automatically when they match this category.</p>
          </div>
        ) : (
          filteredItems.map(n => (
            <NotificationRow
              key={n.id}
              notification={n}
              onSelect={() => setSelected(n)}
              onRead={() => markRead.mutate(n.id)}
            />
          ))
        )}
      </div>

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

function NotificationRow({ notification: n, onSelect, onRead }) {
  const config = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.system;
  const Icon = config.icon;
  const sevConf = SEVERITY_CONFIG[n.severity] || SEVERITY_CONFIG.info;

  return (
    <div
      onClick={onSelect}
      className={`flex items-start gap-3 p-4 border rounded-xl transition-all cursor-pointer group
        hover:border-primary/40 hover:bg-secondary/20
        ${!n.is_read ? `${sevConf.border} bg-card` : 'border-border bg-card/50'}`}
    >
      <div className={`${config.bg} p-2 rounded-lg shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className={`text-sm font-medium leading-tight ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            {n.severity && n.severity !== 'info' && (
              <Badge className={`text-xs ${sevConf.bg} ${sevConf.color}`}>{sevConf.label}</Badge>
            )}
            {n.requires_action && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Action</Badge>}
            {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
          </div>
        </div>
        {n.summary && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.summary}</p>}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground">{n.created_date ? format(new Date(n.created_date), 'dd MMM, h:mm a') : ''}</span>
          {n.source && <span className="text-xs text-muted-foreground">· {n.source}</span>}
          {!n.is_read && (
            <button
              onClick={e => { e.stopPropagation(); onRead(); }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors ml-auto cursor-pointer"
            >
              Mark read
            </button>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
    </div>
  );
}