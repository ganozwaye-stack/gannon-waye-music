import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { POST_STATUS_LABELS, statusClass } from './platforms';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarTab({ onOpenPost, reloadKey }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    let live = true;
    setLoading(true);
    base44.entities.SocialStudioPost.list('-created_date', 200)
      .then((page) => { if (live) setPosts(page.items || []); })
      .catch(() => { if (live) setPosts([]); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [reloadKey]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const postsOn = (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter((p) => p.scheduled_at && p.scheduled_at.slice(0, 10) === key);
  };
  const unscheduled = posts.filter((p) => !p.scheduled_at);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" type="button" aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-display text-lg text-foreground min-w-[9rem] text-center">
            {cursor.toLocaleString('en-AU', { month: 'long', year: 'numeric' })}
          </h2>
          <Button variant="outline" size="icon" type="button" aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button type="button" onClick={() => onOpenPost(null)} className="gradient-gold-button">
          <Plus className="w-4 h-4" /> New post
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading calendar
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-secondary/40">
            {WEEKDAYS.map((d) => (
              <div key={d} className="p-2 text-center text-xs text-muted-foreground tracking-widest uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const dayPosts = day ? postsOn(day) : [];
              const isToday = day && new Date().toDateString() === new Date(year, month, day).toDateString();
              return (
                <div
                  key={i}
                  className={`min-h-[5.5rem] md:min-h-[7rem] p-1.5 border-b border-r border-border ${i % 7 === 6 ? 'border-r-0' : ''} ${!day ? 'bg-secondary/20' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-xs mb-1 ${isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{day}</div>
                      <div className="space-y-1">
                        {dayPosts.slice(0, 3).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => onOpenPost(p)}
                            className={`block w-full text-left text-[11px] leading-tight px-1.5 py-1 rounded truncate ${statusClass(p.status)}`}
                            title={p.title}
                          >
                            {p.title}
                          </button>
                        ))}
                        {dayPosts.length > 3 && (
                          <div className="text-[11px] text-muted-foreground px-1">+{dayPosts.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {unscheduled.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm text-muted-foreground mb-2">Not yet scheduled ({unscheduled.length})</h3>
          <div className="flex flex-wrap gap-2">
            {unscheduled.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenPost(p)}
                className={`px-2 py-1 rounded text-xs ${statusClass(p.status)}`}
              >
                {p.title} · {POST_STATUS_LABELS[p.status] || p.status}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No posts yet. Create your first one with the New post button.
        </p>
      )}
    </div>
  );
}