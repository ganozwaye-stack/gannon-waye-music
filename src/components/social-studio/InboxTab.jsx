import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Inbox, Loader2, MessageCircle, Radio } from 'lucide-react';

const FILTERS = [
  { key: 'all', label: 'All activity' },
  { key: 'comment', label: 'Comments' },
  { key: 'publish', label: 'Publish activity' },
];

export default function InboxTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.SocialStudioEvent.list('-created_date', 60)
      .then((page) => setEvents(page.items || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const sync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await base44.functions.invoke('socialStudioInboxSync', {});
      setMessage({ type: 'ok', text: `Synced: ${res.data && res.data.comments_seen ? res.data.comments_seen : 0} comments seen, ${res.data && res.data.new_events ? res.data.new_events : 0} new.` });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSyncing(false);
    }
  };

  const markRead = async (ev) => {
    await base44.entities.SocialStudioEvent.update(ev.id, { status: 'read' });
    load();
  };

  const shown = events.filter((e) => {
    if (filter === 'comment') return e.event_type === 'comment' || e.event_type === 'message';
    if (filter === 'publish') return ['publish_attempt', 'publish_success', 'publish_failure'].includes(e.event_type);
    return true;
  });
  const unread = events.filter((e) => e.status === 'new' && e.event_type === 'comment').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Inbox className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg text-foreground">Inbox and activity</h2>
          {unread > 0 && <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">{unread} new</span>}
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <Button key={f.key} type="button" size="sm" variant={filter === f.key ? 'default' : 'outline'} onClick={() => setFilter(f.key)}>
              {f.label}
            </Button>
          ))}
          <Button type="button" size="sm" className="gradient-gold-button" disabled={syncing} onClick={sync}>
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Sync Instagram
          </Button>
        </div>
      </div>

      {message && (
        <div className={`text-sm rounded-md px-3 py-2 border ${message.type === 'ok' ? 'border-primary/40 text-primary bg-primary/10' : 'border-destructive/40 text-destructive bg-destructive/10'}`}>
          {message.text}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Comments are pulled from the connected Instagram account when you press Sync. Direct messages are not pulled yet: the connector is not authorized for Instagram messaging, so nothing is invented here.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading
        </div>
      ) : shown.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No activity yet. Press Sync Instagram to pull recent comments.</p>
      ) : (
        <div className="space-y-2">
          {shown.map((e) => (
            <div key={e.id} className={`rounded-lg border border-border bg-card p-3 flex items-start justify-between gap-3 ${e.status === 'new' ? 'border-primary/30' : ''}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {e.event_type === 'comment' ? <MessageCircle className="w-3.5 h-3.5" /> : <Radio className="w-3.5 h-3.5" />}
                  <span className="capitalize">{e.event_type.replace('_', ' ')}</span>
                  <span>{e.platform}</span>
                  {e.occurred_at && <span>{new Date(e.occurred_at).toLocaleString()}</span>}
                </div>
                <div className="text-sm text-foreground mt-1">
                  {e.author_name && <span className="text-primary mr-1">{e.author_name}</span>}
                  {e.content}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {e.permalink && (
                  <a href={e.permalink} target="_blank" rel="noreferrer" className="text-xs text-primary underline">Open</a>
                )}
                {e.status === 'new' && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => markRead(e)}>Mark read</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}