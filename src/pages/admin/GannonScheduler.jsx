import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { CalendarDays, CheckCircle2, Circle, Clock, ListChecks, Plus, Trash2, Zap } from 'lucide-react';

const SEED_FLAG = 'gwm-action-items-seeded-v1';

const SEED_TASKS = [
  { title: 'Make Mum page private', category: 'Mum Tribute', priority: 'critical', status: 'todo', suggested_by: 'System', notes: 'Protect /mum and /without-you-here from public access.', linked_route: '/admin/mum', brand_risk: true, requires_approval: true },
  { title: 'Build family upload portal', category: 'Family', priority: 'critical', status: 'todo', suggested_by: 'System', notes: 'Create a place for family to submit photos, videos, voice notes, eulogies, speeches, and stories.', linked_route: '/family/sonia-upload' },
  { title: 'Review family photos and voice messages', category: 'Family', priority: 'high', status: 'todo', suggested_by: 'Agent', notes: 'Approve only files that should become part of the tribute archive.', linked_route: '/admin/family-uploads' },
  { title: 'Correct Sonia memorial image groups', category: 'Mum Tribute', priority: 'critical', status: 'todo', suggested_by: 'System', notes: 'Use the approved Me & Mum, Her, Her Humour, Family, Her Animals, Carrying Her, Her Words and Old Days groupings. No photo alteration.', linked_route: '/admin/mum' },
  { title: 'Prepare Sonia Memory Chat knowledge base', category: 'Mum Tribute', priority: 'medium', status: 'todo', suggested_by: 'Agent', notes: 'Use approved memories only. Do not invent. Do not clone voice without explicit approval.', linked_route: '/admin/sonia-memory-chat', brand_risk: true, requires_approval: true },
  { title: 'Review website routes after privacy update', category: 'Website', priority: 'high', status: 'todo', suggested_by: 'System', notes: 'Check /mum, /without-you-here, /admin/mum, and /admin/mum-tribute after deploy.', linked_route: '/admin/site-health' },
  { title: 'Confirm store and checkout still work', category: 'Store', priority: 'critical', status: 'todo', suggested_by: 'System', notes: 'Do not break Stripe, cart, orders, webhooks, promo codes, inventory, or checkout.', linked_route: '/admin/payment-diagnostics', financial_risk: true, requires_approval: true },
  { title: 'Complete Triple J Unearthed profile draft', category: 'Music', priority: 'high', status: 'todo', suggested_by: 'Gannon', notes: 'Prepare artist bio, sounds-like references, genres, image checklist and track submission steps.', linked_route: '/admin/music-command-centre' },
  { title: 'Create weekly release operating rhythm', category: 'Marketing', priority: 'high', status: 'todo', suggested_by: 'Agent', notes: 'Turn music/social/store/admin work into a weekly flow with approvals only where money, legal, brand or publishing risk exists.', linked_route: '/admin/social-schedule-queue' }
];

const emptyTask = {
  title: '',
  category: 'Website',
  priority: 'medium',
  status: 'todo',
  due_date: '',
  notes: '',
  suggested_by: 'Gannon'
};

const priorityClasses = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  low: 'bg-secondary text-muted-foreground border-border'
};

function TaskCard({ task, onStatus, onDelete }) {
  return (
    <Card className="border-border/50 bg-card/70">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{task.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{task.notes}</p>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => onDelete(task.id)} title="Delete task">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className={priorityClasses[task.priority] || priorityClasses.medium}>{task.priority}</Badge>
          <Badge variant="outline" className="border-border text-muted-foreground">{task.category}</Badge>
          <Badge variant="outline" className="border-primary/30 text-primary">{task.suggested_by || 'Gannon'}</Badge>
          {task.due_date && <Badge variant="outline" className="border-border text-muted-foreground"><CalendarDays className="h-3 w-3 mr-1" />{task.due_date}</Badge>}
          {task.requires_approval && <Badge variant="outline" className="border-amber-500/30 text-amber-300">approval guarded</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">
          {task.linked_route && (
            <Button size="sm" variant="outline" onClick={() => { window.location.href = task.linked_route; }}>
              Open
            </Button>
          )}
          <Button size="sm" variant={task.status === 'doing' ? 'default' : 'outline'} onClick={() => onStatus(task.id, 'doing')}>Doing</Button>
          <Button size="sm" variant={task.status === 'waiting' ? 'default' : 'outline'} onClick={() => onStatus(task.id, 'waiting')}>Waiting</Button>
          <Button size="sm" className="gap-1" onClick={() => onStatus(task.id, 'done')}><CheckCircle2 className="h-3.5 w-3.5" />Done</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskColumn({ title, icon: Icon, tasks, onStatus, onDelete }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2"><Icon className="h-4 w-4 text-primary" />{title}</h2>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <Card className="border-dashed border-border/60"><CardContent className="p-4 text-xs text-muted-foreground">Nothing here.</CardContent></Card>
        ) : tasks.map(task => <TaskCard key={task.id} task={task} onStatus={onStatus} onDelete={onDelete} />)}
      </div>
    </section>
  );
}

export default function GannonScheduler() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyTask);

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['action-items'],
    queryFn: () => base44.entities.ActionItem.list('-created_date', 200)
  });

  const addTaskMutation = useMutation({
    mutationFn: data => base44.entities.ActionItem.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['action-items'] })
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ActionItem.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['action-items'] })
  });

  const deleteTaskMutation = useMutation({
    mutationFn: id => base44.entities.ActionItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['action-items'] })
  });

  useEffect(() => {
    if (isLoading || error || tasks.length > 0 || localStorage.getItem(SEED_FLAG)) return;
    localStorage.setItem(SEED_FLAG, 'true');
    Promise.all(SEED_TASKS.map(task => base44.entities.ActionItem.create(task)))
      .then(() => queryClient.invalidateQueries({ queryKey: ['action-items'] }))
      .catch(() => localStorage.removeItem(SEED_FLAG));
  }, [error, isLoading, queryClient, tasks.length]);

  const today = new Date().toISOString().slice(0, 10);

  const groups = useMemo(() => {
    const active = tasks.filter(task => task.status !== 'done');
    return {
      today: active.filter(task => !task.due_date || task.due_date <= today),
      suggested: active.filter(task => (task.suggested_by || 'Gannon') !== 'Gannon'),
      waiting: active.filter(task => task.status === 'waiting'),
      done: tasks.filter(task => task.status === 'done')
    };
  }, [tasks, today]);

  const addTask = event => {
    event.preventDefault();
    if (!form.title.trim()) return;
    addTaskMutation.mutate({
      ...form,
      title: form.title.trim(),
      due_date: form.due_date || undefined
    });
    setForm(emptyTask);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-2">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow">Gannon Waye Music OS</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Scheduler and Action Centre</h1>
        <p className="text-sm text-muted-foreground max-w-3xl">A persistent action centre for music, website, family, legal, admin, store, and personal tasks. Low-risk work can move automatically; anything with money, legal, brand, publishing, or deletion risk stays approval guarded.</p>
      </div>

      {error && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 text-sm text-red-300">Action items could not load. Check Base44 entity deployment for ActionItem.</CardContent>
        </Card>
      )}

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="h-4 w-4 text-primary" />Add task</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Input className="md:col-span-2" placeholder="Task title" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} />
            <select className="rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>
              {['Music', 'Website', 'Mum Tribute', 'Store', 'Legal', 'Personal', 'Family', 'Admin', 'Marketing', 'Finance'].map(value => <option key={value}>{value}</option>)}
            </select>
            <select className="rounded-md border border-input bg-background px-3 text-sm" value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}>
              {['critical', 'high', 'medium', 'low'].map(value => <option key={value}>{value}</option>)}
            </select>
            <select className="rounded-md border border-input bg-background px-3 text-sm" value={form.suggested_by} onChange={event => setForm({ ...form, suggested_by: event.target.value })}>
              {['Gannon', 'Agent', 'System'].map(value => <option key={value}>{value}</option>)}
            </select>
            <Input type="date" value={form.due_date} onChange={event => setForm({ ...form, due_date: event.target.value })} />
            <Textarea className="md:col-span-5" placeholder="Notes or guidance" value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} />
            <Button type="submit" className="gap-2" disabled={addTaskMutation.isPending}><Plus className="h-4 w-4" />Add</Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading action centre...</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TaskColumn title="Today and overdue" icon={Clock} tasks={groups.today} onStatus={(id, status) => updateTaskMutation.mutate({ id, data: { status } })} onDelete={id => deleteTaskMutation.mutate(id)} />
          <TaskColumn title="Agent and system suggested" icon={Zap} tasks={groups.suggested} onStatus={(id, status) => updateTaskMutation.mutate({ id, data: { status } })} onDelete={id => deleteTaskMutation.mutate(id)} />
          <TaskColumn title="Waiting" icon={Circle} tasks={groups.waiting} onStatus={(id, status) => updateTaskMutation.mutate({ id, data: { status } })} onDelete={id => deleteTaskMutation.mutate(id)} />
          <TaskColumn title="Completed" icon={ListChecks} tasks={groups.done} onStatus={(id, status) => updateTaskMutation.mutate({ id, data: { status } })} onDelete={id => deleteTaskMutation.mutate(id)} />
        </div>
      )}
    </div>
  );
}
