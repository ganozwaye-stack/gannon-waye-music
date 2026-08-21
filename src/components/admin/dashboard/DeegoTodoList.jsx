import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Check, Trash2, Loader2, ListTodo, ChevronDown, ArrowUpRight, Calendar } from 'lucide-react';

const PRIORITY_STYLE = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  high: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  medium: 'bg-primary/15 text-primary border-primary/30',
  low: 'bg-secondary text-muted-foreground border-border/40',
};

export default function DeegoTodoList() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [expandedId, setExpandedId] = useState(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['deego-todo'],
    queryFn: async () => base44.entities.DailyDashboardTask.list('sort_order', 100),
    staleTime: 15_000,
  });

  const addMut = useMutation({
    mutationFn: async (payload) => base44.entities.DailyDashboardTask.create(payload),
    onSuccess: () => qc.invalidateQueries(['deego-todo']),
    onError: (e) => toast({ title: 'Could not add task', description: e.message, variant: 'destructive' }),
  });

  const toggleMut = useMutation({
    mutationFn: async ({ id, status }) => base44.entities.DailyDashboardTask.update(id, { status }),
    onSuccess: () => qc.invalidateQueries(['deego-todo']),
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => base44.entities.DailyDashboardTask.delete(id),
    onSuccess: () => qc.invalidateQueries(['deego-todo']),
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMut.mutate({ title: title.trim(), priority, status: 'not_started', sort_order: Date.now() });
    setTitle('');
  };

  const open = tasks.filter((t) => t.status !== 'complete');
  const done = tasks.filter((t) => t.status === 'complete');

  const handleRowClick = (t) => {
    if (t.related_page) {
      navigate(t.related_page);
      return;
    }
    setExpandedId(expandedId === t.id ? null : t.id);
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg text-foreground">Deego's Daily To-Do</h2>
        </div>
        <span className="font-body text-[11px] text-muted-foreground">{open.length} open · {done.length} done</span>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task for today…"
          className="bg-secondary/30 border-border/40 flex-1"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="h-9 rounded-md border border-border/40 bg-secondary/30 px-3 text-sm"
        >
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button type="submit" size="sm" className="gradient-gold-button border-0" disabled={addMut.isPending}>
          <Plus className="w-4 h-4" /> Add
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : tasks.length === 0 ? (
        <p className="font-body text-xs text-muted-foreground text-center py-6">Nothing on the list yet. Deego's waiting for instructions.</p>
      ) : (
        <div className="space-y-1.5">
          {[...open, ...done].map((t) => {
            const isDone = t.status === 'complete';
            const isOpen = expandedId === t.id;
            const hasDetail = t.description || t.next_action || t.due_date || t.related_page;
            return (
              <div key={t.id} className="rounded-lg bg-secondary/20 overflow-hidden">
                <div className="flex items-center gap-2.5 px-3 py-2 group">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleMut.mutate({ id: t.id, status: isDone ? 'not_started' : 'complete' }); }}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      isDone ? 'border-primary bg-primary text-primary-foreground' : 'border-border/50 hover:border-primary'
                    }`}
                    aria-label={isDone ? 'Mark as not started' : 'Mark complete'}
                  >
                    {isDone && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRowClick(t)}
                    className="flex-1 text-left flex items-center gap-2 min-w-0 cursor-pointer"
                  >
                    <span className={`flex-1 font-body text-sm truncate ${isDone ? 'line-through text-muted-foreground/50' : 'text-foreground/80'}`}>
                      {t.title}
                    </span>
                    {!isDone && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_STYLE[t.priority] || PRIORITY_STYLE.medium}`}>
                        {t.priority}
                      </span>
                    )}
                    {hasDetail && (
                      <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteMut.mutate(t.id); }}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {isOpen && hasDetail && (
                  <div className="px-3 pb-3 pt-1 space-y-2 border-t border-border/20">
                    {t.description && <p className="font-body text-xs text-muted-foreground leading-relaxed">{t.description}</p>}
                    {t.next_action && <p className="font-body text-xs text-primary/80">→ {t.next_action}</p>}
                    {t.due_date && (
                      <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Due {new Date(t.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    {t.related_page && (
                      <button
                        type="button"
                        onClick={() => navigate(t.related_page)}
                        className="inline-flex items-center gap-1 font-body text-xs text-primary hover:underline"
                      >
                        Open related <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}