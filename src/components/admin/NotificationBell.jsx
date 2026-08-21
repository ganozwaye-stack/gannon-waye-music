import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag, MessageCircle, AlertTriangle, Zap, TrendingUp, Star, Mail, Hash, CheckCheck, ExternalLink, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const TYPE_CONFIG = {
  order: { icon: ShoppingBag, color: 'text-green-400', route: '/admin/orders' },
  comment: { icon: MessageCircle, color: 'text-blue-400', route: '/admin/fans' },
  reply: { icon: MessageCircle, color: 'text-blue-400', route: '/admin/fans' },
  approval: { icon: AlertTriangle, color: 'text-yellow-400', route: '/admin/approval-queue' },
  risk_alert: { icon: AlertTriangle, color: 'text-red-400', route: '/admin/risk-alerts' },
  community_report: { icon: AlertTriangle, color: 'text-orange-400', route: '/admin/fans' },
  viral_opportunity: { icon: TrendingUp, color: 'text-purple-400', route: '/admin/trend-monitor' },
  creator_gap: { icon: TrendingUp, color: 'text-cyan-400', route: '/admin/creator-insights' },
  high_value_supporter: { icon: Star, color: 'text-primary', route: '/admin/supporters' },
  automation_failed: { icon: Zap, color: 'text-red-400', route: '/admin/agent-task-log' },
  email_failed: { icon: Mail, color: 'text-red-400', route: '/admin/subscribers' },
  payment_warning: { icon: AlertTriangle, color: 'text-red-400', route: '/admin/stripe-command-centre' },
  growth_spike: { icon: TrendingUp, color: 'text-green-400', route: '/admin/growth-engine' },
  system: { icon: Hash, color: 'text-muted-foreground', route: '/admin/site-health' },
  like: { icon: Star, color: 'text-pink-400', route: '/admin/fans' },
};

const SEVERITY_PRIORITY = { critical: 0, high: 1, warning: 2, info: 3 };

// Gentle notification chime — soft, low-volume, plays once per session
let hasPlayedDingThisSession = false;
function playDing() {
  if (hasPlayedDingThisSession) return;
  hasPlayedDingThisSession = true;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Soft two-note chime (C6 → G6) — gentle bell-like tone at low volume
    const notes = [
      { freq: 1046.5, start: 0, dur: 0.12 },
      { freq: 1567.98, start: 0.07, dur: 0.18 },
    ];
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    });
  } catch (e) {}
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(null);
  const dropRef = useRef(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notif-bell'],
    queryFn: () => base44.entities.AdminNotification.list('-created_date', 100),
    refetchInterval: 60000,
  });

  // Sort by severity then date, show up to 15
  const sorted = [...notifications]
    .sort((a, b) => {
      const pa = SEVERITY_PRIORITY[a.severity] ?? 3;
      const pb = SEVERITY_PRIORITY[b.severity] ?? 3;
      if (pa !== pb) return pa - pb;
      return new Date(b.created_date) - new Date(a.created_date);
    })
    .slice(0, 15);

  const unread = notifications.filter(n => !n.is_read);
  const unreadCount = unread.length;

  // Ding when new unread arrives
  useEffect(() => {
    if (prevCount === null) { setPrevCount(unreadCount); return; }
    if (unreadCount > prevCount) playDing();
    setPrevCount(unreadCount);
  }, [unreadCount]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.AdminNotification.update(id, { is_read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notif-bell'] }),
  });

  const markAllRead = async () => {
    await Promise.all(unread.map(n => base44.entities.AdminNotification.update(n.id, { is_read: true })));
    qc.invalidateQueries({ queryKey: ['notif-bell'] });
  };

  const getRoute = (n) => {
    if (n.linked_route) return n.linked_route;
    return TYPE_CONFIG[n.notification_type]?.route || '/admin/notifications';
  };

  const handleItemClick = (n) => {
    if (!n.is_read) markRead.mutate(n.id);
    setOpen(false);
    navigate(getRoute(n));
  };

  return (
    <div className="relative" ref={dropRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`relative p-2 rounded-lg transition-all ${open ? 'bg-primary/10' : 'hover:bg-secondary/50'}`}
        title="Notifications"
        aria-label="Open notifications"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 8 }}
        >
          <Bell className={`w-4 h-4 transition-colors ${open || unreadCount > 0 ? 'text-primary' : 'text-muted-foreground'}`} style={unreadCount > 0 ? { filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.6))' } : {}} />
        </motion.div>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-[380px] max-h-[520px] bg-card border border-border/50 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.10)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card/80 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-display text-sm text-foreground">Notifications</span>
                {unreadCount > 0 && <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0">{unreadCount} new</Badge>}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="font-body text-[10px] text-primary hover:text-primary/80 transition-colors" title="Mark all read">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
                <Link to="/admin/notifications" onClick={() => setOpen(false)} className="font-body text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  View All
                </Link>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto overflow-x-hidden flex-1">
              {sorted.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground/40 font-body text-xs">No notifications</div>
              ) : (
                sorted.map((n, i) => {
                  const cfg = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.system;
                  const Icon = cfg.icon;
                  const isUnread = !n.is_read;
                  const isCritical = n.severity === 'critical' || n.severity === 'high';
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-border/20 transition-all group cursor-pointer
                        ${isUnread ? 'bg-primary/4 hover:bg-primary/8' : 'hover:bg-secondary/30'}
                        ${isCritical && isUnread ? 'bg-red-500/5' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isUnread ? 'bg-primary/10' : 'bg-secondary/40'}`}>
                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-1.5 justify-between">
                          <p className={`font-body text-xs leading-tight line-clamp-2 ${isUnread ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{n.title}</p>
                          {isUnread && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                        </div>
                        {n.summary && <p className="font-body text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-1">{n.summary}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-body text-[9px] text-muted-foreground/40">
                            {n.created_date ? format(new Date(n.created_date), 'dd MMM · h:mm a') : ''}
                          </span>
                          {isCritical && <span className="font-body text-[9px] text-red-400 font-bold uppercase tracking-wider">{n.severity}</span>}
                          {n.requires_action && <span className="font-body text-[9px] text-yellow-400 font-bold uppercase tracking-wider">Action</span>}
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground/20 group-hover:text-primary/40 shrink-0 mt-1 transition-colors" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border/40 px-4 py-2.5 bg-card/60">
              <Link
                to="/admin/notifications"
                onClick={() => setOpen(false)}
                className="font-body text-xs text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1.5"
              >
                View all {notifications.length} notifications <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}